import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { messaging, getToken, onMessage } from "../config/firebase";
import axiosInstance from "../api/axios";

export const useFirebaseNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [fcmToken, setFcmToken] = useState(null);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const hasRequestedPermission = useRef(false);

  // Get authentication state directly from Redux
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();

  // Check if we're on public pages - don't make API calls there
  const isPublicPage = location.pathname === "/login" || location.pathname === "/register";
  const isAuthenticated = !!token && !isPublicPage;

  // Fetch notifications from the server
  const fetchNotifications = useCallback(async () => {
    // Don't fetch if not authenticated
    if (!isAuthenticated) {
      return;
    }

    try {
      setNotificationLoading(true);
      const response = await axiosInstance.get("/notifications/my");
      if (response.data.success) {
        setNotifications(response.data.data || []);
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      // Silently handle auth errors - user is not logged in
      if (error.response?.status === 401) {
        setNotifications([]);
        setUnreadCount(0);
      }
    } finally {
      setNotificationLoading(false);
    }
  }, [isAuthenticated]);

  // Request permission and get FCM token
  const requestPermission = useCallback(async () => {
    if (!messaging || hasRequestedPermission.current || !isAuthenticated) {
      return;
    }

    hasRequestedPermission.current = true;

    try {
      // Check if notifications are supported
      if (!("Notification" in window)) {
        console.warn("This browser does not support notifications");
        return;
      }

      // Check current permission status
      const currentPermission = Notification.permission;

      if (currentPermission === "denied") {
        console.warn("🔕 Notifications are blocked. To enable:");
        console.warn("1. Click the tune/lock icon next to the URL");
        console.warn("2. Find 'Notifications' and set to 'Allow'");
        console.warn("3. Refresh the page");
        return;
      }

      // Request notification permission
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        // Get service worker registration
        const registration = await navigator.serviceWorker.ready;

        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (token) {
          setFcmToken(token);
          console.log("✅ Notifications enabled successfully!");

          try {
            await axiosInstance.put("/auth/fcm-token", { fcmToken: token });
          } catch (error) {
            console.error("Error saving FCM token to server:", error);
          }

          return token;
        }
      } else if (permission === "denied") {
        console.warn("🔕 Notifications blocked. See instructions above to enable.");
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      hasRequestedPermission.current = false; // Reset so it can retry
    }
  }, [isAuthenticated]);

  // Listen for foreground messages
  useEffect(() => {
    if (!messaging) {
      return;
    }

    const unsubscribe = onMessage(messaging, async (payload) => {
      // Parse the notification data properly
      const notificationData = {
        ...payload.data,
        type: payload.data?.type || "notification",
      };

      // Create a new notification object with proper structure
      const newNotification = {
        id: `temp-${Date.now()}`, // Temporary ID with prefix
        title: payload.notification?.title || "New Notification",
        message: payload.notification?.body || "",
        type: notificationData.type,
        data: notificationData,
        is_read: false,
        created_at: new Date().toISOString(),
      };

      // Only add to UI if it's not a transient notification (like welcome)
      const isTransient = notificationData.type === "welcome";

      if (!isTransient) {
        // Add notification to state immediately for instant UI update
        setNotifications((prev) => {
          // Check if we already have this notification (avoid duplicates)
          const existingIndex = prev.findIndex(
            (n) =>
              n.title === newNotification.title &&
              n.message === newNotification.message &&
              Math.abs(
                new Date(n.created_at) - new Date(newNotification.created_at)
              ) < 2000
          );

          if (existingIndex !== -1) {
            return prev; // Already exists, don't add duplicate
          }

          return [newNotification, ...prev];
        });
        setUnreadCount((prev) => prev + 1);
      }

      // Show browser notification for foreground messages
      if ("Notification" in window && Notification.permission === "granted") {
        try {
          const notification = new Notification(
            payload.notification?.title || "New Notification",
            {
              body: payload.notification?.body || "",
              icon: "/firebase-logo.png",
              badge: "/firebase-logo.png",
              tag: notificationData.type, // Prevent duplicate browser notifications
              requireInteraction: false,
              silent: false,
            }
          );

          // Auto-close notification after 5 seconds
          setTimeout(() => {
            notification.close();
          }, 5000);

          // Handle notification click
          notification.onclick = function (event) {
            event.preventDefault();
            window.focus();
            notification.close();
          };
        } catch (error) {
          console.error("Error showing browser notification:", error);
        }
      }

      // Fetch from server to sync with database (get real ID and ensure persistence)
      // Shorter timeout for better responsiveness
      setTimeout(async () => {
        try {
          const response = await axiosInstance.get("/notifications/my");
          if (response.data.success) {
            // Replace temporary notifications with real ones from server
            setNotifications(response.data.data || []);
            setUnreadCount(response.data.unreadCount || 0);
          }
        } catch (error) {
          // If fetch fails, keep the temporary notification
        }
      }, 300); // Reduced from 500ms to 300ms for faster sync
    });

    return () => unsubscribe();
  }, []);

  // Initialize on mount and when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      requestPermission();
      fetchNotifications();
    } else {
      // Clear data on logout
      setNotifications([]);
      setUnreadCount(0);
      setFcmToken(null);
      hasRequestedPermission.current = false;
    }
  }, [isAuthenticated]);

  // Periodic polling for new notifications (catches offline notifications)
  useEffect(() => {
    if (!isAuthenticated) return;

    // Poll every 30 seconds for new notifications
    const pollingInterval = setInterval(() => {
      fetchNotifications();
    }, 30000); // 30 seconds

    return () => clearInterval(pollingInterval);
  }, [isAuthenticated, fetchNotifications]);

  // Fetch notifications when tab becomes visible again
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Fetch fresh notifications when user comes back to the tab
        fetchNotifications();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAuthenticated, fetchNotifications]);

  // Fetch notifications when window regains focus
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleFocus = () => {
      // Fetch notifications when window regains focus
      fetchNotifications();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [isAuthenticated, fetchNotifications]);

  const handleMarkAsRead = useCallback(async (id) => {
    try {
      await axiosInstance.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {}
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await axiosInstance.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {}
  }, []);

  const handleDeleteNotification = useCallback(async (id) => {
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      setNotifications((prev) => {
        const deleted = prev.find((n) => n.id === id);
        if (deleted && !deleted.is_read) {
          setUnreadCount((prevCount) => Math.max(0, prevCount - 1));
        }
        return prev.filter((n) => n.id !== id);
      });
    } catch (error) {}
  }, []);

  const clearAllNotifications = useCallback(async () => {
    try {
      await axiosInstance.delete("/notifications");
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {}
  }, []);

  return {
    notifications,
    unreadCount,
    fcmToken,
    notificationLoading,
    requestPermission,
    fetchNotifications, // Expose for manual refresh
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDeleteNotification,
    clearAllNotifications,
  };
};

import { createContext, useContext } from "react";
import { useFirebaseNotifications } from "../hooks/useFirebaseNotifications";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  // Always mount the hook so Firebase listener is always active
  // The hook internally handles authentication checks
  const notifications = useFirebaseNotifications();

  return (
    <NotificationContext.Provider value={notifications}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    // Return empty object if context is not available
    return {
      notifications: [],
      unreadCount: 0,
      notificationLoading: false,
      fetchNotifications: () => {},
      handleMarkAsRead: () => {},
      handleMarkAllAsRead: () => {},
      handleDeleteNotification: () => {},
      clearAllNotifications: () => {},
    };
  }
  return context;
};

// Import Firebase scripts
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

// Service workers cannot access import.meta.env
// Firebase config must be loaded from a separate config file
// Create a firebase-config.js file with your configuration
self.importScripts("/firebase-config.js");

// Initialize Firebase using the loaded config
if (self.firebaseConfig) {
  firebase.initializeApp(self.firebaseConfig);

  const messaging = firebase.messaging();

  // Handle background messages (when app is not in focus)
  messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification?.title || "New Notification";
    const notificationOptions = {
      body: payload.notification?.body || "",
      icon: "/firebase-logo.png",
      badge: "/firebase-logo.png",
      data: payload.data,
      requireInteraction: false,
      silent: false,
      vibrate: [200, 100, 200],
      tag: payload.data?.type || "notification",
    };

    return self.registration.showNotification(
      notificationTitle,
      notificationOptions
    );
  });

  // Handle notification click
  self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    // Navigate to specific URL if provided in notification data
    if (event.notification.data && event.notification.data.url) {
      event.waitUntil(clients.openWindow(event.notification.data.url));
    }
  });
}

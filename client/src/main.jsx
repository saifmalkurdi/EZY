import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { store, persistor } from "./store/store";
import App from "./App";
import "./index.css";

// Register service worker for Firebase Cloud Messaging
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js", { scope: "/" })
    .then((registration) => {
      // Check for updates to the service worker
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            console.log("New Service Worker available, refresh to update");
          }
        });
      });

      // Update service worker every hour
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

const rootElement = (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  import.meta.env.DEV ? (
    <React.StrictMode>{rootElement}</React.StrictMode>
  ) : (
    rootElement
  )
);

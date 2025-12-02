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
    .register("/firebase-messaging-sw.js")
    .then((registration) => {})
    .catch((error) => {});
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

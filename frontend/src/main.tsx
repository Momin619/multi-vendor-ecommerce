import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
} from "react-router-dom";

import {
  Toaster,
} from "react-hot-toast";

import App from "./App";
import {
  AuthProvider,
} from "./context/AuthContext";

import "./index.css";

/**
 * Application entry point.
 */
ReactDOM.createRoot(
  document.getElementById("root")!,
).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />

        {/* Global toast container */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
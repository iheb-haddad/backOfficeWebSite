import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { RessourcesProvider } from "./context/RessourcesProvider.jsx";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RessourcesProvider>
        <App />
      </RessourcesProvider>
    </AuthProvider>
  </React.StrictMode>
);

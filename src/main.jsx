import React from "react";
import ReactDOM from "react-dom/client";

import {
  HashRouter,
  useLocation,
} from "react-router-dom";

import App from "./App.jsx";
import AppErrorBoundary from "./components/AppErrorBoundary.jsx";
import FloatingStaffDemo from "./components/FloatingStaffDemo.jsx";

function PublicStaffShortcut() {
  const { pathname } = useLocation();

  // Hide the floating button inside the staff dashboard.
  const isStaffRoute =
    pathname === "/staff" ||
    pathname.startsWith("/staff/");

  if (isStaffRoute) {
    return null;
  }

  return <FloatingStaffDemo />;
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <HashRouter>
        <App />

        {/* Independent floating dashboard shortcut */}
        <PublicStaffShortcut />
      </HashRouter>
    </AppErrorBoundary>
  </React.StrictMode>
);
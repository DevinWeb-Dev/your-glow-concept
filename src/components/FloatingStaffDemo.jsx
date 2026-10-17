import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

import {
  ArrowUpRight,
  LayoutDashboard,
} from "lucide-react";

import "./floating-staff-demo.css";

export default function FloatingStaffDemo() {
  return createPortal(
    <Link
      to="/staff"
      id="yg-floating-admin"
      aria-label="Open Studio Demo dashboard"
      title="Open the Studio Demo dashboard"
    >
      <span
        className="yg-floating-admin-icon"
        aria-hidden="true"
      >
        <LayoutDashboard size={19} />
      </span>

      <span className="yg-floating-admin-copy">
        <strong>STUDIO DEMO</strong>
        <small>OPEN DASHBOARD</small>
      </span>

      <ArrowUpRight
        className="yg-floating-admin-arrow"
        size={18}
        aria-hidden="true"
      />
    </Link>,
    document.body
  );
}
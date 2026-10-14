import { useEffect, useState } from "react";

import {
  Link,
  NavLink,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  Menu,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  X,
  ChartColumn,
ChartPie,
Settings2,
Database,
} from "lucide-react";

import "../styles/studio.css";
import "../styles/intelligence.css";

const LINKS = [
  {
    title: "Studio Overview",
    path: "/staff",
    icon: LayoutDashboard,
    end: true,
  },
  {
    title: "Consultation Desk",
    path: "/staff/consultations",
    icon: ClipboardList,
  },
  {
    title: "Weekly Schedule",
    path: "/staff/schedule",
    icon: CalendarDays,
  },
  {
    title: "Service Catalog",
    path: "/staff/services",
    icon: Stethoscope,
  },
  {
    title: "Reports & Analytics",
    path: "/staff/reports",
    icon: ChartColumn,
  },
  {
    title: "Service Insights",
    path: "/staff/insights",
    icon: ChartPie,
  },
  {
    title: "Studio Settings",
    path: "/staff/settings",
    icon: Settings2,
  },
  {
    title: "Data & Backups",
    path: "/staff/data",
    icon: Database,
  },
];

const TITLES = {
  "/staff": "Studio Overview",
  "/staff/consultations": "Consultation Desk",
  "/staff/schedule": "Weekly Schedule",
  "/staff/services": "Service Catalog",

  // BATCH 4
  "/staff/reports": "Reports & Analytics",
  "/staff/insights": "Service Insights",
  "/staff/settings": "Studio Settings",
  "/staff/data": "Data & Backups",
};

export default function StudioLayout({
  bookings = [],
  onCancelBooking,
  onReplaceBookings,
}) {
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    function handleKey(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  const activeCount = bookings.filter(
    (item) => item.status === "requested"
  ).length;

  return (
    <div className="ygs-app">
      <aside
        id="ygs-navigation"
        className={`ygs-sidebar ${
          menuOpen ? "is-open" : ""
        }`}
        aria-label="Studio navigation"
      >
        <div className="ygs-sidebar-main">
          <Link
            className="ygs-sidebar-brand"
            to="/staff"
          >
            <span className="ygs-brand-mark">
              <Sparkles
                size={23}
                strokeWidth={1.4}
              />
            </span>

            <span>
              <strong>YOUR GLOW.</strong>
              <small>STUDIO OPERATIONS</small>
            </span>
          </Link>

          <div className="ygs-sidebar-rule" />

          <span className="ygs-sidebar-caption">
            YOUR WORKSPACE
          </span>

          <nav className="ygs-sidebar-links">
            {LINKS.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `ygs-sidebar-link ${
                      isActive ? "is-active" : ""
                    }`
                  }
                >
                  <Icon
                    size={19}
                    strokeWidth={1.7}
                  />

                  <span>{item.title}</span>

                  <ChevronRight
                    size={15}
                    className="ygs-link-arrow"
                  />
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="ygs-sidebar-bottom">
          <div className="ygs-sidebar-note">
            <ShieldCheck size={22} />

            <strong>Portfolio environment</strong>

            <p>
              Fictional consultations and local-only
              sample records.
            </p>

            <small>NO REAL PATIENT DATA</small>
          </div>

          <Link
            to="/"
            className="ygs-return-link"
          >
            <ArrowLeft size={17} />

            Public Website

            <ArrowUpRight size={16} />
          </Link>
        </div>
      </aside>

      {menuOpen && (
        <button
          type="button"
          className="ygs-mobile-overlay"
          aria-label="Close staff navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="ygs-workspace">
        <header className="ygs-topbar">
          <div className="ygs-topbar-left">
            <button
              type="button"
              className="ygs-menu-toggle"
              aria-controls="ygs-navigation"
              aria-expanded={menuOpen}
              aria-label={
                menuOpen
                  ? "Close staff menu"
                  : "Open staff menu"
              }
              onClick={() =>
                setMenuOpen((value) => !value)
              }
            >
              {menuOpen
                ? <X size={22} />
                : <Menu size={22} />}
            </button>

            <span className="ygs-topbar-symbol">
              <Activity size={21} />
            </span>

            <div>
              <small>YOUR GLOW / OPERATIONS</small>
              <h2>
                {TITLES[location.pathname] ||
                  "Studio Operations"}
              </h2>
            </div>
          </div>

          <div className="ygs-topbar-right">
            <span className="ygs-demo-indicator">
              <i />
              LOCAL DEMO
            </span>

            <Link
              to="/calendar"
              className="ygs-topbar-link"
            >
              <CalendarDays size={17} />
              Public Calendar
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </header>

        <main className="ygs-main">
          <div className="ygs-content">
            <div className="ygs-context">
              <span>
                <ShieldCheck size={15} />
                Browser-local operations concept
              </span>

              <span>
                {activeCount} active demo{" "}
                {activeCount === 1
                  ? "request"
                  : "requests"}
              </span>
            </div>

            <Outlet
  context={{
    bookings,
    onCancelBooking,
    onReplaceBookings,
  }}
/>
          </div>
        </main>

        <footer className="ygs-footer">
          <span>
            © {new Date().getFullYear()} YOUR GLOW.
          </span>

          <span>
            Website Concept Made by:
            Web Developer Devin Planas
          </span>
        </footer>
      </div>
    </div>
  );
}
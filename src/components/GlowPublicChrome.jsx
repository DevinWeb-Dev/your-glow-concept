import { useEffect, useState } from "react";

import {
  Link,
  NavLink,
  useLocation,
} from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  Sparkles,
  X,
} from "lucide-react";

import { BRAND } from "../data/studioData.js";

import "../styles/glow-living.css";
import "../styles/glow-batch3-architecture.css";
import "../styles/glow-batch5-operations.css";

const NAV = [
  ["Discover", "/"],
  ["Care edit", "/treatments"],
  ["Skin compass", "/finder"],
  ["Our world", "/studio"],
  ["Visual journal", "/gallery"],
  ["Calendar", "/calendar"],
  ["My requests", "/requests"],
];

function Wordmark({ light = false }) {
  return (
    <span
      className={`gl6-wordmark ${
        light ? "gl6-wordmark--light" : ""
      }`}
    >
      <span
        className="gl6-wordmark-icon"
        aria-hidden="true"
      >
        <Sparkles size={18} />
      </span>

      <span>
        YOUR
        <span className="gl6-wordmark-accent">
          GLOW
        </span>
        <i>.</i>
      </span>
    </span>
  );
}

/* PUBLIC HEADER — NO STAFF BUTTON HERE */

export function GlowHeader() {
  const { pathname } = useLocation();

  const [menu, setMenu] = useState({
    path: pathname,
    open: false,
  });

  const open =
    menu.path === pathname && menu.open;

  const close = () => {
    setMenu({
      path: pathname,
      open: false,
    });
  };

  useEffect(() => {
    if (!open) return;

    const onKey = (event) => {
      if (event.key === "Escape") {
        setMenu({
          path: pathname,
          open: false,
        });
      }
    };

    window.addEventListener(
      "keydown",
      onKey
    );

    return () => {
      window.removeEventListener(
        "keydown",
        onKey
      );
    };
  }, [open, pathname]);

  return (
    <>
      <div className="gl6-announcement">
        <span>
          THE SKIN CULTURE / A LIVING STUDIO CONCEPT
        </span>

        <Link to="/finder">
          Find your starting point
          <ArrowUpRight size={13} />
        </Link>
      </div>

      <header className="gl6-header">
        <div className="gl6-header-inner">
          <Link
            to="/"
            className="gl6-header-logo"
            aria-label="YOUR GLOW homepage"
            onClick={close}
          >
            <Wordmark />
          </Link>

          <nav
            id="gl6-primary-nav"
            aria-label="Primary navigation"
            className={`gl6-nav ${
              open ? "is-open" : ""
            }`}
          >
            {NAV.map(([label, target]) => (
              <NavLink
                key={target}
                to={target}
                end={target === "/"}
                onClick={close}
                className={({ isActive }) =>
                  isActive ? "is-active" : ""
                }
              >
                {label}

                <span aria-hidden="true" />
              </NavLink>
            ))}

            <Link
              className="gl6-mobile-cta"
              to="/consultation"
              onClick={close}
            >
              Consultation preview
              <ArrowUpRight size={18} />
            </Link>
          </nav>

          <div className="gl6-header-actions">
            <Link
              to="/consultation"
              className="gl6-book-btn"
            >
              <span>
                Let's talk skin
              </span>

              <span className="gl6-book-icon">
                <ArrowUpRight size={19} />
              </span>
            </Link>

            <button
              className="gl6-menu-btn"
              type="button"
              aria-label={
                open
                  ? "Close navigation"
                  : "Open navigation"
              }
              aria-controls="gl6-primary-nav"
              aria-expanded={open}
              onClick={() => {
                setMenu({
                  path: pathname,
                  open: !open,
                });
              }}
            >
              {open ? (
                <X size={23} />
              ) : (
                <Menu size={23} />
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

/* PUBLIC FOOTER — NO STAFF BUTTON HERE */

export function GlowFooter() {
  return (
    <footer className="gl6-footer">
      <div
        className="gl6-footer-orb"
        aria-hidden="true"
      />

      <div className="gl6-footer-inner">
        <div className="gl6-footer-top">
          <Link
            to="/"
            aria-label="YOUR GLOW homepage"
          >
            <Wordmark light />
          </Link>

          <span>
            AN OPEN STUDIO / SKIN CULTURE
          </span>
        </div>

        <div className="gl6-footer-lead">
          <p>
            YOUR NEXT CHAPTER LOOKS GOOD ON YOU.
          </p>

          <h2>
            Glow is a <span>feeling.</span>
          </h2>

          <Link
            className="gl6-footer-round"
            to="/consultation"
            aria-label="Open consultation preview"
          >
            <ArrowUpRight size={32} />
          </Link>
        </div>

        <div className="gl6-footer-middle">
          <p>
            A fictional aesthetic and skin studio
            concept featuring thoughtful design
            and responsible service exploration.
            Not a real medical practice.
          </p>

          <div>
            <span>THE STUDIO</span>

            <Link to="/studio">
              Our philosophy
            </Link>

            <Link to="/gallery">
              Visual journal
            </Link>

            <Link to="/finder">
              Skin compass
            </Link>
          </div>

          <div>
            <span>EXPLORE</span>

            <Link to="/treatments">
              Treatment atlas
            </Link>

            <Link to="/calendar">
              Demo calendar
            </Link>

            <Link to="/requests">
              My demo requests
            </Link>
          </div>
        </div>

        <div className="gl6-footer-base">
          <span>
            © {new Date().getFullYear()} YOUR GLOW.
          </span>

          <span>
            {BRAND.developer}
          </span>

          <Link to="/">
            BACK TO THE BEGINNING
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
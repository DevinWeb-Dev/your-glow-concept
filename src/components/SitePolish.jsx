import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
} from "react-router-dom";

import {
  ArrowUp,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import "../styles/polish.css";

const DESCRIPTIONS = {
  "/":
    "Explore YOUR GLOW., a premium aesthetic and skin studio website concept with curated treatment pages and interactive demo consultation scheduling.",

  "/treatments":
    "Discover sample facial, skincare, and aesthetic consultation services at YOUR GLOW.",

  "/finder":
    "Explore YOUR GLOW's interactive treatment finder, an informational discovery guide rather than a medical assessment.",

  "/studio":
    "Learn about the thoughtful approach and editorial aesthetic of the YOUR GLOW studio concept.",

  "/gallery":
    "Explore the editorial skincare and studio atmosphere gallery of YOUR GLOW.",

  "/consultation":
    "Preview an interactive aesthetic studio consultation request using fictional information.",

  "/calendar":
    "Browse sample consultation dates and times in the YOUR GLOW interactive booking calendar.",
};

function prefersReducedMotion() {
  return window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
}

export default function SitePolish() {
  const location = useLocation();

  const [showIntro, setShowIntro] = useState(
    () => !prefersReducedMotion()
  );

  const [progress, setProgress] = useState(0);
  const [showToTop, setShowToTop] = useState(false);

  // Intro is displayed when the public
  // experience first mounts.
  useEffect(() => {
    if (!showIntro) return;

    const timer = window.setTimeout(() => {
      setShowIntro(false);
    }, 850);

    return () => {
      window.clearTimeout(timer);
    };
  }, [showIntro]);

  // Scroll progress indicator.
  useEffect(() => {
    let scheduledFrame = null;

    function calculateScroll() {
      scheduledFrame = null;

      const root = document.documentElement;

      const maximum = Math.max(
        root.scrollHeight - window.innerHeight,
        0
      );

      const current = Math.max(
        0,
        window.scrollY
      );

      const nextProgress =
        maximum > 0
          ? Math.min(
              100,
              (current / maximum) * 100
            )
          : 0;

      setProgress(nextProgress);
      setShowToTop(current > 500);
    }

    function scheduleUpdate() {
      if (scheduledFrame !== null) return;

      scheduledFrame =
        window.requestAnimationFrame(
          calculateScroll
        );
    }

    calculateScroll();

    window.addEventListener(
      "scroll",
      scheduleUpdate,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      scheduleUpdate
    );

    return () => {
      window.removeEventListener(
        "scroll",
        scheduleUpdate
      );

      window.removeEventListener(
        "resize",
        scheduleUpdate
      );

      if (scheduledFrame !== null) {
        window.cancelAnimationFrame(
          scheduledFrame
        );
      }
    };
  }, []);

  // Per-page meta descriptions.
  useEffect(() => {
    const meta = document.querySelector(
      'meta[name="description"]'
    );

    if (!meta) return;

    let description =
      DESCRIPTIONS[location.pathname];

    if (
      location.pathname.startsWith(
        "/treatments/"
      )
    ) {
      description =
        "Explore an illustrative YOUR GLOW skincare or aesthetic treatment, sample pricing, and consultation information.";
    }

    meta.setAttribute(
      "content",
      description ||
        "YOUR GLOW. — Premium aesthetic and skin clinic website concept."
    );
  }, [location.pathname]);

  function backToTop() {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion()
        ? "instant"
        : "smooth",
    });
  }

  return (
    <>
      <div
        className="yg5-scroll-progress"
        aria-hidden="true"
      >
        <span
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      {showIntro && (
        <div
          className="yg5-intro"
          aria-hidden="true"
        >
          <div className="yg5-intro-content">
            <span className="yg5-intro-icon">
              <Sparkles
                size={38}
                strokeWidth={1.1}
              />
            </span>

            <span className="yg5-intro-eyebrow">
              THE BEAUTY OF INTENTIONAL CARE
            </span>

            <h2>
              YOUR GLOW<span>.</span>
            </h2>

            <p>
              Care for your skin.
              Confidence in your own way.
            </p>

            <span className="yg5-intro-loading" />
          </div>
        </div>
      )}

      <div className="yg5-demo-label">
        <ShieldCheck
          size={15}
          strokeWidth={1.6}
        />

        <span>
          PORTFOLIO CONCEPT · DEMO BOOKINGS ONLY
        </span>
      </div>

      <button
        type="button"
        className={`yg5-to-top ${
          showToTop ? "is-visible" : ""
        }`}
        aria-label="Back to top"
        tabIndex={showToTop ? 0 : -1}
        onClick={backToTop}
      >
        <ArrowUp
          size={21}
          strokeWidth={1.7}
        />
      </button>
    </>
  );
}
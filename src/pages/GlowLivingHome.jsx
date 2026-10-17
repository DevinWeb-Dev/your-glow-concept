import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  MoveUpRight,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react";

import {
  BRAND,
  SERVICES,
  APPROACH,
  FAQS,
  IMAGES,
  formatPeso,
} from "../data/studioData.js";

import "../styles/glow-living.css";

const CARE_TABS = [
  "All",
  "Consultations",
  "Facials",
  "Skin Care",
  "Laser",
];

const PATHS = [
  {
    key: "conversation",
    label: "I want to understand my options",
    line: "A good starting point is a conversation.",
    text:
      "Browse consultation-led concepts to prepare questions for a qualified skin professional.",
    ids: [
      "skin-consultation",
      "acne-care",
    ],
  },
  {
    key: "ritual",
    label: "I'm exploring a care ritual",
    line: "Make a little room for yourself.",
    text:
      "Explore illustrative facial experiences and learn why product suitability varies.",
    ids: [
      "hydrating-facial",
      "brightening-facial",
    ],
  },
  {
    key: "advanced",
    label: "I'm curious about advanced care",
    line: "Information before decisions.",
    text:
      "Explore questions about skin-renewal and laser consultations; this is not a medical assessment.",
    ids: [
      "skin-renewal",
      "laser-consultation",
    ],
  },
];

/* ====================================
   SCROLL REVEAL
==================================== */

function Appearing({
  children,
  className = "",
  as: Tag = "div",
}) {
  const element = useRef(null);

  useEffect(() => {
    const target = element.current;

    if (!target) return;

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      target.classList.add("gl6-is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          target.classList.add("gl6-is-visible");
          observer.unobserve(target);
        }
      },
      { threshold: 0.13 }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={element}
      className={`gl6-appear ${className}`}
    >
      {children}
    </Tag>
  );
}

/* ====================================
   CUSTOM BIOMORPHIC VISUAL SYMBOL
==================================== */

function SkinSymbol({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 210 210"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="105"
        cy="105"
        r="94"
        stroke="currentColor"
        strokeWidth="1"
        opacity=".55"
      />

      <path
        d="M105 12c48 35 76 62 76 103s-34 75-76 75-76-34-76-75 28-68 76-103Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      <path
        d="M39 125c38-28 94-28 132 0"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeDasharray="4 8"
      />

      <circle
        cx="105"
        cy="105"
        r="12"
        fill="currentColor"
      />

      <path
        d="M105 2v24M105 184v24M2 105h24M184 105h24"
        stroke="currentColor"
        opacity=".5"
      />
    </svg>
  );
}

/* ====================================
   CUSTOM PILL BUTTON
==================================== */

function ActionLink({
  to,
  children,
  variant = "dark",
}) {
  return (
    <Link
      to={to}
      className={`gl6-action gl6-action--${variant}`}
    >
      <span>{children}</span>

      <span className="gl6-action-disc">
        <ArrowUpRight size={19} />
      </span>
    </Link>
  );
}

/* ====================================
   MAIN PAGE
==================================== */

export default function GlowLivingHome() {
  const [tab, setTab] = useState("All");

  const [activeId, setActiveId] = useState(
    "hydrating-facial"
  );

  const [pathIndex, setPathIndex] = useState(0);

  const list =
    tab === "All"
      ? SERVICES
      : SERVICES.filter(
          (service) => service.category === tab
        );

  const active =
    list.find(
      (service) => service.id === activeId
    ) || list[0];

  const path = PATHS[pathIndex];

  return (
    <main className="gl6-home">
      {/* =================================
          01 / HERO — SKIN IN MOTION
      ================================= */}

      <section
        className="gl6-hero"
        aria-label="YOUR GLOW introduction"
      >
        <div
          className="gl6-hero-field"
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </div>

        <div className="gl6-hero-inner">
          <div className="gl6-hero-meta">
            <span>
              <i />
              THE NEXT WAVE OF SELF-CARE
            </span>

            <span>
              YOUR GLOW / 001
            </span>
          </div>

          <div className="gl6-hero-main">
            <div className="gl6-hero-copy">
              <div className="gl6-kicker">
                <Sparkles size={15} />
                WELCOME TO YOUR SKIN CULTURE
              </div>

              <h1>
                FEEL
                <br />

                <span>GOOD</span>
                <br />

                IN SKIN
                <span className="gl6-hero-punctuation">
                  .
                </span>
              </h1>

              <p>
                Not about changing who you are.
                About making space for care,
                questions, and a confidence
                that feels like yours.
              </p>

              <div className="gl6-hero-actions">
                <ActionLink to="/finder">
                  Explore your starting point
                </ActionLink>

                <Link
                  to="/treatments"
                  className="gl6-plain-link"
                >
                  Discover the care edit
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>

            <div className="gl6-hero-stage">
              <div className="gl6-hero-stage-ring" />

              <div className="gl6-hero-stage-photo">
                <img
                  src={IMAGES.hero}
                  alt="Illustrative modern skin-care facial treatment experience"
                  fetchPriority="high"
                />
              </div>

              <div className="gl6-hero-tag gl6-hero-tag--top">
                <span>
                  001 / YOUR SKIN
                </span>

                <strong>
                  IT'S PERSONAL.
                </strong>
              </div>

              <div className="gl6-hero-tag gl6-hero-tag--bottom">
                <SkinSymbol className="gl6-hero-icon" />

                <span>
                  CARE IS
                  <br />
                  A CONVERSATION
                </span>
              </div>

              <div className="gl6-hero-stage-caption">
                A LIVING STUDY OF SKIN & SELF-CARE
              </div>
            </div>
          </div>

          <div className="gl6-hero-bottom">
            <span>
              NO ONE-SIZE-FITS-ALL BEAUTY.
            </span>

            <a href="#gl6-explore">
              SCROLL TO DISCOVER
              <ArrowDownRight size={18} />
            </a>

            <span>
              YOUR OWN PACE. YOUR OWN GLOW.
            </span>
          </div>
        </div>
      </section>

      {/* =================================
          02 / KINETIC BRAND MARQUEE
      ================================= */}

      <div
        className="gl6-ticker"
        aria-label="Care philosophy"
      >
        <div>
          {Array.from(
            { length: 2 },
            (_, index) => (
              <span key={index}>
                <i>✳</i>
                YOUR SKIN, YOUR TERMS
                <i>✳</i>
                CARE WITH CONTEXT
                <i>✳</i>
                GOOD QUESTIONS FIRST
                <i>✳</i>
                ALWAYS ROOM TO GROW
              </span>
            )
          )}
        </div>
      </div>

      {/* =================================
          03 / MANIFESTO
      ================================= */}

      <section
        className="gl6-manifesto gl6-contain"
        id="gl6-explore"
      >
        <Appearing className="gl6-manifesto-symbol">
          <SkinSymbol />
        </Appearing>

        <Appearing className="gl6-manifesto-content">
          <span className="gl6-label">
            A FRESH WAY TO THINK ABOUT SKIN
          </span>

          <h2>
            There's no such thing as{" "}
            <span>one perfect glow.</span>
          </h2>

          <p>
            Skin is individual. Care should be
            thoughtful. YOUR GLOW is an imagined
            space where modern aesthetics meets
            practical information, realistic
            expectations, and permission to ask
            every question.
          </p>

          <div className="gl6-manifesto-link">
            <span>
              STUDIO PHILOSOPHY
            </span>

            <Link
              to="/studio"
              aria-label="Explore our studio philosophy"
            >
              <ArrowUpRight size={22} />
            </Link>
          </div>
        </Appearing>
      </section>

      {/* =================================
          04 / INTERACTIVE CARE LIBRARY
      ================================= */}

      <section className="gl6-care">
        <div className="gl6-contain">
          <Appearing className="gl6-care-heading">
            <div>
              <span className="gl6-label">
                THE CARE LIBRARY / SIX OPEN
                CONVERSATIONS
              </span>

              <h2>
                THE SKIN
                <br />
                <span>EDIT.</span>
              </h2>
            </div>

            <p>
              Explore the studio's sample
              treatment menu by interest.
              All prices are illustrative,
              and a licensed professional
              must assess suitability.
            </p>
          </Appearing>

          <div
            className="gl6-care-tabs"
            role="group"
            aria-label="Filter treatments by category"
          >
            {CARE_TABS.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={tab === item}
                className={
                  tab === item ? "is-active" : ""
                }
                onClick={() => {
                  setTab(item);
                  setActiveId("");
                }}
              >
                {item}

                <span>
                  {item === "All"
                    ? SERVICES.length
                    : SERVICES.filter(
                        (service) =>
                          service.category === item
                      ).length}
                </span>
              </button>
            ))}
          </div>

          <div className="gl6-care-gallery">
            <div className="gl6-care-list">
              {list.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  className={
                    active.id === service.id
                      ? "is-current"
                      : ""
                  }
                  aria-pressed={
                    active.id === service.id
                  }
                  onClick={() =>
                    setActiveId(service.id)
                  }
                >
                  <span className="gl6-care-index">
                    {service.number}
                  </span>

                  <span className="gl6-care-name">
                    {service.name}

                    <small>
                      {service.category}
                      {" / "}
                      {service.duration} minutes
                    </small>
                  </span>

                  <ArrowUpRight size={20} />
                </button>
              ))}
            </div>

            <div
              className="gl6-care-feature"
              key={active.id}
            >
              <div className="gl6-care-image">
                <img
                  src={active.image}
                  loading="lazy"
                  alt={`Illustrative imagery representing ${active.name}`}
                />

                <span>{active.eyebrow}</span>
              </div>

              <div className="gl6-care-feature-foot">
                <div>
                  <span>
                    SELECTED CARE STUDY /{" "}
                    {active.number}
                  </span>

                  <h3>{active.name}</h3>

                  <p>
                    Sample starting fee{" "}
                    {formatPeso(active.price)}
                    {" · "}
                    Subject to professional
                    assessment
                  </p>
                </div>

                <Link
                  to={`/treatments/${active.id}`}
                  aria-label={`View ${active.name} details`}
                >
                  <ArrowUpRight size={22} />
                </Link>
              </div>
            </div>
          </div>

          <div className="gl6-care-end">
            <span>
              {String(list.length).padStart(2, "0")}
              {" "}
              ENTRIES IN THIS VIEW
            </span>

            <ActionLink
              to="/treatments"
              variant="light"
            >
              View complete care library
            </ActionLink>
          </div>
        </div>
      </section>

      {/* =================================
          05 / THE TEXTURE OF CARE
      ================================= */}

      <section className="gl6-interlude">
        <div className="gl6-interlude-photo">
          <img
            src={IMAGES.ritual}
            alt="Illustrative skin-care products and ritual still life"
            loading="lazy"
          />

          <span>
            THE TEXTURE OF TAKING TIME
          </span>
        </div>

        <div className="gl6-interlude-copy">
          <div
            className="gl6-interlude-drop"
            aria-hidden="true"
          />

          <span className="gl6-label">
            SOFT SCIENCE / HUMAN FEELING
          </span>

          <h2>
            More than
            <br />
            <span>skin-deep.</span>
          </h2>

          <p>
            Thoughtful aesthetic experiences
            begin with better questions.
            What feels right for your routine?
            What needs a professional's
            assessment? What are the
            realistic possibilities?
          </p>

          <div className="gl6-interlude-points">
            <span>
              <Check size={17} />
              Clear service information
            </span>

            <span>
              <Check size={17} />
              Individual suitability matters
            </span>

            <span>
              <Check size={17} />
              No overnight transformations promised
            </span>
          </div>

          <ActionLink
            to="/studio"
            variant="mint"
          >
            Step inside the concept
          </ActionLink>
        </div>
      </section>

      {/* =================================
          06 / INTERACTIVE GLOW GUIDE
      ================================= */}

      <section className="gl6-guide gl6-contain">
        <Appearing className="gl6-guide-intro">
          <span className="gl6-label">
            THE INTERACTIVE GLOW GUIDE /
            NOT A DIAGNOSIS
          </span>

          <h2>
            START WHERE
            <br />
            <span>YOU ARE.</span>
          </h2>

          <p>
            Pick the type of information you
            want to browse. This guide organizes
            sample services—it doesn't diagnose
            skin, assess suitability, or recommend
            treatment.
          </p>
        </Appearing>

        <div className="gl6-guide-panel">
          <div className="gl6-guide-select">
            <span className="gl6-guide-overline">
              WHICH CONVERSATION WOULD YOU
              LIKE TO EXPLORE?
            </span>

            {PATHS.map((option, index) => (
              <button
                key={option.key}
                type="button"
                className={
                  index === pathIndex
                    ? "is-active"
                    : ""
                }
                aria-pressed={
                  index === pathIndex
                }
                onClick={() =>
                  setPathIndex(index)
                }
              >
                <span>0{index + 1}</span>

                {option.label}

                <ChevronRight size={18} />
              </button>
            ))}
          </div>

          <div
            className="gl6-guide-result"
            key={path.key}
          >
            <div className="gl6-guide-result-top">
              <SkinSymbol />

              <span>
                A PLACE TO BEGIN / 0
                {pathIndex + 1}
              </span>
            </div>

            <h3>{path.line}</h3>

            <p>{path.text}</p>

            <div className="gl6-guide-matches">
              {path.ids.map((id) => {
                const service = SERVICES.find(
                  (item) => item.id === id
                );

                return service ? (
                  <Link
                    key={id}
                    to={`/treatments/${id}`}
                  >
                    {service.name}

                    <ArrowUpRight size={15} />
                  </Link>
                ) : null;
              })}
            </div>

            <Link
              className="gl6-guide-cta"
              to="/finder"
            >
              OPEN FULL TREATMENT FINDER
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* =================================
          07 / CARE PHILOSOPHY
      ================================= */}

      <section className="gl6-process">
        <div className="gl6-contain">
          <Appearing className="gl6-process-head">
            <span className="gl6-label">
              A GENTLER KIND OF JOURNEY
            </span>

            <h2>
              CARE MOVES
              <br />
              <span>WITH YOU.</span>
            </h2>
          </Appearing>

          <div className="gl6-process-steps">
            {APPROACH.map((step, index) => (
              <Appearing
                as="article"
                key={step.number}
              >
                <span className="gl6-process-num">
                  / {step.number}
                </span>

                <div className="gl6-process-orbit">
                  <span>
                    {index === 0 ? (
                      <Waves
                        size={31}
                        strokeWidth={1.3}
                      />
                    ) : index === 1 ? (
                      <Sparkles
                        size={31}
                        strokeWidth={1.3}
                      />
                    ) : (
                      <ShieldCheck
                        size={31}
                        strokeWidth={1.3}
                      />
                    )}
                  </span>
                </div>

                <h3>{step.title}</h3>

                <p>{step.description}</p>
              </Appearing>
            ))}
          </div>
        </div>
      </section>

      {/* =================================
          08 / STUDIO VISUAL JOURNAL
      ================================= */}

      <section className="gl6-world">
        <div className="gl6-world-text">
          <span className="gl6-label">
            THE ATMOSPHERE / YOUR GLOW.
          </span>

          <h2>
            YOUR
            <br />
            MOMENT
            <br />
            <span>MATTERS.</span>
          </h2>

          <p>
            Aesthetic care should leave room
            for individuality. See how the
            spaces, textures, and rituals
            of the imagined studio come together.
          </p>

          <ActionLink
            to="/gallery"
            variant="lime"
          >
            Explore visual journal
          </ActionLink>
        </div>

        <div className="gl6-world-images">
          <div>
            <img
              src={IMAGES.products}
              alt="Illustrative studio skincare bottles"
              loading="lazy"
            />
          </div>

          <div>
            <img
              src={IMAGES.skincare}
              alt="Illustrative skincare editorial composition"
              loading="lazy"
            />
          </div>

          <span>
            01 / STUDIO MATERIALS —
            02 / SELF-CARE OBJECTS
          </span>
        </div>
      </section>

      {/* =================================
          09 / FAQ
      ================================= */}

      <section className="gl6-faq gl6-contain">
        <div>
          <span className="gl6-label">
            BEFORE YOU BEGIN
          </span>

          <h2>
            LET'S
            <br />
            <span>BE CLEAR.</span>
          </h2>

          <p>
            Better questions deserve
            straightforward answers.
          </p>

          <Link
            to="/consultation"
            className="gl6-plain-link"
          >
            Explore consultation
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="gl6-faq-items">
          {FAQS.map((item, index) => (
            <details key={item.question}>
              <summary>
                <span>
                  {String(
                    index + 1
                  ).padStart(2, "0")}
                </span>

                <strong>
                  {item.question}
                </strong>

                <span
                  className="gl6-faq-plus"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>

              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* =================================
          10 / FINAL CTA
      ================================= */}

      <section className="gl6-last">
        <div className="gl6-last-inner">
          <span className="gl6-label">
            LET'S MAKE SPACE FOR YOU
          </span>

          <h2>
            GOOD SKIN
            <br />
            DAYS START WITH
            <br />
            <span>A CONVERSATION.</span>
          </h2>

          <p>
            Explore our fictional consultation
            calendar. No real booking is made,
            and no personal medical information
            is collected.
          </p>

          <div className="gl6-last-actions">
            <ActionLink
              to="/calendar"
              variant="lime"
            >
              <CalendarDays size={17} />
              See demo calendar
            </ActionLink>

            <Link
              to="/consultation"
              className="gl6-plain-link"
            >
              Consultation preview
              <MoveUpRight size={18} />
            </Link>
          </div>

          <small>
            <ShieldCheck size={16} />
            SAMPLE SERVICES & PROVIDER INFORMATION ONLY
            {" · "}
            {BRAND.developer}
          </small>
        </div>

        <div
          className="gl6-last-symbol"
          aria-hidden="true"
        >
          <SkinSymbol />
        </div>
      </section>
    </main>
  );
}
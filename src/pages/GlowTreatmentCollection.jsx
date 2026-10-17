import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Clock3,
  Equal,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

import {
  CATEGORIES,
  IMAGES,
  SERVICES,
  formatPeso,
} from "../data/studioData.js";

import {
  GLOW_STORIES,
  GOAL_SERVICES,
  TREATMENT_GOALS,
} from "../data/glowTreatmentStories.js";

import "../styles/glow-treatment-atlas.css";

const ORDER = [
  ["curated", "Curated order"],
  ["price-low", "Price: low to high"],
  ["price-high", "Price: high to low"],
  ["duration", "Shortest duration"],
];

function OrbitalGlyph({ small = false }) {
  return (
    <svg
      className={`gl7-glyph ${
        small ? "gl7-glyph--small" : ""
      }`}
      viewBox="0 0 240 240"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="120"
        cy="120"
        r="102"
        stroke="currentColor"
        strokeOpacity=".65"
      />

      <circle
        cx="120"
        cy="120"
        r="72"
        stroke="currentColor"
        strokeDasharray="2 9"
        strokeOpacity=".6"
      />

      <path
        d="M120 19c53 42 80 66 80 113a80 80 0 0 1-160 0c0-47 27-71 80-113Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      <path
        d="M52 135c43-26 93-26 136 0"
        stroke="currentColor"
        strokeOpacity=".6"
      />

      <circle
        cx="120"
        cy="120"
        r="10"
        fill="currentColor"
      />

      <path
        d="M120 0v30m0 180v30M0 120h30m180 0h30"
        stroke="currentColor"
        strokeOpacity=".5"
      />
    </svg>
  );
}

function CompareModal({
  selected,
  onClose,
  onRemove,
}) {
  const heading = useRef(null);

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    const previousFocus =
      document.activeElement;

    document.body.style.overflow =
      "hidden";

    heading.current?.focus();

    const keydown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      keydown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        keydown
      );

      document.body.style.overflow =
        previousOverflow;

      previousFocus?.focus?.();
    };
  }, [onClose]);

  return createPortal(
    <div
      className="gl7-compare-overlay"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className="gl7-compare-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gl7-compare-title"
      >
        <div className="gl7-compare-heading">
          <div>
            <span className="gl7-eyebrow">
              THE SIDE-BY-SIDE STUDIO / DEMO ONLY
            </span>

            <h2
              id="gl7-compare-title"
              ref={heading}
              tabIndex={-1}
            >
              Consider the{" "}
              <em>differences.</em>
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close comparison"
          >
            <X size={21} />
          </button>
        </div>

        <p className="gl7-compare-intro">
          This compares illustrative service
          information, not medical effectiveness
          or individual suitability.
        </p>

        <div className="gl7-compare-scroll">
          <div
            className="gl7-compare-table"
            style={{
              "--compare-count":
                selected.length,
            }}
          >
            <div
              className="gl7-compare-labels"
              aria-hidden="true"
            >
              <span>SERVICE</span>
              <span>CATEGORY</span>
              <span>DURATION</span>
              <span>SAMPLE FEE</span>
              <span>DISCUSSION</span>
              <span>NEXT STEP</span>
            </div>

            {selected.map((service) => (
              <div
                className="gl7-compare-column"
                key={service.id}
              >
                <div className="gl7-compare-name">
                  <strong>
                    {service.name}
                  </strong>

                  <button
                    type="button"
                    onClick={() =>
                      onRemove(service.id)
                    }
                    aria-label={`Remove ${service.name} from comparison`}
                  >
                    <X size={16} />
                  </button>
                </div>

                <span>
                  {service.category}
                </span>

                <span>
                  {service.duration} minutes
                </span>

                <span>
                  {formatPeso(service.price)}
                  <small>illustrative</small>
                </span>

                <p>
                  {
                    GLOW_STORIES[service.id]
                      ?.note
                  }
                </p>

                <Link
                  to={`/treatments/${service.id}`}
                  onClick={onClose}
                >
                  READ THE JOURNAL
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="gl7-compare-footer">
          <ShieldCheck size={16} />

          Concept-only comparison · No
          treatment recommendation · No
          live booking
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function GlowTreatmentCollection() {
  const [category, setCategory] =
    useState("All");

  const [goal, setGoal] =
    useState("All interests");

  const [query, setQuery] =
    useState("");

  const [order, setOrder] =
    useState("curated");

  const [maxPrice, setMaxPrice] =
    useState(3000);

  const [maxMinutes, setMaxMinutes] =
    useState(60);

  const [compareIds, setCompareIds] =
    useState([]);

  const [modalOpen, setModalOpen] =
    useState(false);

  const filtered = useMemo(() => {
    const needle =
      query.toLowerCase().trim();

    const match = SERVICES.filter(
      (service) => {
        const story =
          GLOW_STORIES[service.id];

        return (
          (category === "All" ||
            service.category === category) &&
          (!GOAL_SERVICES[goal] ||
            GOAL_SERVICES[goal].includes(
              service.id
            )) &&
          service.price <= maxPrice &&
          service.duration <= maxMinutes &&
          [
            service.name,
            service.category,
            service.subtitle,
            service.description,
            ...story.intentions,
          ]
            .join(" ")
            .toLowerCase()
            .includes(needle)
        );
      }
    );

    if (order === "price-low") {
      return match.sort(
        (a, b) => a.price - b.price
      );
    }

    if (order === "price-high") {
      return match.sort(
        (a, b) => b.price - a.price
      );
    }

    if (order === "duration") {
      return match.sort(
        (a, b) =>
          a.duration - b.duration ||
          a.price - b.price
      );
    }

    return match;
  }, [
    category,
    goal,
    query,
    order,
    maxPrice,
    maxMinutes,
  ]);

  const compared = compareIds
    .map((id) =>
      SERVICES.find(
        (item) => item.id === id
      )
    )
    .filter(Boolean);

  function toggleCompare(id) {
    setCompareIds((current) => {
      if (current.includes(id)) {
        return current.filter(
          (value) => value !== id
        );
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, id];
    });
  }

  function reset() {
    setCategory("All");
    setGoal("All interests");
    setQuery("");
    setOrder("curated");
    setMaxPrice(3000);
    setMaxMinutes(60);
  }

  function closeModal() {
    setModalOpen(false);
  }

  return (
    <div className="gl7 gl7-atlas">
      {/* ARCHITECTURAL HERO */}

      <section className="gl7-atlas-hero">
        <div className="gl7-atlas-hero-copy">
          <div className="gl7-atlas-meta">
            <span>
              YOUR GLOW / THE LIVING INDEX
            </span>

            <span>
              VOL. 02 — SKIN CULTURE
            </span>
          </div>

          <span className="gl7-eyebrow">
            <Sparkles size={15} />
            THE TREATMENT ATLAS
          </span>

          <h1>
            THE CARE <em>EDIT.</em>
          </h1>

          <p>
            Six imagined experiences. Different
            starting points. One shared belief:
            information should feel as
            thoughtful as the care it describes.
          </p>

          <a
            className="gl7-text-link"
            href="#gl7-discover"
          >
            EXPLORE THE COLLECTION
            <ArrowDownRight size={18} />
          </a>

          <small>
            FICTIONAL SERVICES · ILLUSTRATIVE
            PHP FEES · NO MEDICAL ASSESSMENT
          </small>
        </div>

        <div className="gl7-atlas-hero-media">
          <div className="gl7-atlas-hero-mask">
            <img
              src={IMAGES.products}
              alt="Editorial skincare bottles illustrating a fictional skin studio"
            />
          </div>

          <div className="gl7-atlas-orb">
            <OrbitalGlyph />
          </div>

          <span className="gl7-atlas-media-caption">
            MATERIAL / LIGHT / CARE / 001
          </span>
        </div>
      </section>

      {/* ADVANCED EXPLORER */}

      <section
        id="gl7-discover"
        className="gl7-explorer gl7-wrap"
      >
        <div className="gl7-explorer-heading">
          <div>
            <span className="gl7-eyebrow">
              01 / THE EXPLORATION
            </span>

            <h2>
              Find your{" "}
              <em>starting point.</em>
            </h2>
          </div>

          <p>
            Filter by service type, general
            interest, demo fee and duration.
            These controls are for browsing,
            not skin diagnosis.
          </p>
        </div>

        <div className="gl7-filter-shell">
          <div className="gl7-filter-top">
            <label className="gl7-search">
              <Search size={19} />

              <input
                type="search"
                value={query}
                onChange={(event) =>
                  setQuery(
                    event.target.value
                  )
                }
                placeholder="Search the care collection"
                aria-label="Search skin treatments"
              />
            </label>

            <label className="gl7-sort">
              <SlidersHorizontal size={17} />

              <span>SORT</span>

              <select
                value={order}
                onChange={(event) =>
                  setOrder(
                    event.target.value
                  )
                }
                aria-label="Sort treatments"
              >
                {ORDER.map(
                  ([id, label]) => (
                    <option
                      key={id}
                      value={id}
                    >
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>
          </div>

          {/* CATEGORIES */}

          <div
            className="gl7-filter-cats"
            role="group"
            aria-label="Service category"
          >
            {CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  category === item
                    ? "is-active"
                    : ""
                }
                aria-pressed={
                  category === item
                }
                onClick={() =>
                  setCategory(item)
                }
              >
                {item}

                <span>
                  {item === "All"
                    ? SERVICES.length
                    : SERVICES.filter(
                        (service) =>
                          service.category ===
                          item
                      ).length}
                </span>
              </button>
            ))}
          </div>

          {/* SECONDARY FILTERS */}

          <div className="gl7-filter-bottom">
            <label>
              <span>YOUR INTEREST</span>

              <select
                value={goal}
                onChange={(event) =>
                  setGoal(
                    event.target.value
                  )
                }
              >
                {TREATMENT_GOALS.map(
                  (item) => (
                    <option key={item}>
                      {item}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className="gl7-price">
              <span>
                MAX. ILLUSTRATIVE FEE

                <strong>
                  {formatPeso(maxPrice)}
                </strong>
              </span>

              <input
                type="range"
                min={500}
                max={3000}
                step={250}
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(
                    Number(
                      event.target.value
                    )
                  )
                }
              />
            </label>

            <label>
              <span>
                MAX. SESSION LENGTH
              </span>

              <select
                value={maxMinutes}
                onChange={(event) =>
                  setMaxMinutes(
                    Number(
                      event.target.value
                    )
                  )
                }
              >
                <option value={30}>
                  30 minutes
                </option>

                <option value={45}>
                  45 minutes
                </option>

                <option value={60}>
                  60 minutes
                </option>
              </select>
            </label>

            <button
              className="gl7-reset"
              type="button"
              onClick={reset}
            >
              <RotateCcw size={15} />
              RESET
            </button>
          </div>
        </div>

        <div className="gl7-results-line">
          <span>
            {String(
              filtered.length
            ).padStart(2, "0")}
            {" / "}
            {String(
              SERVICES.length
            ).padStart(2, "0")}
            {" "}
            STUDIES IN VIEW
          </span>

          <span>
            COMPARE UP TO THREE ENTRIES
          </span>
        </div>

        {/* TREATMENT COLLECTION */}

        <div className="gl7-service-grid">
          {filtered.map(
            (service, index) => {
              const story =
                GLOW_STORIES[service.id];

              const checked =
                compareIds.includes(
                  service.id
                );

              return (
                <article
                  className={`gl7-service-card gl7-mood-${story.mood}`}
                  key={service.id}
                >
                  <div className="gl7-card-media">
                    <Link
                      to={`/treatments/${service.id}`}
                      aria-label={`Open ${service.name} treatment journal`}
                    >
                      <img
                        src={service.image}
                        loading="lazy"
                        alt={`Illustrative editorial photograph for ${service.name}`}
                      />
                    </Link>

                    <span className="gl7-card-count">
                      {service.number} /{" "}
                      {String(
                        SERVICES.length
                      ).padStart(2, "0")}
                    </span>

                    <div className="gl7-card-geometry">
                      <OrbitalGlyph small />
                    </div>

                    <span className="gl7-card-category">
                      {service.category.toUpperCase()}
                    </span>
                  </div>

                  <div className="gl7-card-body">
                    <span className="gl7-card-overline">
                      {story.motif}
                    </span>

                    <h3>
                      <Link
                        to={`/treatments/${service.id}`}
                      >
                        {service.name}
                      </Link>
                    </h3>

                    <p>{story.opening}</p>

                    <div className="gl7-card-tags">
                      {story.intentions
                        .slice(0, 2)
                        .map((item) => (
                          <span
                            key={item}
                          >
                            {item}
                          </span>
                        ))}
                    </div>

                    <div className="gl7-card-facts">
                      <span>
                        <Clock3 size={15} />
                        {service.duration} MIN
                      </span>

                      <span>
                        FROM{" "}
                        {formatPeso(
                          service.price
                        )}
                        *
                      </span>
                    </div>

                    <div className="gl7-card-actions">
                      <Link
                        to={`/treatments/${service.id}`}
                        className="gl7-card-open"
                      >
                        VIEW JOURNAL
                        <ArrowUpRight
                          size={16}
                        />
                      </Link>

                      <button
                        type="button"
                        aria-pressed={checked}
                        disabled={
                          !checked &&
                          compareIds.length >= 3
                        }
                        onClick={() =>
                          toggleCompare(
                            service.id
                          )
                        }
                      >
                        <Equal size={17} />
                        {checked
                          ? "REMOVE"
                          : "COMPARE"}
                      </button>
                    </div>
                  </div>

                  {index === 0 && (
                    <span className="gl7-card-editorial">
                      THE LIVING SKIN SERIES
                    </span>
                  )}
                </article>
              );
            }
          )}
        </div>

        {!filtered.length && (
          <div className="gl7-empty">
            <OrbitalGlyph small />

            <h3>
              Nothing in this edit.
            </h3>

            <p>
              Try widening your sample
              fee, duration or interest
              selections.
            </p>

            <button
              type="button"
              onClick={reset}
            >
              CLEAR FILTERS
              <ArrowRight size={17} />
            </button>
          </div>
        )}

        <p className="gl7-disclosure">
          <ShieldCheck size={17} />

          All service descriptions and
          fees are illustrative. No medical
          conclusions, proven results or real
          appointment availability are implied.
        </p>
      </section>

      {/* TREATMENT FINDER CONNECTION */}

      <section className="gl7-atlas-finder">
        <div className="gl7-wrap gl7-atlas-finder-inner">
          <div>
            <span className="gl7-eyebrow">
              02 / NOT SURE WHERE TO BEGIN?
            </span>

            <h2>
              Follow a{" "}
              <em>different thread.</em>
            </h2>

            <p>
              Our existing Treatment Finder
              organizes general interests
              without diagnosing or
              determining suitability.
            </p>

            <Link to="/finder">
              ENTER THE SKIN FINDER
              <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="gl7-finder-art">
            <OrbitalGlyph />

            <span>
              EXPLORE / ASK / UNDERSTAND
            </span>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}

      <section className="gl7-atlas-end gl7-wrap">
        <div>
          <span className="gl7-eyebrow">
            03 / YOUR NEXT CONVERSATION
          </span>

          <h2>
            No pressure.
            <br />

            <em>Just possibilities.</em>
          </h2>
        </div>

        <div>
          <p>
            Take a closer look at the fictional
            calendar. Select a treatment interest
            and save a demo request locally
            in your own browser.
          </p>

          <Link to="/calendar">
            EXPLORE SAMPLE TIMES
            <ChevronRight size={19} />
          </Link>
        </div>
      </section>

      {/* LIVE COMPARISON DOCK */}

      {compared.length > 0 && (
        <div
          className="gl7-compare-dock"
          role="region"
          aria-label="Treatment comparison selection"
        >
          <div>
            <strong>
              <Equal size={18} />
              THE COMPARISON EDIT
            </strong>

            <span>
              {compared
                .map(
                  (service) =>
                    service.name
                )
                .join(" · ")}
            </span>
          </div>

          <button
            className="gl7-compare-clear"
            type="button"
            onClick={() => {
              setCompareIds([]);
              setModalOpen(false);
            }}
          >
            CLEAR
          </button>

          <button
            className="gl7-compare-open"
            type="button"
            onClick={() =>
              setModalOpen(true)
            }
            disabled={
              compared.length < 2
            }
          >
            COMPARE {compared.length}
            <ArrowUpRight size={17} />
          </button>
        </div>
      )}

      {modalOpen &&
        compared.length > 0 && (
          <CompareModal
            selected={compared}
            onClose={closeModal}
            onRemove={(id) => {
              setCompareIds((ids) =>
                ids.filter(
                  (value) =>
                    value !== id
                )
              );

              if (
                compared.length <= 1
              ) {
                setModalOpen(false);
              }
            }}
          />
        )}
    </div>
  );
}
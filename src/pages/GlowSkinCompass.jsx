import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Clock3,
  Compass,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Waves,
  Flower2,
  ScanFace,
  Zap,
  SlidersHorizontal,
} from "lucide-react";

import {
  SERVICES,
  formatPeso,
} from "../data/studioData.js";

import {
  GLOW_STORIES,
} from "../data/glowTreatmentStories.js";

import "../styles/glow-batch3-architecture.css";

const INTERESTS = [
  {
    id: "explore",
    no: "01",
    name: "A thoughtful beginning",
    desc:
      "I want to understand what's possible before choosing anything.",
    icon: Compass,
    ids: [
      "skin-consultation",
      "acne-care",
      "skin-renewal",
    ],
  },
  {
    id: "ritual",
    no: "02",
    name: "The everyday ritual",
    desc:
      "I'm interested in facial care and a more considered routine.",
    icon: Flower2,
    ids: [
      "hydrating-facial",
      "brightening-facial",
      "skin-consultation",
    ],
  },
  {
    id: "texture",
    no: "03",
    name: "Texture & renewal",
    desc:
      "I want to learn about renewal-related conversations and precautions.",
    icon: Waves,
    ids: [
      "skin-renewal",
      "skin-consultation",
      "brightening-facial",
    ],
  },
  {
    id: "specific",
    no: "04",
    name: "An individual concern",
    desc:
      "I'd rather start with questions for a qualified professional.",
    icon: ScanFace,
    ids: [
      "acne-care",
      "skin-consultation",
      "skin-renewal",
    ],
  },
  {
    id: "technology",
    no: "05",
    name: "Technology & aesthetics",
    desc:
      "I'm curious about laser assessment, eligibility and risks.",
    icon: Zap,
    ids: [
      "laser-consultation",
      "skin-consultation",
      "skin-renewal",
    ],
  },
];

const PACES = [
  {
    id: "open",
    name: "I'm flexible",
    note: "Show every illustrative duration.",
    accept: () => true,
  },
  {
    id: "short",
    name: "A shorter visit",
    note: "30–45 minute examples.",
    accept: (service) =>
      service.duration <= 45,
  },
  {
    id: "long",
    name: "Room to unwind",
    note: "60-minute examples.",
    accept: (service) =>
      service.duration >= 60,
  },
];

function CompassIllustration() {
  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      aria-hidden="true"
      className="gb3-compass-art"
    >
      <circle
        cx="250"
        cy="250"
        r="216"
        stroke="currentColor"
        strokeOpacity=".55"
      />

      <circle
        cx="250"
        cy="250"
        r="168"
        stroke="currentColor"
        strokeDasharray="3 12"
        strokeOpacity=".55"
      />

      <circle
        cx="250"
        cy="250"
        r="110"
        stroke="currentColor"
        strokeOpacity=".25"
      />

      <path
        d="M250 53C366 161 432 213 432 302a182 182 0 0 1-364 0c0-89 66-141 182-249Z"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M101 290c107-87 191-87 298 0"
        stroke="currentColor"
        strokeOpacity=".6"
      />

      <path
        d="M250 0v65m0 370v65M0 250h65m370 0h65"
        stroke="currentColor"
        strokeOpacity=".7"
      />

      <circle
        cx="250"
        cy="250"
        r="23"
        fill="currentColor"
        fillOpacity=".65"
      />
    </svg>
  );
}

export default function GlowSkinCompass() {
  const [stage, setStage] = useState(0);
  const [interest, setInterest] =
    useState("explore");
  const [pace, setPace] =
    useState("open");
  const [order, setOrder] =
    useState("match");

  const selected =
    INTERESTS.find(
      (item) => item.id === interest
    ) || INTERESTS[0];

  const selectedPace =
    PACES.find(
      (item) => item.id === pace
    ) || PACES[0];

  const matches = useMemo(() => {
    const candidates = SERVICES
      .filter(selectedPace.accept)
      .map((service) => ({
        service,
        score: selected.ids.includes(service.id)
          ? 3 - selected.ids.indexOf(service.id)
          : 0,
      }))
      .filter((item) => item.score > 0);

    if (order === "price") {
      candidates.sort(
        (a, b) =>
          a.service.price - b.service.price
      );
    } else if (order === "duration") {
      candidates.sort(
        (a, b) =>
          a.service.duration - b.service.duration
      );
    } else {
      candidates.sort(
        (a, b) => b.score - a.score
      );
    }

    return candidates;
  }, [selected, selectedPace, order]);

  function reset() {
    setStage(0);
    setInterest("explore");
    setPace("open");
    setOrder("match");
  }

  return (
    <div className="gb3 gb3-compass">
      {/* HERO */}

      <section className="gb3-compass-hero">
        <div className="gb3-compass-hero-copy">
          <div className="gb3-mini">
            <span className="gb3-dot" />
            YOUR GLOW. / THE SKIN COMPASS /
            CHAPTER 03
          </div>

          <h1>
            THE ART OF <em>beginning.</em>
          </h1>

          <p>
            Less guessing. More thoughtful
            exploration. Choose what interests
            you, then browse a small editorial
            collection of sample skin-care
            conversations.
          </p>

          <a
            href="#gb3-compass-flow"
            className="gb3-underlined"
          >
            START YOUR EXPLORATION
            <ArrowRight size={18} />
          </a>

          <span className="gb3-micro">
            AN INTERACTIVE CONTENT GUIDE —
            NOT A SKIN ASSESSMENT
          </span>
        </div>

        <div className="gb3-compass-hero-art">
          <CompassIllustration />

          <span>
            POINTS OF VIEW / NOT PRESCRIPTIONS
          </span>
        </div>
      </section>

      {/* INTERACTIVE FLOW */}

      <div
        className="gb3-wrap gb3-flow"
        id="gb3-compass-flow"
      >
        <div className="gb3-flow-head">
          <span className="gb3-mini">
            01 / THE DISCOVERY SEQUENCE
          </span>

          <button
            type="button"
            onClick={reset}
            className="gb3-reset"
          >
            <RotateCcw size={15} />
            BEGIN AGAIN
          </button>
        </div>

        <div
          className="gb3-stepper"
          aria-label="Skin finder progress"
        >
          {[
            "YOUR CURIOSITY",
            "YOUR PACE",
            "THE CARE EDIT",
          ].map((name, index) => (
            <button
              key={name}
              type="button"
              className={
                stage === index
                  ? "is-current"
                  : ""
              }
              aria-current={
                stage === index
                  ? "step"
                  : undefined
              }
              onClick={() => setStage(index)}
            >
              <span>
                0{index + 1}
              </span>

              <strong>{name}</strong>
              <i aria-hidden="true" />
            </button>
          ))}
        </div>

        {/* STEP 1 */}

        {stage === 0 && (
          <section
            className="gb3-step"
            aria-labelledby="gb3-step-title"
          >
            <div className="gb3-step-header">
              <div>
                <span className="gb3-mini">
                  QUESTION / 01 OF 02
                </span>

                <h2 id="gb3-step-title">
                  What feels{" "}
                  <em>interesting?</em>
                </h2>
              </div>

              <p>
                Pick an area to browse.
                There's no correct answer,
                and this doesn't identify
                a skin condition.
              </p>
            </div>

            <div
              className="gb3-intent-grid"
              role="group"
              aria-label="Select an interest"
            >
              {INTERESTS.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={
                      interest === item.id
                    }
                    className={
                      interest === item.id
                        ? "is-selected"
                        : ""
                    }
                    onClick={() =>
                      setInterest(item.id)
                    }
                  >
                    <span className="gb3-intent-top">
                      <small>
                        {item.no} / 05
                      </small>

                      <Icon
                        size={24}
                        strokeWidth={1.5}
                      />
                    </span>

                    <strong>
                      {item.name}
                    </strong>

                    <span className="gb3-intent-copy">
                      {item.desc}
                    </span>

                    <span className="gb3-intent-check">
                      {interest === item.id ? (
                        <Check size={17} />
                      ) : (
                        <ArrowUpRight size={17} />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="gb3-step-actions">
              <span>
                STEP 01 · ONE AREA SELECTED
              </span>

              <button
                type="button"
                className="gb3-solid"
                onClick={() => setStage(1)}
              >
                CONTINUE TO PACE
                <ArrowRight size={18} />
              </button>
            </div>
          </section>
        )}

        {/* STEP 2 */}

        {stage === 1 && (
          <section
            className="gb3-step"
            aria-labelledby="gb3-step-title"
          >
            <div className="gb3-step-header">
              <div>
                <span className="gb3-mini">
                  QUESTION / 02 OF 02
                </span>

                <h2 id="gb3-step-title">
                  Make room for{" "}
                  <em>your time.</em>
                </h2>
              </div>

              <p>
                Choose the sample visit
                length that you'd like
                to browse. This is a
                content filter, not a
                clinical recommendation.
              </p>
            </div>

            <div
              className="gb3-pace-grid"
              role="group"
              aria-label="Select a duration preference"
            >
              {PACES.map((option, index) => (
                <button
                  type="button"
                  key={option.id}
                  aria-pressed={
                    pace === option.id
                  }
                  className={
                    pace === option.id
                      ? "is-selected"
                      : ""
                  }
                  onClick={() =>
                    setPace(option.id)
                  }
                >
                  <span>
                    0{index + 1}
                  </span>

                  <Clock3 size={27} />

                  <h3>
                    {option.name}
                  </h3>

                  <p>{option.note}</p>

                  <span className="gb3-pace-circle">
                    {pace === option.id ? (
                      <Check size={20} />
                    ) : (
                      <ArrowUpRight size={20} />
                    )}
                  </span>
                </button>
              ))}
            </div>

            <div className="gb3-step-actions">
              <button
                className="gb3-back"
                type="button"
                onClick={() => setStage(0)}
              >
                <ArrowLeft size={17} />
                BACK
              </button>

              <button
                type="button"
                className="gb3-solid"
                onClick={() => setStage(2)}
              >
                EXPLORE THE EDIT
                <ArrowRight size={18} />
              </button>
            </div>
          </section>
        )}

        {/* STEP 3 */}

        {stage === 2 && (
          <section
            className="gb3-step"
            aria-labelledby="gb3-step-title"
          >
            <div className="gb3-step-header">
              <div>
                <span className="gb3-mini">
                  YOUR EDIT / NOT A DIAGNOSIS
                </span>

                <h2 id="gb3-step-title">
                  Possible{" "}
                  <em>conversations.</em>
                </h2>
              </div>

              <p>
                Matched by the topics and
                time preference you selected—not
                by examination or skin suitability.
              </p>
            </div>

            <div className="gb3-result-toolbar">
              <div>
                <span className="gb3-mini">
                  INTEREST:{" "}
                  {selected.name.toUpperCase()}
                </span>

                <span className="gb3-mini">
                  VISIT:{" "}
                  {selectedPace.name.toUpperCase()}
                </span>
              </div>

              <label>
                <SlidersHorizontal size={16} />
                DISPLAY ORDER

                <select
                  value={order}
                  onChange={(event) =>
                    setOrder(
                      event.target.value
                    )
                  }
                >
                  <option value="match">
                    Editorial relevance
                  </option>

                  <option value="price">
                    Sample fee: low first
                  </option>

                  <option value="duration">
                    Duration: short first
                  </option>
                </select>
              </label>
            </div>

            {matches.length ? (
              <div className="gb3-result-grid">
                {matches.map(
                  ({ service }, index) => (
                    <article
                      className="gb3-result"
                      key={service.id}
                    >
                      <div className="gb3-result-image">
                        <img
                          src={service.image}
                          alt={`Illustrative ${service.name} editorial image`}
                          loading="lazy"
                        />

                        <span>
                          0{index + 1} /{" "}
                          {service.category.toUpperCase()}
                        </span>
                      </div>

                      <div className="gb3-result-copy">
                        <span className="gb3-mini">
                          {
                            GLOW_STORIES[
                              service.id
                            ]?.motif
                          }
                        </span>

                        <h3>
                          {service.name}
                        </h3>

                        <p>
                          {service.subtitle}
                        </p>

                        <div className="gb3-result-facts">
                          <span>
                            <Clock3 size={15} />
                            {service.duration} MIN
                          </span>

                          <span>
                            {formatPeso(
                              service.price
                            )}{" "}
                            * SAMPLE
                          </span>
                        </div>

                        <div className="gb3-result-actions">
                          <Link
                            to={`/treatments/${service.id}`}
                          >
                            READ JOURNAL
                            <ArrowUpRight size={17} />
                          </Link>

                          <Link
                            to={`/calendar?service=${encodeURIComponent(
                              service.id
                            )}`}
                          >
                            DEMO TIMES
                            <ChevronRight size={17} />
                          </Link>
                        </div>
                      </div>
                    </article>
                  )
                )}
              </div>
            ) : (
              <div className="gb3-no-matches">
                <Sparkles size={31} />

                <h3>
                  No entries in this edit.
                </h3>

                <p>
                  This combination has no
                  matching sample services.
                  Try a different duration.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setPace("open");
                    setOrder("match");
                  }}
                >
                  SHOW ALL DURATIONS
                  <ArrowRight size={17} />
                </button>
              </div>
            )}

            <div className="gb3-step-actions">
              <button
                type="button"
                className="gb3-back"
                onClick={() => setStage(1)}
              >
                <ArrowLeft size={17} />
                ADJUST YOUR PACE
              </button>

              <Link
                className="gb3-solid"
                to="/treatments"
              >
                BROWSE THE FULL ATLAS
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </section>
        )}

        {/* SAFETY DISCLOSURE */}

        <div className="gb3-care-notice">
          <ShieldCheck size={22} />

          <div>
            <strong>
              Good information, without pretending
              to know your skin.
            </strong>

            <p>
              Results are prewritten editorial
              groupings of fictional services.
              No photo analysis, health data
              collection, diagnosis, medical
              recommendation, verified
              availability, or real reservation.
            </p>
          </div>
        </div>
      </div>

      {/* CLOSING SECTION */}

      <section className="gb3-crossroads">
        <div className="gb3-wrap">
          <span className="gb3-mini">
            WHERE TO GO NEXT
          </span>

          <h2>
            Every question has{" "}
            <em>a place.</em>
          </h2>

          <div>
            <Link to="/studio">
              MEET THE STUDIO
              <ArrowUpRight size={18} />
            </Link>

            <Link to="/calendar">
              EXPLORE THE CALENDAR
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
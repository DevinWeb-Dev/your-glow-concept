import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  Heart,
  Leaf,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  SERVICES,
  formatPeso,
} from "../data/studioData.js";

import "../styles/experience.css";

const INTERESTS = [
  {
    id: "start",
    icon: Sparkles,
    title: "I'm exploring options",
    description:
      "I would like to learn about services before choosing.",
    matches: [
      "skin-consultation",
      "skin-renewal",
      "hydrating-facial",
    ],
  },
  {
    id: "hydration",
    icon: Leaf,
    title: "Hydration & self-care",
    description:
      "I'm interested in a facial or hydration-focused experience.",
    matches: [
      "hydrating-facial",
      "skin-consultation",
      "brightening-facial",
    ],
  },
  {
    id: "radiance",
    icon: Sparkles,
    title: "Radiance & facial care",
    description:
      "I want to explore different facial service concepts.",
    matches: [
      "brightening-facial",
      "hydrating-facial",
      "skin-renewal",
    ],
  },
  {
    id: "skin-concerns",
    icon: Heart,
    title: "Specific skin concerns",
    description:
      "I'd prefer to understand my options through a consultation.",
    matches: [
      "skin-consultation",
      "acne-care",
      "skin-renewal",
    ],
  },
  {
    id: "laser",
    icon: ShieldCheck,
    title: "Laser treatment information",
    description:
      "I want to know what a professional consultation involves.",
    matches: [
      "laser-consultation",
      "skin-consultation",
      "skin-renewal",
    ],
  },
];

const VISIT_LENGTHS = [
  {
    id: "any",
    label: "Any duration",
  },
  {
    id: "short",
    label: "Up to 45 minutes",
  },
  {
    id: "long",
    label: "Around 60 minutes",
  },
];

export default function TreatmentFinderPage() {
  const [interest, setInterest] = useState("start");
  const [duration, setDuration] = useState("any");

  const selectedInterest = INTERESTS.find(
    (item) => item.id === interest
  );

  const recommendations = useMemo(() => {
    return selectedInterest.matches
      .map((id) =>
        SERVICES.find((service) => service.id === id)
      )
      .filter(Boolean)
      .filter((service) => {
        if (duration === "short") {
          return service.duration <= 45;
        }

        if (duration === "long") {
          return service.duration >= 60;
        }

        return true;
      });
  }, [selectedInterest, duration]);

  function reset() {
    setInterest("start");
    setDuration("any");
  }

  return (
    <div className="yg2-finder-page">
      <section className="yg2-page-hero yg2-finder-hero">
        <div className="yg-container">
          <span className="yg-overline">
            YOUR GLOW / THE TREATMENT FINDER
          </span>

          <h1>
            Your interests.
            <br />
            <em>Your starting point.</em>
          </h1>

          <p>
            Explore a curated collection of sample
            treatments in a way that feels simple,
            personal, and pressure-free.
          </p>
        </div>
      </section>

      <section className="yg2-section yg-container">
        <div className="yg2-finder-heading">
          <div>
            <span className="yg-overline">
              STEP 01 / EXPLORE WHAT INTERESTS YOU
            </span>

            <h2>
              What would you like
              <br />
              to <em>discover?</em>
            </h2>
          </div>

          <button
            type="button"
            className="yg2-reset-button"
            onClick={reset}
          >
            <RotateCcw size={17} />
            Start Over
          </button>
        </div>

        <div
          className="yg2-interests-grid"
          role="group"
          aria-label="Choose a skincare interest"
        >
          {INTERESTS.map((item) => {
            const Icon = item.icon;
            const active = interest === item.id;

            return (
              <button
                key={item.id}
                type="button"
                className={`yg2-interest-card ${
                  active ? "is-active" : ""
                }`}
                aria-pressed={active}
                onClick={() => setInterest(item.id)}
              >
                <span className="yg2-interest-icon">
                  <Icon
                    size={25}
                    strokeWidth={1.4}
                  />
                </span>

                <strong>{item.title}</strong>
                <p>{item.description}</p>

                <span className="yg2-interest-check">
                  {active ? (
                    <Check size={17} />
                  ) : (
                    <ArrowUpRight size={17} />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="yg2-preference-section">
          <div>
            <span className="yg-overline">
              STEP 02 / YOUR PREFERRED VISIT LENGTH
            </span>

            <h2>
              Take the time <em>you prefer.</em>
            </h2>
          </div>

          <div
            className="yg2-duration-options"
            role="group"
            aria-label="Preferred appointment duration"
          >
            {VISIT_LENGTHS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={duration === item.id}
                className={
                  duration === item.id
                    ? "is-active"
                    : ""
                }
                onClick={() => setDuration(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <section
          className="yg2-recommendations"
          aria-live="polite"
        >
          <div className="yg2-finder-results-title">
            <div>
              <span className="yg-overline">
                THE CURATED EDIT
              </span>

              <h2>
                Services to <em>explore.</em>
              </h2>

              <p>
                Matching your interests:{" "}
                <strong>{selectedInterest.title}</strong>
              </p>
            </div>

            <span>
              {recommendations.length} sample{" "}
              {recommendations.length === 1
                ? "service"
                : "services"}
            </span>
          </div>

          {recommendations.length === 0 ? (
            <div className="yg2-no-matches">
              <Sparkles size={30} />

              <h3>
                Let's broaden <em>the possibilities.</em>
              </h3>

              <p>
                No sample service matches both selections.
                Try another duration to see more options.
              </p>

              <button
                type="button"
                className="yg-button"
                onClick={() => setDuration("any")}
              >
                Show All Durations
                <ArrowRight size={17} />
              </button>
            </div>
          ) : (
            <div className="yg2-recommendation-grid">
              {recommendations.map((service, index) => (
                <article
                  className="yg2-recommendation-card"
                  key={service.id}
                >
                  <div className="yg2-recommendation-photo">
                    <img
                      src={service.image}
                      alt={`Illustrative imagery for ${service.name}`}
                      loading="lazy"
                    />

                    <span>
                      EXPLORE {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="yg2-recommendation-body">
                    <span className="yg-overline">
                      {service.category}
                    </span>

                    <h3>{service.name}</h3>

                    <p>{service.subtitle}</p>

                    <div className="yg2-recommendation-meta">
                      <span>
                        <Clock3 size={16} />
                        {service.duration} min
                      </span>

                      <strong>
                        From {formatPeso(service.price)}
                      </strong>
                    </div>

                    <div className="yg2-recommendation-actions">
                      <Link
                        to={`/treatments/${service.id}`}
                        className="yg-text-link"
                      >
                        Learn More
                        <ArrowRight size={17} />
                      </Link>

                      <Link
                        to={`/calendar?service=${service.id}`}
                        className="yg2-card-cta"
                      >
                        View Calendar
                        <ArrowUpRight size={16} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="yg2-finder-disclaimer">
          <ShieldCheck size={25} />

          <div>
            <strong>
              A discovery guide, not a clinical assessment.
            </strong>

            <p>
              These services are matched using simple
              content categories and appointment durations.
              The finder does not examine your skin, provide
              a diagnosis, assess procedure risks, or
              determine treatment suitability. Speak
              with a qualified professional for
              individualized care.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
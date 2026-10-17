import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clipboard,
  Clock3,
  Info,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  BRAND,
  IMAGES,
  SERVICES,
  formatPeso,
} from "../data/studioData.js";

import {
  storyFor,
} from "../data/glowTreatmentStories.js";

import "../styles/glow-treatment-atlas.css";

const SEGMENTS = [
  "BEFORE",
  "DURING",
  "AFTER",
];

/* =================================
   ABSTRACT SKIN GEOMETRY
================================= */

function DetailGlyph({ mood }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
      className={`gl7-detail-glyph gl7-glyph-${mood}`}
    >
      <circle
        cx="200"
        cy="200"
        r="177"
        stroke="currentColor"
        strokeOpacity=".54"
      />

      <circle
        cx="200"
        cy="200"
        r="142"
        stroke="currentColor"
        strokeDasharray="3 11"
        strokeOpacity=".6"
      />

      <path
        d="M200 29C267 76 335 128 335 210a135 135 0 0 1-270 0C65 128 133 76 200 29Z"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M86 242c78-53 150-53 228 0"
        stroke="currentColor"
        strokeOpacity=".68"
      />

      <circle
        cx="200"
        cy="201"
        r="23"
        fill="currentColor"
        fillOpacity=".16"
        stroke="currentColor"
      />

      <path
        d="M200 2v51m0 294v51M2 200h50m296 0h50"
        stroke="currentColor"
        strokeOpacity=".55"
      />
    </svg>
  );
}

/* =================================
   DYNAMIC TREATMENT JOURNAL
================================= */

function GlowTreatmentJournalContent({
  serviceId,
}) {
  const [stage, setStage] =
    useState(0);

  const [copyMessage, setCopyMessage] =
    useState("");

  const service = SERVICES.find(
    (item) => item.id === serviceId
  );

  const story = storyFor(serviceId);

  useEffect(() => {
    if (!service) return;

    document.title =
      `${service.name} | YOUR GLOW.`;

    return () => {
      document.title = "YOUR GLOW.";
    };
  }, [service]);

  if (!service || !story) {
    return (
      <div className="gl7 gl7-notfound gl7-wrap">
        <span className="gl7-eyebrow">
          THE CARE EDIT / 404
        </span>

        <h1>
          This chapter{" "}
          <em>isn't here.</em>
        </h1>

        <p>
          That treatment isn't part of
          our six-service studio concept.
        </p>

        <Link to="/treatments">
          <ArrowLeft size={18} />
          RETURN TO THE ATLAS
        </Link>
      </div>
    );
  }

  const currentStep =
    story.pathways[stage];

  const related = [
    ...SERVICES.filter(
      (item) =>
        item.id !== service.id &&
        item.category === service.category
    ),

    ...SERVICES.filter(
      (item) =>
        item.id !== service.id &&
        item.category !== service.category
    ),
  ].slice(0, 3);

  const consultationUrl =
    `/consultation?service=${encodeURIComponent(
      service.id
    )}`;

  const calendarUrl =
    `/calendar?service=${encodeURIComponent(
      service.id
    )}`;

  async function copyQuestions() {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error(
          "Clipboard unavailable"
        );
      }

      await navigator.clipboard.writeText(
        story.questions
          .map(
            (question, index) =>
              `${index + 1}. ${question}`
          )
          .join("\n")
      );

      setCopyMessage(
        "Your conversation prompts are copied."
      );
    } catch {
      setCopyMessage(
        "Clipboard unavailable. You can select and copy the questions above."
      );
    }
  }

  return (
    <div
      className={`gl7 gl7-journal gl7-mood-${story.mood}`}
    >
      {/* BREADCRUMB */}

      <div className="gl7-journal-breadcrumb gl7-wrap">
        <Link to="/treatments">
          <ArrowLeft size={17} />
          THE CARE ATLAS
        </Link>

        <span>
          FIELD STUDY {service.number} / 06
        </span>
      </div>

      {/* UNIQUE SERVICE HERO */}

      <section className="gl7-journal-hero">
        <div className="gl7-journal-hero-copy">
          <div className="gl7-journal-meta">
            <span>
              YOUR GLOW / SKIN CULTURE
            </span>

            <span>
              {story.motif}
            </span>
          </div>

          <span className="gl7-eyebrow">
            <Sparkles size={15} />
            {service.eyebrow}
          </span>

          <h1>
            {story.display}{" "}
            <em>{story.accent}</em>
          </h1>

          <p className="gl7-journal-opening">
            {story.opening}
          </p>

          <div className="gl7-journal-hero-actions">
            <Link
              to={calendarUrl}
              className="gl7-primary-pill"
            >
              EXPLORE DEMO TIMES

              <span>
                <ArrowUpRight size={19} />
              </span>
            </Link>

            <a
              href="#gl7-pathway"
              className="gl7-text-link"
            >
              THE CARE JOURNEY
              <ArrowRight size={17} />
            </a>
          </div>

          <div className="gl7-journal-hero-foot">
            <span>NO DIAGNOSIS</span>
            <span>NO GUARANTEED RESULTS</span>
            <span>CONCEPT ONLY</span>
          </div>
        </div>

        <div className="gl7-journal-hero-media">
          <div className="gl7-journal-image">
            <img
              src={service.image}
              alt={`Illustrative editorial visual for ${service.name}`}
            />
          </div>

          <DetailGlyph mood={story.mood} />

          <span className="gl7-journal-hero-no">
            {service.number}

            <small> / 06</small>
          </span>

          <span className="gl7-journal-media-note">
            LIGHT / MATERIAL / SKIN
          </span>
        </div>
      </section>

      {/* TREATMENT FACTS */}

      <div className="gl7-journal-strip gl7-wrap">
        <span>
          <Clock3 size={18} />
          {service.duration} MINUTES / SAMPLE
        </span>

        <span>
          {formatPeso(service.price)} /
          ILLUSTRATIVE FROM
        </span>

        <span>
          {service.category.toUpperCase()}
        </span>
      </div>

      {/* EDITORIAL CONTENT */}

      <div className="gl7-journal-body gl7-wrap">
        <main className="gl7-journal-main">
          <section className="gl7-intro-chapter">
            <span className="gl7-eyebrow">
              01 / READ THE ROOM
            </span>

            <h2>
              Know the <em>context.</em>
            </h2>

            <p>
              {service.description}
            </p>

            <p>
              {story.note}
            </p>

            <div className="gl7-intentions">
              {story.intentions.map(
                (item) => (
                  <span key={item}>
                    <Check size={15} />
                    {item}
                  </span>
                )
              )}
            </div>
          </section>

          {/* INTERACTIVE CARE PATHWAY */}

          <section
            className="gl7-pathway"
            id="gl7-pathway"
          >
            <span className="gl7-eyebrow">
              02 / AN ILLUSTRATIVE CARE PATH
            </span>

            <h2>
              Three thoughtful{" "}
              <em>moments.</em>
            </h2>

            <p className="gl7-lead">
              An interactive educational
              journal, not instructions
              to perform a skin procedure.
            </p>

            <div
              className="gl7-path-tabs"
              role="tablist"
              aria-label="Read care pathway moments"
            >
              {SEGMENTS.map(
                (segment, index) => (
                  <button
                    key={segment}
                    role="tab"
                    type="button"
                    aria-selected={
                      stage === index
                    }
                    aria-controls="gl7-path-content"
                    id={`gl7-path-tab-${index}`}
                    className={
                      stage === index
                        ? "is-current"
                        : ""
                    }
                    onClick={() =>
                      setStage(index)
                    }
                  >
                    <span>
                      0{index + 1}
                    </span>

                    {segment}
                  </button>
                )
              )}
            </div>

            <article
              className="gl7-path-panel"
              id="gl7-path-content"
              role="tabpanel"
              aria-labelledby={`gl7-path-tab-${stage}`}
            >
              <span>
                0{stage + 1} /{" "}
                {currentStep.tag}
              </span>

              <div>
                <h3>
                  {currentStep.title}
                  <i>.</i>
                </h3>

                <p>
                  {currentStep.copy}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setStage(
                    (value) =>
                      (value + 1) % 3
                  )
                }
              >
                NEXT MOMENT
                <ArrowRight size={17} />
              </button>
            </article>
          </section>

          {/* QUESTION JOURNAL */}

          <section className="gl7-questions">
            <span className="gl7-eyebrow">
              03 / TAKE THE RIGHT QUESTIONS
            </span>

            <h2>
              Curiosity is{" "}
              <em>good care.</em>
            </h2>

            <p className="gl7-lead">
              Bring these prompts to a
              qualified practitioner.
              Don't upload or enter your
              medical history in this
              demonstration.
            </p>

            <div className="gl7-question-list">
              {story.questions.map(
                (question, index) => (
                  <div key={question}>
                    <span>
                      0{index + 1}
                    </span>

                    <p>{question}</p>

                    <ArrowUpRight size={17} />
                  </div>
                )
              )}
            </div>

            <button
              type="button"
              className="gl7-copy"
              onClick={copyQuestions}
            >
              <Clipboard size={18} />
              COPY THE QUESTIONS
            </button>

            {copyMessage && (
              <p
                className="gl7-copy-status"
                role="status"
              >
                {copyMessage}
              </p>
            )}
          </section>

          {/* TREATMENT FAQs */}

          <section className="gl7-journal-faq">
            <span className="gl7-eyebrow">
              04 / THINGS TO KNOW
            </span>

            <h2>
              Before the{" "}
              <em>next step.</em>
            </h2>

            <div className="gl7-faq-list">
              {story.faqs.map(
                (
                  [question, answer],
                  index
                ) => (
                  <details key={question}>
                    <summary>
                      <span>
                        0{index + 1}
                      </span>

                      <strong>
                        {question}
                      </strong>

                      <span
                        className="gl7-faq-plus"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </summary>

                    <p>
                      {answer}
                    </p>
                  </details>
                )
              )}
            </div>
          </section>
        </main>

        {/* CONSULTATION HANDOFF */}

        <aside
          className="gl7-consultation-rail"
          aria-label="Demo consultation preview"
        >
          <div className="gl7-rail-visual">
            <img
              src={IMAGES.ritual}
              alt="Illustrative self-care environment"
              loading="lazy"
            />

            <span>
              YOUR NEXT CONVERSATION / 001
            </span>
          </div>

          <div className="gl7-rail-inner">
            <span className="gl7-eyebrow">
              THE STUDIO FOLIO
            </span>

            <h2>
              Keep it <em>personal.</em>
            </h2>

            <p>
              A sample consultation handoff
              for the service you're reading
              about. No availability
              is verified.
            </p>

            <div className="gl7-rail-service">
              <span>SELECTED TOPIC</span>
              <strong>
                {service.name}
              </strong>
            </div>

            <div className="gl7-rail-service">
              <span>
                SAMPLE DURATION
              </span>
              <strong>
                {service.duration} minutes
              </strong>
            </div>

            <div className="gl7-rail-service">
              <span>
                ILLUSTRATIVE FEE
              </span>

              <strong>
                {formatPeso(
                  service.price
                )}
              </strong>
            </div>

            <Link
              to={calendarUrl}
              className="gl7-primary-pill"
            >
              OPEN DEMO CALENDAR

              <span>
                <CalendarDays size={19} />
              </span>
            </Link>

            <Link
              className="gl7-rail-secondary"
              to={consultationUrl}
            >
              CONSULTATION PREVIEW
              <ArrowUpRight size={15} />
            </Link>

            <div className="gl7-rail-notice">
              <ShieldCheck size={17} />

              <p>
                Browser-only sample
                requests. No real appointment,
                clinician, medical records
                or payment.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* RELATED TREATMENTS */}

      <section className="gl7-related">
        <div className="gl7-wrap">
          <div className="gl7-related-heading">
            <div>
              <span className="gl7-eyebrow">
                05 / KEEP EXPLORING
              </span>

              <h2>
                Another way{" "}
                <em>to begin.</em>
              </h2>
            </div>

            <Link to="/treatments">
              VIEW ALL SIX
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="gl7-related-grid">
            {related.map(
              (item) => {
                const otherStory =
                  storyFor(item.id);

                return (
                  <Link
                    key={item.id}
                    className={`gl7-related-card gl7-mood-${otherStory.mood}`}
                    to={`/treatments/${item.id}`}
                  >
                    <div>
                      <img
                        src={item.image}
                        alt=""
                        loading="lazy"
                      />

                      <span>
                        {item.number} /
                        CARE JOURNAL
                      </span>
                    </div>

                    <small>
                      {item.category.toUpperCase()}
                    </small>

                    <strong>
                      {item.name}
                    </strong>

                    <ArrowUpRight
                      size={20}
                    />
                  </Link>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* FINAL DISCLOSURE */}

      <div className="gl7-journal-end gl7-wrap">
        <span>
          <Info size={16} />

          The treatment descriptions are
          for a fictional portfolio concept—
          not medical advice, clinical
          claims or verified provider
          offerings.
        </span>

        <span>
          {BRAND.developer}
        </span>

        <Link to="/treatments">
          BACK TO ATLAS
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}

/*
  Reset interactive tab state when
  navigating to another treatment.
*/

export default function GlowTreatmentJournal() {
  const { serviceId } = useParams();

  return (
    <GlowTreatmentJournalContent
      key={serviceId}
      serviceId={serviceId}
    />
  );
}
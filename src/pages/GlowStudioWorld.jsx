import { useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ShieldCheck,
  Sparkles,
  Waves,
  Flower2,
  Orbit,
} from "lucide-react";

import {
  APPROACH,
  BRAND,
  IMAGES,
} from "../data/studioData.js";

import "../styles/glow-batch3-architecture.css";

const PERSPECTIVES = [
  {
    no: "01",
    title: "To listen.",
    subtitle: "THE FIRST MATERIAL IS ATTENTION",
    description:
      "Care conversations should make room for uncertainty, personal goals and clear, realistic explanations—not rush someone toward a procedure.",
    tone: "mint",
    image: IMAGES.skincare,
  },
  {
    no: "02",
    title: "To explain.",
    subtitle: "BETTER INFORMATION IS BEAUTIFUL",
    description:
      "A considered clinic can communicate who provides a service, what it involves, potential limits, and why individualized assessment matters.",
    tone: "citron",
    image: IMAGES.products,
  },
  {
    no: "03",
    title: "To respect.",
    subtitle: "YOUR PACE IS PART OF THE PLAN",
    description:
      "There should always be space to ask more questions, understand risks and alternatives, and decide whether to proceed with professional advice.",
    tone: "lilac",
    image: IMAGES.ritual,
  },
];

const MATERIALS = [
  {
    hex: "#123D36",
    name: "FOREST",
    meaning: "a sense of grounding",
  },
  {
    hex: "#DCF57A",
    name: "CITRON",
    meaning: "permission to be bold",
  },
  {
    hex: "#D3EEE1",
    name: "DEW",
    meaning: "space for softness",
  },
  {
    hex: "#C5B8F1",
    name: "LILAC",
    meaning: "room for individuality",
  },
];

export default function GlowStudioWorld() {
  const [active, setActive] = useState(0);
  const item = PERSPECTIVES[active];

  return (
    <div className="gb3 gb3-studio">
      {/* SCULPTURAL HERO */}

      <section className="gb3-studio-hero">
        <div className="gb3-studio-hero-copy">
          <span className="gb3-mini">
            <span className="gb3-dot" />
            THE IMAGINED STUDIO / VOL. 03
          </span>

          <h1>
            GOOD CARE
            <br />
            BEGINS <em>within.</em>
          </h1>

          <p>
            A visual world built from living
            color, considered textures,
            generous questions and a simpler
            idea of what beauty can feel like.
          </p>

          <a
            className="gb3-underlined"
            href="#gb3-world-manifesto"
          >
            DISCOVER OUR POINT OF VIEW
            <ArrowDownRight size={18} />
          </a>

          <small>
            FICTIONAL STUDIO · EDITORIAL CONCEPT ONLY
          </small>
        </div>

        <div className="gb3-studio-hero-images">
          <div className="gb3-studio-hero-main">
            <img
              src={IMAGES.hero}
              alt="Illustrative facial care photography"
            />
          </div>

          <div className="gb3-studio-hero-small">
            <img
              src={IMAGES.products}
              alt="Illustrative skincare product styling"
            />
          </div>

          <span className="gb3-studio-stamp">
            AN OPEN STUDIO
            <Sparkles size={24} />
          </span>
        </div>
      </section>

      {/* MANIFESTO */}

      <section
        className="gb3-studio-manifesto gb3-wrap"
        id="gb3-world-manifesto"
      >
        <div
          className="gb3-manifesto-mark"
          aria-hidden="true"
        >
          <Waves
            size={90}
            strokeWidth={0.8}
          />

          <span>
            THE LIVING SKIN MANIFESTO
          </span>
        </div>

        <div>
          <span className="gb3-mini">
            01 / OUR WAY OF THINKING
          </span>

          <h2>
            Beauty should never be{" "}
            <em>a single instruction.</em>
          </h2>

          <p>
            YOUR GLOW is a fictional
            aesthetics studio concept
            that prioritizes understandable
            service information, generous
            breathing room and thoughtful
            digital experiences. Nothing
            here replaces real clinical
            judgment, qualified providers
            or consent.
          </p>

          <Link
            className="gb3-underlined"
            to="/treatments"
          >
            THE CARE EDIT
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>

      {/* INTERACTIVE PHILOSOPHY */}

      <section className="gb3-studio-principles">
        <div className="gb3-wrap">
          <header>
            <span className="gb3-mini">
              02 / THREE WAYS OF SEEING
            </span>

            <h2>
              Less performance.
              <br />
              <em>More perspective.</em>
            </h2>
          </header>

          <div className="gb3-principle-layout">
            <div
              className="gb3-principle-nav"
              role="tablist"
              aria-label="Studio principles"
            >
              {PERSPECTIVES.map((entry, index) => (
                <button
                  role="tab"
                  aria-selected={active === index}
                  aria-controls="gb3-principle-panel"
                  id={`gb3-principle-tab-${index}`}
                  key={entry.no}
                  type="button"
                  className={
                    active === index
                      ? "is-selected"
                      : ""
                  }
                  onClick={() =>
                    setActive(index)
                  }
                >
                  <span>
                    {entry.no}
                  </span>

                  <strong>
                    {entry.title}
                  </strong>

                  <ArrowUpRight size={20} />
                </button>
              ))}
            </div>

            <article
              role="tabpanel"
              id="gb3-principle-panel"
              aria-labelledby={`gb3-principle-tab-${active}`}
              className={`gb3-principle-card gb3-tone-${item.tone}`}
              key={item.no}
            >
              <img
                src={item.image}
                alt={`Illustrative studio visual for ${item.title}`}
                loading="lazy"
              />

              <div>
                <span className="gb3-mini">
                  {item.subtitle}
                </span>

                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.description}
                </p>

                <span className="gb3-principle-counter">
                  {item.no} / 03
                </span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ARCHITECTURAL MATERIAL PALETTE */}

      <section className="gb3-studio-materials">
        <div className="gb3-wrap">
          <div className="gb3-materials-head">
            <div>
              <span className="gb3-mini">
                03 / OUR VISUAL MATERIALS
              </span>

              <h2>
                A language of{" "}
                <em>feeling.</em>
              </h2>
            </div>

            <p>
              The colors, typography and
              textures of YOUR GLOW are
              artistic choices for this
              prototype. They are not
              clinical claims.
            </p>
          </div>

          <div className="gb3-swatches">
            {MATERIALS.map((color) => (
              <article
                key={color.name}
                style={{
                  "--swatch": color.hex,
                }}
              >
                <div className="gb3-swatch-color">
                  <Flower2
                    size={38}
                    strokeWidth={1}
                  />
                </div>

                <div>
                  <strong>
                    {color.name}
                  </strong>

                  <span>
                    {color.meaning}
                  </span>

                  <small>
                    {color.hex}
                  </small>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SPLIT-SCREEN STUDIO STORY */}

      <section className="gb3-studio-space">
        <div className="gb3-space-photo">
          <img
            src={IMAGES.ritual}
            alt="Illustrative skincare objects and studio atmosphere"
            loading="lazy"
          />

          <span>
            AN ATELIER OF QUESTIONS /
            NOT A REAL LOCATION
          </span>
        </div>

        <div className="gb3-space-copy">
          <span className="gb3-mini">
            04 / A THOUGHTFUL EXPERIENCE
          </span>

          <h2>
            What if care
            <br />
            felt like <em>clarity?</em>
          </h2>

          <div className="gb3-space-icon">
            <Orbit
              size={55}
              strokeWidth={1}
            />
          </div>

          {APPROACH.map((entry) => (
            <div
              className="gb3-space-row"
              key={entry.number}
            >
              <span>
                {entry.number}
              </span>

              <div>
                <strong>
                  {entry.title}
                </strong>

                <p>
                  {entry.description}
                </p>
              </div>

              <Check size={19} />
            </div>
          ))}

          <Link
            className="gb3-round-cta"
            to="/finder"
          >
            FIND A STARTING POINT

            <span>
              <ArrowUpRight size={19} />
            </span>
          </Link>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}

      <section className="gb3-studio-end">
        <div className="gb3-wrap">
          <span className="gb3-mini">
            05 / THE OPEN INVITATION
          </span>

          <h2>
            Come as <em>you are.</em>
          </h2>

          <p>
            Explore a fictional studio
            journal or a sample calendar—
            without promises, pressure
            or the need to share medical
            information.
          </p>

          <div>
            <Link to="/gallery">
              THE VISUAL JOURNAL
              <ArrowUpRight size={18} />
            </Link>

            <Link to="/calendar">
              DEMO CONSULTATION CALENDAR
              <ArrowUpRight size={18} />
            </Link>
          </div>

          <small>
            <ShieldCheck size={15} />
            {BRAND.developer} · NO REAL
            CLINIC OR PATIENT IMAGERY
          </small>
        </div>
      </section>
    </div>
  );
}
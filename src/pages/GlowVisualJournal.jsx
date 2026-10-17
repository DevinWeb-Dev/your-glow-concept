import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  createPortal,
} from "react-dom";

import {
  Link,
} from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  BRAND,
  IMAGES,
} from "../data/studioData.js";

import "../styles/glow-batch3-architecture.css";

const PHOTOS = [
  {
    id: "01",
    image: IMAGES.hero,
    title: "In your element",
    category: "ATMOSPHERE",
    note:
      "An abstract study in comfort, skin and calm.",
  },
  {
    id: "02",
    image: IMAGES.products,
    title: "Objects of intention",
    category: "OBJECTS",
    note:
      "A simple arrangement of imagined studio essentials.",
  },
  {
    id: "03",
    image: IMAGES.ritual,
    title: "Slower rituals",
    category: "RITUALS",
    note:
      "A moment for questions, routine and perspective.",
  },
  {
    id: "04",
    image: IMAGES.skincare,
    title: "The soft study",
    category: "ATMOSPHERE",
    note:
      "Color, detail and mood in a fictional care space.",
  },
  {
    id: "05",
    image: IMAGES.detail,
    title: "Material language",
    category: "OBJECTS",
    note:
      "Shapes and surfaces inspired by everyday skin care.",
  },
  {
    id: "06",
    image: IMAGES.facial,
    title: "A considered moment",
    category: "RITUALS",
    note:
      "Editorial photography, not a procedure demonstration.",
  },
  {
    id: "07",
    image: IMAGES.products,
    title: "Everyday light",
    category: "OBJECTS",
    note:
      "A second visual perspective on skincare materials.",
  },
  {
    id: "08",
    image: IMAGES.ritual,
    title: "Personal rhythms",
    category: "RITUALS",
    note:
      "An imagined pause in the self-care journey.",
  },
];

const FILTERS = [
  "ALL",
  "ATMOSPHERE",
  "OBJECTS",
  "RITUALS",
];

function Lightbox({
  items,
  index,
  onClose,
  onSelect,
}) {
  const closeRef = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKey(event) {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowRight") {
        onSelect(
          (index + 1) % items.length
        );
      }

      if (event.key === "ArrowLeft") {
        onSelect(
          (index + items.length - 1) %
            items.length
        );
      }

      if (event.key === "Tab") {
        const modal = closeRef.current?.closest(
          "[role=dialog]"
        );

        const controls = [
          ...(
            modal?.querySelectorAll(
              "button:not(:disabled)"
            ) || []
          ),
        ];

        const first = controls[0];
        const last =
          controls[controls.length - 1];

        if (
          event.shiftKey &&
          document.activeElement === first
        ) {
          event.preventDefault();
          last?.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {
          event.preventDefault();
          first?.focus();
        }
      }
    }

    window.addEventListener(
      "keydown",
      onKey
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        onKey
      );

      previous?.focus?.();
    };
  }, [index, items, onClose, onSelect]);

  const current = items[index];

  if (!current) return null;

  return createPortal(
    <div
      className="gb3-lightbox"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="gb3-lightbox-title"
        className="gb3-lightbox-window"
      >
        <header>
          <span>
            YOUR GLOW. / VISUAL JOURNAL /{" "}
            {current.id}
          </span>

          <button
            type="button"
            ref={closeRef}
            onClick={onClose}
            aria-label="Close image viewer"
          >
            <X size={22} />
          </button>
        </header>

        <div className="gb3-lightbox-image">
          <img
            src={current.image}
            alt={`Editorial visual: ${current.title}`}
          />
        </div>

        <footer>
          <div>
            <span>
              {current.category}
            </span>

            <h2 id="gb3-lightbox-title">
              {current.title}
            </h2>

            <p>
              {current.note}
            </p>
          </div>

          <div className="gb3-lightbox-controls">
            <button
              type="button"
              onClick={() =>
                onSelect(
                  (index + items.length - 1) %
                    items.length
                )
              }
              aria-label="Previous image"
            >
              <ChevronLeft size={22} />
            </button>

            <span>
              {index + 1} / {items.length}
            </span>

            <button
              type="button"
              onClick={() =>
                onSelect(
                  (index + 1) % items.length
                )
              }
              aria-label="Next image"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </footer>
      </section>
    </div>,
    document.body
  );
}

export default function GlowVisualJournal() {
  const [filter, setFilter] = useState("ALL");
  const [openIndex, setOpenIndex] =
    useState(null);

  const shown = PHOTOS.filter(
    (item) =>
      filter === "ALL" ||
      item.category === filter
  );

  return (
    <div className="gb3 gb3-gallery">
      {/* GALLERY HERO */}

      <section className="gb3-gallery-hero">
        <div className="gb3-gallery-hero-copy">
          <span className="gb3-mini">
            <span className="gb3-dot" />
            THE LIVING VISUAL JOURNAL / VOL. 03
          </span>

          <h1>
            THINGS WE <em>notice.</em>
          </h1>

          <p>
            A collection of shapes,
            surfaces, gestures and imagined
            care moments. Not treatment
            outcomes. Not real patient
            photographs.
          </p>

          <a
            className="gb3-underlined"
            href="#gb3-gallery-index"
          >
            OPEN THE JOURNAL
            <ArrowRight size={18} />
          </a>

          <small>
            08 EDITORIAL STUDIES /
            NO BEFORE-AND-AFTER IMAGES
          </small>
        </div>

        <div className="gb3-gallery-hero-composition">
          <img
            src={IMAGES.products}
            alt="Illustrative skincare still-life"
          />

          <span className="gb3-gallery-hero-seal">
            VISUAL
            <br />
            STUDIES
            <br />
            001—008
          </span>
        </div>
      </section>

      {/* PHOTO INDEX */}

      <section
        id="gb3-gallery-index"
        className="gb3-wrap gb3-gallery-section"
      >
        <div className="gb3-gallery-section-head">
          <div>
            <span className="gb3-mini">
              01 / SELECT A PERSPECTIVE
            </span>

            <h2>
              THE IMAGE <em>INDEX.</em>
            </h2>
          </div>

          <p>
            Filter the curated visual
            studies. Select any image for
            a larger view, then browse
            with the arrow keys or
            on-screen controls.
          </p>
        </div>

        <div
          className="gb3-gallery-filters"
          role="group"
          aria-label="Filter editorial images"
        >
          {FILTERS.map((item) => (
            <button
              type="button"
              key={item}
              aria-pressed={filter === item}
              className={
                filter === item
                  ? "is-current"
                  : ""
              }
              onClick={() => {
                setFilter(item);
                setOpenIndex(null);
              }}
            >
              {item}

              <span>
                {item === "ALL"
                  ? PHOTOS.length
                  : PHOTOS.filter(
                      (photo) =>
                        photo.category === item
                    ).length}
              </span>
            </button>
          ))}
        </div>

        <div className="gb3-gallery-count">
          <span>
            {String(shown.length).padStart(2, "0")}
            {" / "}
            {String(PHOTOS.length).padStart(2, "0")}
            {" "}
            STUDIES
          </span>

          <span>
            CLICK TO VIEW LARGE
            <Maximize2 size={15} />
          </span>
        </div>

        {/* IMAGE COLLECTION */}

        <div className="gb3-masonry">
          {shown.map((item, index) => (
            <figure
              className={`gb3-photo gb3-photo--${
                (index % 4) + 1
              }`}
              key={item.id}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenIndex(index)
                }
                aria-label={`Open image ${item.id}: ${item.title}`}
              >
                <img
                  src={item.image}
                  alt={`Editorial ${item.title}`}
                  loading="lazy"
                />

                <span className="gb3-photo-index">
                  FIG. {item.id}
                </span>

                <span className="gb3-photo-zoom">
                  <Maximize2 size={19} />
                </span>
              </button>

              <figcaption>
                <span>
                  {item.category} / {item.id}
                </span>

                <strong>
                  {item.title}
                </strong>

                <p>
                  {item.note}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="gb3-gallery-disclaimer">
          <ShieldCheck size={23} />

          <div>
            <strong>
              Editorial visual references only.
            </strong>

            <p>
              Imagery illustrates a proposed
              studio aesthetic. No real
              patients, before-and-after
              results, verified clinic
              interiors or clinical outcomes
              are represented. Any real
              patient photography would
              require appropriate consent
              and accurate context.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}

      <section className="gb3-gallery-end">
        <div className="gb3-wrap">
          <span className="gb3-mini">
            02 / BEYOND THE FRAME
          </span>

          <h2>
            A LITTLE MORE <em>context.</em>
          </h2>

          <div>
            <Link to="/studio">
              THE STUDIO PHILOSOPHY
              <ArrowUpRight size={17} />
            </Link>

            <Link to="/treatments">
              EXPLORE THE CARE EDIT
              <ArrowUpRight size={17} />
            </Link>
          </div>

          <small>
            {BRAND.developer}
          </small>
        </div>
      </section>

      {/* LIGHTBOX */}

      {openIndex !== null &&
        shown.length > 0 && (
          <Lightbox
            items={shown}
            index={openIndex}
            onClose={() =>
              setOpenIndex(null)
            }
            onSelect={setOpenIndex}
          />
        )}
    </div>
  );
}
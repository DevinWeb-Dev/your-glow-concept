import { useEffect, useMemo, useState } from "react";

import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Heart,
  Leaf,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import {
  BRAND,
  IMAGES,
  SERVICES,
  CATEGORIES,
  APPROACH,
  FAQS,
  TIME_SLOTS,
  dateAfter,
  formatDate,
  formatPeso,
  formatTime,
  localDateKey,
} from "./data/studioData.js";

// BATCH 2 — ADVANCED EXPERIENCES
import ConsultationCalendarPage from "./pages/ConsultationCalendarPage.jsx";

import TreatmentFinderPage from "./pages/TreatmentFinderPage.jsx";

// BATCH 3 — STUDIO OPERATIONS
import StudioLayout from "./components/StudioLayout.jsx";

import StudioDashboardPage from "./pages/staff/StudioDashboardPage.jsx";

import ConsultationDeskPage from "./pages/staff/ConsultationDeskPage.jsx";

import StudioSchedulePage from "./pages/staff/StudioSchedulePage.jsx";

import ServiceCatalogPage from "./pages/staff/ServiceCatalogPage.jsx";

// BATCH 4 — STUDIO INTELLIGENCE
import StudioReportsPage from "./pages/staff/StudioReportsPage.jsx";

import ServiceInsightsPage from "./pages/staff/ServiceInsightsPage.jsx";

import StudioSettingsPage from "./pages/staff/StudioSettingsPage.jsx";

import StudioDataCenterPage from "./pages/staff/StudioDataCenterPage.jsx";

// BATCH 5 — PREMIUM PUBLIC EXPERIENCE
import SitePolish from "./components/SitePolish.jsx";

import "./styles/site.css";

const STORAGE_KEY = "your-glow-demo-consultations-v1";

const NAVIGATION = [
  { label: "Home", path: "/" },
  { label: "Treatments", path: "/treatments" },
  { label: "Treatment Finder", path: "/finder" },
  { label: "The Studio", path: "/studio" },
  { label: "Gallery", path: "/gallery" },
  { label: "Calendar", path: "/calendar" },
];

function firstAvailableDate() {
  const date = new Date(`${dateAfter(1)}T12:00:00`);

  if (date.getDay() === 0) {
    date.setDate(date.getDate() + 1);
  }

  return localDateKey(date);
}

function loadBookings() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    if (!Array.isArray(saved)) return [];

    return saved.filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.date === "string" &&
        typeof item.time === "string" &&
        ["requested", "cancelled"].includes(item.status)
    );
  } catch {
    return [];
  }
}

function PageScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    const titles = {
  "/": "Home",
  "/treatments": "Treatments",
  "/finder": "Treatment Finder",
  "/studio": "Our Studio",
  "/gallery": "Editorial Gallery",
  "/calendar": "Consultation Calendar",
  "/consultation": "Consultation",
  "/staff": "Studio Overview",
"/staff/consultations": "Consultation Desk",
"/staff/schedule": "Weekly Schedule",
"/staff/services": "Service Catalog",
"/staff/reports": "Reports & Analytics",
"/staff/insights": "Service Insights",
"/staff/settings": "Studio Settings",
"/staff/data": "Data & Backups",
};
    const current = pathname.startsWith("/treatments/")
      ? "Treatment Details"
      : titles[pathname] || "Page";

    document.title = `${current} | YOUR GLOW.`;
  }, [pathname]);

  return null;
}

function Logo() {
  return (
    <span className="yg-logo">
      <span className="yg-logo-icon">
        <Sparkles size={21} strokeWidth={1.4} />
      </span>

      <span>
        YOUR GLOW<span className="yg-logo-dot">.</span>
      </span>
    </span>
  );
}

function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);

    return () =>
      window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <div className="yg-announcement">
        <span>
          AN EDITORIAL SKIN & AESTHETICS EXPERIENCE
        </span>

        <Link to="/consultation">
          Explore consultation
          <ArrowUpRight size={13} />
        </Link>
      </div>

      <header className="yg-header">
        <div className="yg-container yg-header-inner">
          <Link to="/" aria-label="YOUR GLOW homepage">
            <Logo />
          </Link>

          <nav
            id="yg-main-navigation"
            aria-label="Main navigation"
            className={`yg-nav ${open ? "is-open" : ""}`}
          >
            {NAVIGATION.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  isActive ? "is-active" : ""
                }
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}

            <Link
              to="/consultation"
              className="yg-nav-mobile-cta"
              onClick={() => setOpen(false)}
            >
              Consultation
              <ArrowUpRight size={17} />
            </Link>
          </nav>

          <div className="yg-header-actions">
            <Link
              className="yg-header-book"
              to="/consultation"
            >
              Book a Consultation
              <ArrowUpRight size={16} />
            </Link>

            <button
              type="button"
              className="yg-menu-button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-controls="yg-main-navigation"
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

function Footer() {
  return (
    <footer className="yg-footer">
      <div className="yg-container">
        <div className="yg-footer-grid">
          <div className="yg-footer-feature">
            <span className="yg-overline yg-overline-light">
              AN INVITATION TO SELF-CARE
            </span>

            <h2>
              Take time
              <br />
              for <em>yourself.</em>
            </h2>

            <p>
              A premium aesthetic clinic website concept,
              thoughtfully designed for modern skin studios.
            </p>

            <Link
              to="/consultation"
              className="yg-button yg-button-cream"
            >
              Explore Consultation
              <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="yg-footer-column">
            <strong>EXPLORE</strong>

            <Link to="/">Homepage</Link>
            <Link to="/treatments">Treatments</Link>
            <Link to="/calendar">Consultation Calendar</Link>
            <Link to="/studio">The Studio</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/consultation">Consultation</Link>
            <Link to="/staff">Studio Demo Dashboard</Link>
          </div>

          <div className="yg-footer-column">
            <strong>ABOUT THIS CONCEPT</strong>

            <p>
              Philippines-inspired skin and aesthetic
              studio portfolio demonstration.
            </p>

            <p>
              No real consultations, treatments,
              payments, or patient records.
            </p>
          </div>
        </div>

        <div className="yg-footer-bottom">
          <span>
            © {new Date().getFullYear()} YOUR GLOW.
          </span>

          <span>{BRAND.developer}</span>
        </div>
      </div>
    </footer>
  );
}

function SectionTitle({
  overline,
  first,
  second,
  description,
  centered = false,
}) {
  return (
    <div
      className={`yg-section-heading ${
        centered ? "is-centered" : ""
      }`}
    >
      <div>
        <span className="yg-overline">{overline}</span>

        <h2>
          {first}
          <br />
          <em>{second}</em>
        </h2>
      </div>

      {description && <p>{description}</p>}
    </div>
  );
}

function ServiceCard({ service }) {
  return (
    <article className="yg-service-card">
      <Link
        to={`/treatments/${service.id}`}
        className="yg-service-photo"
        aria-label={`Explore ${service.name}`}
      >
        <img
          src={service.image}
          alt={`Illustrative imagery for ${service.name}`}
          loading="lazy"
        />

        <span className="yg-service-number">
          {service.number} / 06
        </span>

        <span className="yg-service-arrow">
          <ArrowUpRight size={21} />
        </span>
      </Link>

      <div className="yg-service-body">
        <span className="yg-overline">
          {service.category}
        </span>

        <h3>{service.name}</h3>

        <p>{service.subtitle}</p>

        <div className="yg-service-meta">
          <span>
            <Clock3 size={15} />
            {service.duration} min
          </span>

          <strong>
            From {formatPeso(service.price)}*
          </strong>
        </div>

        <div className="yg-service-actions">
          <Link
            to={`/treatments/${service.id}`}
            className="yg-text-link"
          >
            Discover treatment
            <ArrowRight size={17} />
          </Link>

          <Link
            to={`/consultation?service=${service.id}`}
            className="yg-card-book"
          >
            Book <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function HomePage() {
  const featured = SERVICES.filter(
    (service) => service.featured
  );

  return (
    <>
      <section className="yg-hero">
        <div className="yg-container yg-hero-layout">
          <div className="yg-hero-copy">
            <span className="yg-overline">
              THE ART OF FEELING GOOD IN YOUR SKIN
            </span>

            <h1>
              Your skin.
              <br />
              Your story.
              <br />
              <em>Your glow.</em>
            </h1>

            <p>
              A considered approach to skin and self-care,
              where modern aesthetics meets a gentler,
              more personal experience.
            </p>

            <div className="yg-hero-actions">
              <Link
                to="/consultation"
                className="yg-button"
              >
                Explore Consultation
                <ArrowUpRight size={18} />
              </Link>

              <Link
                to="/treatments"
                className="yg-text-link"
              >
                The treatment edit
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="yg-hero-signature">
              <Leaf size={19} strokeWidth={1.3} />

              <span>
                BEAUTY, WITH INTENTION.
                <br />
                CARE, WITHOUT THE PRESSURE.
              </span>
            </div>
          </div>

          <div className="yg-hero-visual">
            <div className="yg-hero-arch">
              <img
                src={IMAGES.hero}
                alt="Illustrative facial and skin-care setting"
                fetchPriority="high"
              />
            </div>

            <div className="yg-hero-small-photo">
              <img
                src={IMAGES.products}
                alt="Skincare product editorial"
              />
            </div>

            <div className="yg-hero-stamp">
              <Sparkles size={22} strokeWidth={1.4} />
              <span>
                GLOW
                <br />
                BEGINS
                <br />
                WITH CARE
              </span>
            </div>

            <span className="yg-hero-caption">
              YOUR GLOW / THE SKIN EDIT
            </span>
          </div>
        </div>
      </section>

      <section className="yg-intro-strip">
        <div className="yg-container yg-intro-inner">
          <span>01 — PERSONALIZED CARE</span>
          <span>02 — THOUGHTFUL RITUALS</span>
          <span>03 — BEAUTY ON YOUR TERMS</span>
        </div>
      </section>

      <section className="yg-section yg-container">
        <SectionTitle
          overline="CURATED SKIN EXPERIENCES"
          first="The treatment"
          second="collection."
          description="Explore an illustrative menu of services and consultation pathways, presented with clarity and thoughtful detail."
        />

        <div className="yg-service-grid">
          {featured.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
            />
          ))}
        </div>

        <div className="yg-center-action">
          <Link
            to="/treatments"
            className="yg-button yg-button-outline"
          >
            Explore All Services
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>

      <section className="yg-philosophy">
        <div className="yg-philosophy-photo">
          <img
            src={IMAGES.skincare}
            alt="Illustrative skin-care products"
            loading="lazy"
          />

          <div className="yg-philosophy-photo-label">
            <Sparkles size={17} />
            THE ART OF CARE
          </div>
        </div>

        <div className="yg-philosophy-copy">
          <span className="yg-overline">
            OUR APPROACH
          </span>

          <h2>
            Beautiful skin care
            <br />
            begins with
            <br />
            <em>being heard.</em>
          </h2>

          <p>
            We imagined YOUR GLOW as a space where
            every treatment starts with understanding.
            No exaggerated promises. Just a thoughtful
            experience built around clear information
            and personal choice.
          </p>

          <div className="yg-philosophy-list">
            <span>
              <Check size={17} />
              Consultation-led exploration
            </span>

            <span>
              <Check size={17} />
              Transparent sample service information
            </span>

            <span>
              <Check size={17} />
              Comfort and informed decisions
            </span>
          </div>

          <Link
            to="/studio"
            className="yg-text-link"
          >
            Discover the studio
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="yg-section yg-container">
        <SectionTitle
          overline="A MORE THOUGHTFUL JOURNEY"
          first="Care is in"
          second="the details."
          description="Three simple principles behind the studio experience."
        />

        <div className="yg-approach-grid">
          {APPROACH.map((item) => (
            <article
              key={item.number}
              className="yg-approach-card"
            >
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="yg-editorial">
        <div className="yg-container yg-editorial-grid">
          <div className="yg-editorial-copy">
            <span className="yg-overline yg-overline-light">
              BEAUTY, IN YOUR OWN TIME
            </span>

            <h2>
              Less pressure.
              <br />
              More <em>presence.</em>
            </h2>

            <p>
              Self-care shouldn't feel like a race.
              Discover an atmosphere that values
              comfort, individual needs, and
              realistic expectations.
            </p>

            <Link
              to="/gallery"
              className="yg-button yg-button-cream"
            >
              Explore the Gallery
              <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="yg-editorial-photo">
            <img
              src={IMAGES.ritual}
              alt="Skincare editorial still life"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="yg-section yg-container">
        <SectionTitle
          overline="FREQUENTLY ASKED QUESTIONS"
          first="A little more"
          second="clarity."
        />

        <div className="yg-faq-list">
          {FAQS.map((item, index) => (
            <details key={item.question}>
              <summary>
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <strong>{item.question}</strong>

                <span className="yg-faq-plus">+</span>
              </summary>

              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

function TreatmentsPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return SERVICES.filter((service) => {
      const categoryMatch =
        category === "All" ||
        service.category === category;

      const searchMatch =
        !query ||
        [
          service.name,
          service.category,
          service.subtitle,
          service.description,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return categoryMatch && searchMatch;
    });
  }, [category, search]);

  return (
    <div className="yg-page">
      <section className="yg-page-hero">
        <div className="yg-container yg-page-hero-grid">
          <div>
            <span className="yg-overline">
              YOUR GLOW / THE TREATMENT EDIT
            </span>

            <h1>
              Thoughtful care.
              <br />
              <em>Beautifully considered.</em>
            </h1>

            <p>
              Discover aesthetic treatments and
              consultation pathways through a
              curated, easy-to-explore service catalog.
            </p>
          </div>

          <img
            src={IMAGES.products}
            alt="Editorial arrangement of skincare products"
          />
        </div>
      </section>

      <section className="yg-section yg-container">
        <div className="yg-treatments-toolbar">
          <div>
            <span className="yg-overline">
              THE COLLECTION
            </span>

            <h2>
              Find your <em>ritual.</em>
            </h2>
          </div>

          <label className="yg-search-box">
            <Search size={18} />

            <input
              type="search"
              aria-label="Search treatments"
              placeholder="Search treatments..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </label>
        </div>

        <div
          className="yg-filter-tabs"
          role="group"
          aria-label="Treatment categories"
        >
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              className={
                category === item ? "is-active" : ""
              }
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="yg-service-grid">
          {filtered.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="yg-empty">
            <Search size={30} />

            <h3>No treatments found.</h3>

            <p>Try a different category or keyword.</p>

            <button
              type="button"
              className="yg-button"
              onClick={() => {
                setCategory("All");
                setSearch("");
              }}
            >
              Clear filters
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        <p className="yg-fineprint">
          *All fees and treatment descriptions are
          illustrative only. Actual service suitability
          and pricing depend on professional assessment.
        </p>
      </section>
    </div>
  );
}

function TreatmentDetailsPage() {
  const { serviceId } = useParams();

  const service = SERVICES.find(
    (item) => item.id === serviceId
  );

  if (!service) {
    return <NotFoundPage />;
  }

  const related = SERVICES.filter(
    (item) => item.id !== service.id
  ).slice(0, 3);

  return (
    <div className="yg-page">
      <section className="yg-details-hero">
        <div className="yg-container">
          <div className="yg-breadcrumbs">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/treatments">Treatments</Link>
            <span>/</span>
            <strong>{service.name}</strong>
          </div>

          <div className="yg-details-grid">
            <div className="yg-details-copy">
              <span className="yg-overline">
                {service.eyebrow}
              </span>

              <h1>{service.name}<em>.</em></h1>

              <p>{service.description}</p>

              <div className="yg-details-facts">
                <div>
                  <Clock3 size={21} />

                  <span>
                    <small>Sample duration</small>
                    <strong>
                      {service.duration} minutes
                    </strong>
                  </span>
                </div>

                <div>
                  <Sparkles size={21} />

                  <span>
                    <small>Illustrative fee from</small>
                    <strong>
                      {formatPeso(service.price)}
                    </strong>
                  </span>
                </div>
              </div>

              <Link
                className="yg-button"
                to={`/consultation?service=${service.id}`}
              >
                Explore Consultation
                <ArrowUpRight size={18} />
              </Link>
            </div>

            <div className="yg-details-visual">
              <img
                src={service.image}
                alt={`Editorial imagery representing ${service.name}`}
              />

              <span>
                CURATED CARE / {service.number}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="yg-section yg-container">
        <div className="yg-details-content">
          <div>
            <span className="yg-overline">
              UNDERSTANDING YOUR OPTIONS
            </span>

            <h2>
              A considered
              <br />
              <em>experience.</em>
            </h2>

            <p>{service.description}</p>

            <p>
              A qualified professional should assess
              whether a particular product or procedure
              is suitable, explain potential risks, and
              discuss the expected course of care.
            </p>
          </div>

          <aside className="yg-detail-inclusions">
            <span className="yg-overline">
              THE SERVICE OVERVIEW
            </span>

            <h3>What to <em>explore.</em></h3>

            {service.highlights.map((item) => (
              <div key={item}>
                <Check size={17} />
                <span>{item}</span>
              </div>
            ))}

            <div className="yg-detail-note">
              <ShieldCheck size={21} />

              <p>
                This is an illustrative treatment
                description, not individualized advice
                or a promise of results.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="yg-section yg-container yg-related-section">
        <SectionTitle
          overline="DISCOVER MORE"
          first="Explore another"
          second="experience."
        />

        <div className="yg-service-grid">
          {related.map((item) => (
            <ServiceCard
              key={item.id}
              service={item}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function StudioPage() {
  return (
    <div className="yg-page">
      <section className="yg-page-hero yg-story-hero">
        <div className="yg-container yg-page-hero-grid">
          <div>
            <span className="yg-overline">
              THE STUDIO / OUR PHILOSOPHY
            </span>

            <h1>
              An approach
              <br />
              rooted in <em>care.</em>
            </h1>

            <p>
              Thoughtfully designed spaces,
              considered skin-care rituals,
              and conversations built around
              personal choice.
            </p>
          </div>

          <img
            src={IMAGES.skincare}
            alt="Illustrative skincare studio imagery"
          />
        </div>
      </section>

      <section className="yg-section yg-container">
        <div className="yg-story-statement">
          <span className="yg-overline">
            WHAT WE BELIEVE
          </span>

          <h2>
            Beauty isn't about
            <br />
            becoming someone else.
            <br />
            It's about <em>feeling like you.</em>
          </h2>

          <p>
            YOUR GLOW is a fictional aesthetic studio
            designed to demonstrate how a thoughtful
            digital experience can help visitors
            understand services before making a decision.
          </p>
        </div>
      </section>

      <section className="yg-philosophy">
        <div className="yg-philosophy-photo">
          <img
            src={IMAGES.ritual}
            alt="Editorial imagery of skincare products"
            loading="lazy"
          />
        </div>

        <div className="yg-philosophy-copy">
          <span className="yg-overline">
            A CALMER KIND OF EXPERIENCE
          </span>

          <h2>
            Every detail.
            <br />
            Every moment.
            <br />
            <em>With intention.</em>
          </h2>

          <p>
            From reading about a treatment to
            exploring appointment times, the
            entire journey is designed to feel
            clear, comfortable, and unhurried.
          </p>

          <Link
            className="yg-text-link"
            to="/consultation"
          >
            Explore the consultation preview
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="yg-section yg-container">
        <SectionTitle
          overline="OUR THREE PRINCIPLES"
          first="Simple ideas."
          second="Thoughtful care."
        />

        <div className="yg-approach-grid">
          {APPROACH.map((item) => (
            <article
              className="yg-approach-card"
              key={item.number}
            >
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function GalleryPage() {
  const gallery = [
    {
      image: IMAGES.hero,
      name: "The Skin Ritual",
      category: "ATMOSPHERE",
    },
    {
      image: IMAGES.products,
      name: "Thoughtful Formulations",
      category: "THE COLLECTION",
    },
    {
      image: IMAGES.skincare,
      name: "A Slower Moment",
      category: "SELF-CARE",
    },
    {
      image: IMAGES.ritual,
      name: "Everyday Essentials",
      category: "EDITORIAL",
    },
    {
      image: IMAGES.detail,
      name: "The Treatment Edit",
      category: "THE STUDIO",
    },
  ];

  return (
    <div className="yg-page">
      <section className="yg-page-hero yg-gallery-hero">
        <div className="yg-container">
          <span className="yg-overline">
            THE VISUAL JOURNAL
          </span>

          <h1>
            An atmosphere
            <br />
            of <em>intention.</em>
          </h1>

          <p>
            A curated collection of visual
            references for the YOUR GLOW concept.
          </p>
        </div>
      </section>

      <section className="yg-section yg-container">
        <div className="yg-gallery-grid">
          {gallery.map((item, index) => (
            <figure
              key={`${item.name}-${index}`}
              className={`yg-gallery-item yg-gallery-item-${index + 1}`}
            >
              <img
                src={item.image}
                alt={`Editorial skincare concept: ${item.name}`}
                loading="lazy"
              />

              <figcaption>
                <span>{item.category}</span>
                <strong>{item.name}</strong>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="yg-gallery-disclaimer">
          <ShieldCheck size={24} />

          <p>
            <strong>Editorial gallery only.</strong>{" "}
            These photographs illustrate the
            proposed visual atmosphere. They
            are not patient photographs or
            before-and-after treatment results.
            A real results gallery would require
            permission, accurate context, and
            appropriate privacy safeguards.
          </p>
        </div>
      </section>
    </div>
  );
}

function ConsultationPage({
  bookings,
  onCreateBooking,
  onCancelBooking,
}) {
  const [params] = useSearchParams();
  const incomingService = params.get("service");

  const [form, setForm] = useState(() => ({
    alias: "",
    serviceId: SERVICES.some(
      (item) => item.id === incomingService
    )
      ? incomingService
      : SERVICES[0].id,
    date: firstAvailableDate(),
    time: "",
  }));

  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    if (
      incomingService &&
      SERVICES.some(
        (item) => item.id === incomingService
      )
    ) {
      setForm((previous) => ({
        ...previous,
        serviceId: incomingService,
      }));
    }
  }, [incomingService]);

  const service = SERVICES.find(
    (item) => item.id === form.serviceId
  );

  const dateObject = new Date(
    `${form.date}T12:00:00`
  );

  const isSunday =
    !Number.isNaN(dateObject.getTime()) &&
    dateObject.getDay() === 0;

  const occupiedSlots = bookings
    .filter(
      (item) =>
        item.date === form.date &&
        item.status === "requested"
    )
    .map((item) => item.time);

  const isSlotTaken = occupiedSlots.includes(
    form.time
  );

  function change(key, value) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));

    setError("");
    setConfirmation(null);
  }

  function submit(event) {
    event.preventDefault();

    const result = onCreateBooking(form);

    if (!result.ok) {
      setError(result.error);
      setConfirmation(null);
      return;
    }

    setConfirmation(result);
    setError("");

    setForm((previous) => ({
      ...previous,
      alias: "",
      time: "",
    }));
  }

  return (
    <div className="yg-page">
      <section className="yg-page-hero yg-consultation-hero">
        <div className="yg-container">
          <span className="yg-overline">
            YOUR GLOW / CONSULTATION PREVIEW
          </span>

          <h1>
            Your moment
            <br />
            <em>begins here.</em>
          </h1>

          <p>
            Preview an elegant and simple
            consultation scheduling experience.
            No real appointments are created.
          </p>
        </div>
      </section>

      <section className="yg-section yg-container">
        <div className="yg-booking-grid">
          <form
            className="yg-booking-form"
            onSubmit={submit}
          >
            <span className="yg-overline">
              01 / YOUR PREFERENCES
            </span>

            <h2>
              Plan your <em>visit.</em>
            </h2>

            <label className="yg-field">
              <span>YOUR TREATMENT INTEREST</span>

              <select
                value={form.serviceId}
                onChange={(event) =>
                  change("serviceId", event.target.value)
                }
              >
                {SERVICES.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="yg-field">
              <span>DEMO NAME OR ALIAS</span>

              <input
                type="text"
                required
                minLength={2}
                maxLength={50}
                placeholder="e.g. Sample Visitor"
                value={form.alias}
                onChange={(event) =>
                  change("alias", event.target.value)
                }
              />
            </label>

            <label className="yg-field">
              <span>PREFERRED DATE</span>

              <input
                type="date"
                required
                min={dateAfter(1)}
                max={dateAfter(90)}
                value={form.date}
                onChange={(event) => {
                  change("date", event.target.value);

                  setForm((previous) => ({
                    ...previous,
                    date: event.target.value,
                    time: "",
                  }));
                }}
              />
            </label>

            {isSunday ? (
              <div className="yg-form-notice" role="status">
                Sundays are closed in this sample
                schedule. Please select another date.
              </div>
            ) : (
              <>
                <span className="yg-field-heading">
                  AVAILABLE DEMO TIME SLOTS
                </span>

                <div
                  className="yg-time-grid"
                  role="group"
                  aria-label="Select consultation time"
                >
                  {TIME_SLOTS.map((time) => {
                    const taken = occupiedSlots.includes(time);

                    return (
                      <button
                        type="button"
                        key={time}
                        disabled={taken}
                        aria-pressed={form.time === time}
                        className={
                          form.time === time
                            ? "is-selected"
                            : ""
                        }
                        onClick={() =>
                          change("time", time)
                        }
                      >
                        {formatTime(time)}

                        {taken && <small>Taken</small>}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {error && (
              <div className="yg-form-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="yg-button yg-submit"
              disabled={
                isSunday ||
                !form.time ||
                isSlotTaken
              }
            >
              Save Demo Consultation Request
              <ArrowUpRight size={18} />
            </button>

            <p className="yg-fineprint">
              Use a fictional alias only. Do not
              enter your medical history, actual
              contact details, or personal health
              information.
            </p>
          </form>

          <aside className="yg-booking-summary">
            <div className="yg-booking-summary-photo">
              <img
                src={IMAGES.products}
                alt="Editorial skincare still life"
                loading="lazy"
              />
            </div>

            <div className="yg-booking-summary-body">
              <span className="yg-overline">
                YOUR CONSULTATION PREVIEW
              </span>

              <h3>
                Make space
                <br />
                for <em>yourself.</em>
              </h3>

              <div className="yg-summary-line">
                <span>
                  <Sparkles size={17} />
                  Service interest
                </span>

                <strong>{service?.name}</strong>
              </div>

              <div className="yg-summary-line">
                <span>
                  <CalendarDays size={17} />
                  Preferred date
                </span>

                <strong>{formatDate(form.date)}</strong>
              </div>

              <div className="yg-summary-line">
                <span>
                  <Clock3 size={17} />
                  Preferred time
                </span>

                <strong>
                  {form.time
                    ? formatTime(form.time)
                    : "Please select"}
                </strong>
              </div>

              <div className="yg-summary-total">
                <span>Illustrative fee from</span>

                <strong>
                  {formatPeso(service?.price)}
                </strong>
              </div>

              <div className="yg-summary-disclaimer">
                <ShieldCheck size={18} />

                <span>
                  Browser-local portfolio prototype;
                  no real studio receives this request.
                </span>
              </div>
            </div>
          </aside>
        </div>

        {confirmation && (
          <div
            className="yg-confirmation"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 size={32} />

            <span className="yg-overline">
              REQUEST SAVED LOCALLY
            </span>

            <h2>
              A little moment
              <em> reserved in your demo.</em>
            </h2>

            <p>
              Reference: <strong>{confirmation.id}</strong>
            </p>

            <p>
              This is not an actual confirmed appointment.
            </p>
          </div>
        )}

        <section className="yg-booking-history">
          <SectionTitle
            overline="BROWSER-LOCAL HISTORY"
            first="Your saved"
            second="demo requests."
            description="These requests are stored on this device only and can be cancelled below."
          />

          {bookings.length === 0 ? (
            <div className="yg-empty">
              <CalendarDays size={33} />

              <h3>No sample requests yet.</h3>

              <p>
                Select a treatment, date, and time
                to create your first demo request.
              </p>
            </div>
          ) : (
            <div className="yg-history-grid">
              {[...bookings].reverse().map((booking) => {
                const bookedService = SERVICES.find(
                  (item) =>
                    item.id === booking.serviceId
                );

                return (
                  <article
                    className="yg-history-card"
                    key={booking.id}
                  >
                    <div className="yg-history-top">
                      <span>{booking.id}</span>

                      <span
                        className={`yg-history-status ${
                          booking.status === "cancelled"
                            ? "is-cancelled"
                            : ""
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <h3>
                      {bookedService?.name ||
                        "Consultation"}
                    </h3>

                    <p>
                      {formatDate(booking.date)}
                      {" · "}
                      {formatTime(booking.time)}
                    </p>

                    <p>Demo alias: {booking.alias}</p>

                    {booking.status === "requested" && (
                      <button
                        type="button"
                        onClick={() =>
                          onCancelBooking(booking.id)
                        }
                      >
                        Cancel demo request
                        <X size={16} />
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </div>
  );
}

function NotFoundPage() {
  return (
    <section className="yg-container yg-not-found">
      <span className="yg-overline">
        PAGE NOT FOUND
      </span>

      <h1>
        Find your way
        <br />
        <em>back to glow.</em>
      </h1>

      <Link to="/" className="yg-button">
        <ArrowLeft size={17} />
        Return Home
      </Link>
    </section>
  );
}

export default function App() {
  const location = useLocation();

  const isStaffRoute =
    location.pathname === "/staff" ||
    location.pathname.startsWith("/staff/");

  const [bookings, setBookings] = useState(
    loadBookings
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(bookings)
      );
    } catch (error) {
      console.warn(
        "Demo consultation storage unavailable:",
        error
      );
    }
  }, [bookings]);

  function createBooking(input) {
    const alias =
      typeof input.alias === "string"
        ? input.alias.trim()
        : "";

    if (alias.length < 2 || alias.length > 50) {
      return {
        ok: false,
        error:
          "Enter a fictional alias between 2 and 50 characters.",
      };
    }

    if (
      !SERVICES.some(
        (item) => item.id === input.serviceId
      )
    ) {
      return {
        ok: false,
        error: "Please select a valid service.",
      };
    }

    const date = new Date(
      `${input.date}T12:00:00`
    );

    const validDate =
      typeof input.date === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(input.date) &&
      !Number.isNaN(date.getTime()) &&
      localDateKey(date) === input.date &&
      input.date >= dateAfter(1) &&
      input.date <= dateAfter(90) &&
      date.getDay() !== 0;

    if (!validDate) {
      return {
        ok: false,
        error:
          "Select an available Monday–Saturday date within 90 days.",
      };
    }

    if (!TIME_SLOTS.includes(input.time)) {
      return {
        ok: false,
        error: "Please select a valid demo time.",
      };
    }

    // Single shared consultation resource for this demo.
    const occupied = bookings.some(
      (item) =>
        item.date === input.date &&
        item.time === input.time &&
        item.status === "requested"
    );

    if (occupied) {
      return {
        ok: false,
        error:
          "That sample time slot is already occupied. Choose another.",
      };
    }

    const id =
      "YGL-" +
      Date.now().toString(36).toUpperCase() +
      "-" +
      Math.random()
        .toString(36)
        .slice(2, 6)
        .toUpperCase();

    setBookings((previous) => [
      ...previous,
      {
        id,
        alias,
        serviceId: input.serviceId,
        date: input.date,
        time: input.time,
        status: "requested",
        createdAt: new Date().toISOString(),
      },
    ]);

    return { ok: true, id };
  }

  function cancelBooking(id) {
    const matching = bookings.find(
      (item) => item.id === id
    );

    if (
      !matching ||
      matching.status !== "requested"
    ) {
      return;
    }

    if (
      !window.confirm(
        "Cancel this browser-local demo consultation request?"
      )
    ) {
      return;
    }

    setBookings((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, status: "cancelled" }
          : item
      )
    );
  }

  return (
    <div className="yg-app">
      <PageScroll />
      {!isStaffRoute && <Header />}

      <div id="main-content">
        <Routes>
          <Route
            index
            element={<HomePage />}
          />

          <Route
            path="treatments"
            element={<TreatmentsPage />}
          />

          <Route
            path="treatments/:serviceId"
            element={<TreatmentDetailsPage />}
          />

          <Route
            path="studio"
            element={<StudioPage />}
          />

          <Route
            path="gallery"
            element={<GalleryPage />}
          />

          <Route
            path="consultation"
            element={
              <ConsultationPage
                bookings={bookings}
                onCreateBooking={createBooking}
                onCancelBooking={cancelBooking}
              />
            }
          />

          {/* BATCH 2 — INTERACTIVE TREATMENT FINDER */}

<Route
  path="finder"
  element={<TreatmentFinderPage />}
/>

{/* BATCH 2 — ADVANCED CONSULTATION CALENDAR */}

<Route
  path="calendar"
  element={
    <ConsultationCalendarPage
      bookings={bookings}
      onCreateBooking={createBooking}
    />
  }
/>

{/* BATCH 3 — YOUR GLOW STUDIO OPERATIONS */}

<Route
  path="staff"
  element={
    <StudioLayout
      bookings={bookings}
      onCancelBooking={cancelBooking}
      onReplaceBookings={setBookings}
    />
  }
>
  <Route
    index
    element={<StudioDashboardPage />}
  />

  <Route
    path="consultations"
    element={<ConsultationDeskPage />}
  />

  <Route
    path="schedule"
    element={<StudioSchedulePage />}
  />

  <Route
    path="services"
    element={<ServiceCatalogPage />}
  />
</Route>

{/* BATCH 4 — STUDIO INTELLIGENCE */}

<Route
  path="reports"
  element={<StudioReportsPage />}
/>

<Route
  path="insights"
  element={<ServiceInsightsPage />}
/>

<Route
  path="settings"
  element={<StudioSettingsPage />}
/>

<Route
  path="data"
  element={<StudioDataCenterPage />}
/>

          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </div>

      {!isStaffRoute && <Footer />}
      {!isStaffRoute && <SitePolish />}
    </div>
  );
}
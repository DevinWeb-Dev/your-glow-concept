import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Pencil,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  CATEGORIES,
  SERVICES,
  formatPeso,
} from "../../data/studioData.js";

import {
  SERVICE_DRAFTS_KEY,
} from "../../utils/studioOps.js";

import "../../styles/glow-batch5-operations.css";

function readDrafts() {
  try {
    const value = JSON.parse(
      localStorage.getItem(
        SERVICE_DRAFTS_KEY
      ) || "{}"
    );

    return value &&
      typeof value === "object" &&
      !Array.isArray(value)
      ? value
      : {};
  } catch {
    return {};
  }
}

function withDraft(service, drafts) {
  const draft =
    drafts[service.id] || {};

  return {
    ...service,

    price:
      typeof draft.price === "number" &&
      Number.isFinite(draft.price) &&
      draft.price >= 0
        ? draft.price
        : service.price,

    subtitle:
      typeof draft.subtitle === "string"
        ? draft.subtitle
        : service.subtitle,

    visible:
      typeof draft.visible === "boolean"
        ? draft.visible
        : true,

    edited:
      Object.keys(draft).length > 0,
  };
}

export default function ServiceCatalogPage() {
  const [drafts, setDrafts] = useState(
    readDrafts
  );

  const [query, setQuery] = useState("");
  const [category, setCategory] =
    useState("All");

  const [visibility, setVisibility] =
    useState("all");

  const [editing, setEditing] =
    useState(null);

  const [form, setForm] = useState({
    price: "",
    subtitle: "",
    visible: true,
  });

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  /* SAVE TO THE ORIGINAL DRAFT KEY */

  useEffect(() => {
    try {
      localStorage.setItem(
        SERVICE_DRAFTS_KEY,
        JSON.stringify(drafts)
      );
    } catch (err) {
      console.warn(
        "Unable to store service drafts",
        err
      );
    }
  }, [drafts]);

  const all = useMemo(
    () =>
      SERVICES.map((s) =>
        withDraft(s, drafts)
      ),
    [drafts]
  );

  const shown = useMemo(
    () =>
      all.filter(
        (s) =>
          (category === "All" ||
            s.category === category) &&
          (visibility === "all" ||
            (visibility === "visible"
              ? s.visible
              : !s.visible)) &&
          [
            s.name,
            s.category,
            s.subtitle,
          ]
            .join(" ")
            .toLowerCase()
            .includes(
              query.trim().toLowerCase()
            )
      ),
    [all, category, visibility, query]
  );

  const editedCount = all.filter(
    (s) => s.edited
  ).length;

  const hiddenCount = all.filter(
    (s) => !s.visible
  ).length;

  function edit(service) {
    setEditing(service.id);

    setForm({
      price: String(service.price),
      subtitle: service.subtitle,
      visible: service.visible,
    });

    setNotice("");
    setError("");
  }

  function save(event) {
    event.preventDefault();

    const price =
      Number(form.price);

    const subtitle =
      form.subtitle.trim();

    if (
      !form.price.trim() ||
      !Number.isFinite(price) ||
      price < 0 ||
      price > 1000000
    ) {
      setError(
        "Enter an illustrative fee between ₱0 and ₱1,000,000."
      );
      return;
    }

    if (
      subtitle.length < 5 ||
      subtitle.length > 180
    ) {
      setError(
        "Write a sample subtitle between 5 and 180 characters."
      );
      return;
    }

    setDrafts((old) => ({
      ...old,

      [editing]: {
        price,
        subtitle,
        visible: form.visible,
      },
    }));

    setEditing(null);
    setError("");

    setNotice(
      "Staff-only draft saved in this browser. Public treatment data is unchanged."
    );
  }

  function restore(id) {
    if (
      !window.confirm(
        "Restore the original sample service information for this local draft?"
      )
    ) {
      return;
    }

    setDrafts((old) => {
      const next = {
        ...old,
      };

      delete next[id];
      return next;
    });

    setEditing(null);
    setError("");

    setNotice(
      "Local service draft restored to its original values."
    );
  }

  function restoreAll() {
    if (
      !window.confirm(
        "Clear ALL staff-only catalog drafts from this browser?"
      )
    ) {
      return;
    }

    setDrafts({});
    setEditing(null);
    setError("");

    setNotice(
      "All catalog drafts restored. Original service data remains intact."
    );
  }

  return (
    <div className="g5-ops g5-catalog">
      {/* HERO */}

      <section className="g5-ops-hero g5-ops-hero--catalog">
        <div className="g5-ops-hero-copy">
          <span className="g5-kicker">
            OPERATIONS / 03 — THE SERVICE ATELIER
          </span>

          <h1>
            A CARE <em>collection.</em>
          </h1>

          <p>
            Compose sample pricing,
            descriptions and planned visibility
            in a local staff draft workspace.
            The public treatment atlas stays
            untouched.
          </p>

          <Link
            to="/treatments"
            className="g5-hero-link"
          >
            VIEW PUBLIC CARE ATLAS
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div
          className="g5-catalog-hero-art"
          aria-hidden="true"
        >
          <span className="g5-catalog-sphere" />

          <strong>06</strong>

          <small>
            STUDIES IN THE COLLECTION
          </small>
        </div>
      </section>

      {/* CATALOG METRICS */}

      <div className="g5-metrics g5-metrics--three">
        <article>
          <span>ORIGINAL SERVICES</span>
          <strong>
            {SERVICES.length}
          </strong>

          <small>
            Central studioData.js records
          </small>
        </article>

        <article className="is-lime">
          <span>LOCAL DRAFTS</span>

          <strong>
            {editedCount}
          </strong>

          <small>
            Saved only in this browser
          </small>
        </article>

        <article>
          <span>PLANNED HIDDEN</span>

          <strong>
            {hiddenCount}
          </strong>

          <small>
            Not applied to public website
          </small>
        </article>
      </div>

      <section className="g5-panel">
        <header className="g5-panel-heading">
          <div>
            <span className="g5-kicker">
              THE TREATMENT FOLIOS
            </span>

            <h2>
              Edit with <em>intention.</em>
            </h2>
          </div>

          <button
            className="g5-button g5-button--outline"
            onClick={restoreAll}
            disabled={!editedCount}
            type="button"
          >
            <RotateCcw size={16} />
            RESET ALL DRAFTS
          </button>
        </header>

        {/* FILTER CONTROLS */}

        <div className="g5-filters g5-catalog-filters">
          <label className="g5-filter g5-filter--search">
            <span>FIND A SERVICE</span>

            <div>
              <Search size={17} />

              <input
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                type="search"
                placeholder="Name or description…"
              />
            </div>
          </label>

          <label className="g5-filter">
            <span>CATEGORY</span>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >
              {CATEGORIES.map((c) => (
                <option key={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="g5-filter">
            <span>PLANNED VISIBILITY</span>

            <select
              value={visibility}
              onChange={(e) =>
                setVisibility(e.target.value)
              }
            >
              <option value="all">
                All drafts
              </option>

              <option value="visible">
                Planned visible
              </option>

              <option value="hidden">
                Planned hidden
              </option>
            </select>
          </label>
        </div>

        {notice && (
          <p
            className="g5-notice"
            role="status"
          >
            <CheckCircle2 size={17} />
            {notice}
          </p>
        )}

        {/* SERVICE FOLIOS */}

        <div className="g5-catalog-grid">
          {shown.map((service) => (
            <article
              key={service.id}
              className={`g5-service-folio ${
                editing === service.id
                  ? "is-editing"
                  : ""
              }`}
            >
              <div className="g5-folio-image">
                <img
                  src={service.image}
                  alt={`Illustrative imagery for ${service.name}`}
                  loading="lazy"
                />

                <span>
                  {service.number}
                  {" / "}
                  {service.category.toUpperCase()}
                </span>
              </div>

              <div className="g5-folio-content">
                <div className="g5-folio-tags">
                  <span
                    className={
                      service.visible
                        ? "is-visible"
                        : "is-hidden"
                    }
                  >
                    {service.visible ? (
                      <Eye size={13} />
                    ) : (
                      <EyeOff size={13} />
                    )}

                    {service.visible
                      ? "PLANNED VISIBLE"
                      : "PLANNED HIDDEN"}
                  </span>

                  {service.edited && (
                    <span className="is-draft">
                      DRAFT EDITED
                    </span>
                  )}
                </div>

                <h3>{service.name}</h3>

                <p>{service.subtitle}</p>

                <div className="g5-folio-facts">
                  <span>
                    {service.duration} MIN SAMPLE
                  </span>

                  <strong>
                    {formatPeso(
                      service.price
                    )}
                  </strong>
                </div>

                <div className="g5-folio-actions">
                  <button
                    type="button"
                    onClick={() =>
                      editing === service.id
                        ? setEditing(null)
                        : edit(service)
                    }
                  >
                    <Pencil size={16} />

                    {editing === service.id
                      ? "CLOSE EDITOR"
                      : "EDIT DRAFT"}
                  </button>

                  {service.edited && (
                    <button
                      type="button"
                      onClick={() =>
                        restore(service.id)
                      }
                    >
                      <RotateCcw size={16} />
                      RESTORE
                    </button>
                  )}
                </div>

                {/* LOCAL DRAFT EDITOR */}

                {editing === service.id && (
                  <form
                    className="g5-folio-editor"
                    onSubmit={save}
                  >
                    <div className="g5-folio-editor-title">
                      <SlidersHorizontal size={18} />

                      LOCAL-ONLY DRAFT SETTINGS

                      <button
                        type="button"
                        onClick={() => {
                          setEditing(null);
                          setError("");
                        }}
                        aria-label="Close editor"
                      >
                        <X size={17} />
                      </button>
                    </div>

                    <label>
                      ILLUSTRATIVE FEE (PHP)

                      <input
                        required
                        type="number"
                        min="0"
                        max="1000000"
                        step="1"
                        value={form.price}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            price: e.target.value,
                          }))
                        }
                      />
                    </label>

                    <label>
                      SHORT SERVICE DESCRIPTION

                      <textarea
                        required
                        minLength={5}
                        maxLength={180}
                        rows={4}
                        value={form.subtitle}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            subtitle: e.target.value,
                          }))
                        }
                      />
                    </label>

                    <label className="g5-visibility-check">
                      <input
                        type="checkbox"
                        checked={form.visible}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            visible:
                              e.target.checked,
                          }))
                        }
                      />

                      PLANNED VISIBLE IN A FUTURE CATALOG
                    </label>

                    {error && (
                      <p
                        className="g5-form-error"
                        role="alert"
                      >
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="g5-button g5-button--dark"
                    >
                      <CheckCircle2 size={17} />
                      SAVE LOCAL DRAFT
                    </button>
                  </form>
                )}
              </div>
            </article>
          ))}
        </div>

        {shown.length === 0 && (
          <div className="g5-empty">
            <Search size={32} />

            <h3>
              No services in this view.
            </h3>

            <p>
              Try a different filter or search term.
            </p>

            <button
              className="g5-button g5-button--dark"
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("All");
                setVisibility("all");
              }}
            >
              SHOW ALL
              <ArrowRight size={15} />
            </button>
          </div>
        )}

        <p className="g5-disclaimer">
          <ShieldCheck size={18} />

          Staff drafts use the existing{" "}
          {SERVICE_DRAFTS_KEY} browser key.
          Pricing and visibility drafts do not
          publish changes to the public Atlas,
          Calendar or real clinic systems.
        </p>
      </section>
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";

import {
  Link,
} from "react-router-dom";

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
  Sparkles,
  Stethoscope,
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

function readDrafts() {
  try {
    const result = JSON.parse(
      localStorage.getItem(SERVICE_DRAFTS_KEY) || "{}"
    );

    return result &&
      typeof result === "object" &&
      !Array.isArray(result)
      ? result
      : {};
  } catch {
    return {};
  }
}

function effectiveService(service, drafts) {
  const draft = drafts[service.id] || {};

  const price =
    typeof draft.price === "number" &&
    Number.isFinite(draft.price) &&
    draft.price >= 0
      ? draft.price
      : service.price;

  return {
    ...service,

    price,

    subtitle:
      typeof draft.subtitle === "string"
        ? draft.subtitle
        : service.subtitle,

    visible:
      typeof draft.visible === "boolean"
        ? draft.visible
        : true,

    edited: Object.keys(draft).length > 0,
  };
}

export default function ServiceCatalogPage() {
  const [drafts, setDrafts] = useState(readDrafts);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [visibility, setVisibility] = useState("all");

  const [editingId, setEditingId] = useState(null);

  const [editor, setEditor] = useState({
    price: "",
    subtitle: "",
    visible: true,
  });

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(
        SERVICE_DRAFTS_KEY,
        JSON.stringify(drafts)
      );
    } catch (storageError) {
      console.warn(
        "YOUR GLOW draft storage unavailable:",
        storageError
      );
    }
  }, [drafts]);

  const services = useMemo(
    () =>
      SERVICES.map(
        (service) =>
          effectiveService(service, drafts)
      ),
    [drafts]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return services.filter((service) => {
      const matchesCategory =
        category === "All" ||
        service.category === category;

      const matchesVisibility =
        visibility === "all" ||
        (visibility === "visible"
          ? service.visible
          : !service.visible);

      const matchesSearch =
        !query ||
        [
          service.name,
          service.category,
          service.subtitle,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return (
        matchesCategory &&
        matchesVisibility &&
        matchesSearch
      );
    });
  }, [services, search, category, visibility]);

  const editedCount = services.filter(
    (service) => service.edited
  ).length;

  const plannedHidden = services.filter(
    (service) => !service.visible
  ).length;

  function openEditor(service) {
    if (editingId === service.id) {
      setEditingId(null);
      setError("");
      return;
    }

    setEditingId(service.id);

    setEditor({
      price: String(service.price),
      subtitle: service.subtitle,
      visible: service.visible,
    });

    setError("");
    setNotice("");
  }

  function saveDraft(event) {
    event.preventDefault();

    if (!editingId) return;

    const price = Number(editor.price);
    const subtitle = editor.subtitle.trim();

    if (
      editor.price.trim() === "" ||
      !Number.isFinite(price) ||
      price < 0 ||
      price > 1000000
    ) {
      setError(
        "Enter a valid sample fee between ₱0 and ₱1,000,000."
      );
      return;
    }

    if (
      subtitle.length < 5 ||
      subtitle.length > 180
    ) {
      setError(
        "Description should contain 5 to 180 characters."
      );
      return;
    }

    setDrafts((current) => ({
      ...current,
      [editingId]: {
        price,
        subtitle,
        visible: editor.visible,
      },
    }));

    setNotice("Staff-only service draft saved locally.");
    setError("");
    setEditingId(null);
  }

  function resetOne(id) {
    if (
      !window.confirm(
        "Reset this service's browser-local draft?"
      )
    ) {
      return;
    }

    setDrafts((current) => {
      const copy = { ...current };
      delete copy[id];
      return copy;
    });

    setEditingId(null);
    setError("");
    setNotice("Service draft reset.");
  }

  function resetAll() {
    if (
      !window.confirm(
        "Reset all service catalog drafts?"
      )
    ) {
      return;
    }

    setDrafts({});
    setEditingId(null);
    setError("");
    setNotice("All staff-only service drafts reset.");
  }

  return (
    <div className="ygs-page">
      <div className="ygs-page-heading">
        <div>
          <span className="ygs-eyebrow">
            SERVICES / CATALOG MANAGEMENT
          </span>

          <h1>
            The collection,
            <br />
            <em>considered in detail.</em>
          </h1>

          <p>
            Refine the aesthetic studio's sample
            service descriptions and illustrative
            pricing in a separate draft workspace.
          </p>
        </div>

        <Link
          to="/treatments"
          className="ygs-primary-button"
        >
          <Eye size={18} />
          View Public Treatments
          <ArrowUpRight size={17} />
        </Link>
      </div>

      <div className="ygs-summary-grid">
        <article>
          <Stethoscope size={23} />
          <strong>{SERVICES.length}</strong>
          <span>Original sample services</span>
        </article>

        <article>
          <Pencil size={23} />
          <strong>{editedCount}</strong>
          <span>Edited local drafts</span>
        </article>

        <article>
          <EyeOff size={23} />
          <strong>{plannedHidden}</strong>
          <span>Planned hidden services</span>
        </article>
      </div>

      <section className="ygs-panel">
        <div className="ygs-panel-heading">
          <div>
            <span className="ygs-eyebrow">
              SERVICE CATALOG DRAFTS
            </span>

            <h2>
              Your treatment <em>edit.</em>
            </h2>
          </div>

          <button
            type="button"
            className="ygs-secondary-button"
            disabled={editedCount === 0}
            onClick={resetAll}
          >
            <RotateCcw size={17} />
            Reset All Drafts
          </button>
        </div>

        <div className="ygs-catalog-filters">
          <label className="ygs-search-field">
            <span>SEARCH</span>

            <div>
              <Search size={18} />

              <input
                type="search"
                placeholder="Search services..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>
          </label>

          <label>
            <span>CATEGORY</span>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>PLANNED VISIBILITY</span>

            <select
              value={visibility}
              onChange={(event) =>
                setVisibility(event.target.value)
              }
            >
              <option value="all">
                All Services
              </option>
              <option value="visible">
                Planned Visible
              </option>
              <option value="hidden">
                Planned Hidden
              </option>
            </select>
          </label>
        </div>

        {notice && (
          <div className="ygs-save-notice" role="status">
            <CheckCircle2 size={18} />
            {notice}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="ygs-empty">
            <Search size={32} />

            <h3>No services match.</h3>

            <p>
              Try another category,
              status or search term.
            </p>
          </div>
        ) : (
          <div className="ygs-catalog-grid">
            {filtered.map((service) => (
              <article
                key={service.id}
                className="ygs-catalog-card"
              >
                <div className="ygs-catalog-photo">
                  <img
                    src={service.image}
                    alt={`Illustrative ${service.name} imagery`}
                    loading="lazy"
                  />

                  <span>
                    {service.category}
                  </span>
                </div>

                <div className="ygs-catalog-content">
                  <div className="ygs-catalog-flags">
                    <span>
                      {service.number} / 06
                    </span>

                    <span
                      className={
                        service.visible
                          ? "is-visible"
                          : "is-hidden"
                      }
                    >
                      {service.visible
                        ? "PLANNED VISIBLE"
                        : "PLANNED HIDDEN"}
                    </span>
                  </div>

                  <h3>{service.name}</h3>
                  <p>{service.subtitle}</p>

                  <div className="ygs-catalog-price">
                    <span>
                      Illustrative fee from
                    </span>

                    <strong>
                      {formatPeso(service.price)}
                    </strong>
                  </div>

                  <div className="ygs-catalog-actions">
                    <button
                      type="button"
                      onClick={() =>
                        openEditor(service)
                      }
                    >
                      {editingId === service.id
                        ? <X size={17} />
                        : <Pencil size={17} />}

                      {editingId === service.id
                        ? "Close Editor"
                        : "Edit Draft"}
                    </button>

                    {service.edited && (
                      <button
                        type="button"
                        onClick={() =>
                          resetOne(service.id)
                        }
                      >
                        <RotateCcw size={16} />
                        Reset
                      </button>
                    )}
                  </div>

                  {editingId === service.id && (
                    <form
                      className="ygs-catalog-editor"
                      onSubmit={saveDraft}
                    >
                      <span className="ygs-eyebrow">
                        STAFF-ONLY DRAFT
                      </span>

                      <label>
                        <span>
                          SAMPLE STARTING FEE (PHP)
                        </span>

                        <input
                          type="number"
                          min="0"
                          max="1000000"
                          step="50"
                          required
                          value={editor.price}
                          onChange={(event) =>
                            setEditor((current) => ({
                              ...current,
                              price: event.target.value,
                            }))
                          }
                        />
                      </label>

                      <label>
                        <span>
                          SHORT DESCRIPTION
                        </span>

                        <textarea
                          rows="4"
                          minLength={5}
                          maxLength={180}
                          required
                          value={editor.subtitle}
                          onChange={(event) =>
                            setEditor((current) => ({
                              ...current,
                              subtitle: event.target.value,
                            }))
                          }
                        />
                      </label>

                      <label className="ygs-visibility-choice">
                        <input
                          type="checkbox"
                          checked={editor.visible}
                          onChange={(event) =>
                            setEditor((current) => ({
                              ...current,
                              visible: event.target.checked,
                            }))
                          }
                        />

                        <span>
                          Planned visible on a future
                          public catalog
                        </span>
                      </label>

                      {error && (
                        <div
                          className="ygs-editor-error"
                          role="alert"
                        >
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="ygs-primary-button"
                      >
                        <CheckCircle2 size={17} />
                        Save Local Draft
                      </button>
                    </form>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="ygs-information">
        <ShieldCheck size={22} />

        <div>
          <strong>
            Local drafts are not public updates.
          </strong>

          <p>
            Changes are saved in this browser only.
            The original public Treatments,
            Treatment Finder, and Calendar continue
            reading `studioData.js`. Nothing is
            published, and these settings do not
            change real service availability.
          </p>
        </div>
      </div>
    </div>
  );
}
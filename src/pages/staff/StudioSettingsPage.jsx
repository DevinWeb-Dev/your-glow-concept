import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  RotateCcw,
  Save,
  Settings2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  TIME_SLOTS,
  formatTime,
} from "../../data/studioData.js";

import {
  STUDIO_SETTINGS_KEY,
  readLocalObject,
} from "../../utils/studioInsights.js";

import "../../styles/glow-batch6-final.css";

export const DEFAULT_SETTINGS = {
  studioName: "YOUR GLOW.",

  tagline:
    "Care for your skin. Confidence in your own way.",

  locationLabel: "",
  sampleEmail: "",
  samplePhone: "",

  description:
    "An editorial aesthetic and skin studio website concept focused on thoughtful service information, comfortable consultation experiences and personal choice.",

  conceptNotes: "",
};

const LIMITS = {
  studioName: 100,
  tagline: 180,
  locationLabel: 140,
  sampleEmail: 140,
  samplePhone: 50,
  description: 700,
  conceptNotes: 700,
};

function loadSettings() {
  const raw = readLocalObject(
    STUDIO_SETTINGS_KEY
  );

  const data = {
    ...DEFAULT_SETTINGS,
  };

  for (
    const key of Object.keys(DEFAULT_SETTINGS)
  ) {
    if (typeof raw[key] === "string") {
      data[key] = raw[key].slice(
        0,
        LIMITS[key]
      );
    }
  }

  return data;
}

function SettingField({
  label,
  name,
  value,
  onChange,
  placeholder,
  multiline = false,
}) {
  return (
    <label className="g6-field">
      <span>{label}</span>

      {multiline ? (
        <textarea
          rows={4}
          maxLength={LIMITS[name]}
          value={value}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(
              name,
              event.target.value
            )
          }
        />
      ) : (
        <input
          type="text"
          maxLength={LIMITS[name]}
          value={value}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(
              name,
              event.target.value
            )
          }
        />
      )}

      <small>
        {value.length} / {LIMITS[name]}
      </small>
    </label>
  );
}

export default function StudioSettingsPage() {
  const [saved, setSaved] =
    useState(loadSettings);

  const [draft, setDraft] =
    useState(() => ({ ...saved }));

  const [notice, setNotice] =
    useState("");

  const [error, setError] =
    useState("");

  const changed = useMemo(
    () =>
      JSON.stringify(saved) !==
      JSON.stringify(draft),
    [saved, draft]
  );

  function update(name, value) {
    setDraft((old) => ({
      ...old,
      [name]: value,
    }));

    setNotice("");
    setError("");
  }

  function save(event) {
    event.preventDefault();

    const normalized =
      Object.fromEntries(
        Object.keys(DEFAULT_SETTINGS).map(
          (key) => [
            key,
            draft[key].trim(),
          ]
        )
      );

    if (!normalized.studioName) {
      setError(
        "Enter a studio concept name before saving."
      );
      return;
    }

    try {
      localStorage.setItem(
        STUDIO_SETTINGS_KEY,
        JSON.stringify(normalized)
      );

      setSaved(normalized);
      setDraft(normalized);
      setError("");

      setNotice(
        "Studio profile saved as a browser-only draft."
      );
    } catch {
      setError(
        "Browser storage is unavailable. Nothing was saved."
      );
    }
  }

  function discard() {
    setDraft({ ...saved });

    setNotice(
      "Unsaved edits discarded."
    );

    setError("");
  }

  function restore() {
    if (
      !window.confirm(
        "Restore YOUR GLOW studio profile defaults in this browser?"
      )
    ) {
      return;
    }

    try {
      localStorage.removeItem(
        STUDIO_SETTINGS_KEY
      );

      setSaved({
        ...DEFAULT_SETTINGS,
      });

      setDraft({
        ...DEFAULT_SETTINGS,
      });

      setError("");

      setNotice(
        "Original studio profile draft restored."
      );
    } catch {
      setError(
        "Unable to reset studio settings in this browser."
      );
    }
  }

  return (
    <main className="g6 g6-settings">
      <header className="g6-hero g6-hero--soft">
        <div>
          <span className="g6-kicker">
            STUDIO CONFIGURATION / 03
          </span>

          <h1>
            Make it <em>yours.</em>
          </h1>

          <p>
            Build an internal identity draft
            for your fictional studio.
            Your public website and
            consultation rules will not change.
          </p>

          <div className="g6-hero-actions">
            <Link to="/staff/data">
              BACK UP THIS STUDIO
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>

        <div
          className="g6-hero-art"
          aria-hidden="true"
        >
          <span>YG.</span>
          <small>THE IDENTITY STUDY</small>
        </div>
      </header>

      <div className="g6-settings-grid">
        <form
          className="g6-panel g6-settings-form"
          onSubmit={save}
        >
          <div className="g6-panel-head">
            <div>
              <span className="g6-kicker">
                01 / PERSONALIZATION
              </span>

              <h2>
                Small <em>details.</em>
              </h2>
            </div>

            <Settings2 size={25} />
          </div>

          <div className="g6-form-grid">
            <SettingField
              name="studioName"
              label="STUDIO CONCEPT NAME"
              value={draft.studioName}
              onChange={update}
              placeholder="YOUR GLOW."
            />

            <SettingField
              name="tagline"
              label="STUDIO TAGLINE"
              value={draft.tagline}
              onChange={update}
              placeholder="Your editorial point of view"
            />

            <SettingField
              name="locationLabel"
              label="SAMPLE LOCATION LABEL"
              value={draft.locationLabel}
              onChange={update}
              placeholder="Fictional location only"
            />

            <SettingField
              name="sampleEmail"
              label="SAMPLE EMAIL LABEL"
              value={draft.sampleEmail}
              onChange={update}
              placeholder="fictional@example.test"
            />

            <SettingField
              name="samplePhone"
              label="SAMPLE PHONE LABEL"
              value={draft.samplePhone}
              onChange={update}
              placeholder="Fictional contact only"
            />

            <div className="g6-field g6-field-note">
              <span>INTERNAL ONLY</span>

              <p>
                Do not enter real client names,
                private contact details, or
                medical information.
              </p>
            </div>
          </div>

          <SettingField
            name="description"
            label="STUDIO CONCEPT DESCRIPTION"
            value={draft.description}
            onChange={update}
            multiline
            placeholder="What is the design story?"
          />

          <SettingField
            name="conceptNotes"
            label="PRIVATE CONCEPT NOTES"
            value={draft.conceptNotes}
            onChange={update}
            multiline
            placeholder="Design direction and future revisions"
          />

          {error && (
            <p
              className="g6-error"
              role="alert"
            >
              {error}
            </p>
          )}

          {notice && (
            <p
              className="g6-success"
              role="status"
            >
              <CheckCircle2 size={17} />
              {notice}
            </p>
          )}

          <div className="g6-form-actions">
            <button
              type="submit"
              disabled={!changed}
            >
              <Save size={17} />
              SAVE LOCAL DRAFT
            </button>

            <button
              type="button"
              disabled={!changed}
              onClick={discard}
            >
              DISCARD CHANGES
            </button>

            <button
              type="button"
              onClick={restore}
            >
              <RotateCcw size={16} />
              RESTORE DEFAULTS
            </button>
          </div>
        </form>

        <aside className="g6-settings-aside">
          <div className="g6-brand-preview">
            <span className="g6-kicker">
              02 / LIVE DRAFT PREVIEW
            </span>

            <span className="g6-brand-spark">
              <Sparkles size={36} />
            </span>

            <h2>
              {draft.studioName ||
                "YOUR GLOW."}
            </h2>

            <p>
              {draft.tagline ||
                DEFAULT_SETTINGS.tagline}
            </p>

            <div>
              <span>STUDIO LOCATION</span>

              <strong>
                {draft.locationLabel ||
                  "Not specified"}
              </strong>
            </div>

            <small>
              INTERNAL PREVIEW · NEVER
              AUTO-PUBLISHED
            </small>
          </div>

          <div className="g6-panel g6-rules">
            <span className="g6-kicker">
              03 / FIXED DEMO POLICY
            </span>

            <h2>
              Time has <em>boundaries.</em>
            </h2>

            <div>
              <span>
                Operating sample days
              </span>
              <strong>
                Monday–Saturday
              </strong>
            </div>

            <div>
              <span>
                Closed sample day
              </span>
              <strong>Sunday</strong>
            </div>

            <div>
              <span>
                Booking window
              </span>
              <strong>
                Next 90 days
              </strong>
            </div>

            <div>
              <span>Daily slots</span>
              <strong>
                {TIME_SLOTS.length}
              </strong>
            </div>

            <p>
              <Clock3 size={16} />
              {TIME_SLOTS.map(
                formatTime
              ).join(" · ")}
            </p>

            <small>
              Read-only rules controlled
              by the shared appointment
              engine.
            </small>
          </div>
        </aside>
      </div>

      <p className="g6-notice">
        <ShieldCheck size={18} />
        Saved to {STUDIO_SETTINGS_KEY}.
        Changes do not modify public
        pages, medical guidance or any
        live clinic profile.
      </p>
    </main>
  );
}
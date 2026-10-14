import { useMemo, useState } from "react";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
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

function readSettings() {
  const saved = readLocalObject(
    STUDIO_SETTINGS_KEY
  );

  const result = { ...DEFAULT_SETTINGS };

  for (
    const key of Object.keys(DEFAULT_SETTINGS)
  ) {
    if (typeof saved[key] === "string") {
      result[key] = saved[key];
    }
  }

  return result;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  maxLength = 140,
  type = "text",
}) {
  return (
    <label className="ygi-field">
      <span>{label}</span>

      <input
        type={type}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </label>
  );
}

export default function StudioSettingsPage() {
  const [saved, setSaved] = useState(
    readSettings
  );

  const [draft, setDraft] = useState(
    () => ({ ...saved })
  );

  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const changed = useMemo(
    () =>
      JSON.stringify(saved) !==
      JSON.stringify(draft),
    [saved, draft]
  );

  function update(key, value) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));

    setNotice("");
    setError("");
  }

  function handleSave(event) {
    event.preventDefault();

    if (!draft.studioName.trim()) {
      setError(
        "Please enter a studio concept name."
      );
      return;
    }

    const normalized = Object.fromEntries(
      Object.keys(DEFAULT_SETTINGS).map(
        (key) => [key, draft[key].trim()]
      )
    );

    try {
      localStorage.setItem(
        STUDIO_SETTINGS_KEY,
        JSON.stringify(normalized)
      );

      setSaved(normalized);
      setDraft(normalized);

      setNotice(
        "Studio profile draft saved successfully."
      );
      setError("");
    } catch {
      setError(
        "Unable to save the studio profile in this browser."
      );
    }
  }

  function discardChanges() {
    setDraft({ ...saved });
    setNotice("Unsaved changes discarded.");
    setError("");
  }

  function resetSettings() {
    if (
      !window.confirm(
        "Reset your browser-local studio settings to the original concept?"
      )
    ) {
      return;
    }

    try {
      localStorage.removeItem(
        STUDIO_SETTINGS_KEY
      );

      const original = {
        ...DEFAULT_SETTINGS,
      };

      setSaved(original);
      setDraft(original);
      setNotice(
        "Original studio concept settings restored."
      );
      setError("");
    } catch {
      setError(
        "Unable to reset settings in this browser."
      );
    }
  }

  return (
    <div className="ygs-page ygi-page">
      <div className="ygs-page-heading">
        <div>
          <span className="ygs-eyebrow">
            WORKSPACE CONFIGURATION
          </span>

          <h1>
            Make the studio
            <br />
            <em>your own.</em>
          </h1>

          <p>
            Customize a fictional business
            profile and preview the studio's
            editorial identity.
          </p>
        </div>

        <button
          type="button"
          className="ygs-secondary-button"
          onClick={resetSettings}
        >
          <RotateCcw size={17} />
          Reset Draft Settings
        </button>
      </div>

      <div className="ygi-settings-layout">
        <form
          className="ygs-panel ygi-settings-form"
          onSubmit={handleSave}
        >
          <div className="ygs-panel-heading">
            <div>
              <span className="ygs-eyebrow">
                STUDIO PROFILE
              </span>

              <h2>
                The little <em>details.</em>
              </h2>
            </div>

            <Settings2
              size={25}
              color="#B78B83"
            />
          </div>

          <div className="ygi-field-grid">
            <Field
              label="STUDIO CONCEPT NAME"
              value={draft.studioName}
              onChange={(value) =>
                update("studioName", value)
              }
              placeholder="YOUR GLOW."
              maxLength={100}
            />

            <Field
              label="BRAND TAGLINE"
              value={draft.tagline}
              onChange={(value) =>
                update("tagline", value)
              }
              maxLength={180}
            />

            <Field
              label="SAMPLE LOCATION LABEL"
              value={draft.locationLabel}
              onChange={(value) =>
                update("locationLabel", value)
              }
              placeholder="e.g. Proposed Metro Manila studio"
            />

            <Field
              label="SAMPLE CONTACT NUMBER"
              value={draft.samplePhone}
              onChange={(value) =>
                update("samplePhone", value)
              }
              placeholder="Optional demo contact"
              maxLength={50}
            />

            <Field
              label="SAMPLE EMAIL ADDRESS"
              type="email"
              value={draft.sampleEmail}
              onChange={(value) =>
                update("sampleEmail", value)
              }
              placeholder="Optional demo email"
              maxLength={140}
            />
          </div>

          <label className="ygi-field">
            <span>ABOUT THE STUDIO CONCEPT</span>

            <textarea
              rows={5}
              maxLength={700}
              value={draft.description}
              onChange={(event) =>
                update(
                  "description",
                  event.target.value
                )
              }
            />
          </label>

          <label className="ygi-field">
            <span>INTERNAL PROJECT NOTES</span>

            <textarea
              rows={4}
              maxLength={700}
              value={draft.conceptNotes}
              placeholder="Ideas for the final website, design adjustments, launch notes..."
              onChange={(event) =>
                update(
                  "conceptNotes",
                  event.target.value
                )
              }
            />
          </label>

          {notice && (
            <div
              className="ygi-feedback"
              role="status"
            >
              <CheckCircle2 size={19} />
              {notice}
            </div>
          )}

          {error && (
            <div
              className="ygi-feedback is-error"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="ygi-form-actions">
            <button
              type="submit"
              disabled={!changed}
              className="ygs-primary-button"
            >
              <Save size={18} />
              Save Studio Draft
            </button>

            <button
              type="button"
              disabled={!changed}
              className="ygs-secondary-button"
              onClick={discardChanges}
            >
              Discard Changes
            </button>
          </div>
        </form>

        <aside className="ygi-settings-aside">
          <div className="ygi-brand-preview">
            <span className="ygs-eyebrow">
              LIVE CONCEPT PREVIEW
            </span>

            <span className="ygi-brand-symbol">
              <Sparkles
                size={31}
                strokeWidth={1.3}
              />
            </span>

            <h2>
              {draft.studioName || "YOUR GLOW."}
            </h2>

            <p>
              {draft.tagline ||
                DEFAULT_SETTINGS.tagline}
            </p>

            <div className="ygi-brand-location">
              <MapPin size={18} />

              {draft.locationLabel ||
                "Location not specified"}
            </div>

            <small>
              INTERNAL DRAFT ONLY · NOT PUBLISHED
            </small>
          </div>

          <div className="ygs-panel ygi-policy-panel">
            <span className="ygs-eyebrow">
              CONSULTATION POLICY PREVIEW
            </span>

            <h3>
              A little <em>structure.</em>
            </h3>

            <div>
              <span>Sample operating days</span>
              <strong>Monday–Saturday</strong>
            </div>

            <div>
              <span>Sample closed day</span>
              <strong>Sunday</strong>
            </div>

            <div>
              <span>Request window</span>
              <strong>1–90 days ahead</strong>
            </div>

            <div>
              <span>Daily demo times</span>
              <strong>{TIME_SLOTS.length}</strong>
            </div>

            <p>
              {TIME_SLOTS.map(formatTime).join(", ")}
            </p>

            <div className="ygi-policy-note">
              <Clock3 size={19} />

              <span>
                These rules come from the public
                consultation scheduler and are
                read-only in this batch.
              </span>
            </div>
          </div>
        </aside>
      </div>

      <div className="ygs-information">
        <ShieldCheck size={23} />

        <div>
          <strong>
            Profile settings are local drafts.
          </strong>

          <p>
            Editing the studio identity here
            does not modify the public website,
            appointment rules, or any real
            clinic contact information.
          </p>
        </div>
      </div>
    </div>
  );
}
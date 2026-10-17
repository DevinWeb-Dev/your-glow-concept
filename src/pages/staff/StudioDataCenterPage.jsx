import { useState } from "react";

import {
  Link,
  useOutletContext,
} from "react-router-dom";

import {
  ArrowRight,
  CheckCircle2,
  Database,
  Download,
  FileJson,
  FileSpreadsheet,
  RotateCcw,
  ShieldCheck,
  Upload,
  XCircle,
} from "lucide-react";

import {
  SERVICES,
  TIME_SLOTS,
  localDateKey,
} from "../../data/studioData.js";

import {
  SERVICE_DRAFTS_KEY,
  downloadConsultationsCSV,
} from "../../utils/studioOps.js";

import {
  BOOKINGS_KEY,
  STUDIO_SETTINGS_KEY,
  BACKUP_FORMAT,
  readLocalObject,
  saveAsFile,
} from "../../utils/studioInsights.js";

import "../../styles/glow-batch6-final.css";

const MAX_BYTES = 1024 * 1024;

const SETTINGS_LIMITS = {
  studioName: 100,
  tagline: 180,
  locationLabel: 140,
  samplePhone: 50,
  sampleEmail: 140,
  description: 700,
  conceptNotes: 700,
};

const SERVICE_IDS = new Set(
  SERVICES.map((item) => item.id)
);

const isObject = (value) =>
  Boolean(value) &&
  typeof value === "object" &&
  !Array.isArray(value);

function isValidDay(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const date = new Date(
    `${value}T12:00:00`
  );

  return (
    Number.isFinite(date.getTime()) &&
    localDateKey(date) === value &&
    date.getDay() !== 0
  );
}

function validateBackup(input) {
  if (
    !isObject(input) ||
    input.format !== BACKUP_FORMAT ||
    input.version !== 1
  ) {
    throw new Error(
      "Not a supported YOUR GLOW v1 backup."
    );
  }

  if (
    !Array.isArray(input.bookings) ||
    input.bookings.length > 500
  ) {
    throw new Error(
      "A backup must contain 0–500 demo requests."
    );
  }

  if (
    !isObject(input.studioSettings) ||
    !isObject(input.serviceDrafts)
  ) {
    throw new Error(
      "Settings and service drafts must be JSON objects."
    );
  }

  const seenIds = new Set();
  const occupied = new Set();

  const bookings = input.bookings.map(
    (item, index) => {
      if (!isObject(item)) {
        throw new Error(
          `Request ${index + 1} is not an object.`
        );
      }

      const {
        id,
        alias,
        serviceId,
        date,
        time,
        status,
        createdAt,
      } = item;

      if (
        typeof id !== "string" ||
        !id.trim() ||
        id.length > 120 ||
        seenIds.has(id)
      ) {
        throw new Error(
          "Invalid or duplicate demo reference."
        );
      }

      if (
        typeof alias !== "string" ||
        alias.trim().length < 2 ||
        alias.length > 50
      ) {
        throw new Error(
          "An entry has an invalid demo alias."
        );
      }

      if (!SERVICE_IDS.has(serviceId)) {
        throw new Error(
          "An entry has an unknown sample service."
        );
      }

      if (
        !isValidDay(date) ||
        !TIME_SLOTS.includes(time)
      ) {
        throw new Error(
          "Invalid sample visit date or time."
        );
      }

      if (
        !["requested", "cancelled"].includes(
          status
        )
      ) {
        throw new Error(
          "Invalid request status."
        );
      }

      if (
        createdAt !== undefined &&
        (
          typeof createdAt !== "string" ||
          createdAt.length > 80
        )
      ) {
        throw new Error(
          "Invalid creation timestamp."
        );
      }

      seenIds.add(id);

      if (status === "requested") {
        const slot = `${date}|${time}`;

        if (occupied.has(slot)) {
          throw new Error(
            "Two active requests overlap the same sample slot."
          );
        }

        occupied.add(slot);
      }

      return {
        id,
        alias: alias.trim(),
        serviceId,
        date,
        time,
        status,
        createdAt: createdAt || "",
      };
    }
  );

  const studioSettings = {};

  for (
    const [key, limit] of Object.entries(
      SETTINGS_LIMITS
    )
  ) {
    const value =
      input.studioSettings[key];

    if (value === undefined) {
      continue;
    }

    if (
      typeof value !== "string" ||
      value.length > limit
    ) {
      throw new Error(
        `Invalid studio setting: ${key}.`
      );
    }

    studioSettings[key] = value;
  }

  const serviceDrafts = {};

  for (
    const [id, draft] of Object.entries(
      input.serviceDrafts
    )
  ) {
    if (
      !SERVICE_IDS.has(id) ||
      !isObject(draft)
    ) {
      throw new Error(
        "Backup includes an invalid service draft."
      );
    }

    const next = {};

    if (draft.price !== undefined) {
      if (
        typeof draft.price !== "number" ||
        !Number.isFinite(draft.price) ||
        draft.price < 0 ||
        draft.price > 1000000
      ) {
        throw new Error(
          "Invalid sample service fee."
        );
      }

      next.price = draft.price;
    }

    if (draft.subtitle !== undefined) {
      if (
        typeof draft.subtitle !== "string" ||
        draft.subtitle.length < 5 ||
        draft.subtitle.length > 180
      ) {
        throw new Error(
          "Invalid sample subtitle."
        );
      }

      next.subtitle = draft.subtitle;
    }

    if (draft.visible !== undefined) {
      if (
        typeof draft.visible !== "boolean"
      ) {
        throw new Error(
          "Invalid planned visibility flag."
        );
      }

      next.visible = draft.visible;
    }

    serviceDrafts[id] = next;
  }

  return {
    bookings,
    studioSettings,
    serviceDrafts,
  };
}

export default function StudioDataCenterPage() {
  const {
    bookings = [],
    onReplaceBookings,
  } = useOutletContext();

  const [pending, setPending] =
    useState(null);

  const [restorePhrase, setRestorePhrase] =
    useState("");

  const [resetPhrase, setResetPhrase] =
    useState("");

  const [notice, setNotice] =
    useState("");

  const [error, setError] =
    useState("");

  const active = bookings.filter(
    (item) => item.status === "requested"
  ).length;

  function exportJson() {
    const payload = {
      format: BACKUP_FORMAT,
      version: 1,
      exportedAt: new Date().toISOString(),

      bookings: bookings.map((item) => ({
        id: item.id,
        alias: item.alias,
        serviceId: item.serviceId,
        date: item.date,
        time: item.time,
        status: item.status,
        createdAt:
          item.createdAt || "",
      })),

      studioSettings: readLocalObject(
        STUDIO_SETTINGS_KEY
      ),

      serviceDrafts: readLocalObject(
        SERVICE_DRAFTS_KEY
      ),
    };

    try {
      saveAsFile(
        JSON.stringify(
          payload,
          null,
          2
        ),
        "your-glow-demo-backup.json",
        "application/json;charset=utf-8"
      );

      setNotice(
        "JSON download initiated. Keep it in a safe place."
      );

      setError("");
    } catch {
      setError(
        "Could not create the JSON backup."
      );
    }
  }

  function exportCsv() {
    try {
      downloadConsultationsCSV(
        bookings,
        "your-glow-demo-requests.csv"
      );

      setNotice(
        "CSV download initiated."
      );

      setError("");
    } catch {
      setError(
        "Could not export the CSV."
      );
    }
  }

  async function selectFile(event) {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    setPending(null);
    setRestorePhrase("");
    setNotice("");
    setError("");

    if (!file) return;

    if (file.size > MAX_BYTES) {
      setError(
        "Choose a JSON backup smaller than 1 MB."
      );
      return;
    }

    try {
      const contents =
        await file.text();

      const backup =
        validateBackup(
          JSON.parse(contents)
        );

      setPending(backup);

      setNotice(
        "Backup passed validation. Review before restoring."
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to validate the backup."
      );
    }
  }

  function restore() {
    if (
      !pending ||
      restorePhrase !== "RESTORE"
    ) {
      return;
    }

    if (
      !window.confirm(
        "Replace this browser's demo bookings, studio profile and catalog drafts with the selected backup?"
      )
    ) {
      return;
    }

    const keys = [
      BOOKINGS_KEY,
      STUDIO_SETTINGS_KEY,
      SERVICE_DRAFTS_KEY,
    ];

    const before = {};

    try {
      for (const key of keys) {
        before[key] =
          localStorage.getItem(key);
      }

      localStorage.setItem(
        BOOKINGS_KEY,
        JSON.stringify(
          pending.bookings
        )
      );

      localStorage.setItem(
        STUDIO_SETTINGS_KEY,
        JSON.stringify(
          pending.studioSettings
        )
      );

      localStorage.setItem(
        SERVICE_DRAFTS_KEY,
        JSON.stringify(
          pending.serviceDrafts
        )
      );

      onReplaceBookings(
        pending.bookings
      );

      setPending(null);
      setRestorePhrase("");

      setNotice(
        "Backup restored. Reload Settings or Catalog to see their restored local drafts."
      );

      setError("");
    } catch {
      for (const key of keys) {
        try {
          if (before[key] === null) {
            localStorage.removeItem(
              key
            );
          } else if (
            before[key] !== undefined
          ) {
            localStorage.setItem(
              key,
              before[key]
            );
          }
        } catch {
          // Browser storage can fail.
        }
      }

      setError(
        "Restore failed. Previous browser values were restored where possible."
      );
    }
  }

  function clearRequests() {
    if (resetPhrase !== "RESET") {
      return;
    }

    if (
      !window.confirm(
        "Delete all demo request records in this browser? This cannot be undone without a backup."
      )
    ) {
      return;
    }

    try {
      localStorage.setItem(
        BOOKINGS_KEY,
        "[]"
      );

      onReplaceBookings([]);

      setResetPhrase("");

      setNotice(
        "Demo request history cleared. Profile and catalog drafts were not changed."
      );

      setError("");
    } catch {
      setError(
        "Could not reset demo bookings."
      );
    }
  }

  return (
    <main className="g6 g6-vault">
      <header className="g6-hero">
        <div>
          <span className="g6-kicker">
            STUDIO INFRASTRUCTURE /
            04 — LOCAL VAULT
          </span>

          <h1>
            Keep the <em>details.</em>
          </h1>

          <p>
            Safeguard, restore or clear
            fictional demo records.
            Everything is managed locally
            in this browser; no external
            database is connected.
          </p>
        </div>

        <div
          className="g6-hero-art"
          aria-hidden="true"
        >
          <Database
            size={92}
            strokeWidth={0.8}
          />

          <small>
            THE DATA ATELIER / 006
          </small>
        </div>
      </header>

      <div className="g6-kpis g6-kpis--three">
        <article>
          <div>
            <span>
              TOTAL REQUESTS
            </span>

            <FileJson size={20} />
          </div>

          <strong>
            {bookings.length}
          </strong>

          <p>
            Saved in this browser
          </p>
        </article>

        <article className="g6-kpi-feature">
          <div>
            <span>
              REQUESTED
            </span>

            <CheckCircle2 size={20} />
          </div>

          <strong>{active}</strong>

          <p>
            Not confirmed appointments
          </p>
        </article>

        <article>
          <div>
            <span>
              DATA CATEGORIES
            </span>

            <Database size={20} />
          </div>

          <strong>03</strong>

          <p>
            Bookings · Studio · Services
          </p>
        </article>
      </div>

      <div className="g6-vault-grid">
        <section className="g6-panel g6-vault-card">
          <div className="g6-vault-icon">
            <Download size={26} />
          </div>

          <span className="g6-kicker">
            01 / EXPORT
          </span>

          <h2>
            Save a <em>copy.</em>
          </h2>

          <p>
            Download a YOUR GLOW v1
            JSON file containing demo
            requests, studio settings
            and service drafts.
            Export a separate CSV of
            bookings if preferred.
          </p>

          <button
            onClick={exportJson}
            type="button"
          >
            <FileJson size={17} />
            DOWNLOAD JSON BACKUP
          </button>

          <button
            onClick={exportCsv}
            type="button"
            className="g6-secondary"
          >
            <FileSpreadsheet size={17} />
            EXPORT REQUESTS CSV
          </button>
        </section>

        <section className="g6-panel g6-vault-card">
          <div className="g6-vault-icon">
            <Upload size={26} />
          </div>

          <span className="g6-kicker">
            02 / VALIDATE & RESTORE
          </span>

          <h2>
            Bring it <em>back.</em>
          </h2>

          <p>
            Import a validated JSON
            backup (up to 1 MB).
            Records, supported keys
            and overlapping active
            slots are checked before
            any replacement.
          </p>

          <label className="g6-field">
            <span>
              CHOOSE JSON FILE
            </span>

            <input
              type="file"
              accept=".json,application/json"
              onChange={selectFile}
            />
          </label>

          {pending && (
            <div className="g6-restore-ready">
              <CheckCircle2 size={19} />

              <strong>
                VALID BACKUP
              </strong>

              <p>
                {
                  pending.bookings.length
                }{" "}
                demo requests ·{" "}
                {
                  Object.keys(
                    pending.serviceDrafts
                  ).length
                }{" "}
                catalog drafts
              </p>

              <label className="g6-field">
                <span>
                  TYPE RESTORE
                </span>

                <input
                  value={restorePhrase}
                  onChange={(event) =>
                    setRestorePhrase(
                      event.target.value
                    )
                  }
                  autoComplete="off"
                  placeholder="RESTORE"
                />
              </label>

              <button
                type="button"
                disabled={
                  restorePhrase !== "RESTORE"
                }
                onClick={restore}
              >
                <RotateCcw size={17} />
                RESTORE THIS BACKUP
              </button>
            </div>
          )}
        </section>
      </div>

      <section className="g6-panel g6-danger">
        <div>
          <span className="g6-kicker">
            03 / RESET DEMO REQUESTS
          </span>

          <h2>
            Start <em>fresh.</em>
          </h2>

          <p>
            Clear only sample consultation
            history. Studio Settings and
            Service Catalog drafts remain
            saved. Export a backup first
            if you may need the records later.
          </p>
        </div>

        <div>
          <label className="g6-field">
            <span>
              TYPE RESET TO CONFIRM
            </span>

            <input
              value={resetPhrase}
              onChange={(event) =>
                setResetPhrase(
                  event.target.value
                )
              }
              placeholder="RESET"
              autoComplete="off"
            />
          </label>

          <button
            type="button"
            disabled={
              resetPhrase !== "RESET"
            }
            onClick={clearRequests}
          >
            <XCircle size={17} />
            CLEAR REQUEST HISTORY
          </button>
        </div>
      </section>

      {notice && (
        <p
          className="g6-success"
          role="status"
        >
          <CheckCircle2 size={17} />
          {notice}
        </p>
      )}

      {error && (
        <p
          className="g6-error"
          role="alert"
        >
          {error}
        </p>
      )}

      <div className="g6-bottom-navigation">
        <Link to="/staff/settings">
          STUDIO SETTINGS
          <ArrowRight size={17} />
        </Link>

        <Link to="/staff/reports">
          VIEW REPORTS
          <ArrowRight size={17} />
        </Link>
      </div>

      <p className="g6-notice">
        <ShieldCheck size={18} />
        The vault is not encrypted or
        private patient storage.
        Use fictional data only.
        Restoring a backup replaces
        current browser-local demo records.
      </p>
    </main>
  );
}
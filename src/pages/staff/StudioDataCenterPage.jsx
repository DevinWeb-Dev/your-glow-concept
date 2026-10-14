import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import {
  ArrowRight,
  CalendarDays,
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

const MAX_BACKUP_SIZE = 1024 * 1024;

const SETTING_LIMITS = {
  studioName: 100,
  tagline: 180,
  locationLabel: 140,
  samplePhone: 50,
  sampleEmail: 140,
  description: 700,
  conceptNotes: 700,
};

function isObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function validDate(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const date = new Date(`${value}T12:00:00`);

  return (
    !Number.isNaN(date.getTime()) &&
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
      "Invalid YOUR GLOW backup format."
    );
  }

  if (
    !Array.isArray(input.bookings) ||
    input.bookings.length > 500
  ) {
    throw new Error(
      "Backup must contain up to 500 demo requests."
    );
  }

  if (
    !isObject(input.studioSettings) ||
    !isObject(input.serviceDrafts)
  ) {
    throw new Error(
      "Invalid studio settings or service drafts."
    );
  }

  const serviceIds = new Set(
    SERVICES.map((service) => service.id)
  );

  const references = new Set();
  const occupiedSlots = new Set();

  const bookings = input.bookings.map(
    (item, index) => {
      if (!isObject(item)) {
        throw new Error(
          `Request ${index + 1} is invalid.`
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
        id.length < 1 ||
        id.length > 120 ||
        references.has(id)
      ) {
        throw new Error(
          "Invalid or duplicate request reference."
        );
      }

      if (
        typeof alias !== "string" ||
        alias.trim().length < 2 ||
        alias.length > 50
      ) {
        throw new Error(
          "A request contains an invalid demo alias."
        );
      }

      if (!serviceIds.has(serviceId)) {
        throw new Error(
          "A request contains an unknown service."
        );
      }

      if (!validDate(date)) {
        throw new Error(
          "A request has an invalid appointment date."
        );
      }

      if (!TIME_SLOTS.includes(time)) {
        throw new Error(
          "A request has an invalid time slot."
        );
      }

      if (
        status !== "requested" &&
        status !== "cancelled"
      ) {
        throw new Error(
          "A request contains an invalid status."
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
          "Invalid request creation timestamp."
        );
      }

      references.add(id);

      if (status === "requested") {
        const slotKey = `${date}|${time}`;

        if (occupiedSlots.has(slotKey)) {
          throw new Error(
            "Backup contains overlapping active consultation slots."
          );
        }

        occupiedSlots.add(slotKey);
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
    const [key, maxLength]
    of Object.entries(SETTING_LIMITS)
  ) {
    const value = input.studioSettings[key];

    if (value === undefined) continue;

    if (
      typeof value !== "string" ||
      value.length > maxLength
    ) {
      throw new Error(
        `Invalid studio setting: ${key}.`
      );
    }

    studioSettings[key] = value;
  }

  const serviceDrafts = {};

  for (
    const [id, draft]
    of Object.entries(input.serviceDrafts)
  ) {
    if (
      !serviceIds.has(id) ||
      !isObject(draft)
    ) {
      throw new Error(
        "Unknown service catalog draft."
      );
    }

    const normalized = {};

    if (draft.price !== undefined) {
      if (
        typeof draft.price !== "number" ||
        !Number.isFinite(draft.price) ||
        draft.price < 0 ||
        draft.price > 1000000
      ) {
        throw new Error(
          "Invalid draft service price."
        );
      }

      normalized.price = draft.price;
    }

    if (draft.subtitle !== undefined) {
      if (
        typeof draft.subtitle !== "string" ||
        draft.subtitle.length < 5 ||
        draft.subtitle.length > 180
      ) {
        throw new Error(
          "Invalid draft service description."
        );
      }

      normalized.subtitle = draft.subtitle;
    }

    if (draft.visible !== undefined) {
      if (typeof draft.visible !== "boolean") {
        throw new Error(
          "Invalid draft visibility setting."
        );
      }

      normalized.visible = draft.visible;
    }

    serviceDrafts[id] = normalized;
  }

  return {
    bookings,
    studioSettings,
    serviceDrafts,
  };
}

export default function StudioDataCenterPage() {
  const {
    bookings,
    onReplaceBookings,
  } = useOutletContext();

  const [pendingBackup, setPendingBackup] =
    useState(null);

  const [restoreWord, setRestoreWord] =
    useState("");

  const [resetWord, setResetWord] =
    useState("");

  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const activeCount = bookings.filter(
    (item) => item.status === "requested"
  ).length;

  function downloadBackup() {
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
        createdAt: item.createdAt || "",
      })),

      studioSettings: readLocalObject(
        STUDIO_SETTINGS_KEY
      ),

      serviceDrafts: readLocalObject(
        SERVICE_DRAFTS_KEY
      ),
    };

    saveAsFile(
      JSON.stringify(payload, null, 2),
      "your-glow-demo-backup.json",
      "application/json;charset=utf-8"
    );

    setNotice("JSON backup download started.");
    setError("");
  }

  function downloadCSV() {
    downloadConsultationsCSV(
      bookings,
      "your-glow-all-demo-consultations.csv"
    );

    setNotice("CSV export download started.");
    setError("");
  }

  async function selectBackup(event) {
    const file = event.target.files?.[0];

    event.target.value = "";

    setPendingBackup(null);
    setRestoreWord("");
    setNotice("");
    setError("");

    if (!file) return;

    if (file.size > MAX_BACKUP_SIZE) {
      setError(
        "The backup exceeds the 1 MB import limit."
      );
      return;
    }

    try {
      const contents = await file.text();

      const parsed = JSON.parse(contents);

      const validated = validateBackup(parsed);

      setPendingBackup(validated);

      setNotice(
        "Backup validated. Review the details before restoring."
      );
    } catch (problem) {
      setError(
        problem instanceof Error
          ? problem.message
          : "Unable to read the backup."
      );
    }
  }

  function restoreBackup() {
    if (
      !pendingBackup ||
      restoreWord !== "RESTORE"
    ) {
      return;
    }

    if (
      !window.confirm(
        "Replace current fictional consultation requests, studio settings and service drafts with this backup?"
      )
    ) {
      return;
    }

    const keys = [
      BOOKINGS_KEY,
      STUDIO_SETTINGS_KEY,
      SERVICE_DRAFTS_KEY,
    ];

    const previous = {};

    try {
      for (const key of keys) {
        previous[key] = localStorage.getItem(key);
      }

      const updates = {
        [BOOKINGS_KEY]:
          pendingBackup.bookings,

        [STUDIO_SETTINGS_KEY]:
          pendingBackup.studioSettings,

        [SERVICE_DRAFTS_KEY]:
          pendingBackup.serviceDrafts,
      };

      for (const key of keys) {
        localStorage.setItem(
          key,
          JSON.stringify(updates[key])
        );
      }

      // Keep React and localStorage in sync.
      onReplaceBookings(pendingBackup.bookings);

      setNotice(
        "Demo backup restored successfully. Other staff pages will display the restored information."
      );

      setError("");
      setPendingBackup(null);
      setRestoreWord("");
    } catch {
      // Best-effort rollback of previous values.
      for (const key of keys) {
        try {
          if (previous[key] === null) {
            localStorage.removeItem(key);
          } else if (previous[key] !== undefined) {
            localStorage.setItem(
              key,
              previous[key]
            );
          }
        } catch {
          // Browser storage may be unavailable.
        }
      }

      setError(
        "Unable to restore this backup. Existing data was preserved where possible."
      );
    }
  }

  function resetRequests() {
    if (resetWord !== "RESET") return;

    if (
      !window.confirm(
        "Permanently clear this browser's demo consultation requests? Export a backup first if you want to keep them."
      )
    ) {
      return;
    }

    try {
      localStorage.setItem(
        BOOKINGS_KEY,
        JSON.stringify([])
      );

      onReplaceBookings([]);

      setResetWord("");
      setNotice(
        "All demo consultations cleared. Studio settings and service drafts remain saved."
      );
      setError("");
    } catch {
      setError(
        "Unable to clear demo bookings from browser storage."
      );
    }
  }

  return (
    <div className="ygs-page ygi-page">
      <div className="ygs-page-heading">
        <div>
          <span className="ygs-eyebrow">
            DATA MANAGEMENT / LOCAL DEMO
          </span>

          <h1>
            Your studio data.
            <br />
            <em>In your hands.</em>
          </h1>

          <p>
            Keep local backups, restore sample
            consultation records and reset the
            prototype when needed.
          </p>
        </div>

        <span className="ygi-local-label">
          <Database size={18} />
          BROWSER-LOCAL STORAGE
        </span>
      </div>

      <div className="ygi-data-summary">
        <article>
          <CalendarDays size={23} />
          <strong>{bookings.length}</strong>
          <span>Stored demo requests</span>
        </article>

        <article>
          <CheckCircle2 size={23} />
          <strong>{activeCount}</strong>
          <span>Active demo requests</span>
        </article>

        <article>
          <Database size={23} />
          <strong>3</strong>
          <span>Demo data categories</span>
        </article>
      </div>

      <div className="ygi-data-grid">
        <section className="ygs-panel ygi-data-card">
          <span className="ygi-data-icon">
            <Download size={25} />
          </span>

          <span className="ygs-eyebrow">
            01 / EXPORT
          </span>

          <h2>
            Keep a <em>copy.</em>
          </h2>

          <p>
            Download your fictional consultation
            history, studio settings and service
            catalog drafts in one JSON file.
          </p>

          <button
            type="button"
            className="ygs-primary-button"
            onClick={downloadBackup}
          >
            <FileJson size={18} />
            Export JSON Backup
          </button>

          <button
            type="button"
            className="ygs-secondary-button"
            onClick={downloadCSV}
          >
            <FileSpreadsheet size={18} />
            Export Consultations CSV
          </button>
        </section>

        <section className="ygs-panel ygi-data-card">
          <span className="ygi-data-icon">
            <Upload size={25} />
          </span>

          <span className="ygs-eyebrow">
            02 / RESTORE
          </span>

          <h2>
            Bring back <em>the details.</em>
          </h2>

          <p>
            Import a previously exported YOUR GLOW
            JSON backup. All data is validated
            before restoration.
          </p>

          <label className="ygi-file-field">
            <span>SELECT JSON BACKUP</span>

            <input
              type="file"
              accept=".json,application/json"
              onChange={selectBackup}
            />
          </label>

          {pendingBackup && (
            <div className="ygi-restore-preview">
              <strong>
                Valid backup detected
              </strong>

              <p>
                {pendingBackup.bookings.length} demo
                consultations and{" "}
                {
                  Object.keys(
                    pendingBackup.serviceDrafts
                  ).length
                }{" "}
                service drafts.
              </p>

              <label className="ygi-confirm-field">
                <span>
                  TYPE RESTORE TO CONTINUE
                </span>

                <input
                  type="text"
                  autoComplete="off"
                  placeholder="RESTORE"
                  value={restoreWord}
                  onChange={(event) =>
                    setRestoreWord(
                      event.target.value
                    )
                  }
                />
              </label>

              <button
                type="button"
                className="ygs-primary-button"
                disabled={
                  restoreWord !== "RESTORE"
                }
                onClick={restoreBackup}
              >
                <RotateCcw size={18} />
                Restore Demo Backup
              </button>
            </div>
          )}
        </section>
      </div>

      <section className="ygs-panel ygi-reset-section">
        <div>
          <span className="ygs-eyebrow">
            03 / CLEAN DEMO ENVIRONMENT
          </span>

          <h2>
            Begin <em>again.</em>
          </h2>

          <p>
            Clear all sample consultation requests
            from this browser. This also releases
            the occupied demo appointment slots.
            Your studio settings and service
            drafts will stay intact.
          </p>
        </div>

        <div className="ygi-reset-controls">
          <label className="ygi-confirm-field">
            <span>TYPE RESET TO CONTINUE</span>

            <input
              type="text"
              autoComplete="off"
              value={resetWord}
              placeholder="RESET"
              onChange={(event) =>
                setResetWord(event.target.value)
              }
            />
          </label>

          <button
            type="button"
            className="ygi-danger-button"
            disabled={
              resetWord !== "RESET" ||
              bookings.length === 0
            }
            onClick={resetRequests}
          >
            <XCircle size={18} />
            Clear All Demo Requests
          </button>
        </div>
      </section>

      {notice && (
        <div
          className="ygi-feedback"
          role="status"
        >
          <CheckCircle2 size={21} />
          {notice}
        </div>
      )}

      {error && (
        <div
          className="ygi-feedback is-error"
          role="alert"
        >
          <XCircle size={21} />
          {error}
        </div>
      )}

      <div className="ygs-information">
        <ShieldCheck size={23} />

        <div>
          <strong>
            This is a local data tool, not a
            medical records system.
          </strong>

          <p>
            Backups are not encrypted. They are
            downloaded manually and should contain
            fictional information only. Do not use
            this prototype for real client records,
            skin photographs or health details.
          </p>
        </div>
      </div>

      <Link
        className="ygs-panel-link ygi-return-link"
        to="/staff"
      >
        Return to Studio Overview
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}
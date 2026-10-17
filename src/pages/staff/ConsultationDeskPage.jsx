import { useMemo, useState } from "react";
import {
  Link,
  useOutletContext,
} from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  Download,
  FilterX,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import {
  SERVICES,
  formatDate,
  formatTime,
} from "../../data/studioData.js";

import {
  downloadConsultationsCSV,
  findService,
  todayKey,
} from "../../utils/studioOps.js";

import "../../styles/glow-batch5-operations.css";

const nameOf = (id) =>
  findService(id)?.name ||
  "Unknown sample service";

export default function ConsultationDeskPage() {
  const {
    bookings = [],
    onCancelBooking,
  } = useOutletContext();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [serviceId, setServiceId] = useState("all");
  const [day, setDay] = useState("");
  const [order, setOrder] = useState("soonest");
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(
    () =>
      bookings
        .filter(
          (b) =>
            status === "all" ||
            b.status === status
        )
        .filter(
          (b) =>
            serviceId === "all" ||
            b.serviceId === serviceId
        )
        .filter(
          (b) =>
            !day || b.date === day
        )
        .filter((b) =>
          [
            b.id,
            b.alias,
            b.date,
            b.time,
            nameOf(b.serviceId),
          ]
            .join(" ")
            .toLowerCase()
            .includes(search.trim().toLowerCase())
        )
        .sort((a, b) =>
          order === "soonest"
            ? `${a.date} ${a.time}`.localeCompare(
                `${b.date} ${b.time}`
              )
            : `${b.date} ${b.time}`.localeCompare(
                `${a.date} ${a.time}`
              )
        ),
    [bookings, search, status, serviceId, day, order]
  );

  const requested = bookings.filter(
    (b) => b.status === "requested"
  ).length;

  const cancelled = bookings.filter(
    (b) => b.status === "cancelled"
  ).length;

  const today = todayKey();

  const todayCount = bookings.filter(
    (b) =>
      b.status === "requested" &&
      b.date === today
  ).length;

  const clear = () => {
    setSearch("");
    setStatus("all");
    setServiceId("all");
    setDay("");
    setOrder("soonest");
  };

  return (
    <div className="g5-ops g5-desk">
      {/* ARCHITECTURAL HERO */}

      <section className="g5-ops-hero g5-ops-hero--desk">
        <div className="g5-ops-hero-copy">
          <span className="g5-kicker">
            OPERATIONS / 01 — THE CONSULTATION DESK
          </span>

          <h1>
            THE DAILY <em>flow.</em>
          </h1>

          <p>
            A focused view of fictional requests,
            each stored only in this browser.
            Search, inspect, export and cancel
            without altering the public booking
            engine.
          </p>

          <Link
            className="g5-hero-link"
            to="/calendar"
          >
            OPEN THE PUBLIC CALENDAR
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div
          className="g5-desk-hero-art"
          aria-hidden="true"
        >
          <span className="g5-orbit g5-orbit--one" />
          <span className="g5-orbit g5-orbit--two" />

          <strong>01.</strong>

          <small>
            ALWAYS ROOM FOR CLARITY
          </small>
        </div>
      </section>

      {/* METRICS */}

      <div className="g5-metrics g5-metrics--four">
        {[
          ["TOTAL ENTRIES", bookings.length],
          ["REQUESTED", requested],
          ["CANCELLED", cancelled],
          ["ON TODAY'S DEMO BOARD", todayCount],
        ].map(([label, number], index) => (
          <article
            key={label}
            className={
              index === 1 ? "is-lime" : ""
            }
          >
            <span>{label}</span>

            <strong>
              {String(number).padStart(2, "0")}
            </strong>

            <small>
              {index === 1
                ? "Awaiting demo action"
                : "Fictional records only"}
            </small>
          </article>
        ))}
      </div>

      {/* WORKSPACE */}

      <section className="g5-panel g5-desk-workspace">
        <header className="g5-panel-heading">
          <div>
            <span className="g5-kicker">
              THE CONSULTATION LEDGER
            </span>

            <h2>
              A considered <em>overview.</em>
            </h2>
          </div>

          <button
            className="g5-button g5-button--dark"
            type="button"
            onClick={() =>
              downloadConsultationsCSV(
                filtered,
                "your-glow-consultation-desk-demo.csv"
              )
            }
            disabled={filtered.length === 0}
          >
            <Download size={17} />
            EXPORT VIEW ({filtered.length})
          </button>
        </header>

        {/* FILTERS */}

        <div className="g5-filters">
          <label className="g5-filter g5-filter--search">
            <span>SEARCH THE LEDGER</span>

            <div>
              <Search size={17} />

              <input
                aria-label="Search demo bookings"
                type="search"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Alias, reference, service…"
              />
            </div>
          </label>

          <label className="g5-filter">
            <span>STATUS</span>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >
              <option value="all">
                Every status
              </option>

              <option value="requested">
                Requested
              </option>

              <option value="cancelled">
                Cancelled
              </option>
            </select>
          </label>

          <label className="g5-filter">
            <span>SERVICE</span>

            <select
              value={serviceId}
              onChange={(e) =>
                setServiceId(e.target.value)
              }
            >
              <option value="all">
                All care studies
              </option>

              {SERVICES.map((s) => (
                <option
                  value={s.id}
                  key={s.id}
                >
                  {s.name}
                </option>
              ))}
            </select>
          </label>

          <label className="g5-filter">
            <span>DEMO DATE</span>

            <input
              aria-label="Filter by date"
              type="date"
              value={day}
              onChange={(e) =>
                setDay(e.target.value)
              }
            />
          </label>

          <label className="g5-filter">
            <span>ORDER</span>

            <select
              value={order}
              onChange={(e) =>
                setOrder(e.target.value)
              }
            >
              <option value="soonest">
                Earliest first
              </option>

              <option value="latest">
                Latest first
              </option>
            </select>
          </label>

          <button
            className="g5-button g5-button--outline"
            type="button"
            onClick={clear}
          >
            <FilterX size={17} />
            RESET
          </button>
        </div>

        <div className="g5-ledger-meta">
          <span>
            {filtered.length} MATCHING DEMO RECORDS
          </span>

          <span>
            SELECT AN ENTRY TO SEE MORE
            <ChevronDown size={15} />
          </span>
        </div>

        {/* EMPTY STATE */}

        {filtered.length === 0 ? (
          <div className="g5-empty">
            <CalendarDays size={34} />

            <h3>
              No entries in this edit.
            </h3>

            <p>
              Adjust the filters or create a
              fictional request in the public
              calendar.
            </p>

            <button
              className="g5-button g5-button--dark"
              onClick={clear}
              type="button"
            >
              RESET FILTERS
              <ArrowRight size={15} />
            </button>
          </div>
        ) : (
          <div className="g5-ledger-list">
            {filtered.map((b, i) => {
              const open = expanded === b.id;

              return (
                <article
                  className={`g5-ledger-entry ${
                    open ? "is-open" : ""
                  }`}
                  key={b.id}
                >
                  <button
                    type="button"
                    className="g5-ledger-summary"
                    aria-expanded={open}
                    onClick={() =>
                      setExpanded(
                        open ? null : b.id
                      )
                    }
                  >
                    <span className="g5-ledger-index">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span className="g5-ledger-identity">
                      <small>{b.id}</small>
                      <strong>
                        {nameOf(b.serviceId)}
                      </strong>
                      <span>
                        {b.alias || "Demo visitor"}
                      </span>
                    </span>

                    <span className="g5-ledger-visit">
                      <CalendarDays size={15} />
                      {formatDate(b.date)}
                      <small>
                        {formatTime(b.time)}
                      </small>
                    </span>

                    <span
                      className={`g5-state ${
                        b.status === "requested"
                          ? "is-active"
                          : ""
                      }`}
                    >
                      {b.status.toUpperCase()}
                    </span>

                    <ChevronDown
                      className="g5-ledger-chevron"
                      size={19}
                    />
                  </button>

                  {open && (
                    <div className="g5-ledger-expanded">
                      <div>
                        <span>DEMO REFERENCE</span>
                        <strong>{b.id}</strong>
                      </div>

                      <div>
                        <span>CREATED</span>
                        <strong>
                          {b.createdAt
                            ? new Date(
                                b.createdAt
                              ).toLocaleString("en-PH")
                            : "Not recorded"}
                        </strong>
                      </div>

                      <div>
                        <span>STATUS</span>
                        <strong>
                          {b.status === "requested"
                            ? "Request stored — unconfirmed"
                            : "Request cancelled"}
                        </strong>
                      </div>

                      {b.status === "requested" && (
                        <button
                          type="button"
                          className="g5-cancel"
                          onClick={() =>
                            onCancelBooking(b.id)
                          }
                        >
                          <XCircle size={17} />
                          CANCEL DEMO REQUEST
                        </button>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        <p className="g5-disclaimer">
          <ShieldCheck size={18} />
          Demo data only. CSV contains local
          fictional aliases; do not use this
          workspace for real patients or
          sensitive medical information.
        </p>
      </section>
    </div>
  );
}
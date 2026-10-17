import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import {
  SERVICES,
  formatDate,
  formatTime,
} from "../data/studioData.js";

import "../styles/glow-batch4-botanical.css";

const serviceName = (id) =>
  SERVICES.find((item) => item.id === id)?.name ||
  "Unknown sample service";

export default function GlowRequestLibrary({
  bookings = [],
  onCancelBooking,
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [order, setOrder] = useState("newest");

  const counts = {
    all: bookings.length,

    requested: bookings.filter(
      (item) => item.status === "requested"
    ).length,

    cancelled: bookings.filter(
      (item) => item.status === "cancelled"
    ).length,
  };

  const shown = useMemo(
    () =>
      bookings
        .filter((booking) => {
          if (
            status !== "all" &&
            booking.status !== status
          ) {
            return false;
          }

          const content = [
            booking.id,
            booking.alias,
            booking.date,
            booking.time,
            serviceName(booking.serviceId),
          ]
            .join(" ")
            .toLowerCase();

          return content.includes(
            query.toLowerCase().trim()
          );
        })
        .sort((a, b) => {
          const left = `${a.date} ${a.time}`;
          const right = `${b.date} ${b.time}`;

          return order === "soonest"
            ? left.localeCompare(right)
            : right.localeCompare(left);
        }),
    [bookings, query, status, order]
  );

  return (
    <main className="g4 g4-library">
      <section className="g4-library-hero">
        <div className="g4-wrap">
          <span className="g4-overline">
            <ShieldCheck size={16} />
            THE LOCAL REQUEST LIBRARY / 004
          </span>

          <h1>
            YOUR MOMENTS, <em>in order.</em>
          </h1>

          <p>
            Review and cancel fictional consultation
            requests saved in this browser. Cancelled
            slots become selectable again.
          </p>

          <Link
            to="/calendar"
            className="g4-hero-outline"
          >
            CREATE A DEMO REQUEST
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>

      <div className="g4-wrap g4-library-body">
        <section
          className="g4-library-counts"
          aria-label="Request summary"
        >
          <article>
            <CalendarDays size={21} />
            <small>ALL ENTRIES</small>
            <strong>{counts.all}</strong>
          </article>

          <article>
            <CheckCircle2 size={21} />
            <small>REQUESTED</small>
            <strong>{counts.requested}</strong>
          </article>

          <article>
            <XCircle size={21} />
            <small>CANCELLED</small>
            <strong>{counts.cancelled}</strong>
          </article>
        </section>

        <div className="g4-library-tools">
          <label className="g4-library-search">
            <Search size={17} />

            <input
              type="search"
              aria-label="Search sample requests"
              placeholder="Search reference, alias or service"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
            />
          </label>

          <label>
            STATUS

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
            >
              <option value="all">All records</option>
              <option value="requested">Requested</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>

          <label>
            ORDER

            <select
              value={order}
              onChange={(event) =>
                setOrder(event.target.value)
              }
            >
              <option value="newest">
                Latest visit first
              </option>

              <option value="soonest">
                Earliest visit first
              </option>
            </select>
          </label>
        </div>

        {shown.length ? (
          <div className="g4-request-list">
            {shown.map((booking, index) => (
              <article
                key={booking.id}
                className="g4-request"
              >
                <div className="g4-request-index">
                  {String(index + 1).padStart(2, "0")}

                  <span>
                    / {String(shown.length).padStart(2, "0")}
                  </span>
                </div>

                <div className="g4-request-core">
                  <span className="g4-overline">
                    {booking.id}
                  </span>

                  <h2>
                    {serviceName(booking.serviceId)}
                  </h2>

                  <p>
                    {booking.alias || "Fictional visitor"}
                  </p>
                </div>

                <div className="g4-request-when">
                  <span>
                    <CalendarDays size={16} />
                    {formatDate(booking.date)}
                  </span>

                  <span>
                    <Clock3 size={16} />
                    {formatTime(booking.time)}
                  </span>
                </div>

                <div className="g4-request-actions">
                  <span
                    className={`g4-status ${
                      booking.status === "requested"
                        ? "is-requested"
                        : ""
                    }`}
                  >
                    {booking.status.toUpperCase()}
                  </span>

                  {booking.status === "requested" && (
                    <button
                      type="button"
                      onClick={() =>
                        onCancelBooking(booking.id)
                      }
                    >
                      CANCEL DEMO
                      <XCircle size={16} />
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="g4-library-empty">
            <CalendarDays size={36} />

            <h2>
              Nothing in this <em>edit.</em>
            </h2>

            <p>
              No records match the current filters.
              A new demo request can be made
              through the public calendar.
            </p>

            <button
              type="button"
              onClick={() => {
                setStatus("all");
                setQuery("");
              }}
            >
              CLEAR FILTERS
              <ArrowRight size={17} />
            </button>
          </div>
        )}

        <div className="g4-library-disclosure">
          <ShieldCheck size={21} />

          <p>
            The public site has no login or identity
            verification, and demo records are
            accessible within this browser. Do not
            enter actual personal or medical information.
            These are not confirmed clinic bookings.
          </p>

          <Link to="/staff">
            STUDIO DEMO DASHBOARD
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </main>
  );
}
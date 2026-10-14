import { useMemo, useState } from "react";

import {
  Link,
  useOutletContext,
} from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Download,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
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
} from "../../utils/studioOps.js";

export default function ConsultationDeskPage() {
  const {
    bookings,
    onCancelBooking,
  } = useOutletContext();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [serviceId, setServiceId] = useState("all");
  const [date, setDate] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookings
      .filter((booking) => {
        if (
          status !== "all" &&
          booking.status !== status
        ) {
          return false;
        }

        if (
          serviceId !== "all" &&
          booking.serviceId !== serviceId
        ) {
          return false;
        }

        if (
          date &&
          booking.date !== date
        ) {
          return false;
        }

        const serviceName =
          findService(booking.serviceId)?.name || "";

        const content = [
          booking.id,
          booking.alias,
          booking.date,
          booking.time,
          serviceName,
        ]
          .join(" ")
          .toLowerCase();

        return content.includes(query);
      })
      .sort((a, b) =>
        `${a.date} ${a.time}`.localeCompare(
          `${b.date} ${b.time}`
        )
      );
  }, [bookings, search, status, serviceId, date]);

  const activeCount = bookings.filter(
    (item) => item.status === "requested"
  ).length;

  const cancelledCount = bookings.filter(
    (item) => item.status === "cancelled"
  ).length;

  function resetFilters() {
    setSearch("");
    setStatus("all");
    setServiceId("all");
    setDate("");
  }

  function exportCSV() {
    downloadConsultationsCSV(
      filtered,
      "your-glow-filtered-demo-consultations.csv"
    );
  }

  return (
    <div className="ygs-page">
      <div className="ygs-page-heading">
        <div>
          <span className="ygs-eyebrow">
            CONSULTATIONS / OPERATIONS
          </span>

          <h1>
            Every visit,
            <br />
            <em>beautifully planned.</em>
          </h1>

          <p>
            Manage sample consultation requests
            and keep the studio's fictional
            appointments organized.
          </p>
        </div>

        <Link
          className="ygs-primary-button"
          to="/calendar"
        >
          <CalendarDays size={18} />
          New Demo Request
          <ArrowUpRight size={17} />
        </Link>
      </div>

      <div className="ygs-summary-grid">
        <article>
          <ClipboardList size={23} />

          <strong>{bookings.length}</strong>

          <span>Total demo requests</span>
        </article>

        <article>
          <CheckCircle2 size={23} />

          <strong>{activeCount}</strong>

          <span>Active requests</span>
        </article>

        <article>
          <XCircle size={23} />

          <strong>{cancelledCount}</strong>

          <span>Cancelled requests</span>
        </article>
      </div>

      <section className="ygs-panel">
        <div className="ygs-panel-heading">
          <div>
            <span className="ygs-eyebrow">
              THE CONSULTATION DESK
            </span>

            <h2>
              Request <em>management.</em>
            </h2>
          </div>

          <button
            type="button"
            className="ygs-secondary-button"
            onClick={exportCSV}
          >
            <Download size={17} />
            Export Filtered CSV
          </button>
        </div>

        <div className="ygs-filters">
          <label className="ygs-search-field">
            <span>SEARCH REQUESTS</span>

            <div>
              <Search size={18} />

              <input
                type="search"
                placeholder="Alias, reference, treatment..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>
          </label>

          <label>
            <span>STATUS</span>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
            >
              <option value="all">
                All statuses
              </option>

              <option value="requested">
                Requested
              </option>

              <option value="cancelled">
                Cancelled
              </option>
            </select>
          </label>

          <label>
            <span>SAMPLE SERVICE</span>

            <select
              value={serviceId}
              onChange={(event) =>
                setServiceId(event.target.value)
              }
            >
              <option value="all">
                All services
              </option>

              {SERVICES.map((service) => (
                <option
                  key={service.id}
                  value={service.id}
                >
                  {service.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>REQUESTED DATE</span>

            <input
              type="date"
              value={date}
              onChange={(event) =>
                setDate(event.target.value)
              }
            />
          </label>
        </div>

        <div className="ygs-results-line">
          <span>
            Showing {filtered.length} of{" "}
            {bookings.length} demo records
          </span>

          <button
            type="button"
            onClick={resetFilters}
          >
            Clear all filters
            <ArrowRight size={16} />
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="ygs-empty">
            <ClipboardList size={34} />

            <h3>No matching consultations.</h3>

            <p>
              Try another filter, or create a new
              fictional consultation request.
            </p>

            <button
              type="button"
              className="ygs-secondary-button"
              onClick={resetFilters}
            >
              Reset Filters
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="ygs-desk-list">
            {filtered.map((booking) => {
              const service = findService(
                booking.serviceId
              );

              const cancelled =
                booking.status === "cancelled";

              return (
                <article
                  className="ygs-desk-card"
                  key={booking.id}
                >
                  <div className="ygs-desk-top">
                    <span className="ygs-reference">
                      {booking.id}
                    </span>

                    <span
                      className={`ygs-status ${
                        cancelled
                          ? "is-cancelled"
                          : ""
                      }`}
                    >
                      {cancelled
                        ? "Cancelled"
                        : "Demo Requested"}
                    </span>
                  </div>

                  <div className="ygs-desk-body">
                    <span className="ygs-desk-icon">
                      <Sparkles size={23} />
                    </span>

                    <div className="ygs-desk-details">
                      <h3>
                        {service?.name ||
                          "Skin Consultation"}
                      </h3>

                      <strong>
                        Demo alias: {booking.alias}
                      </strong>

                      <div className="ygs-desk-meta">
                        <span>
                          <CalendarDays size={16} />
                          {formatDate(booking.date)}
                        </span>

                        <span>
                          <Clock3 size={16} />
                          {formatTime(booking.time)}
                        </span>

                        <span>
                          <ShieldCheck size={16} />
                          Browser-local demo
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ygs-desk-footer">
                    <span>
                      No actual appointment
                      confirmation or payment
                    </span>

                    {!cancelled && (
                      <button
                        type="button"
                        onClick={() =>
                          onCancelBooking(booking.id)
                        }
                      >
                        <Trash2 size={17} />
                        Cancel Demo Request
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <div className="ygs-information">
        <ShieldCheck size={22} />

        <div>
          <strong>
            Local demonstration, not a patient portal.
          </strong>

          <p>
            CSV exports contain fictional aliases
            and demo appointment selections. Do not
            use this page to manage real clients or
            sensitive medical information.
          </p>
        </div>
      </div>
    </div>
  );
}
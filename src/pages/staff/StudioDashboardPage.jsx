import { useMemo } from "react";

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
  Heart,
  Sparkles,
  XCircle,
} from "lucide-react";

import {
  SERVICES,
  formatDate,
  formatTime,
} from "../../data/studioData.js";

import {
  addDays,
  findService,
  getActiveBookings,
  getServiceDemand,
  shortDate,
  todayKey,
} from "../../utils/studioOps.js";

function Metric({
  icon: Icon,
  label,
  value,
  description,
  tone = "",
}) {
  return (
    <article className="ygs-metric">
      <div className="ygs-metric-top">
        <span className={`ygs-metric-icon ${tone}`}>
          <Icon size={22} strokeWidth={1.6} />
        </span>

        <small>/ YOUR GLOW</small>
      </div>

      <strong>{value}</strong>
      <h3>{label}</h3>
      <p>{description}</p>
    </article>
  );
}

export default function StudioDashboardPage() {
  const { bookings } = useOutletContext();

  const today = todayKey();

  const active = useMemo(
    () => getActiveBookings(bookings),
    [bookings]
  );

  const cancelled = bookings.filter(
    (item) => item.status === "cancelled"
  );

  const upcoming = useMemo(
    () =>
      active
        .filter((item) => item.date >= today)
        .sort((a, b) =>
          `${a.date} ${a.time}`.localeCompare(
            `${b.date} ${b.time}`
          )
        ),
    [active, today]
  );

  const chart = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = addDays(today, index);

        return {
          date,
          label: shortDate(date),
          count: active.filter(
            (item) => item.date === date
          ).length,
        };
      }),
    [active, today]
  );

  const services = useMemo(
    () => getServiceDemand(bookings),
    [bookings]
  );

  const todayCount = active.filter(
    (item) => item.date === today
  ).length;

  const weekEnd = addDays(today, 6);

  const weekCount = active.filter(
    (item) =>
      item.date >= today &&
      item.date <= weekEnd
  ).length;

  const largestBar = Math.max(
    1,
    ...chart.map((item) => item.count)
  );

  const largestService = Math.max(
    1,
    ...services.map((item) => item.active)
  );

  const dateLabel = new Date().toLocaleDateString(
    "en-PH",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div className="ygs-page">
      <div className="ygs-page-heading">
        <div>
          <span className="ygs-eyebrow">
            AESTHETIC STUDIO / OVERVIEW
          </span>

          <h1>
            A beautiful
            <br />
            <em>day in order.</em>
          </h1>

          <p>
            {dateLabel} — A thoughtful overview of
            this browser's fictional consultations.
          </p>
        </div>

        <Link
          to="/calendar"
          className="ygs-primary-button"
        >
          <CalendarDays size={18} />
          New Demo Consultation
          <ArrowUpRight size={17} />
        </Link>
      </div>

      <div className="ygs-metrics">
        <Metric
          icon={ClipboardList}
          label="Total Requests"
          value={bookings.length}
          description="Saved locally in this browser"
        />

        <Metric
          icon={CheckCircle2}
          label="Active Requests"
          value={active.length}
          description="Requested, not confirmed"
          tone="rose"
        />

        <Metric
          icon={Clock3}
          label="Next 7 Days"
          value={weekCount}
          description="Upcoming sample consultations"
          tone="olive"
        />

        <Metric
          icon={XCircle}
          label="Cancelled"
          value={cancelled.length}
          description="Retained as demo history"
          tone="clay"
        />
      </div>

      <div className="ygs-dashboard-grid">
        <section className="ygs-panel">
          <div className="ygs-panel-heading">
            <div>
              <span className="ygs-eyebrow">
                SEVEN-DAY LOOKAHEAD
              </span>

              <h2>
                Consultation <em>activity.</em>
              </h2>
            </div>

            <span className="ygs-panel-tag">
              NEXT 7 DAYS
            </span>
          </div>

          <div
            className="ygs-bar-chart"
            role="img"
            aria-label={
              "Active demo consultation requests: " +
              chart
                .map(
                  (item) =>
                    `${item.label}: ${item.count}`
                )
                .join("; ")
            }
          >
            {chart.map((item) => (
              <div
                className="ygs-bar-column"
                key={item.date}
              >
                <strong>{item.count}</strong>

                <div className="ygs-bar-track">
                  <span
                    style={{
                      height: `${
                        (item.count / largestBar) * 100
                      }%`,
                    }}
                  />
                </div>

                <small>{item.label}</small>
              </div>
            ))}
          </div>

          <p className="ygs-panel-footnote">
            Based on requested visit dates,
            not completed studio services.
          </p>
        </section>

        <section className="ygs-panel">
          <div className="ygs-panel-heading">
            <div>
              <span className="ygs-eyebrow">
                SERVICE INTEREST
              </span>

              <h2>
                Most explored <em>care.</em>
              </h2>
            </div>
          </div>

          <div className="ygs-demand-list">
            {services.slice(0, 4).map((item, index) => (
              <div
                className="ygs-demand-item"
                key={item.id}
              >
                <div className="ygs-demand-heading">
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.category}</small>
                  </div>

                  <b>{item.active}</b>
                </div>

                <div className="ygs-demand-track">
                  <span
                    style={{
                      width: `${
                        (item.active /
                          largestService) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/staff/services"
            className="ygs-panel-link"
          >
            View Service Catalog
            <ArrowRight size={18} />
          </Link>
        </section>
      </div>

      <section className="ygs-panel ygs-upcoming">
        <div className="ygs-panel-heading">
          <div>
            <span className="ygs-eyebrow">
              COMING UP
            </span>

            <h2>
              The next <em>consultations.</em>
            </h2>
          </div>

          <Link
            to="/staff/consultations"
            className="ygs-panel-link"
          >
            See All Requests
            <ArrowRight size={18} />
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="ygs-empty">
            <CalendarDays size={33} />

            <h3>
              Nothing scheduled in the demo.
            </h3>

            <p>
              Create a fictional consultation on
              the public calendar to populate
              this studio overview.
            </p>

            <Link
              className="ygs-secondary-button"
              to="/calendar"
            >
              Open Calendar
              <ArrowUpRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="ygs-upcoming-list">
            {upcoming.slice(0, 6).map((booking) => {
              const service = findService(
                booking.serviceId
              );

              return (
                <article
                  className="ygs-upcoming-row"
                  key={booking.id}
                >
                  <span className="ygs-upcoming-icon">
                    <Sparkles size={21} />
                  </span>

                  <div className="ygs-upcoming-description">
                    <strong>
                      {service?.name || "Consultation"}
                    </strong>

                    <small>
                      Demo alias: {booking.alias}
                    </small>
                  </div>

                  <div className="ygs-upcoming-date">
                    <strong>
                      {formatDate(booking.date)}
                    </strong>

                    <small>
                      {formatTime(booking.time)}
                    </small>
                  </div>

                  <span className="ygs-status">
                    Requested
                  </span>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <div className="ygs-information">
        <Heart size={22} />

        <div>
          <strong>
            Beautiful reporting, without invented results.
          </strong>

          <p>
            These figures show fictional requests
            created in this browser. They do not
            represent actual customers, sales,
            clinical procedures, or patient outcomes.
          </p>
        </div>
      </div>
    </div>
  );
}
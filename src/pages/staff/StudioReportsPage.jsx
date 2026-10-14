import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import {
  ArrowRight,
  CalendarDays,
  ChartColumn,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Download,
  Sparkles,
  XCircle,
} from "lucide-react";

import {
  formatDate,
  formatTime,
} from "../../data/studioData.js";

import {
  findService,
  downloadConsultationsCSV,
} from "../../utils/studioOps.js";

import {
  REPORT_PERIODS,
  filterPeriod,
  requestStats,
  dailyActivity,
  serviceInsights,
  percentage,
} from "../../utils/studioInsights.js";

function Metric({ icon: Icon, number, label, description }) {
  return (
    <article className="ygi-metric">
      <span className="ygi-metric-icon">
        <Icon size={23} strokeWidth={1.5} />
      </span>

      <strong>{number}</strong>
      <h3>{label}</h3>
      <p>{description}</p>
    </article>
  );
}

export default function StudioReportsPage() {
  const { bookings } = useOutletContext();

  const [period, setPeriod] = useState("all");

  const filtered = useMemo(
    () => filterPeriod(bookings, period),
    [bookings, period]
  );

  const stats = useMemo(
    () => requestStats(filtered),
    [filtered]
  );

  const activity = useMemo(
    () => dailyActivity(filtered, period),
    [filtered, period]
  );

  const services = useMemo(
    () => serviceInsights(filtered),
    [filtered]
  );

  const largestDay = Math.max(
    1,
    ...activity.map((item) => item.count)
  );

  const largestService = Math.max(
    1,
    ...services.map((item) => item.total)
  );

  const activePercentage = percentage(
    stats.requested,
    stats.total
  );

  const latest = [...filtered]
    .sort((a, b) =>
      `${b.date} ${b.time}`.localeCompare(
        `${a.date} ${a.time}`
      )
    )
    .slice(0, 5);

  function downloadReport() {
    downloadConsultationsCSV(
      filtered,
      `your-glow-report-${period}.csv`
    );
  }

  const chartTitle =
    period === "past30"
      ? "Previous 14 days"
      : period === "next7"
        ? "Next 7 days"
        : "Next 14 days";

  return (
    <div className="ygs-page ygi-page">
      <div className="ygs-page-heading">
        <div>
          <span className="ygs-eyebrow">
            BUSINESS INTELLIGENCE / BATCH 04
          </span>

          <h1>
            A clearer
            <br />
            <em>studio perspective.</em>
          </h1>

          <p>
            Explore consultation patterns and
            sample service demand from this
            browser's fictional appointment history.
          </p>
        </div>

        <button
          type="button"
          className="ygs-primary-button"
          onClick={downloadReport}
        >
          <Download size={18} />
          Export Report CSV
        </button>
      </div>

      <div className="ygi-filter-bar">
        <label>
          <span>REPORTING PERIOD</span>

          <select
            value={period}
            onChange={(event) =>
              setPeriod(event.target.value)
            }
          >
            {REPORT_PERIODS.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <p>
          All reporting is grouped by requested
          consultation date, not payment or
          completed service date.
        </p>
      </div>

      <div className="ygi-metrics">
        <Metric
          icon={ClipboardList}
          number={stats.total}
          label="All Requests"
          description="Within the selected period"
        />

        <Metric
          icon={CheckCircle2}
          number={stats.requested}
          label="Active Requests"
          description="Pending fictional requests"
        />

        <Metric
          icon={CalendarDays}
          number={stats.upcoming}
          label="Upcoming"
          description="Active requests dated today or later"
        />

        <Metric
          icon={XCircle}
          number={stats.cancelled}
          label="Cancelled"
          description="Retained in demo history"
        />
      </div>

      <div className="ygi-two-columns">
        <section className="ygs-panel">
          <div className="ygs-panel-heading">
            <div>
              <span className="ygs-eyebrow">
                CONSULTATION ACTIVITY
              </span>

              <h2>
                A view of <em>the days.</em>
              </h2>
            </div>

            <span className="ygs-panel-tag">
              {chartTitle.toUpperCase()}
            </span>
          </div>

          <div
            className="ygi-chart"
            role="img"
            aria-label={activity
              .map(
                (item) =>
                  `${item.label}: ${item.count} requests`
              )
              .join("; ")}
          >
            {activity.map((item) => (
              <div
                className="ygi-chart-column"
                key={item.date}
                title={`${item.label}: ${item.count}`}
              >
                <strong>{item.count}</strong>

                <div className="ygi-chart-track">
                  <span
                    style={{
                      height: `${
                        (item.count / largestDay) * 100
                      }%`,
                    }}
                  />
                </div>

                <small>{item.label}</small>
              </div>
            ))}
          </div>

          <p className="ygs-panel-footnote">
            Bars represent active requests only.
            They do not represent consultations
            actually completed.
          </p>
        </section>

        <section className="ygs-panel">
          <div className="ygs-panel-heading">
            <div>
              <span className="ygs-eyebrow">
                REQUEST STATUS OVERVIEW
              </span>

              <h2>
                Booking <em>status.</em>
              </h2>
            </div>
          </div>

          <div className="ygi-status-overview">
            <strong>{activePercentage}%</strong>

            <p>
              of demo requests within this period
              currently have an active status.
            </p>
          </div>

          <div className="ygi-status-track">
            <span
              style={{
                width: `${activePercentage}%`,
              }}
            />
          </div>

          <div className="ygi-status-legend">
            <div>
              <CheckCircle2 size={18} />
              <span>Requested</span>
              <strong>{stats.requested}</strong>
            </div>

            <div>
              <XCircle size={18} />
              <span>Cancelled</span>
              <strong>{stats.cancelled}</strong>
            </div>
          </div>

          <div className="ygi-note-mini">
            <Clock3 size={19} />
            Active does not mean confirmed,
            paid or completed.
          </div>
        </section>
      </div>

      <section className="ygs-panel ygi-section">
        <div className="ygs-panel-heading">
          <div>
            <span className="ygs-eyebrow">
              MOST REQUESTED SERVICE TYPES
            </span>

            <h2>
              The treatment <em>edit.</em>
            </h2>
          </div>

          <Link
            to="/staff/insights"
            className="ygs-panel-link"
          >
            Explore Service Insights
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="ygi-demand-list">
          {services.slice(0, 6).map((item, index) => (
            <div
              className="ygi-demand-item"
              key={item.id}
            >
              <div className="ygi-demand-heading">
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <strong>{item.name}</strong>
                  <small>{item.category}</small>
                </div>

                <b>{item.total}</b>
              </div>

              <div className="ygi-demand-track">
                <span
                  style={{
                    width: `${
                      (item.total / largestService) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {stats.total === 0 && (
          <p className="ygi-empty-hint">
            No demo consultations match this period yet.
            Create a sample booking to populate the chart.
          </p>
        )}
      </section>

      <section className="ygs-panel ygi-section">
        <div className="ygs-panel-heading">
          <div>
            <span className="ygs-eyebrow">
              SAMPLE REQUEST HISTORY
            </span>

            <h2>
              Recent <em>date selections.</em>
            </h2>
          </div>

          <Link
            to="/staff/consultations"
            className="ygs-panel-link"
          >
            Consultation Desk
            <ArrowRight size={18} />
          </Link>
        </div>

        {latest.length === 0 ? (
          <div className="ygs-empty">
            <CalendarDays size={32} />
            <h3>No records in this period.</h3>
            <p>
              Change the filter or make a fictional
              consultation request.
            </p>
          </div>
        ) : (
          <div className="ygi-record-list">
            {latest.map((booking) => (
              <article
                className="ygi-record"
                key={booking.id}
              >
                <span className="ygi-record-icon">
                  <Sparkles size={20} />
                </span>

                <div>
                  <strong>
                    {findService(
                      booking.serviceId
                    )?.name || "Consultation"}
                  </strong>

                  <small>
                    {booking.alias} · {booking.status}
                  </small>
                </div>

                <div className="ygi-record-date">
                  <strong>
                    {formatDate(booking.date)}
                  </strong>

                  <small>
                    {formatTime(booking.time)}
                  </small>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="ygs-information">
        <ChartColumn size={23} />

        <div>
          <strong>
            Studio analytics without invented revenue.
          </strong>

          <p>
            All metrics come from fictional requests.
            They do not measure treatments performed,
            real customer conversion, income or
            patient outcomes.
          </p>
        </div>
      </div>
    </div>
  );
}
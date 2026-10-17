import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Download,
  FileText,
  ShieldCheck,
  TrendingUp,
  XCircle,
} from "lucide-react";

import {
  formatDate,
  formatTime,
} from "../../data/studioData.js";

import {
  downloadConsultationsCSV,
  findService,
} from "../../utils/studioOps.js";

import {
  REPORT_PERIODS,
  filterPeriod,
  requestStats,
  dailyActivity,
  serviceInsights,
  percentage,
} from "../../utils/studioInsights.js";

import "../../styles/glow-batch6-final.css";

export default function StudioReportsPage() {
  const { bookings = [] } = useOutletContext();
  const [period, setPeriod] = useState("all");

  const scoped = useMemo(
    () => filterPeriod(bookings, period),
    [bookings, period]
  );

  const stats = useMemo(
    () => requestStats(scoped),
    [scoped]
  );

  const activity = useMemo(
    () => dailyActivity(scoped, period),
    [scoped, period]
  );

  const services = useMemo(
    () => serviceInsights(scoped),
    [scoped]
  );

  const topServices = services
    .filter((item) => item.total > 0)
    .slice(0, 4);

  const recent = useMemo(
    () =>
      [...scoped]
        .sort((a, b) =>
          `${b.date} ${b.time}`.localeCompare(
            `${a.date} ${a.time}`
          )
        )
        .slice(0, 5),
    [scoped]
  );

  const peak = Math.max(
    1,
    ...activity.map((item) => item.count)
  );

  const top = Math.max(
    1,
    ...topServices.map((item) => item.total)
  );

  const requestedRate = percentage(
    stats.requested,
    stats.total
  );

  const chartLabel =
    period === "past30"
      ? "LAST 14 DAYS"
      : period === "next7"
        ? "NEXT 7 DAYS"
        : "NEXT 14 DAYS";

  return (
    <main className="g6 g6-reports">
      <header className="g6-hero">
        <div>
          <span className="g6-kicker">
            STUDIO INTELLIGENCE / 01 — REPORTS
          </span>

          <h1>
            The bigger <em>picture.</em>
          </h1>

          <p>
            Explore fictional consultation requests
            as clear, thoughtful activity—not
            revenue, confirmed visits, or
            clinical outcomes.
          </p>

          <div className="g6-hero-actions">
            <button
              type="button"
              onClick={() =>
                downloadConsultationsCSV(
                  scoped,
                  `your-glow-report-${period}.csv`
                )
              }
              disabled={!scoped.length}
            >
              <Download size={17} />
              EXPORT FILTERED CSV
            </button>

            <Link to="/staff/insights">
              SERVICE INSIGHTS
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>

        <div
          className="g6-hero-art"
          aria-hidden="true"
        >
          <span>R</span>
          <small>FIELD REPORT / 006</small>
        </div>
      </header>

      <div className="g6-toolbar">
        <label>
          REPORTING WINDOW

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
          <CalendarDays size={17} />
          Filters use the requested visit date,
          not when a form was submitted.
        </p>
      </div>

      <div className="g6-kpis">
        {[
          [
            "ALL ENTRIES",
            stats.total,
            FileText,
            "Within selected dates",
          ],
          [
            "REQUESTED",
            stats.requested,
            CheckCircle2,
            "Unconfirmed demo requests",
          ],
          [
            "UPCOMING",
            stats.upcoming,
            CalendarDays,
            "Requested for today or later",
          ],
          [
            "CANCELLED",
            stats.cancelled,
            XCircle,
            "Historical demo entries",
          ],
        ].map(([label, number, Icon, note], index) => (
          <article
            key={label}
            className={
              index === 1 ? "g6-kpi-feature" : ""
            }
          >
            <div>
              <span>{label}</span>
              <Icon size={20} />
            </div>

            <strong>
              {String(number).padStart(2, "0")}
            </strong>

            <p>{note}</p>
          </article>
        ))}
      </div>

      <div className="g6-columns">
        <section className="g6-panel">
          <div className="g6-panel-head">
            <div>
              <span className="g6-kicker">
                02 / THE REQUEST PULSE
              </span>

              <h2>
                Moments <em>over time.</em>
              </h2>
            </div>

            <span className="g6-tag">
              {chartLabel}
            </span>
          </div>

          <div
            className="g6-chart"
            role="img"
            aria-label={activity
              .map(
                (item) =>
                  `${item.label}: ${item.count} active demo requests`
              )
              .join("; ")}
          >
            {activity.map((item) => (
              <div
                className="g6-chart-col"
                key={item.date}
              >
                <b>{item.count}</b>

                <div className="g6-chart-track">
                  <i
                    style={{
                      height: `${
                        item.count
                          ? Math.max(
                              5,
                              (item.count / peak) * 100
                            )
                          : 2
                      }%`,
                    }}
                  />
                </div>

                <small>{item.label}</small>
              </div>
            ))}
          </div>

          <p className="g6-caption">
            This chart counts requested demo
            slots on each date. A zero bar means
            no matching requests.
          </p>
        </section>

        <section className="g6-panel">
          <div className="g6-panel-head">
            <div>
              <span className="g6-kicker">
                03 / REQUEST DISTRIBUTION
              </span>

              <h2>
                A little <em>perspective.</em>
              </h2>
            </div>

            <TrendingUp size={25} />
          </div>

          <div className="g6-rate">
            <strong>{requestedRate}%</strong>

            <span>
              OF MATCHING ENTRIES ARE
              CURRENTLY REQUESTED
            </span>
          </div>

          <div
            className="g6-progress"
            aria-label={`${requestedRate}% requested`}
          >
            <span
              style={{
                width: `${requestedRate}%`,
              }}
            />
          </div>

          <div className="g6-status-legend">
            <span>
              <i />
              REQUESTED: {stats.requested}
            </span>

            <span>
              <i />
              CANCELLED: {stats.cancelled}
            </span>
          </div>

          <p className="g6-caption">
            Status distribution is calculated
            from locally saved requests. It
            does not measure attendance,
            conversion or financial performance.
          </p>
        </section>
      </div>

      <div className="g6-columns">
        <section className="g6-panel">
          <div className="g6-panel-head">
            <div>
              <span className="g6-kicker">
                04 / MOST-EXPLORED SERVICES
              </span>

              <h2>
                The care <em>edit.</em>
              </h2>
            </div>
          </div>

          {topServices.length ? (
            <div className="g6-ranking">
              {topServices.map((item, i) => (
                <div key={item.id}>
                  <span>0{i + 1}</span>

                  <div>
                    <strong>
                      {item.name}
                    </strong>

                    <div className="g6-progress">
                      <span
                        style={{
                          width: `${
                            (item.total / top) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <b>{item.total}</b>
                </div>
              ))}
            </div>
          ) : (
            <div className="g6-empty">
              <FileText size={27} />

              <p>
                No demo request data in
                this reporting window.
              </p>
            </div>
          )}

          <Link
            className="g6-bottom-link"
            to="/staff/insights"
          >
            EXPLORE ALL SIX SERVICES
            <ArrowRight size={17} />
          </Link>
        </section>

        <section className="g6-panel">
          <div className="g6-panel-head">
            <div>
              <span className="g6-kicker">
                05 / REQUEST JOURNAL
              </span>

              <h2>
                Recent <em>entries.</em>
              </h2>
            </div>
          </div>

          {recent.length ? (
            <div className="g6-recent">
              {recent.map((item) => (
                <article key={item.id}>
                  <span className="g6-recent-date">
                    {formatDate(item.date)}

                    <small>
                      {formatTime(item.time)}
                    </small>
                  </span>

                  <div>
                    <strong>
                      {findService(item.serviceId)
                        ?.name || "Sample service"}
                    </strong>

                    <small>{item.id}</small>
                  </div>

                  <span
                    className={
                      item.status === "requested"
                        ? "g6-status-active"
                        : "g6-status-cancelled"
                    }
                  >
                    {item.status.toUpperCase()}
                  </span>
                </article>
              ))}
            </div>
          ) : (
            <div className="g6-empty">
              <CalendarDays size={27} />
              <p>No entries found.</p>
            </div>
          )}

          <Link
            className="g6-bottom-link"
            to="/staff/consultations"
          >
            OPEN CONSULTATION DESK
            <ArrowRight size={17} />
          </Link>
        </section>
      </div>

      <p className="g6-notice">
        <ShieldCheck size={18} />
        Fictional, browser-local reporting.
        No real clinic activity, verified
        availability, patient data or payment
        metrics.
      </p>
    </main>
  );
}
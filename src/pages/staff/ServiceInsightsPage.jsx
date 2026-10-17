import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  ChartNoAxesColumn,
  Clock3,
  Layers3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  CATEGORIES,
  formatPeso,
} from "../../data/studioData.js";

import {
  REPORT_PERIODS,
  filterPeriod,
  serviceInsights,
  categoryInsights,
  percentage,
} from "../../utils/studioInsights.js";

import "../../styles/glow-batch6-final.css";

const STATUS = [
  {
    id: "requested",
    label: "Requested only",
  },
  {
    id: "all",
    label: "All statuses",
  },
  {
    id: "cancelled",
    label: "Cancelled only",
  },
];

export default function ServiceInsightsPage() {
  const { bookings = [] } = useOutletContext();

  const [period, setPeriod] = useState("all");
  const [status, setStatus] = useState("requested");
  const [category, setCategory] = useState("All");

  const scoped = useMemo(() => {
    const dates = filterPeriod(bookings, period);

    return status === "all"
      ? dates
      : dates.filter(
          (item) => item.status === status
        );
  }, [bookings, period, status]);

  const services = useMemo(
    () =>
      serviceInsights(scoped).filter(
        (item) =>
          category === "All" ||
          item.category === category
      ),
    [scoped, category]
  );

  const categories = useMemo(
    () => categoryInsights(scoped),
    [scoped]
  );

  const total = services.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const leading = services.find(
    (item) => item.total > 0
  );

  const peak = Math.max(
    1,
    ...services.map((item) => item.total)
  );

  const used = services.filter(
    (item) => item.total > 0
  ).length;

  return (
    <main className="g6 g6-insights">
      <header className="g6-hero g6-hero--soft">
        <div>
          <span className="g6-kicker">
            STUDIO INTELLIGENCE / 02 — CARE INTEREST
          </span>

          <h1>
            Six stories. <em>Many beginnings.</em>
          </h1>

          <p>
            Understand which fictional treatment
            topics are selected most often.
            These are booking interests, not
            treatment success or patient outcomes.
          </p>

          <div className="g6-hero-actions">
            <Link to="/staff/reports">
              FULL REPORTS
              <ArrowUpRight size={17} />
            </Link>

            <Link to="/staff/services">
              SERVICE CATALOG
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        <div
          className="g6-hero-art"
          aria-hidden="true"
        >
          <span>06</span>
          <small>THE SERVICE STUDIES</small>
        </div>
      </header>

      <div className="g6-toolbar g6-toolbar--triple">
        <label>
          APPOINTMENT WINDOW

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

        <label>
          REQUEST STATUS

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            {STATUS.map((item) => (
              <option
                value={item.id}
                key={item.id}
              >
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          SERVICE CATEGORY

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >
            {CATEGORIES.map((item) => (
              <option key={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="g6-insight-feature">
        <div className="g6-insight-lead">
          <span className="g6-kicker">
            01 / MOST-SELECTED TOPIC
          </span>

          <Sparkles size={29} />

          <h2>
            {leading?.name ||
              "The next conversation"}
            <em>.</em>
          </h2>

          <p>
            {leading
              ? `${leading.total} matching fictional request${
                  leading.total === 1 ? "" : "s"
                } in the current view.`
              : "No matching sample requests yet. Try another time window, status or category."}
          </p>

          <Link
            to={
              leading
                ? `/treatments/${leading.id}`
                : "/treatments"
            }
          >
            VIEW PUBLIC JOURNAL
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="g6-insight-numbers">
          <span>
            THE SELECTED VIEW
          </span>

          <strong>
            {String(total).padStart(2, "0")}
          </strong>

          <p>
            matching request records
          </p>

          <div>
            <span>
              INTERESTED SERVICE TOPICS
            </span>

            <b>
              {used} / {services.length}
            </b>
          </div>

          <div>
            <span>
              AVAILABLE SERVICE CATEGORIES
            </span>

            <b>
              {
                categories.filter(
                  (item) => item.count > 0
                ).length
              }{" "}
              / {categories.length}
            </b>
          </div>
        </div>
      </div>

      <section className="g6-panel">
        <div className="g6-panel-head">
          <div>
            <span className="g6-kicker">
              02 / THE SIX-SERVICE INDEX
            </span>

            <h2>
              In the <em>details.</em>
            </h2>
          </div>

          <ChartNoAxesColumn size={27} />
        </div>

        <div className="g6-service-list">
          {services.map((item, index) => (
            <article key={item.id}>
              <div className="g6-service-photo">
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                />

                <span>0{index + 1}</span>
              </div>

              <div className="g6-service-details">
                <small>
                  {item.category.toUpperCase()}
                </small>

                <h3>{item.name}</h3>

                <p>
                  <Clock3 size={14} />
                  {item.duration} MIN · FROM{" "}
                  {formatPeso(item.price)}{" "}
                  (ILLUSTRATIVE)
                </p>

                <div className="g6-progress">
                  <span
                    style={{
                      width: `${
                        (item.total / peak) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="g6-service-volume">
                <strong>{item.total}</strong>

                <span>
                  {percentage(
                    item.total,
                    total
                  )}
                  % OF VIEW
                </span>

                <Link
                  to={`/treatments/${item.id}`}
                  aria-label={`Open ${item.name} journal`}
                >
                  <ArrowUpRight size={19} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p className="g6-caption">
          A service's count includes only
          records that match your current
          date and status filters.
          Displayed fees are portfolio
          examples, not booked revenue.
        </p>
      </section>

      <section className="g6-panel">
        <div className="g6-panel-head">
          <div>
            <span className="g6-kicker">
              03 / CATEGORIES
            </span>

            <h2>
              A wider <em>view.</em>
            </h2>
          </div>

          <Layers3 size={27} />
        </div>

        <div className="g6-category-grid">
          {categories.map((item, index) => (
            <article key={item.name}>
              <span>
                0{index + 1} / CATEGORY
              </span>

              <strong>
                {item.name}
              </strong>

              <div className="g6-progress">
                <span
                  style={{
                    width: `${
                      percentage(
                        item.count,
                        Math.max(
                          1,
                          scoped.length
                        )
                      )
                    }%`,
                  }}
                />
              </div>

              <small>
                {item.count} matching
                demo entries
              </small>
            </article>
          ))}
        </div>

        <p className="g6-caption">
          Categories above reflect your
          date and status filters. The
          category selector only filters
          the service list above.
        </p>
      </section>

      <p className="g6-notice">
        <ShieldCheck size={18} />
        This demo is not a skin analysis
        or medical analytics platform.
        No personal health information
        is processed.
      </p>
    </main>
  );
}
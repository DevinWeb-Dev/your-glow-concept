import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import {
  ArrowRight,
  ChartPie,
  Clock3,
  Filter,
  Heart,
  Layers,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  SERVICES,
  formatPeso,
} from "../../data/studioData.js";

import {
  REPORT_PERIODS,
  filterPeriod,
  serviceInsights,
  categoryInsights,
  percentage,
} from "../../utils/studioInsights.js";

const STATUS_OPTIONS = [
  { id: "requested", label: "Active Requests" },
  { id: "all", label: "All Requests" },
  { id: "cancelled", label: "Cancelled Requests" },
];

export default function ServiceInsightsPage() {
  const { bookings } = useOutletContext();

  const [period, setPeriod] = useState("all");
  const [status, setStatus] = useState("requested");

  const scoped = useMemo(() => {
    const periodData = filterPeriod(bookings, period);

    return status === "all"
      ? periodData
      : periodData.filter(
          (item) => item.status === status
        );
  }, [bookings, period, status]);

  const services = useMemo(
    () => serviceInsights(scoped),
    [scoped]
  );

  const categories = useMemo(
    () => categoryInsights(scoped),
    [scoped]
  );

  const leadingService =
    services.find((item) => item.total > 0);

  const highestService = Math.max(
    1,
    ...services.map((item) => item.total)
  );

  const highestCategory = Math.max(
    1,
    ...categories.map((item) => item.count)
  );

  const usedCategories = categories.filter(
    (item) => item.count > 0
  ).length;

  return (
    <div className="ygs-page ygi-page">
      <div className="ygs-page-heading">
        <div>
          <span className="ygs-eyebrow">
            STUDIO INTELLIGENCE / SERVICE INTEREST
          </span>

          <h1>
            Discover the
            <br />
            <em>treatment story.</em>
          </h1>

          <p>
            Explore how fictional visitors
            select services in the consultation
            scheduling experience.
          </p>
        </div>

        <Link
          to="/staff/reports"
          className="ygs-primary-button"
        >
          <ChartPie size={18} />
          View Full Reports
          <ArrowRight size={17} />
        </Link>
      </div>

      <div className="ygi-filter-bar">
        <label>
          <span>APPOINTMENT PERIOD</span>

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
          <span>REQUEST STATUS</span>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            {STATUS_OPTIONS.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <span className="ygi-filter-count">
          <Filter size={17} />

          {scoped.length} matching demo requests
        </span>
      </div>

      <div className="ygi-insights-hero">
        <div className="ygi-insights-feature">
          <span className="ygs-eyebrow">
            TOP SERVICE INTEREST
          </span>

          <Sparkles
            className="ygi-feature-sparkle"
            size={36}
            strokeWidth={1.2}
          />

          <h2>
            {leadingService
              ? leadingService.name
              : "Your story begins here"}
            <em>.</em>
          </h2>

          <p>
            {leadingService
              ? `${leadingService.total} matching demo consultation requests for this service.`
              : "Create a fictional consultation request to explore studio service trends."}
          </p>

          <div className="ygi-feature-foot">
            <Heart size={19} />

            Thoughtful data. No invented results.
          </div>
        </div>

        <div className="ygi-insights-summary">
          <article>
            <Layers size={23} />

            <strong>{SERVICES.length}</strong>

            <span>Sample service types</span>
          </article>

          <article>
            <ChartPie size={23} />

            <strong>{scoped.length}</strong>

            <span>Matching consultation requests</span>
          </article>

          <article>
            <Sparkles size={23} />

            <strong>{usedCategories}</strong>

            <span>Service categories requested</span>
          </article>
        </div>
      </div>

      <section className="ygs-panel ygi-section">
        <div className="ygs-panel-heading">
          <div>
            <span className="ygs-eyebrow">
              SERVICE COMPARISON
            </span>

            <h2>
              What visitors <em>explore.</em>
            </h2>
          </div>

          <span className="ygs-panel-tag">
            {scoped.length} REQUESTS
          </span>
        </div>

        <div className="ygi-service-grid">
          {services.map((service, index) => (
            <article
              className="ygi-service-card"
              key={service.id}
            >
              <div className="ygi-service-photo">
                <img
                  src={service.image}
                  alt={`Illustrative imagery for ${service.name}`}
                  loading="lazy"
                />

                <span>
                  RANK {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="ygi-service-body">
                <span className="ygs-eyebrow">
                  {service.category}
                </span>

                <h3>{service.name}</h3>

                <div className="ygi-service-count">
                  <strong>{service.total}</strong>
                  <span>
                    matching
                    <br />
                    demo requests
                  </span>
                </div>

                <div className="ygi-demand-track">
                  <span
                    style={{
                      width: `${
                        (service.total /
                          highestService) * 100
                      }%`,
                    }}
                  />
                </div>

                <div className="ygi-service-details">
                  <span>
                    <Clock3 size={15} />
                    {service.duration} min
                  </span>

                  <strong>
                    From {formatPeso(service.price)}*
                  </strong>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="ygs-panel-footnote">
          *Prices are illustrative only. No
          transactions or actual service delivery
          are tracked in this portfolio prototype.
        </p>
      </section>

      <section className="ygs-panel ygi-section">
        <div className="ygs-panel-heading">
          <div>
            <span className="ygs-eyebrow">
              DISTRIBUTION BY SERVICE CATEGORY
            </span>

            <h2>
              Different kinds of <em>interest.</em>
            </h2>
          </div>

          <ChartPie size={26} color="#B78B83" />
        </div>

        <div className="ygi-category-grid">
          {categories.map((category) => (
            <article
              key={category.name}
              className="ygi-category-card"
            >
              <div className="ygi-category-top">
                <div>
                  <strong>{category.name}</strong>

                  <small>
                    {percentage(
                      category.count,
                      scoped.length
                    )}% of matching requests
                  </small>
                </div>

                <span>{category.count}</span>
              </div>

              <div className="ygi-demand-track">
                <span
                  style={{
                    width: `${
                      (category.count /
                        highestCategory) * 100
                    }%`,
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="ygs-information">
        <ShieldCheck size={23} />

        <div>
          <strong>
            This is a service discovery report.
          </strong>

          <p>
            A requested consultation does not
            indicate a diagnosis, treatment
            recommendation, completed procedure,
            or satisfactory result.
          </p>
        </div>
      </div>
    </div>
  );
}
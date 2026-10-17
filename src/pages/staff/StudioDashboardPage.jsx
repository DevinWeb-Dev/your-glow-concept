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
  Layers3,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";

import {
  SERVICES,
  TIME_SLOTS,
  formatDate,
  formatTime,
} from "../../data/studioData.js";

import {
  addDays,
  getActiveBookings,
  getServiceDemand,
  todayKey,
} from "../../utils/studioOps.js";

import "../../styles/glow-batch4-botanical.css";

const findService = (id) =>
  SERVICES.find((item) => item.id === id)?.name ||
  "Sample consultation";

export default function StudioDashboardPage() {
  const { bookings = [] } = useOutletContext();

  const today = todayKey();

  const active = useMemo(
    () => getActiveBookings(bookings),
    [bookings]
  );

  const cancelled = bookings.filter(
    (item) => item.status === "cancelled"
  ).length;

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

  const demand = useMemo(
    () => getServiceDemand(bookings),
    [bookings]
  );

  const next7 = Array.from(
    { length: 7 },
    (_, index) => {
      const date = addDays(today, index);

      return {
        date,
        count: active.filter(
          (item) => item.date === date
        ).length,
      };
    }
  );

  const maxBar = Math.max(
    1,
    ...next7.map((day) => day.count)
  );

  const maxDemand = Math.max(
    1,
    ...demand.map((item) => item.active)
  );

  const weekCount = next7.reduce(
    (sum, day) => sum + day.count,
    0
  );

  const todayBookings = active.filter(
    (item) => item.date === today
  ).length;

  const nowLabel = new Date().toLocaleDateString(
    "en-PH",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div className="g4 g4-staff">
      <section className="g4-staff-hero">
        <div>
          <span className="g4-overline">
            <Sparkles size={15} />
            YOUR GLOW / STUDIO OPERATIONS
          </span>

          <h1>
            A clearer view of <em>the day.</em>
          </h1>

          <p>
            {nowLabel} · A private-to-this-browser
            perspective on fictional consultation requests.
          </p>

          <div className="g4-staff-actions">
            <Link to="/staff/consultations">
              OPEN CONSULTATION DESK
              <ArrowUpRight size={17} />
            </Link>

            <Link to="/calendar">
              PUBLIC DEMO CALENDAR
              <CalendarDays size={17} />
            </Link>
          </div>
        </div>

        <div
          className="g4-staff-hero-art"
          aria-hidden="true"
        >
          <span>YG.</span>
          <i>OPERATIONS / 004</i>
        </div>
      </section>

      <div className="g4-staff-metrics">
        {[
          {
            label: "TOTAL ENTRIES",
            number: bookings.length,
            icon: ClipboardList,
            note: "Browser-local records",
          },
          {
            label: "REQUESTED",
            number: active.length,
            icon: CheckCircle2,
            note: "Not confirmed",
          },
          {
            label: "NEXT 7 DAYS",
            number: weekCount,
            icon: Clock3,
            note: "Upcoming sample slots",
          },
          {
            label: "CANCELLED",
            number: cancelled,
            icon: XCircle,
            note: "Kept as demo history",
          },
        ].map((metric) => {
          const Icon = metric.icon;

          return (
            <article key={metric.label}>
              <div>
                <span>{metric.label}</span>
                <Icon size={22} />
              </div>

              <strong>
                {String(metric.number).padStart(2, "0")}
              </strong>

              <p>{metric.note}</p>
            </article>
          );
        })}
      </div>

      <div className="g4-staff-columns">
        <section className="g4-staff-panel">
          <header>
            <span className="g4-overline">
              01 / THE SEVEN DAY PULSE
            </span>

            <h2>
              The week <em>ahead.</em>
            </h2>
          </header>

          <div
            className="g4-staff-chart"
            role="img"
            aria-label={next7
              .map(
                (day) =>
                  `${formatDate(day.date)}: ${day.count} requests`
              )
              .join("; ")}
          >
            {next7.map((day) => (
              <div key={day.date}>
                <b>{day.count}</b>

                <span>
                  <i
                    style={{
                      height: `${
                        day.count
                          ? Math.max(
                              5,
                              (day.count / maxBar) * 100
                            )
                          : 2
                      }%`,
                    }}
                  />
                </span>

                <small>
                  {new Date(
                    `${day.date}T12:00:00`
                  ).toLocaleDateString("en-PH", {
                    weekday: "short",
                  })}
                </small>
              </div>
            ))}
          </div>

          <div className="g4-panel-foot">
            <span>
              TODAY / {todayBookings} SAMPLE REQUEST(S)
            </span>

            <Link to="/staff/schedule">
              SCHEDULE
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        <section className="g4-staff-panel">
          <header>
            <span className="g4-overline">
              02 / INTEREST IN SERVICE
            </span>

            <h2>
              The care <em>pulse.</em>
            </h2>
          </header>

          <div className="g4-staff-demand">
            {demand.map((item, index) => (
              <div key={item.id}>
                <span>0{index + 1}</span>

                <div>
                  <strong>{item.name}</strong>

                  <span>
                    <i
                      style={{
                        width: `${
                          (item.active / maxDemand) * 100
                        }%`,
                      }}
                    />
                  </span>
                </div>

                <b>{item.active}</b>
              </div>
            ))}
          </div>

          <div className="g4-panel-foot">
            <span>
              REQUESTS, NOT CLINICAL RESULTS
            </span>

            <Link to="/staff/insights">
              INSIGHTS
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>

      <div className="g4-staff-columns g4-staff-columns--bottom">
        <section className="g4-staff-panel">
          <header>
            <span className="g4-overline">
              03 / UPCOMING DEMO REQUESTS
            </span>

            <h2>
              Next in <em>the journal.</em>
            </h2>
          </header>

          <div className="g4-staff-upcoming">
            {upcoming.slice(0, 5).map((item) => (
              <article key={item.id}>
                <time>
                  {formatDate(item.date)}

                  <small>
                    {formatTime(item.time)}
                  </small>
                </time>

                <div>
                  <strong>
                    {findService(item.serviceId)}
                  </strong>

                  <small>
                    {item.alias} · {item.id}
                  </small>
                </div>

                <span>REQUESTED</span>
              </article>
            ))}

            {!upcoming.length && (
              <p>
                No upcoming demo consultations yet.
                Use the public calendar to create a
                fictional request.
              </p>
            )}
          </div>

          <Link
            to="/staff/consultations"
            className="g4-panel-link"
          >
            GO TO CONSULTATION DESK
            <ArrowUpRight size={17} />
          </Link>
        </section>

        <section className="g4-staff-panel g4-staff-notes">
          <header>
            <span className="g4-overline">
              04 / SYSTEM OF RECORD
            </span>

            <h2>
              Thoughtfully <em>contained.</em>
            </h2>
          </header>

          <div>
            <Layers3 size={22} />
            <strong>One shared time resource</strong>

            <p>
              Each sample time holds one active request,
              regardless of treatment interest.
            </p>
          </div>

          <div>
            <CalendarDays size={22} />

            <strong>
              Seven daily sample times
            </strong>

            <p>
              {TIME_SLOTS.length} available clock options
              on Monday–Saturday, up to 90 days ahead.
            </p>
          </div>

          <div>
            <ShieldCheck size={22} />

            <strong>
              Browser-only demonstration
            </strong>

            <p>
              No login, server database, payment processing,
              verified staff access or actual patient data.
            </p>
          </div>
        </section>
      </div>

      <p className="g4-staff-footnote">
        <ShieldCheck size={17} />
        STUDIO DEMO IS NOT AN AUTHENTICATED ADMIN PORTAL.
        USE FICTIONAL ALIASES ONLY.
      </p>
    </div>
  );
}
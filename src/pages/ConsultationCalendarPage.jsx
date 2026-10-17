import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  SERVICES,
  TIME_SLOTS,
  dateAfter,
  formatDate,
  formatPeso,
  formatTime,
  localDateKey,
} from "../data/studioData.js";

import "../styles/glow-batch4-botanical.css";

function initialDate() {
  const date = new Date(`${dateAfter(1)}T12:00:00`);

  while (date.getDay() === 0) {
    date.setDate(date.getDate() + 1);
  }

  return localDateKey(date);
}

function gridFor(year, month) {
  const leading = new Date(year, month, 1, 12).getDay();

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(
      year,
      month,
      index - leading + 1,
      12
    );

    return {
      key: localDateKey(date),
      number: date.getDate(),
      weekday: date.getDay(),
      inMonth: date.getMonth() === month,
    };
  });
}

export default function ConsultationCalendarPage({
  bookings = [],
  onCreateBooking,
}) {
  const [params] = useSearchParams();

  const requested = params.get("service");

  const [serviceId, setServiceId] = useState(
    SERVICES.some((item) => item.id === requested)
      ? requested
      : SERVICES[0].id
  );

  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState("");
  const [alias, setAlias] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(null);

  const [month, setMonth] = useState(() => {
    const current = new Date(
      `${initialDate()}T12:00:00`
    );

    return {
      year: current.getFullYear(),
      month: current.getMonth(),
    };
  });

  const min = dateAfter(1);
  const max = dateAfter(90);

  const minMonth =
    Number(min.slice(0, 4)) * 12 +
    Number(min.slice(5, 7)) -
    1;

  const maxMonth =
    Number(max.slice(0, 4)) * 12 +
    Number(max.slice(5, 7)) -
    1;

  const monthIndex = month.year * 12 + month.month;

  const days = useMemo(
    () => gridFor(month.year, month.month),
    [month.year, month.month]
  );

  const chosen =
    SERVICES.find((item) => item.id === serviceId) ||
    SERVICES[0];

  const occupied = useMemo(() => {
    const map = new Map();

    for (const item of bookings) {
      if (item.status !== "requested") continue;

      if (!map.has(item.date)) {
        map.set(item.date, new Set());
      }

      map.get(item.date).add(item.time);
    }

    return map;
  }, [bookings]);

  const taken = occupied.get(date) || new Set();

  const available = TIME_SLOTS.filter(
    (slot) => !taken.has(slot)
  );

  const monthLabel = new Date(
    month.year,
    month.month,
    1,
    12
  ).toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric",
  });

  function changeMonth(delta) {
    const next = new Date(
      month.year,
      month.month + delta,
      1,
      12
    );

    const index =
      next.getFullYear() * 12 + next.getMonth();

    if (index < minMonth || index > maxMonth) return;

    setMonth({
      year: next.getFullYear(),
      month: next.getMonth(),
    });
  }

  function submit(event) {
    event.preventDefault();

    setError("");
    setSaved(null);

    if (!time || taken.has(time)) {
      setError(
        "Choose a sample slot that isn't occupied."
      );
      return;
    }

    const result = onCreateBooking({
      alias,
      serviceId,
      date,
      time,
    });

    if (!result.ok) {
      setError(
        result.error || "Could not save the sample request."
      );
      return;
    }

    setSaved({
      id: result.id,
      date,
      time,
      serviceName: chosen.name,
    });

    setTime("");
    setAlias("");
  }

  return (
    <main className="g4 g4-calendar">
      <header className="g4-calendar-hero">
        <div className="g4-wrap">
          <span className="g4-overline">
            <CalendarDays size={17} />
            THE LIVING CALENDAR / 004
          </span>

          <h1>
            A MOMENT <em>in time.</em>
          </h1>

          <p>
            Choose a service interest, explore sample
            times and leave a fictional request in your
            browser. This does not show real clinic
            availability.
          </p>

          <Link className="g4-inline-link" to="/requests">
            YOUR DEMO REQUESTS
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <span
          className="g4-calendar-halo"
          aria-hidden="true"
        />
      </header>

      <div className="g4-wrap g4-calendar-layout">
        <div className="g4-calendar-main">
          <div className="g4-panel g4-calendar-card">
            <div className="g4-calendar-card-head">
              <div>
                <span className="g4-overline">
                  01 / SELECT A DAY
                </span>

                <h2>{monthLabel}</h2>
              </div>

              <div className="g4-calendar-arrows">
                <button
                  type="button"
                  aria-label="Previous month"
                  disabled={monthIndex <= minMonth}
                  onClick={() => changeMonth(-1)}
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  type="button"
                  aria-label="Next month"
                  disabled={monthIndex >= maxMonth}
                  onClick={() => changeMonth(1)}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="g4-weekdays">
              {[
                "SUN",
                "MON",
                "TUE",
                "WED",
                "THU",
                "FRI",
                "SAT",
              ].map((name) => (
                <span key={name}>{name}</span>
              ))}
            </div>

            <div
              className="g4-days"
              role="group"
              aria-label="Select a sample consultation day"
            >
              {days.map((day) => {
                const full =
                  (occupied.get(day.key)?.size || 0) >=
                  TIME_SLOTS.length;

                const valid =
                  day.inMonth &&
                  day.key >= min &&
                  day.key <= max &&
                  day.weekday !== 0 &&
                  !full;

                return (
                  <button
                    type="button"
                    key={day.key}
                    disabled={!valid}
                    aria-pressed={date === day.key}
                    aria-label={`${formatDate(day.key)}${
                      full
                        ? ", all sample times occupied"
                        : ""
                    }`}
                    className={[
                      day.inMonth ? "" : "is-outside",
                      date === day.key ? "is-active" : "",
                    ].join(" ")}
                    onClick={() => {
                      setDate(day.key);
                      setTime("");
                      setError("");
                      setSaved(null);
                    }}
                  >
                    <strong>{day.number}</strong>

                    {valid && (
                      <i aria-hidden="true" />
                    )}

                    {full &&
                      day.inMonth &&
                      day.key >= min &&
                      day.key <= max && (
                        <small>FULL</small>
                      )}
                  </button>
                );
              })}
            </div>

            <div className="g4-calendar-legend">
              <span>
                <i />
                SELECTABLE DAY
              </span>

              <span>
                <i />
                SELECTED DAY
              </span>

              <span>
                MON–SAT / NEXT 90 DAYS
              </span>
            </div>
          </div>

          <section className="g4-panel g4-slots">
            <div className="g4-calendar-card-head">
              <div>
                <span className="g4-overline">
                  02 / CHOOSE A MOMENT
                </span>

                <h2>{formatDate(date)}</h2>
              </div>

              <span className="g4-slots-count">
                {available.length} / {TIME_SLOTS.length} OPEN
              </span>
            </div>

            <div className="g4-time-grid">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  disabled={taken.has(slot)}
                  aria-pressed={time === slot}
                  className={
                    time === slot ? "is-selected" : ""
                  }
                  onClick={() => {
                    setTime(slot);
                    setError("");
                    setSaved(null);
                  }}
                >
                  <Clock3 size={16} />
                  {formatTime(slot)}

                  <small>
                    {taken.has(slot) ? "TAKEN" : "SELECT"}
                  </small>
                </button>
              ))}
            </div>

            <p className="g4-fine">
              <ShieldCheck size={16} />
              A single shared demo schedule is used
              across all service interests. Occupied slots
              are local to this browser.
            </p>
          </section>
        </div>

        <aside className="g4-panel g4-calendar-sidebar">
          <span className="g4-overline">
            03 / YOUR VISIT FOLIO
          </span>

          <div className="g4-sidebar-photo">
            <img
              src={chosen.image}
              alt={`Illustrative photograph for ${chosen.name}`}
            />
          </div>

          <h2>
            Choose your <em>chapter.</em>
          </h2>

          <form onSubmit={submit}>
            <label
              className="g4-field"
              htmlFor="g4-cal-service"
            >
              <span>SAMPLE SERVICE</span>

              <select
                id="g4-cal-service"
                value={serviceId}
                onChange={(event) => {
                  setServiceId(event.target.value);
                  setSaved(null);
                  setError("");
                }}
              >
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

            <div className="g4-preview-line">
              <span>DAY</span>
              <strong>{formatDate(date)}</strong>
            </div>

            <div className="g4-preview-line">
              <span>TIME</span>
              <strong>
                {time ? formatTime(time) : "Not selected"}
              </strong>
            </div>

            <div className="g4-preview-line">
              <span>ILLUSTRATIVE FEE</span>
              <strong>{formatPeso(chosen.price)}</strong>
            </div>

            <label
              className="g4-field"
              htmlFor="g4-cal-alias"
            >
              <span>FICTIONAL VISITOR ALIAS</span>

              <input
                id="g4-cal-alias"
                type="text"
                minLength={2}
                maxLength={50}
                required
                placeholder="Sample Visitor"
                value={alias}
                onChange={(event) => {
                  setAlias(event.target.value);
                  setError("");
                }}
              />
            </label>

            {error && (
              <p className="g4-alert" role="alert">
                {error}
              </p>
            )}

            <button
              className="g4-cta"
              type="submit"
              disabled={!time || taken.has(time)}
            >
              SAVE DEMO REQUEST

              <span>
                <ArrowUpRight size={18} />
              </span>
            </button>
          </form>

          <p className="g4-fine">
            <ShieldCheck size={16} />
            No real booking, medical details or payment
            is collected.
          </p>
        </aside>
      </div>

      {saved && (
        <div
          className="g4-wrap g4-success"
          role="status"
        >
          <CheckCircle2 size={30} />

          <div>
            <span className="g4-overline">
              SAVED TO THIS BROWSER
            </span>

            <h2>
              Moment <em>selected.</em>
            </h2>

            <p>
              {saved.serviceName} ·{" "}
              {formatDate(saved.date)} ·{" "}
              {formatTime(saved.time)} · Ref:{" "}
              <strong>{saved.id}</strong>
            </p>

            <p>No real clinic confirmation was issued.</p>
          </div>

          <Link to="/requests">
            MANAGE REQUEST
            <ArrowRight size={17} />
          </Link>
        </div>
      )}

      <div className="g4-calendar-end g4-wrap">
        <Sparkles size={28} />

        <p>
          The real next step would always be a conversation
          with a qualified provider. Explore, ask questions,
          and proceed only after appropriate assessment.
        </p>

        <Link to="/treatments">
          CARE ATLAS
          <ArrowUpRight size={17} />
        </Link>
      </div>
    </main>
  );
}
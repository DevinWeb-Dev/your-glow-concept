import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Leaf,
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
} from "../data/studioData.js";

import "../styles/glow-batch4-botanical.css";

function firstDate() {
  const day = new Date(`${dateAfter(1)}T12:00:00`);

  while (day.getDay() === 0) {
    day.setDate(day.getDate() + 1);
  }

  return [
    day.getFullYear(),
    String(day.getMonth() + 1).padStart(2, "0"),
    String(day.getDate()).padStart(2, "0"),
  ].join("-");
}

export default function GlowConsultationAtelier({
  bookings = [],
  onCreateBooking,
}) {
  const [params] = useSearchParams();

  const initialService = params.get("service");

  const [serviceId, setServiceId] = useState(
    SERVICES.some((item) => item.id === initialService)
      ? initialService
      : SERVICES[0].id
  );

  const [date, setDate] = useState(firstDate);
  const [time, setTime] = useState("");
  const [alias, setAlias] = useState("");
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  const service =
    SERVICES.find((item) => item.id === serviceId) ||
    SERVICES[0];

  const isSunday =
    new Date(`${date}T12:00:00`).getDay() === 0;

  const occupied = useMemo(
    () =>
      new Set(
        bookings
          .filter(
            (entry) =>
              entry.status === "requested" &&
              entry.date === date
          )
          .map((entry) => entry.time)
      ),
    [bookings, date]
  );

  const availableCount = TIME_SLOTS.filter(
    (slot) => !occupied.has(slot)
  ).length;

  function clearMessages() {
    setError("");
    setConfirmation(null);
  }

  function submit(event) {
    event.preventDefault();
    clearMessages();

    if (isSunday || !time || occupied.has(time)) {
      setError(
        "Choose an available Monday–Saturday sample time."
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
        result.error || "Unable to save the demo request."
      );
      return;
    }

    setConfirmation({
      id: result.id,
      name: service.name,
      date,
      time,
    });

    setAlias("");
    setTime("");
  }

  return (
    <main className="g4 g4-booking">
      <section className="g4-hero g4-hero--booking">
        <div className="g4-hero-copy">
          <span className="g4-overline">
            <Leaf size={16} />
            CHAPTER 04 / CONSULTATION ATELIER
          </span>

          <h1>
            MAKE ROOM <em>for you.</em>
          </h1>

          <p>
            A beautifully considered starting point.
            Select a fictional service, explore sample
            time slots and save an appointment request
            only in this browser.
          </p>

          <div className="g4-hero-inline">
            <span>01 / CHOOSE A TOPIC</span>
            <span>02 / CHOOSE A MOMENT</span>
            <span>03 / SAVE A DEMO</span>
          </div>
        </div>

        <div className="g4-hero-art" aria-hidden="true">
          <span className="g4-hero-arc" />

          <div className="g4-hero-orb">
            <Sparkles size={86} strokeWidth={0.7} />
          </div>

          <span className="g4-art-note">
            SKIN CULTURE · TIME WELL CONSIDERED
          </span>
        </div>
      </section>

      <div className="g4-wrap g4-booking-layout">
        <form
          className="g4-panel g4-booking-form"
          onSubmit={submit}
        >
          <div className="g4-section-heading">
            <span className="g4-overline">
              THE CONSULTATION EDIT / 001
            </span>

            <h2>
              Begin with <em>curiosity.</em>
            </h2>

            <p>
              This form does not request medical history,
              contact details or skin photos.
            </p>
          </div>

          <div className="g4-field">
            <label htmlFor="g4-service">
              01 / SERVICE INTEREST
            </label>

            <select
              id="g4-service"
              value={serviceId}
              onChange={(event) => {
                setServiceId(event.target.value);
                clearMessages();
              }}
            >
              {SERVICES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="g4-field-row">
            <div className="g4-field">
              <label htmlFor="g4-date">
                02 / DEMO DATE
              </label>

              <input
                id="g4-date"
                type="date"
                required
                min={dateAfter(1)}
                max={dateAfter(90)}
                value={date}
                onChange={(event) => {
                  setDate(event.target.value);
                  setTime("");
                  clearMessages();
                }}
              />
            </div>

            <div className="g4-field">
              <label htmlFor="g4-alias">
                03 / FICTIONAL ALIAS
              </label>

              <input
                id="g4-alias"
                type="text"
                required
                minLength={2}
                maxLength={50}
                placeholder="Sample Visitor"
                value={alias}
                onChange={(event) => {
                  setAlias(event.target.value);
                  clearMessages();
                }}
              />
            </div>
          </div>

          {isSunday && (
            <p className="g4-alert" role="alert">
              Sundays are unavailable in the demo.
              Choose Monday–Saturday.
            </p>
          )}

          <div className="g4-times-head">
            <span className="g4-overline">
              04 / ILLUSTRATIVE TIMES
            </span>

            <span>
              {isSunday ? 0 : availableCount} /{" "}
              {TIME_SLOTS.length} OPEN IN THIS BROWSER
            </span>
          </div>

          <div
            className="g4-time-grid"
            role="group"
            aria-label="Choose a sample consultation time"
          >
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                disabled={isSunday || occupied.has(slot)}
                aria-pressed={time === slot}
                className={
                  time === slot ? "is-selected" : ""
                }
                onClick={() => {
                  setTime(slot);
                  clearMessages();
                }}
              >
                <Clock3 size={16} />
                {formatTime(slot)}

                <small>
                  {occupied.has(slot) ? "TAKEN" : "SELECT"}
                </small>
              </button>
            ))}
          </div>

          {error && (
            <p role="alert" className="g4-alert">
              {error}
            </p>
          )}

          <button
            className="g4-cta"
            type="submit"
            disabled={
              isSunday || !time || occupied.has(time)
            }
          >
            SAVE DEMO REQUEST

            <span>
              <ArrowUpRight size={20} />
            </span>
          </button>

          <p className="g4-fine">
            <ShieldCheck size={16} />
            A sample request is not a confirmed appointment.
            One shared consultation slot is used across all
            sample services.
          </p>
        </form>

        <aside className="g4-booking-side">
          <div className="g4-booking-photo">
            <img
              src={service.image}
              alt={`Illustrative visual for ${service.name}`}
            />

            <span>
              THE SELECTED CARE STUDY / {service.number}
            </span>
          </div>

          <div className="g4-panel g4-preview">
            <span className="g4-overline">
              THE MOMENT / PREVIEW
            </span>

            <h2>
              Your care <em>folio.</em>
            </h2>

            <div className="g4-preview-line">
              <span>SERVICE</span>
              <strong>{service.name}</strong>
            </div>

            <div className="g4-preview-line">
              <span>DATE</span>
              <strong>{formatDate(date)}</strong>
            </div>

            <div className="g4-preview-line">
              <span>TIME</span>
              <strong>
                {time ? formatTime(time) : "Choose a time"}
              </strong>
            </div>

            <div className="g4-preview-line">
              <span>ILLUSTRATIVE FEE FROM</span>
              <strong>{formatPeso(service.price)}</strong>
            </div>

            <Link
              to={`/calendar?service=${encodeURIComponent(
                serviceId
              )}`}
              className="g4-inline-link"
            >
              <CalendarDays size={17} />
              SEE THE FULL CALENDAR
              <ArrowRight size={16} />
            </Link>
          </div>
        </aside>
      </div>

      {confirmation && (
        <section
          className="g4-success g4-wrap"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 size={30} />

          <div>
            <span className="g4-overline">
              YOUR BROWSER-LOCAL REQUEST WAS SAVED
            </span>

            <h2>
              One small <em>step forward.</em>
            </h2>

            <p>
              {confirmation.name} ·{" "}
              {formatDate(confirmation.date)} ·{" "}
              {formatTime(confirmation.time)} · Reference{" "}
              <strong>{confirmation.id}</strong>
            </p>

            <p>
              This is not a real booking or a clinic
              confirmation.
            </p>
          </div>

          <Link to="/requests">
            VIEW DEMO REQUESTS
            <ArrowUpRight size={17} />
          </Link>
        </section>
      )}

      <div className="g4-booking-foot g4-wrap">
        <span>
          <ShieldCheck size={17} />
          FICTIONAL DEMO DATA ONLY
        </span>

        <Link to="/requests">
          VIEW & MANAGE REQUESTS
          <ArrowUpRight size={17} />
        </Link>
      </div>
    </main>
  );
}
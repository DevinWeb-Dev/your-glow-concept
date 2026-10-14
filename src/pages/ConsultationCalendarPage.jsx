import { useEffect, useMemo, useState } from "react";
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

import "../styles/experience.css";

function getInitialDate() {
  const date = new Date(`${dateAfter(1)}T12:00:00`);

  if (date.getDay() === 0) {
    date.setDate(date.getDate() + 1);
  }

  return localDateKey(date);
}

function buildMonth(year, month) {
  const firstDay = new Date(year, month, 1, 12);
  const offset = firstDay.getDay();

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(
      year,
      month,
      index - offset + 1,
      12
    );

    return {
      key: localDateKey(date),
      day: date.getDate(),
      weekday: date.getDay(),
      currentMonth: date.getMonth() === month,
    };
  });
}

export default function ConsultationCalendarPage({
  bookings,
  onCreateBooking,
}) {
  const [params] = useSearchParams();
  const requestedService = params.get("service");

  const [serviceId, setServiceId] = useState(() => {
    return SERVICES.some(
      (item) => item.id === requestedService
    )
      ? requestedService
      : SERVICES[0].id;
  });

  const [selectedDate, setSelectedDate] = useState(
    getInitialDate
  );

  const [selectedTime, setSelectedTime] = useState("");
  const [alias, setAlias] = useState("");
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  const [visibleMonth, setVisibleMonth] = useState(() => {
    const date = new Date(
      `${getInitialDate()}T12:00:00`
    );

    return {
      year: date.getFullYear(),
      month: date.getMonth(),
    };
  });

  useEffect(() => {
    if (
      requestedService &&
      SERVICES.some(
        (item) => item.id === requestedService
      )
    ) {
      setServiceId(requestedService);
    }
  }, [requestedService]);

  const minDate = dateAfter(1);
  const maxDate = dateAfter(90);

  const minDateObject = new Date(
    `${minDate}T12:00:00`
  );

  const maxDateObject = new Date(
    `${maxDate}T12:00:00`
  );

  const minMonth =
    minDateObject.getFullYear() * 12 +
    minDateObject.getMonth();

  const maxMonth =
    maxDateObject.getFullYear() * 12 +
    maxDateObject.getMonth();

  const displayedMonth =
    visibleMonth.year * 12 +
    visibleMonth.month;

  const calendarDays = useMemo(
    () =>
      buildMonth(
        visibleMonth.year,
        visibleMonth.month
      ),
    [visibleMonth.year, visibleMonth.month]
  );

  const service = SERVICES.find(
    (item) => item.id === serviceId
  );

  const occupiedTimes = useMemo(
    () =>
      bookings
        .filter(
          (item) =>
            item.date === selectedDate &&
            item.status === "requested"
        )
        .map((item) => item.time),
    [bookings, selectedDate]
  );

  const occupiedByDate = useMemo(() => {
    const result = new Map();

    bookings.forEach((item) => {
      if (item.status !== "requested") return;

      if (!result.has(item.date)) {
        result.set(item.date, new Set());
      }

      result.get(item.date).add(item.time);
    });

    return result;
  }, [bookings]);

  const monthTitle = new Date(
    visibleMonth.year,
    visibleMonth.month,
    1
  ).toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric",
  });

  const availableTimes = TIME_SLOTS.filter(
    (time) => !occupiedTimes.includes(time)
  );

  function changeMonth(offset) {
    const next = new Date(
      visibleMonth.year,
      visibleMonth.month + offset,
      1
    );

    const nextMonth =
      next.getFullYear() * 12 +
      next.getMonth();

    if (nextMonth < minMonth || nextMonth > maxMonth) {
      return;
    }

    setVisibleMonth({
      year: next.getFullYear(),
      month: next.getMonth(),
    });
  }

  function chooseDate(key) {
    setSelectedDate(key);
    setSelectedTime("");
    setError("");
    setConfirmation(null);
  }

  function chooseTime(time) {
    setSelectedTime(time);
    setError("");
    setConfirmation(null);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!selectedTime) {
      setError("Please select a demo time slot.");
      return;
    }

    const result = onCreateBooking({
      alias,
      serviceId,
      date: selectedDate,
      time: selectedTime,
    });

    if (!result.ok) {
      setError(result.error);
      setConfirmation(null);
      return;
    }

    setConfirmation({
      id: result.id,
      date: selectedDate,
      time: selectedTime,
      serviceName: service.name,
    });

    setAlias("");
    setSelectedTime("");
    setError("");
  }

  return (
    <div className="yg2-calendar-page">
      <section className="yg2-page-hero">
        <div className="yg-container">
          <span className="yg-overline">
            YOUR GLOW / CONSULTATION CALENDAR
          </span>

          <h1>
            Make a little time
            <br />
            <em>for yourself.</em>
          </h1>

          <p>
            Find a date that feels right, explore
            sample consultation times, and experience
            a more considered way to schedule.
          </p>
        </div>
      </section>

      <section className="yg2-section yg-container">
        <div className="yg2-booking-layout">
          <div className="yg2-booking-main">
            <div className="yg2-step-heading">
              <span className="yg-overline">
                STEP 01 / CHOOSE YOUR INTEREST
              </span>

              <h2>
                Begin with <em>your goals.</em>
              </h2>
            </div>

            <label className="yg2-service-select">
              <span>SELECT A SAMPLE SERVICE</span>

              <select
                value={serviceId}
                onChange={(event) => {
                  setServiceId(event.target.value);
                  setError("");
                  setConfirmation(null);
                }}
              >
                {SERVICES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="yg2-calendar-card">
              <div className="yg2-calendar-header">
                <div>
                  <span className="yg-overline">
                    STEP 02 / SELECT A DATE
                  </span>

                  <h2>{monthTitle}</h2>
                </div>

                <div className="yg2-month-controls">
                  <button
                    type="button"
                    disabled={displayedMonth <= minMonth}
                    aria-label="Previous month"
                    onClick={() => changeMonth(-1)}
                  >
                    <ChevronLeft size={21} />
                  </button>

                  <button
                    type="button"
                    disabled={displayedMonth >= maxMonth}
                    aria-label="Next month"
                    onClick={() => changeMonth(1)}
                  >
                    <ChevronRight size={21} />
                  </button>
                </div>
              </div>

              <div className="yg2-weekdays">
                {[
                  "Sun",
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                ].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              <div
                className="yg2-calendar-grid"
                role="group"
                aria-label="Select consultation date"
              >
                {calendarDays.map((day) => {
                  const withinRange =
                    day.key >= minDate &&
                    day.key <= maxDate;

                  const fullyBooked =
                    (occupiedByDate.get(day.key)?.size ||
                      0) >= TIME_SLOTS.length;

                  const available =
                    day.currentMonth &&
                    withinRange &&
                    day.weekday !== 0 &&
                    !fullyBooked;

                  const selected =
                    selectedDate === day.key;

                  return (
                    <button
                      key={day.key}
                      type="button"
                      disabled={!available}
                      aria-pressed={selected}
                      aria-label={`${formatDate(day.key)}${
                        fullyBooked ? ", fully booked" : ""
                      }`}
                      className={[
                        "yg2-calendar-day",
                        selected ? "is-selected" : "",
                        !day.currentMonth
                          ? "is-other-month"
                          : "",
                      ].join(" ")}
                      onClick={() =>
                        chooseDate(day.key)
                      }
                    >
                      <strong>{day.day}</strong>

                      {available && (
                        <span
                          className="yg2-day-dot"
                          aria-hidden="true"
                        />
                      )}

                      {fullyBooked &&
                        day.currentMonth &&
                        withinRange && (
                          <small>Full</small>
                        )}
                    </button>
                  );
                })}
              </div>

              <div className="yg2-calendar-legend">
                <span>
                  <i className="yg2-dot-available" />
                  Available
                </span>

                <span>
                  <i className="yg2-dot-selected" />
                  Selected
                </span>

                <span>
                  <i className="yg2-dot-unavailable" />
                  Unavailable
                </span>
              </div>
            </div>

            <div className="yg2-times-card">
              <div className="yg2-times-heading">
                <div>
                  <span className="yg-overline">
                    STEP 03 / SELECT A TIME
                  </span>

                  <h3>{formatDate(selectedDate)}</h3>
                </div>

                <span className="yg2-availability">
                  {availableTimes.length} of{" "}
                  {TIME_SLOTS.length} slots open
                </span>
              </div>

              <div className="yg2-time-grid">
                {TIME_SLOTS.map((time) => {
                  const taken =
                    occupiedTimes.includes(time);

                  return (
                    <button
                      key={time}
                      type="button"
                      disabled={taken}
                      aria-pressed={selectedTime === time}
                      className={
                        selectedTime === time
                          ? "is-selected"
                          : ""
                      }
                      onClick={() => chooseTime(time)}
                    >
                      <Clock3 size={18} />
                      <strong>{formatTime(time)}</strong>

                      {taken && <small>TAKEN</small>}

                      {selectedTime === time && (
                        <CheckCircle2 size={17} />
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="yg2-calendar-hint">
                All times are illustrative. The calendar
                uses one shared sample consultation
                resource, not real clinic availability.
              </p>
            </div>
          </div>

          <aside className="yg2-booking-sidebar">
            <div className="yg2-summary-card">
              <span className="yg-overline">
                YOUR VISIT / PREVIEW
              </span>

              <h3>
                A moment
                <br />
                <em>just for you.</em>
              </h3>

              <div className="yg2-summary-image">
                <img
                  src={service.image}
                  alt={`Illustrative skincare imagery for ${service.name}`}
                  loading="lazy"
                />
              </div>

              <div className="yg2-summary-details">
                <div>
                  <Sparkles size={17} />
                  <span>
                    <small>Service interest</small>
                    <strong>{service.name}</strong>
                  </span>
                </div>

                <div>
                  <CalendarDays size={17} />
                  <span>
                    <small>Preferred date</small>
                    <strong>
                      {formatDate(selectedDate)}
                    </strong>
                  </span>
                </div>

                <div>
                  <Clock3 size={17} />
                  <span>
                    <small>Preferred time</small>
                    <strong>
                      {selectedTime
                        ? formatTime(selectedTime)
                        : "Not selected"}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="yg2-summary-price">
                <span>Illustrative fee from</span>
                <strong>
                  {formatPeso(service.price)}
                </strong>
              </div>

              <form
                className="yg2-summary-form"
                onSubmit={handleSubmit}
              >
                <label htmlFor="yg2-demo-alias">
                  DEMO NAME OR ALIAS
                </label>

                <input
                  id="yg2-demo-alias"
                  type="text"
                  placeholder="e.g. Sample Visitor"
                  value={alias}
                  onChange={(event) =>
                    setAlias(event.target.value)
                  }
                  required
                  minLength={2}
                  maxLength={50}
                />

                {error && (
                  <div
                    className="yg2-form-error"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="yg-button"
                  disabled={
                    !selectedTime ||
                    occupiedTimes.includes(selectedTime)
                  }
                >
                  Save Demo Request
                  <ArrowUpRight size={17} />
                </button>
              </form>

              <div className="yg2-sidebar-note">
                <ShieldCheck size={20} />
                <p>
                  This request stays in your browser.
                  Use a fictional alias, not personal
                  or medical information.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {confirmation && (
          <section
            className="yg2-calendar-confirmation"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 size={35} />

            <span className="yg-overline">
              DEMO REQUEST SAVED
            </span>

            <h2>
              A little time
              <em> set aside.</em>
            </h2>

            <p>
              {confirmation.serviceName} —{" "}
              {formatDate(confirmation.date)} at{" "}
              {formatTime(confirmation.time)}
            </p>

            <p>
              Reference: <strong>{confirmation.id}</strong>
            </p>

            <Link
              to="/consultation"
              className="yg-text-link"
            >
              View Saved Demo Requests
              <ArrowRight size={18} />
            </Link>
          </section>
        )}
      </section>
    </div>
  );
}
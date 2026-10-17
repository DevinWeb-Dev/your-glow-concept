import { useMemo, useState } from "react";
import {
  Link,
  useOutletContext,
} from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  TIME_SLOTS,
  formatDate,
  formatTime,
} from "../../data/studioData.js";

import {
  addDays,
  dayName,
  findService,
  mondayOfWeek,
  todayKey,
} from "../../utils/studioOps.js";

import "../../styles/glow-batch5-operations.css";

const nameOf = (id) =>
  findService(id)?.name ||
  "Sample care conversation";

const toneOf = (id) =>
  ({
    "skin-consultation": "sage",
    "hydrating-facial": "mint",
    "brightening-facial": "citron",
    "skin-renewal": "lilac",
    "laser-consultation": "violet",
    "acne-care": "coral",
  })[id] || "sage";

export default function StudioSchedulePage() {
  const {
    bookings = [],
  } = useOutletContext();

  const [weekStart, setWeekStart] = useState(
    () => mondayOfWeek(todayKey())
  );

  const [selectedDay, setSelectedDay] = useState(
    () => {
      const t = todayKey();

      return new Date(
        `${t}T12:00:00`
      ).getDay() === 0
        ? addDays(t, -1)
        : t;
    }
  );

  const [details, setDetails] = useState(null);

  const days = useMemo(
    () =>
      Array.from(
        { length: 6 },
        (_, i) => addDays(weekStart, i)
      ),
    [weekStart]
  );

  const weekEnd = addDays(weekStart, 5);

  const weekRecords = useMemo(
    () =>
      bookings
        .filter(
          (b) =>
            b.status === "requested" &&
            b.date >= weekStart &&
            b.date <= weekEnd
        )
        .sort((a, b) =>
          `${a.date} ${a.time}`.localeCompare(
            `${b.date} ${b.time}`
          )
        ),
    [bookings, weekStart, weekEnd]
  );

  const occupied = useMemo(
    () =>
      new Map(
        weekRecords.map((b) => [
          `${b.date}|${b.time}`,
          b,
        ])
      ),
    [weekRecords]
  );

  const capacity =
    TIME_SLOTS.length * days.length;

  const remaining =
    capacity - weekRecords.length;

  const selection = weekRecords.find(
    (b) => b.id === details
  );

  const selectedItems = weekRecords.filter(
    (b) => b.date === selectedDay
  );

  function shift(delta) {
    const next = addDays(
      weekStart,
      7 * delta
    );

    setWeekStart(next);
    setSelectedDay(next);
    setDetails(null);
  }

  function jumpToDate(nextDate) {
    if (!nextDate) return;

    setWeekStart(
      mondayOfWeek(nextDate)
    );

    setSelectedDay(
      new Date(
        `${nextDate}T12:00:00`
      ).getDay() === 0
        ? addDays(nextDate, -1)
        : nextDate
    );

    setDetails(null);
  }

  return (
    <div className="g5-ops g5-schedule">
      {/* SCHEDULE HERO */}

      <section className="g5-ops-hero g5-ops-hero--schedule">
        <div className="g5-ops-hero-copy">
          <span className="g5-kicker">
            OPERATIONS / 02 — THE WEEKLY ATELIER
          </span>

          <h1>
            SPACE TO <em>breathe.</em>
          </h1>

          <p>
            Six open days. Seven illustrative
            moments per day. One shared demo
            consultation resource—shown in a
            tactile botanical weekly board.
          </p>

          <Link
            className="g5-hero-link"
            to="/calendar"
          >
            EXPLORE THE PUBLIC CALENDAR
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div
          className="g5-schedule-hero-art"
          aria-hidden="true"
        >
          <span>MON</span>
          <i />
          <span>→ SAT</span>

          <small>
            TIME IN ITS OWN RHYTHM
          </small>
        </div>
      </section>

      {/* SCHEDULE STATISTICS */}

      <div className="g5-metrics g5-metrics--three">
        <article>
          <span>WEEKLY DEMO CAPACITY</span>
          <strong>{capacity}</strong>
          <small>
            6 × {TIME_SLOTS.length} time cells
          </small>
        </article>

        <article className="is-lime">
          <span>REQUESTED THIS WEEK</span>
          <strong>
            {weekRecords.length}
          </strong>
          <small>
            Unconfirmed sample requests
          </small>
        </article>

        <article>
          <span>OPEN DEMO CELLS</span>
          <strong>
            {remaining}
          </strong>
          <small>
            Read-only from this workspace
          </small>
        </article>
      </div>

      {/* MAIN WEEKLY BOARD */}

      <section className="g5-panel">
        <header className="g5-panel-heading">
          <div>
            <span className="g5-kicker">
              THE WEEKLY FIELD / MONDAY TO SATURDAY
            </span>

            <h2>
              Time, <em>considered.</em>
            </h2>
          </div>

          <div className="g5-week-nav">
            <button
              type="button"
              aria-label="Previous week"
              onClick={() => shift(-1)}
            >
              <ChevronLeft size={19} />
            </button>

            <button
              type="button"
              className="g5-week-today"
              onClick={() =>
                jumpToDate(todayKey())
              }
            >
              THIS WEEK
            </button>

            <button
              type="button"
              aria-label="Next week"
              onClick={() => shift(1)}
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </header>

        <div className="g5-week-summary">
          <strong>
            {formatDate(weekStart)}
            {" — "}
            {formatDate(weekEnd)}
          </strong>

          <label>
            JUMP TO DATE

            <input
              type="date"
              value={selectedDay}
              onChange={(e) =>
                jumpToDate(e.target.value)
              }
            />
          </label>
        </div>

        {/* RESPONSIVE TIMETABLE */}

        <div
          className="g5-schedule-scroll"
          tabIndex={0}
          role="region"
          aria-label="Scrollable weekly timetable"
        >
          <div className="g5-timetable">
            <div className="g5-timetable-corner">
              SLOT / DAY
            </div>

            {days.map((day) => (
              <button
                type="button"
                className={`g5-timetable-day ${
                  day === selectedDay
                    ? "is-current"
                    : ""
                }`}
                key={day}
                onClick={() => {
                  setSelectedDay(day);
                  setDetails(null);
                }}
                aria-pressed={
                  day === selectedDay
                }
              >
                <small>
                  {dayName(day).toUpperCase()}
                </small>

                <strong>
                  {new Date(
                    `${day}T12:00:00`
                  ).getDate()}
                </strong>

                <span>
                  {weekRecords.filter(
                    (b) => b.date === day
                  ).length}
                  {" / "}
                  {TIME_SLOTS.length} TAKEN
                </span>
              </button>
            ))}

            {TIME_SLOTS.map((slot) => (
              <div
                className="g5-timetable-row"
                key={slot}
              >
                <div className="g5-timetable-time">
                  <Clock3 size={15} />
                  <span>
                    {formatTime(slot)}
                  </span>
                </div>

                {days.map((day) => {
                  const b = occupied.get(
                    `${day}|${slot}`
                  );

                  return b ? (
                    <button
                      key={day}
                      type="button"
                      className={`g5-timetable-cell is-booked g5-tone-${toneOf(
                        b.serviceId
                      )}`}
                      onClick={() => {
                        setSelectedDay(day);
                        setDetails(b.id);
                      }}
                      aria-label={`${formatDate(
                        day
                      )} ${formatTime(
                        slot
                      )}: requested ${nameOf(
                        b.serviceId
                      )}`}
                    >
                      <strong>
                        {nameOf(b.serviceId)}
                      </strong>

                      <small>
                        REQUESTED · VIEW
                      </small>
                    </button>
                  ) : (
                    <div
                      className="g5-timetable-cell is-empty"
                      key={day}
                      aria-label={`${formatDate(
                        day
                      )} ${formatTime(
                        slot
                      )}: empty sample slot`}
                    >
                      <span>OPEN</span>
                      <i aria-hidden="true" />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="g5-schedule-key">
          <span>
            <i className="is-lime" />
            REQUESTED
          </span>

          <span>
            <i />
            OPEN DEMO CELL
          </span>

          <span>
            <ShieldCheck size={15} />
            SUNDAY NOT INCLUDED
          </span>
        </div>
      </section>

      {/* DAY SELECTION AND BOOKING INSPECTOR */}

      <div className="g5-schedule-lower">
        <section className="g5-panel">
          <span className="g5-kicker">
            SELECTED DAY / READ-ONLY LIST
          </span>

          <h2 className="g5-section-title">
            {formatDate(selectedDay)}
            <em>.</em>
          </h2>

          {selectedItems.length === 0 ? (
            <p className="g5-empty-note">
              No requested demo times on this
              selected day.
            </p>
          ) : (
            <div className="g5-day-list">
              {selectedItems.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() =>
                    setDetails(
                      details === b.id
                        ? null
                        : b.id
                    )
                  }
                  className={
                    details === b.id
                      ? "is-current"
                      : ""
                  }
                >
                  <time>
                    {formatTime(b.time)}
                  </time>

                  <strong>
                    {nameOf(b.serviceId)}
                  </strong>

                  <ArrowRight size={17} />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="g5-panel g5-schedule-inspector">
          <span className="g5-kicker">
            CONSULTATION CARD / INSPECTION
          </span>

          {selection ? (
            <>
              <h2 className="g5-section-title">
                One <em>moment.</em>
              </h2>

              <div className="g5-inspector-detail">
                <span>DEMO TOPIC</span>
                <strong>
                  {nameOf(selection.serviceId)}
                </strong>
              </div>

              <div className="g5-inspector-detail">
                <span>DATE & TIME</span>
                <strong>
                  {formatDate(selection.date)}
                  {" · "}
                  {formatTime(selection.time)}
                </strong>
              </div>

              <div className="g5-inspector-detail">
                <span>FICTIONAL ALIAS</span>
                <strong>
                  {selection.alias}
                </strong>
              </div>

              <div className="g5-inspector-detail">
                <span>REFERENCE</span>
                <strong>
                  {selection.id}
                </strong>
              </div>

              <Link
                to="/staff/consultations"
                className="g5-inspector-link"
              >
                GO TO CONSULTATION DESK
                <ArrowUpRight size={17} />
              </Link>
            </>
          ) : (
            <>
              <div className="g5-inspector-illustration">
                <Sparkles
                  size={50}
                  strokeWidth={1}
                />
              </div>

              <h2 className="g5-section-title">
                Look <em>closer.</em>
              </h2>

              <p>
                Select an occupied time cell
                to inspect its fictional booking
                reference. To cancel a request,
                open the Consultation Desk.
              </p>
            </>
          )}
        </section>
      </div>

      <p className="g5-disclaimer">
        <ShieldCheck size={18} />
        This timetable is illustrative.
        No live clinic availability, clinician
        roster, authenticated scheduling or
        confirmed appointment is provided.
      </p>
    </div>
  );
}
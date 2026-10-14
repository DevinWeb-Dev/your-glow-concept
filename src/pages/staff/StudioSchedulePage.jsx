import { useMemo, useState } from "react";

import {
  Link,
  useOutletContext,
} from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
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
  shortDate,
  todayKey,
} from "../../utils/studioOps.js";

export default function StudioSchedulePage() {
  const { bookings } = useOutletContext();

  const today = todayKey();

  const [weekStart, setWeekStart] = useState(
    () => mondayOfWeek(todayKey())
  );

  const days = useMemo(
    () =>
      Array.from(
        { length: 7 },
        (_, index) => addDays(weekStart, index)
      ),
    [weekStart]
  );

  const weekEnd = days[6];

  const active = bookings.filter(
    (item) => item.status === "requested"
  );

  const weekBookings = useMemo(
    () =>
      active
        .filter(
          (item) =>
            item.date >= weekStart &&
            item.date <= weekEnd
        )
        .sort((a, b) =>
          `${a.date} ${a.time}`.localeCompare(
            `${b.date} ${b.time}`
          )
        ),
    [active, weekStart, weekEnd]
  );

  const bookingMap = new Map(
    weekBookings.map((item) => [
      `${item.date}|${item.time}`,
      item,
    ])
  );

  const totalSampleSlots =
    TIME_SLOTS.length * 6;

  const availableCount = Math.max(
    0,
    totalSampleSlots - weekBookings.length
  );

  function shiftWeek(amount) {
    setWeekStart((current) =>
      addDays(current, amount * 7)
    );
  }

  function jumpToToday() {
    setWeekStart(
      mondayOfWeek(todayKey())
    );
  }

  function chooseDate(event) {
    const value = event.target.value;

    if (value) {
      setWeekStart(mondayOfWeek(value));
    }
  }

  return (
    <div className="ygs-page">
      <div className="ygs-page-heading">
        <div>
          <span className="ygs-eyebrow">
            STUDIO OPERATIONS / WEEKLY PLANNER
          </span>

          <h1>
            A week with
            <br />
            <em>room to breathe.</em>
          </h1>

          <p>
            Explore a fictional weekly calendar,
            occupied consultation times and
            available sample slots.
          </p>
        </div>

        <Link
          to="/calendar"
          className="ygs-primary-button"
        >
          <CalendarDays size={18} />
          Open Public Calendar
          <ArrowUpRight size={17} />
        </Link>
      </div>

      <section className="ygs-panel">
        <div className="ygs-panel-heading">
          <div>
            <span className="ygs-eyebrow">
              THE WEEKLY VIEW
            </span>

            <h2>
              Studio <em>schedule.</em>
            </h2>
          </div>

          <span className="ygs-panel-tag">
            READ-ONLY DEMO TIMETABLE
          </span>
        </div>

        <div className="ygs-schedule-controls">
          <div className="ygs-week-controls">
            <button
              type="button"
              aria-label="Previous week"
              onClick={() => shiftWeek(-1)}
            >
              <ChevronLeft size={21} />
            </button>

            <div>
              <small>SELECTED WEEK</small>

              <strong>
                {shortDate(weekStart)} —{" "}
                {shortDate(weekEnd)}
              </strong>
            </div>

            <button
              type="button"
              aria-label="Next week"
              onClick={() => shiftWeek(1)}
            >
              <ChevronRight size={21} />
            </button>
          </div>

          <div className="ygs-week-tools">
            <label>
              <span>JUMP TO A DATE</span>

              <input
                type="date"
                value={weekStart}
                onChange={chooseDate}
              />
            </label>

            <button
              type="button"
              onClick={jumpToToday}
            >
              This Week
            </button>
          </div>
        </div>

        <div className="ygs-schedule-stats">
          <span>
            <Clock3 size={17} />
            {totalSampleSlots} weekly demo slots
          </span>

          <span>
            <CalendarDays size={17} />
            {weekBookings.length} requested
          </span>

          <span>
            <Sparkles size={17} />
            {availableCount} available
          </span>
        </div>

        <div
          className="ygs-schedule-scroll"
          role="region"
          aria-label="Scrollable weekly consultation timetable"
          tabIndex={0}
        >
          <table className="ygs-week-table">
            <thead>
              <tr>
                <th scope="col">TIME</th>

                {days.map((day, index) => (
                  <th
                    scope="col"
                    key={day}
                    className={
                      day === today
                        ? "is-today"
                        : ""
                    }
                  >
                    <span>
                      {dayName(day)}
                    </span>

                    <strong>
                      {shortDate(day)}
                    </strong>

                    {index === 6 && (
                      <small>CLOSED</small>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {TIME_SLOTS.map((time) => (
                <tr key={time}>
                  <th scope="row">
                    {formatTime(time)}
                  </th>

                  {days.map((day, index) => {
                    const request = bookingMap.get(
                      `${day}|${time}`
                    );

                    const closed = index === 6;

                    const service = request
                      ? findService(
                          request.serviceId
                        )
                      : null;

                    return (
                      <td
                        key={`${day}-${time}`}
                        className={
                          closed
                            ? "is-closed"
                            : request
                              ? "is-booked"
                              : "is-open"
                        }
                      >
                        {closed ? (
                          <span className="ygs-cell-closed">
                            Closed
                          </span>
                        ) : request ? (
                          <div className="ygs-slot-booked">
                            <span>
                              <i />
                              REQUESTED
                            </span>

                            <strong>
                              {service?.name ||
                                "Consultation"}
                            </strong>

                            <small>
                              {request.alias}
                            </small>
                          </div>
                        ) : (
                          <div className="ygs-slot-open">
                            <i />

                            <strong>
                              Available
                            </strong>

                            <small>Demo slot</small>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ygs-schedule-legend">
          <span>
            <i className="is-available" />
            Available demo slot
          </span>

          <span>
            <i className="is-requested" />
            Requested
          </span>

          <span>
            <i className="is-closed" />
            Closed
          </span>
        </div>

        <p className="ygs-panel-footnote">
          Sunday is closed in this demo.
          Horizontal scrolling is intentional
          on narrow screens so the weekly
          timetable remains readable.
        </p>
      </section>

      <section className="ygs-panel ygs-week-requests">
        <div className="ygs-panel-heading">
          <div>
            <span className="ygs-eyebrow">
              SELECTED WEEK
            </span>

            <h2>
              Weekly <em>request list.</em>
            </h2>
          </div>

          <span className="ygs-panel-tag">
            {weekBookings.length} ACTIVE REQUESTS
          </span>
        </div>

        {weekBookings.length === 0 ? (
          <div className="ygs-empty">
            <CalendarDays size={33} />

            <h3>No requests for this week.</h3>

            <p>
              Create a fictional booking on the
              public calendar to populate this view.
            </p>
          </div>
        ) : (
          <div className="ygs-upcoming-list">
            {weekBookings.map((booking) => (
              <article
                key={booking.id}
                className="ygs-upcoming-row"
              >
                <span className="ygs-upcoming-icon">
                  <CalendarDays size={21} />
                </span>

                <div className="ygs-upcoming-description">
                  <strong>
                    {findService(
                      booking.serviceId
                    )?.name || "Consultation"}
                  </strong>

                  <small>
                    Fictional alias: {booking.alias}
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
            ))}
          </div>
        )}
      </section>

      <div className="ygs-information">
        <ShieldCheck size={22} />

        <div>
          <strong>
            One shared appointment resource.
          </strong>

          <p>
            This calendar uses the original
            YOUR GLOW demo booking logic. It
            does not simulate multiple practitioners
            or claim real staff availability.
          </p>
        </div>
      </div>
    </div>
  );
}
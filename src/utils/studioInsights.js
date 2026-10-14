import {
  CATEGORIES,
  SERVICES,
  localDateKey,
} from "../data/studioData.js";

export const BOOKINGS_KEY =
  "your-glow-demo-consultations-v1";

export const STUDIO_SETTINGS_KEY =
  "your-glow-studio-settings-v1";

export const BACKUP_FORMAT =
  "your-glow-demo-backup-v1";

export const REPORT_PERIODS = [
  { id: "all", label: "All Dates" },
  { id: "next7", label: "Next 7 Days" },
  { id: "next30", label: "Next 30 Days" },
  { id: "next90", label: "Next 90 Days" },
  { id: "past30", label: "Past 30 Days" },
];

export function shiftDay(offset, source = new Date()) {
  const date = new Date(source);

  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);

  return localDateKey(date);
}

export function filterPeriod(bookings, period = "all") {
  const today = localDateKey();

  const next7 = shiftDay(6);
  const next30 = shiftDay(29);
  const next90 = shiftDay(89);
  const past30 = shiftDay(-29);

  return bookings.filter((booking) => {
    const date = booking.date;

    if (typeof date !== "string") return false;

    switch (period) {
      case "next7":
        return date >= today && date <= next7;

      case "next30":
        return date >= today && date <= next30;

      case "next90":
        return date >= today && date <= next90;

      case "past30":
        return date >= past30 && date <= today;

      default:
        return true;
    }
  });
}

export function requestStats(bookings) {
  const today = localDateKey();

  return {
    total: bookings.length,

    requested: bookings.filter(
      (booking) => booking.status === "requested"
    ).length,

    cancelled: bookings.filter(
      (booking) => booking.status === "cancelled"
    ).length,

    upcoming: bookings.filter(
      (booking) =>
        booking.status === "requested" &&
        booking.date >= today
    ).length,
  };
}

export function dailyActivity(bookings, period = "all") {
  const previous = period === "past30";

  const count = period === "next7" ? 7 : 14;

  const start = previous ? -(count - 1) : 0;

  return Array.from({ length: count }, (_, index) => {
    const day = shiftDay(start + index);

    const date = new Date(`${day}T12:00:00`);

    return {
      date: day,

      label: date.toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
      }),

      count: bookings.filter(
        (booking) =>
          booking.status === "requested" &&
          booking.date === day
      ).length,
    };
  });
}

export function serviceInsights(bookings) {
  return SERVICES.map((service) => {
    const matching = bookings.filter(
      (booking) => booking.serviceId === service.id
    );

    return {
      id: service.id,
      name: service.name,
      image: service.image,
      category: service.category,
      price: service.price,
      duration: service.duration,

      total: matching.length,

      requested: matching.filter(
        (booking) => booking.status === "requested"
      ).length,

      cancelled: matching.filter(
        (booking) => booking.status === "cancelled"
      ).length,
    };
  }).sort(
    (a, b) =>
      b.total - a.total ||
      a.name.localeCompare(b.name)
  );
}

export function categoryInsights(bookings) {
  return CATEGORIES
    .filter((name) => name !== "All")
    .map((name) => {
      const ids = new Set(
        SERVICES.filter(
          (service) => service.category === name
        ).map((service) => service.id)
      );

      return {
        name,
        count: bookings.filter(
          (booking) => ids.has(booking.serviceId)
        ).length,
      };
    })
    .sort((a, b) => b.count - a.count);
}

export function percentage(part, total) {
  if (!total) return 0;

  return Math.round((part / total) * 100);
}

export function saveAsFile(content, filename, mimeType) {
  const blob = new Blob([content], {
    type: mimeType,
  });

  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

export function readLocalObject(key) {
  try {
    const value = JSON.parse(
      localStorage.getItem(key) || "{}"
    );

    return value &&
      typeof value === "object" &&
      !Array.isArray(value)
        ? value
        : {};
  } catch {
    return {};
  }
}
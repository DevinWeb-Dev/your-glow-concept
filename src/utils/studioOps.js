import {
  SERVICES,
  localDateKey,
} from "../data/studioData.js";

export const SERVICE_DRAFTS_KEY =
  "your-glow-service-drafts-v1";

export function todayKey() {
  return localDateKey(new Date());
}

export function addDays(key, offset) {
  const date = new Date(`${key}T12:00:00`);

  date.setDate(date.getDate() + offset);

  return localDateKey(date);
}

export function mondayOfWeek(key) {
  const date = new Date(`${key}T12:00:00`);

  const weekday = date.getDay();

  const mondayOffset =
    weekday === 0 ? -6 : 1 - weekday;

  date.setDate(date.getDate() + mondayOffset);

  return localDateKey(date);
}

export function shortDate(key) {
  const date = new Date(`${key}T12:00:00`);

  return date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
  });
}

export function dayName(key) {
  const date = new Date(`${key}T12:00:00`);

  return date.toLocaleDateString("en-PH", {
    weekday: "short",
  });
}

export function findService(id) {
  return SERVICES.find(
    (item) => item.id === id
  );
}

export function getActiveBookings(bookings) {
  return bookings.filter(
    (item) => item.status === "requested"
  );
}

export function getServiceDemand(bookings) {
  return SERVICES.map((service) => {
    const matching = bookings.filter(
      (item) => item.serviceId === service.id
    );

    return {
      ...service,
      total: matching.length,

      active: matching.filter(
        (item) => item.status === "requested"
      ).length,
    };
  }).sort(
    (a, b) =>
      b.active - a.active ||
      b.total - a.total
  );
}

function csvCell(value) {
  let text = String(value ?? "");

  // Protect spreadsheet applications against
  // formula-like values from user text.
  if (/^\s*[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

export function downloadConsultationsCSV(
  bookings,
  filename = "your-glow-demo-consultations.csv"
) {
  const header = [
    "Reference",
    "Demo Alias",
    "Service",
    "Requested Date",
    "Requested Time",
    "Status",
    "Created At",
  ];

  const data = bookings.map((item) => [
    item.id,
    item.alias,
    findService(item.serviceId)?.name || "",
    item.date,
    item.time,
    item.status,
    item.createdAt || "",
  ]);

  const content = "\uFEFF" + [
    header.map(csvCell).join(","),
    ...data.map(
      (row) => row.map(csvCell).join(",")
    ),
  ].join("\r\n");

  const blob = new Blob([content], {
    type: "text/csv;charset=utf-8",
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
export const BRAND = {
  name: "YOUR GLOW.",
  tagline: "Care for your skin. Confidence in your own way.",
  descriptor: "SKIN · AESTHETICS · SELF-CARE",
  developer: "Website Concept Made by: Web Developer Devin Planas",
};

const photo = (id, width = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export const IMAGES = {
  hero: photo("photo-1570172619644-dfd03ed5d881", 1600),
  products: photo("photo-1608248543803-ba4f8c70ae0b", 1200),
  skincare: photo("photo-1611930022073-b7a4ba5fcccd", 1500),
  ritual: photo("photo-1556228578-0d85b1a4d571", 1200),
  facial: photo("photo-1570172619644-dfd03ed5d881", 1200),
  detail: photo("photo-1608248543803-ba4f8c70ae0b", 1200),
};

export const CATEGORIES = [
  "All",
  "Consultations",
  "Facials",
  "Skin Care",
  "Laser",
];

export const SERVICES = [
  {
    id: "skin-consultation",
    number: "01",
    name: "Personalized Skin Consultation",
    category: "Consultations",
    eyebrow: "THE FIRST STEP",
    subtitle: "A conversation that starts with your skin.",
    description:
      "An illustrative consultation experience focused on discussing skin concerns, exploring treatment options, and understanding when qualified professional advice is appropriate.",
    duration: 30,
    price: 500,
    image: IMAGES.skincare,
    featured: true,
    highlights: [
      "Initial consultation discussion",
      "Skin-care goals overview",
      "General next-step recommendations",
    ],
  },
  {
    id: "hydrating-facial",
    number: "02",
    name: "Hydrating Facial",
    category: "Facials",
    eyebrow: "THE RESET RITUAL",
    subtitle: "A thoughtful moment of skin care.",
    description:
      "A sample facial service concept centered on cleansing, hydration-focused products, and a relaxing studio experience. Product suitability varies by individual.",
    duration: 60,
    price: 1800,
    image: IMAGES.facial,
    featured: true,
    highlights: [
      "Pre-service suitability check",
      "Hydration-focused facial concept",
      "General aftercare guidance",
    ],
  },
  {
    id: "brightening-facial",
    number: "03",
    name: "Radiance Facial",
    category: "Facials",
    eyebrow: "THE RADIANCE EDIT",
    subtitle: "A softer approach to your self-care routine.",
    description:
      "An illustrative brightening-oriented facial offering, with an emphasis on discussing suitable products and avoiding guaranteed cosmetic outcomes.",
    duration: 60,
    price: 2400,
    image: IMAGES.products,
    featured: true,
    highlights: [
      "Treatment suitability review",
      "Customized facial concept",
      "Home-care discussion",
    ],
  },
  {
    id: "skin-renewal",
    number: "04",
    name: "Skin Renewal Consultation",
    category: "Skin Care",
    eyebrow: "THE SKIN EDIT",
    subtitle: "Explore a more considered routine.",
    description:
      "A consultation-led preview of exfoliation and skin-care options. Professional guidance is important because some products and procedures may irritate or injure skin.",
    duration: 45,
    price: 1000,
    image: IMAGES.ritual,
    featured: false,
    highlights: [
      "Skin concerns discussion",
      "Suitability and precautions",
      "Individualized care-path overview",
    ],
  },
  {
    id: "laser-consultation",
    number: "05",
    name: "Laser Aesthetics Consultation",
    category: "Laser",
    eyebrow: "THE PRECISION EDIT",
    subtitle: "Understand your options before proceeding.",
    description:
      "A sample consultation page explaining that laser procedures require properly qualified assessment, informed consent, and a discussion of potential risks.",
    duration: 45,
    price: 1200,
    image: IMAGES.detail,
    featured: false,
    highlights: [
      "Goals and eligibility discussion",
      "Potential risk and care considerations",
      "Procedure information overview",
    ],
  },
  {
    id: "acne-care",
    number: "06",
    name: "Acne Care Consultation",
    category: "Skin Care",
    eyebrow: "THE CARE PATH",
    subtitle: "Individual skin concerns deserve individual care.",
    description:
      "An illustrative assessment and consultation pathway for discussing acne-related concerns and appropriate professional care rather than promising specific results.",
    duration: 45,
    price: 750,
    image: IMAGES.skincare,
    featured: false,
    highlights: [
      "Skin concerns discussion",
      "Treatment-options overview",
      "General follow-up guidance",
    ],
  },
];

export const APPROACH = [
  {
    number: "01",
    title: "Listen first.",
    description:
      "Create space for thoughtful questions, realistic expectations, and personal goals.",
  },
  {
    number: "02",
    title: "Explore thoughtfully.",
    description:
      "Present clear service information and explain that suitability varies.",
  },
  {
    number: "03",
    title: "Care beyond the visit.",
    description:
      "Help visitors understand the importance of appropriate follow-up and professional advice.",
  },
];

export const FAQS = [
  {
    question: "Are the treatment prices final?",
    answer:
      "No. All fees on this portfolio website are fictional examples in Philippine pesos. Real prices depend on the clinic and an appropriate assessment.",
  },
  {
    question: "Is the consultation request a real booking?",
    answer:
      "No. The scheduler is a browser-local demonstration. It does not send a request to a clinic or reserve a real appointment.",
  },
  {
    question: "Can I upload photos of my skin?",
    answer:
      "Not in this demo. We intentionally avoid collecting health information, identifiable skin photographs, or medical history.",
  },
  {
    question: "Can this website show before-and-after photos?",
    answer:
      "A real clinic can add an authorized gallery later, with documented consent, accurate context, and appropriate privacy protections. This concept does not invent treatment results.",
  },
];

export const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

export function formatPeso(value) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function formatTime(value) {
  if (!value || !value.includes(":")) return "—";

  const [hourString, minute] = value.split(":");
  const hour = Number(hourString);

  return `${hour % 12 || 12}:${minute} ${
    hour >= 12 ? "PM" : "AM"
  }`;
}

export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function dateAfter(days) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);

  return localDateKey(date);
}

export function formatDate(value) {
  if (!value) return "—";

  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-PH", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
// Dummy marketplace data — swap to Lovable Cloud queries later.
import tomato from "@/assets/prod-tomato.jpg";
import spinach from "@/assets/prod-spinach.jpg";
import mango from "@/assets/prod-mango.jpg";
import wheat from "@/assets/prod-wheat.jpg";
import onion from "@/assets/prod-onion.jpg";
import okra from "@/assets/prod-okra.jpg";

export type Category = "vegetables" | "fruits" | "grains";

export type Product = {
  id: string;
  name: { en: string; hi: string };
  category: Category;
  price: number; // INR per kg
  unit: string;
  image: string;
  freshness: "Just Harvested" | "Today" | "Yesterday";
  stockKg: number;
  farmer: { name: string; village: string; state: string; rating: number; distanceKm: number };
};

export const products: Product[] = [
  {
    id: "tomato-01",
    name: { en: "Vine-Ripened Tomatoes", hi: "ताज़े टमाटर" },
    category: "vegetables",
    price: 28, unit: "kg", image: tomato,
    freshness: "Just Harvested", stockKg: 120,
    farmer: { name: "Sunita Devi", village: "Khandwa", state: "MP", rating: 4.8, distanceKm: 12 },
  },
  {
    id: "spinach-01",
    name: { en: "Organic Spinach", hi: "जैविक पालक" },
    category: "vegetables",
    price: 22, unit: "kg", image: spinach,
    freshness: "Today", stockKg: 60,
    farmer: { name: "Ramesh Kumar", village: "Sonipat", state: "HR", rating: 4.6, distanceKm: 8 },
  },
  {
    id: "mango-01",
    name: { en: "Alphonso Mangoes", hi: "अल्फांसो आम" },
    category: "fruits",
    price: 220, unit: "kg", image: mango,
    freshness: "Today", stockKg: 200,
    farmer: { name: "Anjali Patil", village: "Devgad", state: "MH", rating: 4.9, distanceKm: 45 },
  },
  {
    id: "wheat-01",
    name: { en: "Sharbati Wheat", hi: "शरबती गेहूँ" },
    category: "grains",
    price: 38, unit: "kg", image: wheat,
    freshness: "Yesterday", stockKg: 1500,
    farmer: { name: "Harpreet Singh", village: "Ludhiana", state: "PB", rating: 4.7, distanceKm: 22 },
  },
  {
    id: "onion-01",
    name: { en: "Red Onions", hi: "लाल प्याज़" },
    category: "vegetables",
    price: 32, unit: "kg", image: onion,
    freshness: "Today", stockKg: 400,
    farmer: { name: "Mahesh Pawar", village: "Lasalgaon", state: "MH", rating: 4.5, distanceKm: 18 },
  },
  {
    id: "okra-01",
    name: { en: "Tender Okra", hi: "भिंडी" },
    category: "vegetables",
    price: 40, unit: "kg", image: okra,
    freshness: "Just Harvested", stockKg: 80,
    farmer: { name: "Lakshmi Reddy", village: "Warangal", state: "TS", rating: 4.8, distanceKm: 14 },
  },
];

export const findProduct = (id: string) => products.find((p) => p.id === id);

export const weatherAdvisory = {
  city: "Indore, MP",
  tempC: 31,
  condition: "Partly Cloudy",
  rainChance: 40,
  tip: {
    en: "Mild rain expected in 48h — good for sowing leafy greens. Postpone harvest of ripe tomatoes by a day.",
    hi: "48 घंटों में हल्की बारिश संभव — पत्तेदार सब्ज़ियों की बुवाई के लिए उत्तम। पके टमाटर की कटाई एक दिन टालें।",
  },
};

export const demandSignals = [
  { crop: { en: "Tomato", hi: "टमाटर" }, trend: "+18%", direction: "up" as const },
  { crop: { en: "Spinach", hi: "पालक" }, trend: "+9%", direction: "up" as const },
  { crop: { en: "Onion", hi: "प्याज़" }, trend: "-4%", direction: "down" as const },
  { crop: { en: "Mango", hi: "आम" }, trend: "+24%", direction: "up" as const },
];

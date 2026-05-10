import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "hi";

const dict = {
  brand: { en: "KisanKart", hi: "किसानकार्ट" },
  tagline: {
    en: "Farm-fresh, fair priced. Direct from the soil to your home.",
    hi: "खेत से ताज़ा, उचित दाम। सीधे मिट्टी से आपके घर तक।",
  },
  ctaShop: { en: "Shop Fresh", hi: "ताज़ा खरीदें" },
  ctaSell: { en: "Sell as Farmer", hi: "किसान बनकर बेचें" },
  nav: {
    home: { en: "Home", hi: "होम" },
    market: { en: "Market", hi: "मंडी" },
    farmer: { en: "Farmer", hi: "किसान" },
    admin: { en: "Admin", hi: "एडमिन" },
    cart: { en: "Cart", hi: "कार्ट" },
  },
  search: { en: "Search vegetables, fruits, grains…", hi: "सब्ज़ी, फल, अनाज खोजें…" },
  voice: { en: "Tap & speak", hi: "बोलकर खोजें" },
  addToCart: { en: "Add to cart", hi: "कार्ट में डालें" },
  perKg: { en: "per kg", hi: "प्रति किलो" },
  freshness: { en: "Freshness", hi: "ताज़गी" },
  distance: { en: "Distance", hi: "दूरी" },
  checkout: { en: "Checkout", hi: "भुगतान" },
  total: { en: "Total", hi: "कुल" },
  empty: { en: "Your cart is empty", hi: "आपका कार्ट खाली है" },
  categories: {
    all: { en: "All", hi: "सभी" },
    vegetables: { en: "Vegetables", hi: "सब्ज़ियाँ" },
    fruits: { en: "Fruits", hi: "फल" },
    grains: { en: "Grains", hi: "अनाज" },
  },
  weather: { en: "Weather Advisory", hi: "मौसम सलाह" },
  demand: { en: "Demand Trend", hi: "माँग का रुझान" },
  bestCrop: { en: "Suggested Crops", hi: "अनुशंसित फसलें" },
  yourProducts: { en: "Your Products", hi: "आपके उत्पाद" },
  earnings: { en: "Earnings (30d)", hi: "कमाई (30 दिन)" },
  orders: { en: "Orders", hi: "ऑर्डर" },
  customers: { en: "Customers", hi: "ग्राहक" },
} as const;

type DictKey = keyof typeof dict;

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: DictKey | string) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => String(k),
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("kk-lang") as Lang | null) : null;
    if (saved) setLangState(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("kk-lang", l);
  };
  const t = (k: string) => {
    const parts = k.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let node: any = dict;
    for (const p of parts) node = node?.[p];
    if (node && typeof node === "object" && lang in node) return node[lang];
    return k;
  };
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);

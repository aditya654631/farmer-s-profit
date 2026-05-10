import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { products, type Category } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { ProductCard } from "@/components/product-card";
import { VoiceButton } from "@/components/voice-button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export const Route = createFileRoute("/market")({
  head: () => ({
    meta: [
      { title: "Marketplace — KisanKart" },
      { name: "description", content: "Browse fresh vegetables, fruits and grains direct from farmers." },
    ],
  }),
  component: Market,
});

const cats: Array<Category | "all"> = ["all", "vegetables", "fruits", "grains"];

function Market() {
  const { lang, t } = useI18n();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "all">("all");
  const [maxPrice, setMaxPrice] = useState(250);
  const [maxDist, setMaxDist] = useState(60);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return products.filter((p) => {
      if (cat !== "all" && p.category !== cat) return false;
      if (p.price > maxPrice) return false;
      if (p.farmer.distanceKm > maxDist) return false;
      if (!ql) return true;
      return (
        p.name.en.toLowerCase().includes(ql) ||
        p.name.hi.includes(ql) ||
        p.farmer.village.toLowerCase().includes(ql)
      );
    });
  }, [q, cat, maxPrice, maxDist]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-bold md:text-5xl">
          {lang === "hi" ? "ताज़ा मंडी" : "Fresh Marketplace"}
        </h1>
        <p className="text-muted-foreground">
          {lang === "hi" ? "किसान से सीधे — कोई बिचौलिया नहीं" : "Straight from farmers — no middlemen"}
        </p>
      </header>

      {/* Search bar */}
      <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-3 shadow-soft md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search")}
            className="h-12 rounded-2xl border-0 bg-muted pl-11 text-base focus-visible:ring-2"
          />
        </div>
        <VoiceButton onTranscript={(s) => setQ(s)} />
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-[260px_1fr]">
        {/* Filters */}
        <aside className="space-y-6 rounded-3xl border border-border bg-card p-5 shadow-soft">
          <div>
            <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
              <SlidersHorizontal className="h-4 w-4" />
              {lang === "hi" ? "श्रेणियाँ" : "Categories"}
            </h3>
            <div className="flex flex-wrap gap-2">
              {cats.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    cat === c ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/70 hover:bg-accent"
                  }`}
                >
                  {t(`categories.${c}`)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">{lang === "hi" ? "अधिकतम दाम" : "Max price"}</span>
              <span className="font-display font-semibold text-primary">₹{maxPrice}</span>
            </div>
            <Slider value={[maxPrice]} onValueChange={(v) => setMaxPrice(v[0])} min={20} max={300} step={5} />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">{lang === "hi" ? "अधिकतम दूरी" : "Max distance"}</span>
              <span className="font-display font-semibold text-primary">{maxDist} km</span>
            </div>
            <Slider value={[maxDist]} onValueChange={(v) => setMaxDist(v[0])} min={5} max={100} step={5} />
          </div>
        </aside>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="grid place-items-center rounded-3xl border border-dashed border-border bg-card/40 p-16 text-center">
            <p className="text-muted-foreground">
              {lang === "hi" ? "कोई उत्पाद नहीं मिला" : "No products match your filters"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

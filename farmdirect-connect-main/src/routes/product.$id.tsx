import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Star, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { findProduct } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = findProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.product.name.en ?? "Product"} — KisanKart` },
      { name: "description", content: `Fresh ${loaderData?.product.name.en} direct from ${loaderData?.product.farmer.village}.` },
    ],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="grid place-items-center py-32 text-center">
      <p>Product not found.</p>
      <Link to="/market" className="mt-3 text-primary underline">Back to market</Link>
    </div>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { lang, t } = useI18n();
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/market" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {lang === "hi" ? "वापस मंडी" : "Back to market"}
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-soft">
          <img src={product.image} alt={product.name[lang]} className="aspect-square w-full object-cover" />
        </div>

        <div>
          {product.freshness === "Just Harvested" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-leaf px-3 py-1 text-xs font-semibold text-leaf-foreground">
              <Sparkles className="h-3 w-3" /> {lang === "hi" ? "अभी काटी गई" : "Just Harvested"}
            </span>
          )}
          <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">{product.name[lang]}</h1>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-primary">₹{product.price}</span>
            <span className="text-sm text-muted-foreground">/ {t("perKg")}</span>
          </div>

          {/* Farmer card */}
          <div className="mt-6 flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-sun font-display text-lg font-bold text-primary-foreground">
              {product.farmer.name[0]}
            </div>
            <div className="flex-1">
              <div className="font-semibold">{product.farmer.name}</div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {product.farmer.village}, {product.farmer.state}</span>
                <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-harvest text-harvest" /> {product.farmer.rating}</span>
              </div>
            </div>
            <span className="rounded-full bg-leaf/15 px-2.5 py-1 text-xs font-semibold text-leaf">
              {product.farmer.distanceKm} km
            </span>
          </div>

          {/* Qty + Add */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-border bg-card p-1">
              <button onClick={() => setQty(Math.max(0.5, qty - 0.5))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent">−</button>
              <span className="min-w-[3rem] text-center font-display text-lg font-semibold">{qty} kg</span>
              <button onClick={() => setQty(qty + 0.5)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent">+</button>
            </div>
            <Button
              size="lg"
              className="flex-1 rounded-full text-base shadow-warm"
              onClick={() => {
                add(product, qty);
                toast.success(lang === "hi" ? "कार्ट में जोड़ा गया" : "Added to cart", {
                  description: `${qty} kg ${product.name[lang]}`,
                });
              }}
            >
              {t("addToCart")} · ₹{(product.price * qty).toFixed(0)}
            </Button>
          </div>

          <ul className="mt-8 space-y-3 text-sm">
            <li className="flex items-center gap-3"><Truck className="h-4 w-4 text-primary" /> {lang === "hi" ? "24 घंटे में डिलीवरी" : "Delivery within 24 hours"}</li>
            <li className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-primary" /> {lang === "hi" ? "गुणवत्ता की गारंटी" : "Quality guaranteed or refunded"}</li>
            <li className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-primary" /> {lang === "hi" ? `भंडार: ${product.stockKg} किलो` : `In stock: ${product.stockKg} kg`}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

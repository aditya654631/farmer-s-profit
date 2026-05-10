import { Link } from "@tanstack/react-router";
import { Star, MapPin, Sparkles } from "lucide-react";
import type { Product } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: Product }) {
  const { lang, t } = useI18n();
  const add = useCart((s) => s.add);

  return (
    <article className="group overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-warm">
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name[lang]}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.freshness === "Just Harvested" && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-leaf px-2.5 py-1 text-xs font-semibold text-leaf-foreground shadow-soft">
              <Sparkles className="h-3 w-3" /> Fresh
            </span>
          )}
        </div>
      </Link>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-tight">{product.name[lang]}</h3>
          <div className="text-right">
            <div className="font-display text-xl font-bold text-primary">₹{product.price}</div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{t("perKg")}</div>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {product.farmer.village}, {product.farmer.state}
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3 fill-harvest text-harvest" /> {product.farmer.rating}
          </span>
        </div>
        <Button
          onClick={(e) => {
            e.preventDefault();
            add(product, 1);
          }}
          className="w-full rounded-xl"
          size="lg"
        >
          {t("addToCart")}
        </Button>
      </div>
    </article>
  );
}

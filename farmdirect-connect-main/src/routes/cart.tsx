import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, ShoppingBasket, IndianRupee, Banknote, QrCode } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { UpiPaymentDialog } from "@/components/upi-payment-dialog";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — KisanKart" }] }),
  component: CartPage,
});

function CartPage() {
  const { lang, t } = useI18n();
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const setQty = useCart((s) => s.setQty);
  const total = useCart((s) => s.total());
  const clear = useCart((s) => s.clear);
  const [pay, setPay] = useState<"upi" | "cod">("upi");
  const [upiOpen, setUpiOpen] = useState(false);

  const placeOrder = (method: "upi" | "cod") => {
    toast.success(lang === "hi" ? "ऑर्डर सफल!" : "Order placed!", {
      description:
        method === "upi"
          ? lang === "hi"
            ? "UPI भुगतान प्राप्त हुआ। किसान को सूचित कर दिया गया।"
            : "UPI payment received. Farmer has been notified."
          : lang === "hi"
            ? "डिलीवरी पर नकद। किसान को सूचित कर दिया गया।"
            : "Cash on delivery. Farmer has been notified.",
    });
    clear();
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto grid max-w-3xl place-items-center px-4 py-24 text-center">
        <ShoppingBasket className="h-16 w-16 text-muted-foreground" />
        <h1 className="mt-4 font-display text-3xl font-bold">{t("empty")}</h1>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/market">{t("ctaShop")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl font-bold">{lang === "hi" ? "आपका कार्ट" : "Your Cart"}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <ul className="space-y-3">
          {items.map((i) => (
            <li key={i.product.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
              <img src={i.product.image} alt="" className="h-20 w-20 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="font-display text-lg font-semibold">{i.product.name[lang]}</div>
                <div className="text-xs text-muted-foreground">{i.product.farmer.name} · {i.product.farmer.village}</div>
                <div className="mt-2 flex items-center gap-2">
                  <button onClick={() => setQty(i.product.id, i.qtyKg - 0.5)} className="grid h-7 w-7 place-items-center rounded-full bg-muted hover:bg-accent">−</button>
                  <span className="min-w-[3rem] text-center text-sm font-semibold">{i.qtyKg} kg</span>
                  <button onClick={() => setQty(i.product.id, i.qtyKg + 0.5)} className="grid h-7 w-7 place-items-center rounded-full bg-muted hover:bg-accent">+</button>
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-lg font-bold text-primary">₹{(i.product.price * i.qtyKg).toFixed(0)}</div>
                <button onClick={() => remove(i.product.id)} className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3 w-3" /> Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-warm">
          <h2 className="font-display text-xl font-semibold">{lang === "hi" ? "सारांश" : "Order Summary"}</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>₹{total.toFixed(0)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd className="text-leaf">FREE</dd></div>
            <div className="my-2 border-t border-border" />
            <div className="flex items-baseline justify-between">
              <dt className="font-display text-base font-semibold">{t("total")}</dt>
              <dd className="font-display text-2xl font-bold text-primary">₹{total.toFixed(0)}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <div className="text-sm font-semibold">{lang === "hi" ? "भुगतान विधि" : "Payment method"}</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button onClick={() => setPay("upi")} className={`flex flex-col items-center gap-1 rounded-2xl border p-3 text-xs ${pay === "upi" ? "border-primary bg-accent" : "border-border bg-card hover:bg-accent"}`}>
                <QrCode className="h-5 w-5 text-primary" /> UPI
              </button>
              <button onClick={() => setPay("cod")} className={`flex flex-col items-center gap-1 rounded-2xl border p-3 text-xs ${pay === "cod" ? "border-primary bg-accent" : "border-border bg-card hover:bg-accent"}`}>
                <Banknote className="h-5 w-5 text-primary" /> Cash on Delivery
              </button>
            </div>
          </div>

          <Button
            size="lg"
            className="mt-6 w-full rounded-full text-base shadow-warm"
            onClick={() => {
              if (pay === "upi") setUpiOpen(true);
              else placeOrder("cod");
            }}
          >
            <IndianRupee className="mr-1 h-4 w-4" />
            {pay === "upi"
              ? (lang === "hi" ? "UPI से भुगतान करें" : "Pay with UPI")
              : (lang === "hi" ? "ऑर्डर करें (COD)" : "Place Order (COD)")}
          </Button>
        </aside>
      </div>

      <UpiPaymentDialog
        open={upiOpen}
        onOpenChange={setUpiOpen}
        amount={total}
        onPaid={() => placeOrder("upi")}
      />
    </div>
  );
}

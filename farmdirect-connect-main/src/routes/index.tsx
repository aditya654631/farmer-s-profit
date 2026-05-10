import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Truck, IndianRupee, Wifi, ShieldCheck, Sparkles, CloudSun } from "lucide-react";
import heroImg from "@/assets/hero-farmer.jpg";
import { useI18n } from "@/lib/i18n";
import { products, weatherAdvisory } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KisanKart — Farm-fresh produce, direct from Indian farmers" },
      { name: "description", content: "Buy fresh vegetables, fruits and grains directly from verified farmers. Fair pricing, voice search in Hindi, UPI payments." },
      { property: "og:title", content: "KisanKart — Farm to Family" },
      { property: "og:description", content: "Direct farmer-to-consumer marketplace for India." },
    ],
  }),
  component: Home,
});

function Home() {
  const { lang, t } = useI18n();
  const featured = products.slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-12 pb-16 md:grid-cols-2 md:items-center md:pt-20 md:pb-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-soil shadow-soft">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {lang === "hi" ? "बिना बिचौलिया, सीधे किसान से" : "Zero middlemen — direct from farms"}
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
              {lang === "hi" ? (
                <>खेत से सीधे <span className="text-primary">आपके घर</span> तक।</>
              ) : (
                <>From the soil <span className="text-primary">to your soul.</span></>
              )}
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">{t("tagline")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-6 text-base shadow-warm">
                <Link to="/market">
                  {t("ctaShop")} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-6 text-base">
                <Link to="/farmer">{t("ctaSell")}</Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 text-sm">
              {[
                { k: "12k+", v: lang === "hi" ? "किसान" : "Farmers" },
                { k: "₹38L", v: lang === "hi" ? "किसानों को" : "Paid out" },
                { k: "4.8★", v: lang === "hi" ? "औसत रेटिंग" : "Avg rating" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="font-display text-2xl font-bold text-foreground">{s.k}</dt>
                  <dd className="text-muted-foreground">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -left-6 -top-6 h-40 w-40 rounded-full bg-harvest/40 blur-3xl" aria-hidden />
            <div className="absolute -right-4 bottom-0 h-48 w-48 rounded-full bg-leaf/30 blur-3xl" aria-hidden />
            <img
              src={heroImg}
              alt="Indian farmer with fresh harvest in golden field"
              width={1536}
              height={1024}
              className="relative aspect-[4/5] w-full rounded-[2rem] object-cover shadow-warm"
            />
            <div className="absolute -bottom-6 left-6 right-6 rounded-2xl border border-border bg-card/95 p-4 shadow-warm backdrop-blur md:left-auto md:right-6 md:w-72">
              <div className="flex items-center gap-3">
                <CloudSun className="h-9 w-9 text-harvest" />
                <div>
                  <div className="text-xs text-muted-foreground">{weatherAdvisory.city}</div>
                  <div className="font-display text-lg font-semibold">{weatherAdvisory.tempC}° · {weatherAdvisory.condition}</div>
                </div>
              </div>
              <p className="mt-2 text-xs leading-snug text-muted-foreground line-clamp-3">
                {weatherAdvisory.tip[lang]}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { Icon: IndianRupee, t: lang === "hi" ? "उचित दाम" : "Fair Pricing", d: lang === "hi" ? "किसान को 80%+ हिस्सा" : "80%+ to the farmer" },
            { Icon: Truck, t: lang === "hi" ? "तेज़ डिलीवरी" : "Fast Delivery", d: lang === "hi" ? "24 घंटे में ताज़ा" : "Fresh in 24 hours" },
            { Icon: Wifi, t: lang === "hi" ? "ऑफ़लाइन भी चले" : "Works Offline", d: lang === "hi" ? "गाँव में भी" : "Built for rural" },
            { Icon: ShieldCheck, t: lang === "hi" ? "सुरक्षित भुगतान" : "Safe UPI", d: lang === "hi" ? "या नकद COD" : "Or cash on delivery" },
          ].map(({ Icon, t: title, d }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              {lang === "hi" ? "आज की ताज़ा फसल" : "Today's fresh harvest"}
            </h2>
            <p className="text-muted-foreground">
              {lang === "hi" ? "मंडी से सीधे आपके लिए" : "Hand-picked from verified farmers"}
            </p>
          </div>
          <Link to="/market" className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline md:inline-flex">
            {lang === "hi" ? "सब देखें" : "View all"} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}

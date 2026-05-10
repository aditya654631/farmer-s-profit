import { createFileRoute } from "@tanstack/react-router";
import { Users, Package, IndianRupee, TrendingUp } from "lucide-react";
import { products } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — KisanKart" }] }),
  component: Admin,
});

function Admin() {
  const { lang } = useI18n();
  const stats = [
    { Icon: Users, label: lang === "hi" ? "किसान" : "Farmers", value: "12,418" },
    { Icon: Users, label: lang === "hi" ? "उपभोक्ता" : "Consumers", value: "84,902" },
    { Icon: Package, label: lang === "hi" ? "ऑर्डर (आज)" : "Orders today", value: "1,284" },
    { Icon: IndianRupee, label: lang === "hi" ? "GMV (माह)" : "GMV (month)", value: "₹1.4Cr" },
  ];

  // Tiny inline sparkline-ish bar chart (dummy)
  const monthly = [12, 18, 14, 22, 28, 24, 32, 38, 35, 42, 48, 56];
  const max = Math.max(...monthly);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header>
        <p className="text-sm text-muted-foreground">{lang === "hi" ? "एडमिन" : "Admin"}</p>
        <h1 className="font-display text-4xl font-bold md:text-5xl">{lang === "hi" ? "प्लेटफ़ॉर्म डैशबोर्ड" : "Platform Dashboard"}</h1>
      </header>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <s.Icon className="h-5 w-5 text-primary" />
            <div className="mt-3 font-display text-3xl font-bold">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold">{lang === "hi" ? "मासिक GMV" : "Monthly GMV"}</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-leaf/15 px-2.5 py-1 text-xs font-semibold text-leaf">
              <TrendingUp className="h-3 w-3" /> +24% YoY
            </span>
          </div>
          <div className="mt-6 flex h-48 items-end gap-2">
            {monthly.map((v, i) => (
              <div key={i} className="flex-1 rounded-t-lg bg-gradient-sun transition-all hover:opacity-80" style={{ height: `${(v / max) * 100}%` }} />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wide text-muted-foreground">
            {["J","F","M","A","M","J","J","A","S","O","N","D"].map((m, i) => <span key={i}>{m}</span>)}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl font-semibold">{lang === "hi" ? "टॉप उत्पाद" : "Top Products"}</h2>
          <ul className="mt-4 space-y-3">
            {products.slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                <div className="flex-1 text-sm">
                  <div className="font-semibold">{p.name[lang]}</div>
                  <div className="text-xs text-muted-foreground">{p.farmer.village}</div>
                </div>
                <div className="font-display font-bold text-primary">₹{p.price}</div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-display text-2xl font-semibold">{lang === "hi" ? "हाल के ऑर्डर" : "Recent Orders"}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr><th className="py-2">Order</th><th>Customer</th><th>Farmer</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {[
                ["#KK-1042","Priya Sharma","Sunita Devi","₹420","Delivered"],
                ["#KK-1041","Arjun Mehta","Harpreet Singh","₹1,140","In transit"],
                ["#KK-1040","Neha Kapoor","Anjali Patil","₹880","Packed"],
                ["#KK-1039","Rohit Verma","Mahesh Pawar","₹256","Delivered"],
              ].map((r) => (
                <tr key={r[0]} className="border-t border-border">
                  <td className="py-3 font-mono text-xs">{r[0]}</td>
                  <td>{r[1]}</td><td>{r[2]}</td>
                  <td className="font-semibold">{r[3]}</td>
                  <td><span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold">{r[4]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

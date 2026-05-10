import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, TrendingDown, CloudSun, Plus, Mic, Wallet, Package, Users, Trash2, ImagePlus } from "lucide-react";
import { useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { products, demandSignals, weatherAdvisory, type Category } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VoiceButton } from "@/components/voice-button";
import { useFarmerProducts } from "@/lib/farmer-products";
import { toast } from "sonner";

export const Route = createFileRoute("/farmer")({
  head: () => ({ meta: [{ title: "Farmer Dashboard — KisanKart" }] }),
  component: FarmerDashboard,
});

function FarmerDashboard() {
  const { lang, t } = useI18n();
  const seedProducts = products.slice(0, 3);
  const myAdded = useFarmerProducts((s) => s.items);
  const addProduct = useFarmerProducts((s) => s.add);
  const removeProduct = useFarmerProducts((s) => s.remove);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<Category>("vegetables");
  const [stock, setStock] = useState("");
  const [unit, setUnit] = useState("kg");
  const [image, setImage] = useState<string | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);

  const onPickImage = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(typeof reader.result === "string" ? reader.result : undefined);
    reader.readAsDataURL(file);
  };

  const handleList = () => {
    const priceNum = Number(price);
    const stockNum = Number(stock);
    if (!name.trim()) {
      toast.error(lang === "hi" ? "नाम ज़रूरी है" : "Name is required");
      return;
    }
    if (!priceNum || priceNum <= 0) {
      toast.error(lang === "hi" ? "सही दाम डालें" : "Enter a valid price");
      return;
    }
    if (!stockNum || stockNum <= 0) {
      toast.error(lang === "hi" ? "मात्रा डालें" : "Enter available quantity");
      return;
    }
    addProduct({ name: name.trim(), price: priceNum, stockKg: stockNum, unit, category, image });
    toast.success(lang === "hi" ? "उत्पाद जोड़ा गया" : "Product listed", {
      description: `${name} · ₹${priceNum}/${unit}`,
    });
    setName(""); setPrice(""); setStock(""); setImage(undefined);
    if (fileRef.current) fileRef.current.value = "";
  };

  const stats = [
    { Icon: Wallet, label: t("earnings"), value: "₹42,380", color: "text-primary" },
    { Icon: Package, label: t("orders"), value: "184", color: "text-leaf" },
    { Icon: Users, label: t("customers"), value: "76", color: "text-harvest-foreground" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{lang === "hi" ? "नमस्ते 👋" : "Namaste 👋"}</p>
          <h1 className="font-display text-4xl font-bold md:text-5xl">Sunita Devi</h1>
          <p className="text-muted-foreground">Khandwa, Madhya Pradesh</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 shadow-soft">
          <CloudSun className="h-5 w-5 text-harvest" />
          <span className="text-sm font-medium">{weatherAdvisory.tempC}° · {weatherAdvisory.condition}</span>
        </div>
      </header>

      {/* Stats */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <s.Icon className={`h-6 w-6 ${s.color}`} />
            <div className="mt-3 font-display text-3xl font-bold">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Add Product */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
          <h2 className="font-display text-2xl font-semibold">{lang === "hi" ? "नया उत्पाद जोड़ें" : "Add a new product"}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{lang === "hi" ? "नाम" : "Name"}</label>
              <div className="mt-1 flex gap-2">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={lang === "hi" ? "जैसे टमाटर" : "e.g. Tomato"} className="h-11 rounded-xl" />
                <VoiceButton onTranscript={(s) => setName(s)} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{lang === "hi" ? "श्रेणी" : "Category"}</label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger className="mt-1 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegetables">{lang === "hi" ? "सब्ज़ियाँ" : "Vegetables"}</SelectItem>
                  <SelectItem value="fruits">{lang === "hi" ? "फल" : "Fruits"}</SelectItem>
                  <SelectItem value="grains">{lang === "hi" ? "अनाज" : "Grains"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{lang === "hi" ? "दाम (₹/किलो)" : "Price (₹/kg)"}</label>
              <Input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" placeholder="28" className="mt-1 h-11 rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{lang === "hi" ? "मात्रा (किलो)" : "Quantity (kg)"}</label>
              <Input value={stock} onChange={(e) => setStock(e.target.value)} type="number" min="0" placeholder="50" className="mt-1 h-11 rounded-xl" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{lang === "hi" ? "तस्वीर (वैकल्पिक)" : "Photo (optional)"}</label>
              <div className="mt-1 flex items-center gap-3">
                <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={() => fileRef.current?.click()}>
                  <ImagePlus className="mr-1 h-4 w-4" />
                  {image ? (lang === "hi" ? "बदलें" : "Change") : (lang === "hi" ? "जोड़ें" : "Upload")}
                </Button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPickImage(e.target.files?.[0])} />
                {image && <img src={image} alt="preview" className="h-11 w-11 rounded-xl object-cover border border-border" />}
              </div>
            </div>
          </div>
          <Button size="lg" className="mt-4 rounded-full shadow-warm" onClick={handleList}>
            <Plus className="mr-1 h-4 w-4" />
            {lang === "hi" ? "मंडी में डालें" : "List on marketplace"}
          </Button>
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Mic className="h-3 w-3" /> {lang === "hi" ? "हिंदी या अपनी भाषा में बोलें" : "Speak in Hindi or your local language"}
          </p>

          <div className="mt-8">
            <h3 className="font-display text-lg font-semibold">{t("yourProducts")}</h3>
            <div className="mt-3 space-y-2">
              {myAdded.map((p) => (
                <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-3">
                  {p.image ? (
                    <img src={p.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-xl">🌾</div>
                  )}
                  <div className="flex-1">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.stockKg} {p.unit} · {p.category}</div>
                  </div>
                  <div className="font-display text-lg font-bold text-primary">₹{p.price}</div>
                  <Button size="icon" variant="ghost" onClick={() => removeProduct(p.id)} aria-label="Remove">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {seedProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-border bg-background/60 p-3">
                  <img src={p.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="font-semibold">{p.name[lang]}</div>
                    <div className="text-xs text-muted-foreground">{p.stockKg} kg in stock</div>
                  </div>
                  <div className="font-display text-lg font-bold text-primary">₹{p.price}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Smart panel */}
        <aside className="space-y-4">
          <div className="rounded-3xl border border-border bg-gradient-sun p-6 text-primary-foreground shadow-warm">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
              <CloudSun className="h-5 w-5" /> {t("weather")}
            </h3>
            <p className="mt-2 text-sm leading-snug opacity-95">{weatherAdvisory.tip[lang]}</p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-display text-lg font-semibold">{t("demand")}</h3>
            <ul className="mt-3 space-y-2">
              {demandSignals.map((d) => (
                <li key={d.crop.en} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{d.crop[lang]}</span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${d.direction === "up" ? "bg-leaf/15 text-leaf" : "bg-destructive/10 text-destructive"}`}>
                    {d.direction === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {d.trend}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-display text-lg font-semibold">{t("bestCrop")}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{lang === "hi" ? "अगले 30 दिन के लिए" : "For the next 30 days"}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Tomato", "Spinach", "Mango", "Okra"].map((c) => (
                <span key={c} className="rounded-full bg-accent px-3 py-1 text-xs font-semibold">{c}</span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

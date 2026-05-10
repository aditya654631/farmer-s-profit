import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Sprout, ShoppingBasket, UserCog, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth, roleHome, type Role } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — KisanKart" }] }),
  component: Signup,
});

const roleMeta: Record<Role, { en: string; hi: string; Icon: typeof Sprout; tagline: { en: string; hi: string } }> = {
  farmer: {
    en: "Farmer", hi: "किसान", Icon: Sprout,
    tagline: { en: "Sell your produce directly", hi: "अपनी फसल सीधे बेचें" },
  },
  consumer: {
    en: "Consumer", hi: "ग्राहक", Icon: ShoppingBasket,
    tagline: { en: "Buy fresh from farms", hi: "खेत से ताज़ा खरीदें" },
  },
  admin: {
    en: "Admin", hi: "व्यवस्थापक", Icon: UserCog,
    tagline: { en: "Manage the platform", hi: "प्लेटफ़ॉर्म प्रबंधित करें" },
  },
};

function Signup() {
  const { lang } = useI18n();
  const nav = useNavigate();
  const signup = useAuth((s) => s.signup);

  const [role, setRole] = useState<Role>("consumer");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const canSendOtp = name.trim().length >= 2 && phone.length === 10;

  const submit = () => {
    const account = signup({ name: name.trim(), phone, role, village: village.trim() || undefined });
    toast.success(lang === "hi" ? "खाता बन गया" : "Account created", {
      description: `${account.name} · ${roleMeta[account.role][lang]}`,
    });
    nav({ to: roleHome[account.role] });
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 md:grid-cols-2 md:items-start">
      <div>
        <h1 className="font-display text-4xl font-bold md:text-5xl">
          {lang === "hi" ? "खाता बनाएँ" : "Create your account"}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {lang === "hi"
            ? "एक मिनट में शुरू करें — मोबाइल नंबर ही काफ़ी है।"
            : "Get started in a minute — just your mobile number."}
        </p>
        <div className="mt-8 space-y-4">
          {(Object.keys(roleMeta) as Role[]).map((r) => {
            const { Icon, tagline } = roleMeta[r];
            const active = role === r;
            return (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors ${
                  active ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-accent"
                }`}
              >
                <span className={`grid h-11 w-11 place-items-center rounded-xl ${active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/70"}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold">{roleMeta[r][lang]}</span>
                  <span className="text-xs text-muted-foreground">{tagline[lang]}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-8 shadow-warm">
        {!otpSent ? (
          <>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {lang === "hi" ? "पूरा नाम" : "Full name"}
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === "hi" ? "जैसे, राम कुमार" : "e.g. Ramesh Kumar"}
              className="mt-2 h-12 rounded-2xl"
            />

            <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {lang === "hi" ? "मोबाइल नंबर" : "Mobile number"}
            </label>
            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-border bg-background px-3">
              <span className="text-muted-foreground">+91</span>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                maxLength={10}
                placeholder="98765 43210"
                className="h-12 border-0 bg-transparent text-lg shadow-none focus-visible:ring-0"
              />
            </div>

            {role === "farmer" && (
              <>
                <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {lang === "hi" ? "गाँव / शहर" : "Village / Town"}
                </label>
                <Input
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder={lang === "hi" ? "जैसे, रामपुर" : "e.g. Rampur"}
                  className="mt-2 h-12 rounded-2xl"
                />
              </>
            )}

            <Button
              size="lg"
              className="mt-6 w-full rounded-full text-base shadow-warm"
              disabled={!canSendOtp}
              onClick={() => {
                setOtpSent(true);
                toast.success(lang === "hi" ? "OTP भेजा गया" : "OTP sent", {
                  description: lang === "hi" ? "कोई भी 6 अंक डालें (डेमो)" : "Enter any 6 digits (demo)",
                });
              }}
            >
              {lang === "hi" ? "OTP भेजें" : "Send OTP"} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              <ShieldCheck className="mr-1 inline h-3 w-3" />
              {lang === "hi" ? "हम आपकी जानकारी सुरक्षित रखते हैं।" : "Your details stay private and secure."}
            </p>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              {lang === "hi" ? "पहले से खाता है?" : "Already have an account?"}{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                {lang === "hi" ? "लॉगिन करें" : "Sign in"}
              </Link>
            </p>
          </>
        ) : (
          <>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {lang === "hi" ? "OTP पुष्टि करें" : "Verify OTP"}
            </label>
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              placeholder="••••••"
              className="mt-2 h-14 rounded-2xl text-center text-2xl tracking-[0.6em]"
            />
            <Button
              size="lg"
              className="mt-5 w-full rounded-full text-base shadow-warm"
              disabled={otp.length !== 6}
              onClick={submit}
            >
              {lang === "hi" ? "खाता बनाएँ" : "Create account"}
            </Button>
            <button
              onClick={() => setOtpSent(false)}
              className="mt-3 w-full text-center text-xs text-muted-foreground hover:underline"
            >
              {lang === "hi" ? "विवरण बदलें" : "Edit details"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

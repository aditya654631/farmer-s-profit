import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Smartphone, ShieldCheck, ArrowRight, Sprout, ShoppingBasket, UserCog } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth, roleHome, type Role } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — KisanKart" }] }),
  component: Login,
});

const roleMeta: Record<Role, { en: string; hi: string; Icon: typeof Sprout }> = {
  farmer: { en: "Farmer", hi: "किसान", Icon: Sprout },
  consumer: { en: "Consumer", hi: "ग्राहक", Icon: ShoppingBasket },
  admin: { en: "Admin", hi: "व्यवस्थापक", Icon: UserCog },
};

function Login() {
  const { lang } = useI18n();
  const nav = useNavigate();
  const login = useAuth((s) => s.login);
  const accounts = useAuth((s) => s.accounts);

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState<Role>("consumer");

  const verify = () => {
    const account = login(phone, role);
    if (!account) {
      toast.error(lang === "hi" ? "खाता नहीं मिला" : "No account found", {
        description: lang === "hi" ? "कृपया पहले साइन अप करें।" : "Please sign up first.",
      });
      return;
    }
    toast.success(lang === "hi" ? "लॉगिन सफल" : "Signed in", {
      description: `${account.name} · ${roleMeta[account.role][lang]}`,
    });
    nav({ to: roleHome[account.role] });
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center">
      <div>
        <h1 className="font-display text-4xl font-bold md:text-5xl">
          {lang === "hi" ? "स्वागत है" : "Welcome back"}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {lang === "hi"
            ? "अपने मोबाइल नंबर से लॉगिन करें — कोई पासवर्ड नहीं।"
            : "Sign in with your mobile number — no passwords."}
        </p>
        <ul className="mt-8 space-y-3 text-sm">
          <li className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-leaf" />{" "}
            {lang === "hi" ? "सुरक्षित OTP" : "Secure OTP authentication"}
          </li>
          <li className="flex items-center gap-3">
            <Smartphone className="h-4 w-4 text-leaf" />{" "}
            {lang === "hi" ? "किसी भी फ़ोन पर" : "Works on any phone"}
          </li>
        </ul>
        <p className="mt-8 text-sm text-muted-foreground">
          {lang === "hi" ? "नए हैं?" : "New here?"}{" "}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            {lang === "hi" ? "खाता बनाएँ" : "Create an account"}
          </Link>
        </p>
        {accounts.length > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            {accounts.length} {lang === "hi" ? "डेमो खाते सहेजे गए" : "demo account(s) on this device"}
          </p>
        )}
      </div>

      <div className="rounded-3xl border border-border bg-card p-8 shadow-warm">
        {step === "phone" ? (
          <>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {lang === "hi" ? "मैं हूँ" : "I am a"}
            </label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(Object.keys(roleMeta) as Role[]).map((r) => {
                const { Icon } = roleMeta[r];
                const active = role === r;
                return (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`flex flex-col items-center gap-1 rounded-2xl border p-3 text-xs font-semibold transition-colors ${
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-foreground/70 hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {roleMeta[r][lang]}
                  </button>
                );
              })}
            </div>

            <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
            <Button
              size="lg"
              className="mt-5 w-full rounded-full text-base"
              disabled={phone.length !== 10}
              onClick={() => {
                setStep("otp");
                toast.success(lang === "hi" ? "OTP भेजा गया" : "OTP sent", {
                  description: lang === "hi" ? "कोई भी 6 अंक डालें (डेमो)" : "Enter any 6 digits (demo)",
                });
              }}
            >
              {lang === "hi" ? "OTP भेजें" : "Send OTP"} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {lang === "hi" ? "6-अंकीय OTP" : "6-digit OTP"}
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
              onClick={verify}
            >
              {lang === "hi" ? "जारी रखें" : "Continue"}
            </Button>
            <button
              onClick={() => setStep("phone")}
              className="mt-3 w-full text-center text-xs text-muted-foreground hover:underline"
            >
              {lang === "hi" ? "नंबर बदलें" : "Change number"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

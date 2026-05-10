import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Leaf, ShoppingBasket, Sprout, Languages, ShieldCheck, Home, LogOut, LogIn, UserCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function SiteHeader() {
  const { lang, setLang, t } = useI18n();
  const count = useCart((s) => s.count());
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const nav = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setConfirmOpen(false);
    toast.success(lang === "hi" ? "लॉग आउट हो गए" : "Signed out");
    nav({ to: "/" });
  };

  const link = (to: string, label: string, Icon: React.ComponentType<{ className?: string }>) => {
    const active = path === to || (to !== "/" && path.startsWith(to));
    return (
      <Link
        to={to}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
          active ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-accent hover:text-foreground"
        }`}
      >
        <Icon className="h-4 w-4" />
        <span className="hidden sm:inline">{label}</span>
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-sun text-primary-foreground shadow-warm">
            <Sprout className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">{t("brand")}</span>
        </Link>

        <nav className="flex items-center gap-1">
          {link("/", t("nav.home"), Home)}
          {link("/market", t("nav.market"), Leaf)}
          {link("/farmer", t("nav.farmer"), Sprout)}
          {link("/admin", t("nav.admin"), ShieldCheck)}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-foreground/80 transition-colors hover:bg-accent"
            aria-label="Toggle language"
          >
            <Languages className="h-3.5 w-3.5" />
            {lang === "en" ? "हिंदी" : "EN"}
          </button>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <Link to="/cart" className="flex items-center gap-1.5">
              <ShoppingBasket className="h-4 w-4" />
              <span>{count > 0 ? `${count.toFixed(1)}kg` : t("nav.cart")}</span>
            </Link>
          </Button>

          {user ? (
            <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-1">
              <UserCircle2 className="h-4 w-4 text-primary" />
              <span className="hidden text-xs font-semibold sm:inline">{user.name.split(" ")[0]}</span>
              <button
                onClick={() => setConfirmOpen(true)}
                aria-label="Logout"
                className="rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Button asChild size="sm" className="rounded-full">
              <Link to="/login" className="flex items-center gap-1.5">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">{lang === "hi" ? "लॉगिन" : "Login"}</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {lang === "hi" ? "क्या आप लॉग आउट करना चाहते हैं?" : "Sign out?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {lang === "hi"
                ? "आपको होम पेज पर भेज दिया जाएगा।"
                : "You'll be redirected to the home page."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{lang === "hi" ? "रद्द करें" : "Cancel"}</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              {lang === "hi" ? "लॉग आउट" : "Sign out"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-24 border-t border-border/60 bg-card/50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-sun text-primary-foreground">
              <Sprout className="h-4 w-4" />
            </span>
            <span className="font-display text-lg font-semibold">{t("brand")}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{t("tagline")}</p>
        </div>
        <div className="text-sm">
          <h4 className="font-display text-base font-semibold">Platform</h4>
          <ul className="mt-2 space-y-1.5 text-muted-foreground">
            <li>Marketplace</li>
            <li>Farmer Tools</li>
            <li>Logistics Network</li>
            <li>UPI &amp; COD</li>
          </ul>
        </div>
        <div className="text-sm">
          <h4 className="font-display text-base font-semibold">Mission</h4>
          <p className="mt-2 text-muted-foreground">
            Fair prices for farmers. Fresh produce for families. Less waste between.
          </p>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} KisanKart — Sowing prosperity.
      </div>
    </footer>
  );
}

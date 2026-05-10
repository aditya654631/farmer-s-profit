import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Smartphone, Copy, Check, ExternalLink, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

// Demo merchant VPA — replace with the farmer/platform's real UPI ID in production.
const MERCHANT_VPA = "kisankart@upi";
const MERCHANT_NAME = "KisanKart";

export function buildUpiUri({
  amount,
  note,
  txnRef,
}: {
  amount: number;
  note: string;
  txnRef: string;
}) {
  // NPCI UPI deep-link spec: upi://pay?pa=&pn=&am=&cu=INR&tn=&tr=
  const params = new URLSearchParams({
    pa: MERCHANT_VPA,
    pn: MERCHANT_NAME,
    am: amount.toFixed(2),
    cu: "INR",
    tn: note,
    tr: txnRef,
  });
  return `upi://pay?${params.toString()}`;
}

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  amount: number;
  onPaid: () => void;
};

export function UpiPaymentDialog({ open, onOpenChange, amount, onPaid }: Props) {
  const { lang } = useI18n();
  const [qr, setQr] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [txnRef] = useState(() => `KK${Date.now().toString().slice(-10)}`);

  const note = lang === "hi" ? "किसानकार्ट ऑर्डर" : "KisanKart Order";
  const upiUri = buildUpiUri({ amount, note, txnRef });

  useEffect(() => {
    if (!open) return;
    QRCode.toDataURL(upiUri, {
      width: 320,
      margin: 1,
      color: { dark: "#3a2418", light: "#ffffff" },
    }).then(setQr);
  }, [open, upiUri]);

  const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad/i.test(navigator.userAgent);

  const copyVpa = async () => {
    await navigator.clipboard.writeText(MERCHANT_VPA);
    setCopied(true);
    toast.success(lang === "hi" ? "UPI ID कॉपी हो गई" : "UPI ID copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {lang === "hi" ? "UPI से भुगतान" : "Pay with UPI"}
          </DialogTitle>
          <DialogDescription>
            {lang === "hi"
              ? "किसी भी UPI ऐप से QR स्कैन करें या नीचे टैप करें।"
              : "Scan with any UPI app, or tap below to open."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <div className="rounded-3xl border-4 border-primary/15 bg-white p-3 shadow-warm">
            {qr ? (
              <img src={qr} alt="UPI QR code" width={260} height={260} className="block" />
            ) : (
              <div className="grid h-[260px] w-[260px] place-items-center text-sm text-muted-foreground">
                Generating…
              </div>
            )}
          </div>

          <div className="text-center">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              {lang === "hi" ? "भुगतान राशि" : "Amount due"}
            </div>
            <div className="font-display text-3xl font-bold text-primary">₹{amount.toFixed(0)}</div>
          </div>

          <button
            onClick={copyVpa}
            className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground/80 hover:bg-accent"
          >
            <span className="font-mono">{MERCHANT_VPA}</span>
            {copied ? <Check className="h-3 w-3 text-leaf" /> : <Copy className="h-3 w-3" />}
          </button>

          {isMobile && (
            <Button asChild size="lg" className="w-full rounded-full shadow-warm">
              <a href={upiUri}>
                <Smartphone className="mr-1 h-4 w-4" />
                {lang === "hi" ? "UPI ऐप खोलें" : "Open UPI App"}
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          )}

          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-leaf" />
            {lang === "hi" ? "सुरक्षित NPCI लेनदेन" : "Secure NPCI transaction"}
            <span className="font-mono"> · {txnRef}</span>
          </p>

          <div className="flex w-full gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1 rounded-full"
              onClick={() => onOpenChange(false)}
            >
              {lang === "hi" ? "रद्द करें" : "Cancel"}
            </Button>
            <Button
              className="flex-1 rounded-full"
              onClick={() => {
                onOpenChange(false);
                onPaid();
              }}
            >
              {lang === "hi" ? "भुगतान हो गया" : "I've paid"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

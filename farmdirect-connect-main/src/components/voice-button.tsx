import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type SR = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export function VoiceButton({ onTranscript }: { onTranscript: (text: string) => void }) {
  const { lang, t } = useI18n();
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recRef = useRef<SR | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) setSupported(false);
  }, []);

  const toggle = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const rec: SR = new SR();
    rec.lang = lang === "hi" ? "hi-IN" : "en-IN";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      onTranscript(text);
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  if (!supported) return null;

  return (
    <button
      onClick={toggle}
      type="button"
      aria-label="Voice search"
      className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-all ${
        listening
          ? "animate-pulse bg-destructive text-destructive-foreground"
          : "bg-leaf text-leaf-foreground hover:opacity-90"
      }`}
    >
      {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      <span className="hidden sm:inline">{t("voice")}</span>
    </button>
  );
}

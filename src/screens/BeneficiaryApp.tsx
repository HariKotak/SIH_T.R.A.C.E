/**
 * Screen 5 — Beneficiary SOS App
 * ------------------------------------------------------------------
 * Three large buttons (Give Feedback / Report Issue / SOS) with a
 * language switch (English · हिंदी · ગુજરાતી).
 *
 * SOS asks for confirmation first (to avoid accidental taps), then shows
 * "SOS submitted successfully" with reference SOS-2847.
 * Feedback / Report Issue show a simple "recorded" confirmation.
 */
import { useState, type ReactNode } from "react";
import { AlertOctagon, ArrowLeft, CheckCircle2, MessageSquare, TriangleAlert } from "lucide-react";
import { SOS_REFERENCE } from "../data/mockData";
import { PhoneFrame } from "../components/ui";

type Lang = "en" | "hi" | "gu";
type View = "home" | "confirmSos" | "sosDone" | "recorded";

/** All user-facing strings, per language. */
const T: Record<Lang, Record<string, string>> = {
  en: {
    title: "Beneficiary Help Desk",
    feedback: "Give Feedback",
    issue: "Report Issue",
    sos: "SOS",
    sosHint: "Emergency — alerts the District Officer",
    confirm: "Send an emergency alert to the District Officer?",
    yes: "Yes, send SOS",
    cancel: "Cancel",
    sosDone: "SOS submitted successfully.",
    reference: "Reference",
    recorded: "Thank you. Your response has been recorded.",
    back: "Back",
    anon: "Your identity is kept confidential.",
  },
  hi: {
    title: "लाभार्थी सहायता",
    feedback: "प्रतिक्रिया दें",
    issue: "समस्या की रिपोर्ट करें",
    sos: "SOS",
    sosHint: "आपातकाल — ज़िला अधिकारी को सूचना",
    confirm: "ज़िला अधिकारी को आपातकालीन अलर्ट भेजें?",
    yes: "हाँ, SOS भेजें",
    cancel: "रद्द करें",
    sosDone: "SOS सफलतापूर्वक भेजा गया।",
    reference: "संदर्भ",
    recorded: "धन्यवाद। आपकी प्रतिक्रिया दर्ज कर ली गई है।",
    back: "वापस",
    anon: "आपकी पहचान गोपनीय रखी जाएगी।",
  },
  gu: {
    title: "લાભાર્થી સહાય",
    feedback: "પ્રતિસાદ આપો",
    issue: "સમસ્યાની જાણ કરો",
    sos: "SOS",
    sosHint: "કટોકટી — જિલ્લા અધિકારીને જાણ",
    confirm: "જિલ્લા અધિકારીને કટોકટી ચેતવણી મોકલો?",
    yes: "હા, SOS મોકલો",
    cancel: "રદ કરો",
    sosDone: "SOS સફળતાપૂર્વક મોકલાયું.",
    reference: "સંદર્ભ",
    recorded: "આભાર. તમારો પ્રતિસાદ નોંધાઈ ગયો છે.",
    back: "પાછા",
    anon: "તમારી ઓળખ ગુપ્ત રાખવામાં આવશે.",
  },
};

const LANGS: { id: Lang; label: string }[] = [
  { id: "en", label: "English" },
  { id: "hi", label: "हिंदी" },
  { id: "gu", label: "ગુજરાતી" },
];

// Indic fonts so Hindi / Gujarati render cleanly.
const FONT: Record<Lang, string> = {
  en: "",
  hi: "font-['Noto_Sans_Devanagari',_'IBM_Plex_Sans',_sans-serif]",
  gu: "font-['Noto_Sans_Gujarati',_'IBM_Plex_Sans',_sans-serif]",
};

export default function BeneficiaryApp() {
  const [lang, setLang] = useState<Lang>("en");
  const [view, setView] = useState<View>("home");
  const t = T[lang];

  return (
    <PhoneFrame>
      <div className={FONT[lang]}>
        {/* App bar */}
        <div className="bg-navy-900 px-4 py-3 text-white">
          <div className="font-mono text-sm font-semibold tracking-[0.15em]">T.R.A.C.E.</div>
          <div className="text-xs text-white/70">{t.title} · ABC Welfare Institute</div>
        </div>

        {/* Language switch */}
        <div className="flex gap-1 p-3" role="radiogroup" aria-label="Language">
          {LANGS.map((l) => (
            <button
              key={l.id}
              role="radio"
              aria-checked={lang === l.id}
              onClick={() => setLang(l.id)}
              className={`flex-1 rounded-md border px-2 py-1.5 text-sm ${
                lang === l.id ? "border-teal-600 bg-teal-600 font-semibold text-white" : "border-surface-line bg-white text-ink-600"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="px-4 pb-6">
          {/* Home: three big buttons */}
          {view === "home" && (
            <div className="flex flex-col gap-3">
              <BigButton icon={<MessageSquare size={26} />} label={t.feedback} onClick={() => setView("recorded")} />
              <BigButton icon={<TriangleAlert size={26} />} label={t.issue} onClick={() => setView("recorded")} />
              <button
                onClick={() => setView("confirmSos")}
                className="flex flex-col items-center justify-center rounded-xl bg-crit py-8 text-white shadow-sm hover:brightness-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-crit/40"
              >
                <AlertOctagon size={40} />
                <span className="mt-2 text-3xl font-bold tracking-wider">{t.sos}</span>
                <span className="mt-1 text-xs text-white/85">{t.sosHint}</span>
              </button>
              <p className="text-center text-xs text-ink-400">{t.anon}</p>
            </div>
          )}

          {/* SOS confirmation step */}
          {view === "confirmSos" && (
            <div className="card mt-4 p-5 text-center">
              <AlertOctagon size={40} className="mx-auto text-crit" />
              <p className="mt-3 text-base font-semibold">{t.confirm}</p>
              <div className="mt-5 flex flex-col gap-2">
                <button onClick={() => setView("sosDone")} className="btn-danger py-3 text-base">{t.yes}</button>
                <button onClick={() => setView("home")} className="btn-ghost py-3">{t.cancel}</button>
              </div>
            </div>
          )}

          {/* SOS submitted */}
          {view === "sosDone" && (
            <Result text={t.sosDone} extra={<>{t.reference}: <span className="font-mono font-semibold text-ink-900">{SOS_REFERENCE}</span></>} back={t.back} onBack={() => setView("home")} />
          )}

          {/* Feedback / issue recorded */}
          {view === "recorded" && <Result text={t.recorded} back={t.back} onBack={() => setView("home")} />}
        </div>
      </div>
    </PhoneFrame>
  );
}

/* ------------------------------- Helpers ----------------------------- */

function BigButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-4 rounded-xl border border-surface-line bg-white px-5 py-5 text-left text-lg font-semibold text-navy-900 shadow-sm hover:border-teal-500">
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 text-teal-700">{icon}</span>
      {label}
    </button>
  );
}

function Result({ text, extra, back, onBack }: { text: string; extra?: ReactNode; back: string; onBack: () => void }) {
  return (
    <div className="flex flex-col items-center pt-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ok/10 text-ok">
        <CheckCircle2 size={44} />
      </div>
      <p className="mt-4 text-lg font-semibold">{text}</p>
      {extra && <p className="mt-2 text-sm text-ink-600">{extra}</p>}
      <button onClick={onBack} className="btn-ghost mt-8">
        <ArrowLeft size={15} /> {back}
      </button>
    </div>
  );
}

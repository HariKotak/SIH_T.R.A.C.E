/**
 * Screen 5 — Beneficiary Help Desk
 * ------------------------------------------------------------------
 * Three large buttons:
 * - Give Feedback
 * - Report Issue
 * - SOS
 *
 * Feedback / Report Issue use the same demo-modal interaction
 * as the GPT prototype:
 * form -> submit -> success -> reference ID -> OK
 *
 * No backend is connected; everything is local React state.
 */

import { useState, type FormEvent, type ReactNode } from "react";
import {
  AlertOctagon,
  ArrowLeft,
  CheckCircle2,
  FileText,
  MessageSquare,
  X,
} from "lucide-react";
import { SOS_REFERENCE } from "../data/mockData";
import { PhoneFrame } from "../components/ui";

type Lang = "en" | "hi" | "gu";

type View = "home" | "confirmSos" | "sosDone";

type SubmissionType = "feedback" | "issue" | null;

type ModalStep = "form" | "success";

const T: Record<Lang, Record<string, string>> = {
  en: {
    title: "Beneficiary Help Desk",

    feedback: "Give Feedback",
    issue: "Report Issue",

    demoSubmission:
      "Demo submission · Your message stays in this prototype.",

    yourMessage: "Your message",
    submit: "Submit",

    submittedSuccessfully: "Submitted successfully",
    reference: "Reference",
    ok: "OK",

    sos: "SOS",
    sosHint: "Emergency — alerts the District Officer",
    confirm:
      "Send an emergency alert to the District Officer?",
    yes: "Yes, send SOS",
    cancel: "Cancel",
    sosDone: "SOS submitted successfully.",

    back: "Back",
    anon: "Your identity is kept confidential.",
  },

  hi: {
    title: "लाभार्थी सहायता",

    feedback: "प्रतिक्रिया दें",
    issue: "समस्या की रिपोर्ट करें",

    demoSubmission:
      "डेमो सबमिशन · आपका संदेश इसी प्रोटोटाइप में रहेगा।",

    yourMessage: "आपका संदेश",
    submit: "सबमिट करें",

    submittedSuccessfully: "सफलतापूर्वक सबमिट किया गया",
    reference: "संदर्भ",
    ok: "OK",

    sos: "SOS",
    sosHint: "आपातकाल — ज़िला अधिकारी को सूचना",
    confirm:
      "ज़िला अधिकारी को आपातकालीन अलर्ट भेजें?",
    yes: "हाँ, SOS भेजें",
    cancel: "रद्द करें",
    sosDone: "SOS सफलतापूर्वक भेजा गया।",

    back: "वापस",
    anon: "आपकी पहचान गोपनीय रखी जाएगी।",
  },

  gu: {
    title: "લાભાર્થી સહાય",

    feedback: "પ્રતિસાદ આપો",
    issue: "સમસ્યાની જાણ કરો",

    demoSubmission:
      "ડેમો સબમિશન · તમારો સંદેશ આ પ્રોટોટાઇપમાં રહેશે.",

    yourMessage: "તમારો સંદેશ",
    submit: "સબમિટ કરો",

    submittedSuccessfully: "સફળતાપૂર્વક સબમિટ થયું",
    reference: "સંદર્ભ",
    ok: "OK",

    sos: "SOS",
    sosHint: "કટોકટી — જિલ્લા અધિકારીને જાણ",
    confirm:
      "જિલ્લા અધિકારીને કટોકટી ચેતવણી મોકલો?",
    yes: "હા, SOS મોકલો",
    cancel: "રદ કરો",
    sosDone: "SOS સફળતાપૂર્વક મોકલાયું.",

    back: "પાછા",
    anon: "તમારી ઓળખ ગુપ્ત રાખવામાં આવશે.",
  },
};

const LANGS: { id: Lang; label: string }[] = [
  { id: "en", label: "English" },
  { id: "hi", label: "हिंदी" },
  { id: "gu", label: "ગુજરાતી" },
];

const FONT: Record<Lang, string> = {
  en: "",
  hi: "font-['Noto_Sans_Devanagari',_'IBM_Plex_Sans',_sans-serif]",
  gu: "font-['Noto_Sans_Gujarati',_'IBM_Plex_Sans',_sans-serif]",
};

export default function BeneficiaryApp() {
  const [lang, setLang] = useState<Lang>("en");
  const [view, setView] = useState<View>("home");

  const [submissionType, setSubmissionType] =
    useState<SubmissionType>(null);

  const [modalStep, setModalStep] =
    useState<ModalStep>("form");

  const [message, setMessage] = useState("");

  const [reference, setReference] = useState("");

  const t = T[lang];

  const openSubmission = (
    type: Exclude<SubmissionType, null>
  ) => {
    setSubmissionType(type);
    setModalStep("form");
    setMessage("");
    setReference("");
  };

  const closeSubmission = () => {
    setSubmissionType(null);
    setModalStep("form");
    setMessage("");
    setReference("");
  };

  const submitSubmission = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!message.trim() || !submissionType) {
      return;
    }

    if (submissionType === "feedback") {
      setReference("FDB-2848");
    } else {
      setReference("ISS-2849");
    }

    setModalStep("success");
  };

  return (
    <PhoneFrame>
      <div className={FONT[lang]}>
        {/* App bar */}
        <div className="bg-navy-900 px-4 py-3 text-white">
          <div className="font-mono text-sm font-semibold tracking-[0.15em]">
            T.R.A.C.E.
          </div>

          <div className="text-xs text-white/70">
            {t.title} · ABC Welfare Institute
          </div>
        </div>

        {/* Language switch */}
        <div
          className="flex gap-1 p-3"
          role="radiogroup"
          aria-label="Language"
        >
          {LANGS.map((l) => (
            <button
              key={l.id}
              role="radio"
              aria-checked={lang === l.id}
              onClick={() => setLang(l.id)}
              className={`flex-1 rounded-md border px-2 py-1.5 text-sm ${
                lang === l.id
                  ? "border-teal-600 bg-teal-600 font-semibold text-white"
                  : "border-surface-line bg-white text-ink-600"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="px-4 pb-6">
          {/* Home */}
          {view === "home" && (
            <div className="flex flex-col gap-3">
              <BigButton
                icon={<MessageSquare size={26} />}
                label={t.feedback}
                onClick={() =>
                  openSubmission("feedback")
                }
              />

              <BigButton
                icon={<FileText size={26} />}
                label={t.issue}
                onClick={() =>
                  openSubmission("issue")
                }
              />

              <button
                onClick={() =>
                  setView("confirmSos")
                }
                className="flex flex-col items-center justify-center rounded-xl bg-crit py-8 text-white shadow-sm hover:brightness-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-crit/40"
              >
                <AlertOctagon size={40} />

                <span className="mt-2 text-3xl font-bold tracking-wider">
                  {t.sos}
                </span>

                <span className="mt-1 text-xs text-white/85">
                  {t.sosHint}
                </span>
              </button>

              <p className="text-center text-xs text-ink-400">
                {t.anon}
              </p>
            </div>
          )}

          {/* SOS confirmation */}
          {view === "confirmSos" && (
            <div className="card mt-4 p-5 text-center">
              <AlertOctagon
                size={40}
                className="mx-auto text-crit"
              />

              <p className="mt-3 text-base font-semibold">
                {t.confirm}
              </p>

              <div className="mt-5 flex flex-col gap-2">
                <button
                  onClick={() =>
                    setView("sosDone")
                  }
                  className="btn-danger py-3 text-base"
                >
                  {t.yes}
                </button>

                <button
                  onClick={() =>
                    setView("home")
                  }
                  className="btn-ghost py-3"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          )}

          {/* SOS submitted */}
          {view === "sosDone" && (
            <Result
              text={t.sosDone}
              extra={
                <>
                  {t.reference}:{" "}
                  <span className="font-mono font-semibold text-ink-900">
                    {SOS_REFERENCE}
                  </span>
                </>
              }
              back={t.back}
              onBack={() =>
                setView("home")
              }
            />
          )}
        </div>

        {/* Feedback / Issue modal */}
        {submissionType && (
          <SubmissionModal
            title={
              submissionType === "feedback"
                ? t.feedback
                : t.issue
            }
            subtitle={t.demoSubmission}
            step={modalStep}
            message={message}
            reference={reference}
            onMessageChange={setMessage}
            onSubmit={submitSubmission}
            onClose={closeSubmission}
            t={t}
          />
        )}
      </div>
    </PhoneFrame>
  );
}

/* ------------------------------- Helpers ----------------------------- */

function BigButton({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 rounded-xl border border-surface-line bg-white px-5 py-5 text-left text-lg font-semibold text-navy-900 shadow-sm hover:border-teal-500"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
        {icon}
      </span>

      {label}

      <span className="ml-auto text-2xl text-ink-500">
        ›
      </span>
    </button>
  );
}

function SubmissionModal({
  title,
  subtitle,
  step,
  message,
  reference,
  onMessageChange,
  onSubmit,
  onClose,
  t,
}: {
  title: string;
  subtitle: string;
  step: ModalStep;
  message: string;
  reference: string;
  onMessageChange: (value: string) => void;
  onSubmit: (
    e: FormEvent<HTMLFormElement>
  ) => void;
  onClose: () => void;
  t: Record<string, string>;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        className="relative w-full max-w-2xl rounded-xl border border-navy-200 bg-[#f7f9fc] p-8 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 rounded-md p-1 text-ink-500 hover:bg-black/5"
        >
          <X size={22} />
        </button>

        {step === "form" ? (
          <>
            <h2 className="pr-8 text-2xl font-bold text-navy-900">
              {title}
            </h2>

            <p className="mt-4 text-lg text-ink-500">
              {subtitle}
            </p>

            <form
              onSubmit={onSubmit}
              className="mt-7"
            >
              <label className="block">
                <span className="text-lg text-navy-900">
                  {t.yourMessage}
                </span>

                <textarea
                  autoFocus
                  required
                  value={message}
                  onChange={(e) =>
                    onMessageChange(
                      e.target.value
                    )
                  }
                  rows={5}
                  className="mt-4 block w-full resize-none rounded-lg border-2 border-blue-500 bg-white px-4 py-3 text-base text-navy-900 outline-none focus:ring-2 focus:ring-blue-200"
                />
              </label>

              <button
                type="submit"
                className="mt-5 w-full rounded-lg bg-[#7dbfc4] py-4 text-lg font-semibold text-white hover:bg-[#6fb4ba]"
              >
                {t.submit}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-[5px] border-[#2ba37a] text-[#2ba37a]">
                <CheckCircle2 size={34} />
              </div>

              <h2 className="mt-8 text-3xl font-bold text-navy-900">
                {t.submittedSuccessfully}
              </h2>

              <p className="mt-6 text-xl text-[#7893a6]">
                {t.reference}: {reference}
              </p>

              <button
                onClick={onClose}
                className="mt-8 rounded-lg bg-[#078c92] px-8 py-4 text-lg font-semibold text-white hover:bg-[#06777c]"
              >
                {t.ok}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Result({
  text,
  extra,
  back,
  onBack,
}: {
  text: string;
  extra?: ReactNode;
  back: string;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col items-center pt-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ok/10 text-ok">
        <CheckCircle2 size={44} />
      </div>

      <p className="mt-4 text-lg font-semibold">
        {text}
      </p>

      {extra && (
        <p className="mt-2 text-sm text-ink-600">
          {extra}
        </p>
      )}

      <button
        onClick={onBack}
        className="btn-ghost mt-8"
      >
        <ArrowLeft size={15} /> {back}
      </button>
    </div>
  );
}
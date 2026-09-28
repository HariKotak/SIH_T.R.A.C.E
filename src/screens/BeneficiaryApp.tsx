/**
 * Screen 5 — Beneficiary Help Desk
 *
 * Feedback and Report Issue are functional:
 * - Shows a real form
 * - Validates the description
 * - Generates a reference ID
 * - Stores submissions in localStorage
 *
 * SOS flow remains unchanged.
 */

import { useState, type FormEvent, type ReactNode } from "react";
import {
  AlertOctagon,
  ArrowLeft,
  CheckCircle2,
  MessageSquare,
  Send,
  TriangleAlert,
} from "lucide-react";
import { SOS_REFERENCE } from "../data/mockData";
import { PhoneFrame } from "../components/ui";

type Lang = "en" | "hi" | "gu";

type View =
  | "home"
  | "feedback"
  | "issue"
  | "confirmSos"
  | "sosDone"
  | "submitted";

type SubmissionKind = "feedback" | "issue";

interface Submission {
  id: string;
  kind: SubmissionKind;
  category: string;
  message: string;
  rating?: number;
  createdAt: string;
}

const STORAGE_KEY = "trace-beneficiary-submissions";

/** All user-facing strings, per language. */
const T: Record<Lang, Record<string, string>> = {
  en: {
    title: "Beneficiary Help Desk",

    feedback: "Give Feedback",
    issue: "Report Issue",

    feedbackTitle: "Give Feedback",
    feedbackCategory: "Feedback type",
    feedbackCategoryService: "Service quality",
    feedbackCategoryStaff: "Staff behaviour",
    feedbackCategoryFacilities: "Facilities",
    feedbackCategoryScheme: "Scheme benefit",
    feedbackCategoryOther: "Other",
    rating: "Overall rating",
    feedbackMessage: "Tell us about your experience",
    feedbackPlaceholder:
      "What worked well or what should be improved?",
    submitFeedback: "Submit Feedback",

    issueTitle: "Report an Issue",
    issueCategory: "Issue category",
    issueCategoryFood: "Food / Nutrition",
    issueCategoryFacilities: "Facilities",
    issueCategoryStaff: "Staff / Behaviour",
    issueCategoryPayment: "Payment / Benefit",
    issueCategorySafety: "Safety",
    issueCategoryOther: "Other",
    issueMessage: "Describe the issue",
    issuePlaceholder:
      "Explain what happened, where it happened, and what help you need.",
    submitIssue: "Submit Issue",

    required: "Please enter a description before submitting.",

    sos: "SOS",
    sosHint: "Emergency — alerts the District Officer",
    confirm:
      "Send an emergency alert to the District Officer?",
    yes: "Yes, send SOS",
    cancel: "Cancel",
    sosDone: "SOS submitted successfully.",

    feedbackSubmitted:
      "Thank you. Your feedback has been submitted.",
    issueSubmitted:
      "Your issue has been submitted to the monitoring team.",

    reference: "Reference",
    back: "Back",

    anon: "Your identity is kept confidential.",
  },

  hi: {
    title: "लाभार्थी सहायता",

    feedback: "प्रतिक्रिया दें",
    issue: "समस्या की रिपोर्ट करें",

    feedbackTitle: "प्रतिक्रिया दें",
    feedbackCategory: "प्रतिक्रिया का प्रकार",
    feedbackCategoryService: "सेवा की गुणवत्ता",
    feedbackCategoryStaff: "कर्मचारियों का व्यवहार",
    feedbackCategoryFacilities: "सुविधाएँ",
    feedbackCategoryScheme: "योजना का लाभ",
    feedbackCategoryOther: "अन्य",
    rating: "कुल रेटिंग",
    feedbackMessage: "अपने अनुभव के बारे में बताएं",
    feedbackPlaceholder:
      "क्या अच्छा रहा या क्या बेहतर किया जाना चाहिए?",
    submitFeedback: "प्रतिक्रिया भेजें",

    issueTitle: "समस्या की रिपोर्ट करें",
    issueCategory: "समस्या की श्रेणी",
    issueCategoryFood: "भोजन / पोषण",
    issueCategoryFacilities: "सुविधाएँ",
    issueCategoryStaff: "कर्मचारी / व्यवहार",
    issueCategoryPayment: "भुगतान / लाभ",
    issueCategorySafety: "सुरक्षा",
    issueCategoryOther: "अन्य",
    issueMessage: "समस्या का विवरण",
    issuePlaceholder:
      "क्या हुआ, कहाँ हुआ और किस सहायता की आवश्यकता है, बताएं।",
    submitIssue: "समस्या भेजें",

    required:
      "कृपया सबमिट करने से पहले विवरण दर्ज करें।",

    sos: "SOS",
    sosHint: "आपातकाल — ज़िला अधिकारी को सूचना",
    confirm:
      "ज़िला अधिकारी को आपातकालीन अलर्ट भेजें?",
    yes: "हाँ, SOS भेजें",
    cancel: "रद्द करें",
    sosDone: "SOS सफलतापूर्वक भेजा गया।",

    feedbackSubmitted:
      "धन्यवाद। आपकी प्रतिक्रिया भेज दी गई है।",
    issueSubmitted:
      "आपकी समस्या मॉनिटरिंग टीम को भेज दी गई है।",

    reference: "संदर्भ",
    back: "वापस",

    anon: "आपकी पहचान गोपनीय रखी जाएगी।",
  },

  gu: {
    title: "લાભાર્થી સહાય",

    feedback: "પ્રતિસાદ આપો",
    issue: "સમસ્યાની જાણ કરો",

    feedbackTitle: "પ્રતિસાદ આપો",
    feedbackCategory: "પ્રતિસાદનો પ્રકાર",
    feedbackCategoryService: "સેવાની ગુણવત્તા",
    feedbackCategoryStaff: "સ્ટાફનું વર્તન",
    feedbackCategoryFacilities: "સુવિધાઓ",
    feedbackCategoryScheme: "યોજનાનો લાભ",
    feedbackCategoryOther: "અન્ય",
    rating: "કુલ રેટિંગ",
    feedbackMessage: "તમારા અનુભવ વિશે જણાવો",
    feedbackPlaceholder:
      "શું સારું રહ્યું અથવા શું સુધારવું જોઈએ?",
    submitFeedback: "પ્રતિસાદ મોકલો",

    issueTitle: "સમસ્યાની જાણ કરો",
    issueCategory: "સમસ્યાની શ્રેણી",
    issueCategoryFood: "ભોજન / પોષણ",
    issueCategoryFacilities: "સુવિધાઓ",
    issueCategoryStaff: "સ્ટાફ / વર્તન",
    issueCategoryPayment: "ચુકવણી / લાભ",
    issueCategorySafety: "સલામતી",
    issueCategoryOther: "અન્ય",
    issueMessage: "સમસ્યાનું વર્ણન",
    issuePlaceholder:
      "શું થયું, ક્યાં થયું અને તમને કઈ મદદ જોઈએ તે જણાવો.",
    submitIssue: "સમસ્યા મોકલો",

    required:
      "કૃપા કરીને મોકલતા પહેલાં વિગતો દાખલ કરો.",

    sos: "SOS",
    sosHint: "કટોકટી — જિલ્લા અધિકારીને જાણ",
    confirm:
      "જિલ્લા અધિકારીને કટોકટી ચેતવણી મોકલો?",
    yes: "હા, SOS મોકલો",
    cancel: "રદ કરો",
    sosDone: "SOS સફળતાપૂર્વક મોકલાયું.",

    feedbackSubmitted:
      "આભાર. તમારો પ્રતિસાદ મોકલવામાં આવ્યો છે.",
    issueSubmitted:
      "તમારી સમસ્યા મોનિટરિંગ ટીમને મોકલવામાં આવી છે.",

    reference: "સંદર્ભ",
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

function readSubmissions(): Submission[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed)
      ? (parsed as Submission[])
      : [];
  } catch {
    return [];
  }
}

function createReference(
  kind: SubmissionKind
): string {
  const prefix = kind === "feedback" ? "FB" : "ISS";

  const suffix =
    `${Date.now().toString().slice(-6)}` +
    `${Math.floor(Math.random() * 90 + 10)}`;

  return `${prefix}-${suffix}`;
}

export default function BeneficiaryApp() {
  const [lang, setLang] = useState<Lang>("en");
  const [view, setView] = useState<View>("home");

  const t = T[lang];

  const [feedbackCategory, setFeedbackCategory] =
    useState("service");

  const [feedbackRating, setFeedbackRating] =
    useState(5);

  const [feedbackMessage, setFeedbackMessage] =
    useState("");

  const [issueCategory, setIssueCategory] =
    useState("food");

  const [issueMessage, setIssueMessage] =
    useState("");

  const [submittedReference, setSubmittedReference] =
    useState("");

  const [submittedKind, setSubmittedKind] =
    useState<SubmissionKind>("feedback");

  const [error, setError] = useState("");

  const persistSubmission = (
    submission: Submission
  ) => {
    const existing = readSubmissions();

    const next = [
      submission,
      ...existing,
    ].slice(0, 50);

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(next)
    );
  };

  const submitFeedback = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const message = feedbackMessage.trim();

    if (!message) {
      setError(t.required);
      return;
    }

    const id = createReference("feedback");

    persistSubmission({
      id,
      kind: "feedback",
      category: feedbackCategory,
      message,
      rating: feedbackRating,
      createdAt: new Date().toISOString(),
    });

    setSubmittedKind("feedback");
    setSubmittedReference(id);
    setFeedbackMessage("");
    setError("");
    setView("submitted");
  };

  const submitIssue = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const message = issueMessage.trim();

    if (!message) {
      setError(t.required);
      return;
    }

    const id = createReference("issue");

    persistSubmission({
      id,
      kind: "issue",
      category: issueCategory,
      message,
      createdAt: new Date().toISOString(),
    });

    setSubmittedKind("issue");
    setSubmittedReference(id);
    setIssueMessage("");
    setError("");
    setView("submitted");
  };

  const backHome = () => {
    setError("");
    setView("home");
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
                onClick={() => {
                  setError("");
                  setView("feedback");
                }}
              />

              <BigButton
                icon={<TriangleAlert size={26} />}
                label={t.issue}
                onClick={() => {
                  setError("");
                  setView("issue");
                }}
              />

              <button
                onClick={() => setView("confirmSos")}
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

          {/* Feedback form */}
          {view === "feedback" && (
            <HelpFormCard
              title={t.feedbackTitle}
              onBack={backHome}
            >
              <form
                onSubmit={submitFeedback}
                className="space-y-4"
              >

                <label className="block">
                  <span className="label">
                    {t.feedbackCategory}
                  </span>

                  <select
                    value={feedbackCategory}
                    onChange={(e) =>
                      setFeedbackCategory(
                        e.target.value
                      )
                    }
                    className="mt-1 w-full rounded-md border border-surface-line bg-white px-3 py-2 text-sm text-ink-900"
                  >
                    <option value="service">
                      {t.feedbackCategoryService}
                    </option>

                    <option value="staff">
                      {t.feedbackCategoryStaff}
                    </option>

                    <option value="facilities">
                      {t.feedbackCategoryFacilities}
                    </option>

                    <option value="scheme">
                      {t.feedbackCategoryScheme}
                    </option>

                    <option value="other">
                      {t.feedbackCategoryOther}
                    </option>
                  </select>
                </label>

                <div>
                  <span className="label">
                    {t.rating}
                  </span>

                  <div className="mt-2 grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map(
                      (value) => (
                        <button
                          type="button"
                          key={value}
                          onClick={() =>
                            setFeedbackRating(value)
                          }
                          className={`rounded-md border py-2 text-sm font-semibold ${
                            feedbackRating === value
                              ? "border-teal-600 bg-teal-600 text-white"
                              : "border-surface-line bg-white text-ink-700"
                          }`}
                        >
                          {value}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <label className="block">
                  <span className="label">
                    {t.feedbackMessage}
                  </span>

                  <textarea
                    required
                    value={feedbackMessage}
                    onChange={(e) =>
                      setFeedbackMessage(
                        e.target.value
                      )
                    }
                    placeholder={
                      t.feedbackPlaceholder
                    }
                    rows={5}
                    className="mt-1 w-full resize-none rounded-md border border-surface-line bg-white px-3 py-2 text-sm"
                  />
                </label>

                {error && (
                  <FormError text={error} />
                )}

                <button
                  type="submit"
                  className="btn-primary w-full py-3"
                >
                  <Send size={16} />
                  {t.submitFeedback}
                </button>
              </form>
            </HelpFormCard>
          )}

          {/* Issue form */}
          {view === "issue" && (
            <HelpFormCard
              title={t.issueTitle}
              onBack={backHome}
            >
              <form
                onSubmit={submitIssue}
                className="space-y-4"
              >

                <label className="block">
                  <span className="label">
                    {t.issueCategory}
                  </span>

                  <select
                    value={issueCategory}
                    onChange={(e) =>
                      setIssueCategory(
                        e.target.value
                      )
                    }
                    className="mt-1 w-full rounded-md border border-surface-line bg-white px-3 py-2 text-sm text-ink-900"
                  >
                    <option value="food">
                      {t.issueCategoryFood}
                    </option>

                    <option value="facilities">
                      {t.issueCategoryFacilities}
                    </option>

                    <option value="staff">
                      {t.issueCategoryStaff}
                    </option>

                    <option value="payment">
                      {t.issueCategoryPayment}
                    </option>

                    <option value="safety">
                      {t.issueCategorySafety}
                    </option>

                    <option value="other">
                      {t.issueCategoryOther}
                    </option>
                  </select>
                </label>

                <label className="block">
                  <span className="label">
                    {t.issueMessage}
                  </span>

                  <textarea
                    required
                    value={issueMessage}
                    onChange={(e) =>
                      setIssueMessage(
                        e.target.value
                      )
                    }
                    placeholder={
                      t.issuePlaceholder
                    }
                    rows={7}
                    className="mt-1 w-full resize-none rounded-md border border-surface-line bg-white px-3 py-2 text-sm"
                  />
                </label>

                {error && (
                  <FormError text={error} />
                )}

                <button
                  type="submit"
                  className="btn-primary w-full py-3"
                >
                  <Send size={16} />
                  {t.submitIssue}
                </button>
              </form>
            </HelpFormCard>
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
                  onClick={backHome}
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
              onBack={backHome}
            />
          )}

          {/* Feedback / issue submitted */}
          {view === "submitted" && (
            <Result
              text={
                submittedKind === "feedback"
                  ? t.feedbackSubmitted
                  : t.issueSubmitted
              }
              extra={
                <>
                  {t.reference}:{" "}
                  <span className="font-mono font-semibold text-ink-900">
                    {submittedReference}
                  </span>
                </>
              }
              back={t.back}
              onBack={backHome}
            />
          )}
        </div>
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
    </button>
  );
}

function HelpFormCard({
  title,
  onBack,
  children,
}: {
  title: string;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <div className="card mt-1 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-surface-line px-4 py-3">
        <button
          onClick={onBack}
          className="rounded p-1 text-ink-600 hover:bg-surface"
          aria-label="Back"
        >
          <ArrowLeft size={17} />
        </button>

        <h2 className="text-sm font-semibold text-ink-900">
          {title}
        </h2>
      </div>

      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

function FormError({
  text,
}: {
  text: string;
}) {
  return (
    <p
      role="alert"
      className="rounded-md border border-crit/20 bg-crit/5 px-3 py-2 text-xs font-medium text-crit"
    >
      {text}
    </p>
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

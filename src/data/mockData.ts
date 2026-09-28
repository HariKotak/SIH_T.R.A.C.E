/**
 * mockData.ts
 * ------------------------------------------------------------------
 * All data shown in the prototype lives here. Nothing is fetched from
 * a server — every "AI detection", "CCTV count" or "GPS check" in the
 * UI is simulated from these constants.
 *
 * To change what the demo shows, edit this file only.
 */

/* ============================== Types ============================== */

/** Risk / severity levels used across alerts, projects and map markers. */
export type Risk = "LOW" | "MEDIUM" | "HIGH";

export interface Project {
  id: string;
  name: string;
  scheme: string;
  city: string;
  state: string;
  beneficiaries: number;
  riskScore: number; // 0–100, higher = riskier
  compliance: number; // percentage
  risk: Risk;
  /** Position on the schematic Gujarat map (SVG viewBox 0–400 × 0–300). */
  map: { x: number; y: number };
}

export interface Alert {
  id: string;
  title: string;
  projectId: string;
  /** Short key/value facts shown on the alert card. */
  facts: { label: string; value: string }[];
  risk: Risk;
  time: string;
  type: "attendance" | "invoice" | "cctv" | "fund";
}

/* ============================ Dashboard ============================ */

export const KPIS = [
  { label: "Total Projects", value: 248, note: "Across 6 schemes" },
  { label: "Pending Inspections", value: 37, note: "9 due this week" },
  { label: "High Risk Projects", value: 12, note: "+3 since last month", tone: "crit" },
  { label: "Open Alerts", value: 19, note: "5 critical", tone: "warn" },
] as const;

/* ============================= Projects ============================ */

export const PROJECTS: Project[] = [
  { id: "p1", name: "ABC Welfare Institute", scheme: "SMILE", city: "Ahmedabad", state: "Gujarat", beneficiaries: 128, riskScore: 72, compliance: 78, risk: "HIGH", map: { x: 238, y: 148 } },
  { id: "p2", name: "Nutrition Supplies Unit", scheme: "SHRESHTA", city: "Vadodara", state: "Gujarat", beneficiaries: 210, riskScore: 58, compliance: 84, risk: "MEDIUM", map: { x: 268, y: 186 } },
  { id: "p3", name: "Navjeevan De-addiction Centre", scheme: "NAPDDR", city: "Surat", state: "Gujarat", beneficiaries: 64, riskScore: 31, compliance: 93, risk: "LOW", map: { x: 262, y: 246 } },
  { id: "p4", name: "Kaushal Skill Hub", scheme: "PM-DAKSH", city: "Rajkot", state: "Gujarat", beneficiaries: 180, riskScore: 44, compliance: 88, risk: "MEDIUM", map: { x: 140, y: 170 } },
  { id: "p5", name: "Swachhta Karmi Seva Kendra", scheme: "NAMASTE", city: "Gandhinagar", state: "Gujarat", beneficiaries: 92, riskScore: 22, compliance: 96, risk: "LOW", map: { x: 248, y: 128 } },
  { id: "p6", name: "Vayo Senior Citizen Home", scheme: "AVYAY", city: "Bhavnagar", state: "Gujarat", beneficiaries: 75, riskScore: 67, compliance: 74, risk: "HIGH", map: { x: 196, y: 212 } },
  { id: "p7", name: "Kutch Livelihood Centre", scheme: "SMILE", city: "Bhuj", state: "Gujarat", beneficiaries: 58, riskScore: 38, compliance: 90, risk: "LOW", map: { x: 92, y: 92 } },
  { id: "p8", name: "Sagar Shelter Home", scheme: "SMILE", city: "Jamnagar", state: "Gujarat", beneficiaries: 46, riskScore: 55, compliance: 81, risk: "MEDIUM", map: { x: 96, y: 150 } },
];

/** Convenience lookup: PROJECT_BY_ID["p1"] → ABC Welfare Institute */
export const PROJECT_BY_ID: Record<string, Project> = Object.fromEntries(
  PROJECTS.map((p) => [p.id, p]),
);

/** The project used throughout the main demo flow. */
export const DEMO_PROJECT_ID = "p1";

/* ============================== Alerts ============================= */

export const ALERTS: Alert[] = [
  {
    id: "a1",
    title: "Attendance mismatch detected",
    projectId: "p1",
    facts: [
      { label: "Claimed", value: "86" },
      { label: "Detected", value: "54" },
    ],
    risk: "HIGH",
    time: "12 min ago",
    type: "attendance",
  },
  {
    id: "a2",
    title: "Invoice price anomaly",
    projectId: "p2",
    facts: [
      { label: "Item", value: "Nutrition Supplies" },
      { label: "Deviation", value: "+26%" },
    ],
    risk: "HIGH",
    time: "41 min ago",
    type: "invoice",
  },
  {
    id: "a3",
    title: "CCTV feed offline > 6 hrs",
    projectId: "p6",
    facts: [
      { label: "Camera", value: "CAM-02 Dining" },
      { label: "Last frame", value: "08:12" },
    ],
    risk: "MEDIUM",
    time: "2 hrs ago",
    type: "cctv",
  },
  {
    id: "a4",
    title: "Fund utilisation spike",
    projectId: "p8",
    facts: [
      { label: "This month", value: "₹6.2 lakh" },
      { label: "Avg.", value: "₹3.9 lakh" },
    ],
    risk: "MEDIUM",
    time: "5 hrs ago",
    type: "fund",
  },
];

/* ============================== Schemes ============================ */

export const SCHEMES = [
  { code: "SHRESHTA", full: "Residential education for SC students", projects: 46, compliance: 88 },
  { code: "PM-DAKSH", full: "Skill development", projects: 52, compliance: 91 },
  { code: "NAMASTE", full: "Sanitation worker safety", projects: 31, compliance: 94 },
  { code: "NAPDDR", full: "Drug demand reduction", projects: 38, compliance: 79 },
  { code: "SMILE", full: "Livelihood & rehabilitation", projects: 49, compliance: 76 },
  { code: "AVYAY", full: "Senior citizen welfare", projects: 32, compliance: 83 },
];

/* ============================= Analytics =========================== */

/** Last 6 months — used by the dashboard's two small charts. */
export const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
export const INSPECTION_COMPLETION = [62, 68, 71, 77, 81, 85]; // % completed
export const ATTENDANCE_ANOMALIES = [9, 14, 11, 17, 22, 19]; // count flagged by AI

/* ============================ Project detail ======================= */

/** Extra detail for the demo project (ABC Welfare Institute). */
export const DEMO_DETAIL = {
  attendance: { claimed: 86, detected: 54, mismatchPct: 37 },
  cctv: { status: "LIVE", lastChecked: "2 mins ago", personCount: 54 },
  funds: { approved: 24, utilized: 17.8 }, // ₹ lakh
  cameras: [
    { id: "CAM-01", name: "Main Hall", count: 31 },
    { id: "CAM-02", name: "Dining Area", count: 14 },
    { id: "CAM-03", name: "Classroom B", count: 9 },
    { id: "CAM-04", name: "Entrance Gate", count: 0 },
  ],
  pastInspections: [
    { date: "12 Jun 2026", inspector: "R. Mehta", type: "Scheduled", result: "Satisfactory" },
    { date: "03 Mar 2026", inspector: "A. Desai", type: "Scheduled", result: "Minor issues" },
    { date: "18 Nov 2025", inspector: "K. Patel", type: "Surprise", result: "Satisfactory" },
  ],
  evidence: [
    { id: "TRC-00171", kind: "Photo", note: "Kitchen store — stock register", date: "12 Jun 2026" },
    { id: "TRC-00172", kind: "Photo", note: "Dormitory — bed count", date: "12 Jun 2026" },
    { id: "TRC-00173", kind: "Document", note: "Attendance register (scanned)", date: "12 Jun 2026" },
  ],
};

/* ============================ Inspections ========================== */

/** Pool the "random assignment" picks from. The demo always lands on Priya
 *  (so the story is predictable), but the animation cycles through all names. */
export const INSPECTOR_POOL = ["Rahul Mehta", "Anjali Desai", "Kiran Patel", "Priya Sharma", "Farhan Shaikh"];
export const ASSIGNED_INSPECTOR = "Priya Sharma";

/** Starting state of the inspector's checklist (matches the brief). */
export type CheckState = "done" | "warn" | "todo";
export const INITIAL_CHECKLIST: { item: string; state: CheckState }[] = [
  { item: "Infrastructure", state: "done" },
  { item: "Attendance", state: "done" },
  { item: "Food / Nutrition", state: "warn" },
  { item: "Documents", state: "todo" },
];

export const EVIDENCE_ID = "TRC-00184";
export const SOS_REFERENCE = "SOS-2847";

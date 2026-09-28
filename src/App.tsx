/**
 * App.tsx — the prototype's single source of navigation state
 * ------------------------------------------------------------------
 * There is no router and no backend. Three pieces of React state decide
 * what is on screen:
 *
 *   role             null → Login screen
 *                    "officer"   → desktop dashboard with sidebar
 *                    "inspector" → inspector mobile app
 *                    "ngo"       → beneficiary SOS mobile app
 *   page             which officer page is showing
 *   inspectionStatus shared between the officer's Inspections page and
 *                    the inspector app, so submitting on the phone updates
 *                    the officer view
 *
 * Main demo flow:
 *   Login (officer) → Dashboard → attendance alert → Project Details
 *   → CCTV → Surprise VC → Order random inspection → Run Random Assignment
 *   → View Inspector App → Start → GPS → Evidence → Checklist → Submit
 */
import { useState } from "react";
import { ALERTS, DEMO_PROJECT_ID } from "./data/mockData";
import { BrandHeader, Sidebar, type Page } from "./components/Layout";
import Login, { ROLE_LABEL, type Role } from "./screens/Login";
import Dashboard from "./screens/Dashboard";
import ProjectDetails from "./screens/ProjectDetails";
import Inspections, { type InspectionStatus } from "./screens/Inspections";
import InspectorApp from "./screens/InspectorApp";
import BeneficiaryApp from "./screens/BeneficiaryApp";
import { AlertsPage, LiveMonitoring, ProjectsList, Reports } from "./screens/SecondaryPages";

export default function App() {
  const [role, setRole] = useState<Role | null>(null);
  const [page, setPage] = useState<Page>("dashboard");
  const [projectId, setProjectId] = useState(DEMO_PROJECT_ID);
  const [inspectionStatus, setInspectionStatus] = useState<InspectionStatus>("PENDING");

  /** Navigate and scroll to top (feels like a real page change). */
  const go = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0 });
  };

  const openProject = (id: string) => {
    setProjectId(id);
    go("project");
  };

  const logout = () => {
    setRole(null);
    setPage("dashboard");
  };

  /* ---------- 1. No role yet → login ---------- */
  if (!role) {
    return (
      <Login
        onSelect={(r) => {
          setRole(r);
          setPage("dashboard");
        }}
      />
    );
  }

  /* ---------- Mobile-only roles ---------- */
  if (role === "inspector" || role === "ngo") {
    return (
      <div className="flex min-h-full flex-col">
        <BrandHeader roleLabel={ROLE_LABEL[role]} onLogout={logout} />
        <main className="flex-1 px-4 py-6">
          {role === "inspector" ? (
            // Inspector logging in directly lands on today's assigned inspection.
            <InspectorApp onSubmit={() => setInspectionStatus("SUBMITTED")} />
          ) : (
            <BeneficiaryApp />
          )}
        </main>
      </div>
    );
  }

  /* ---------- Government Officer: sidebar layout ---------- */
  return (
    <div className="flex min-h-full flex-col">
      <BrandHeader roleLabel={ROLE_LABEL[role]} onLogout={logout} />
      <div className="flex flex-1 flex-col md:flex-row">
        <Sidebar page={page} onNavigate={go} openAlerts={ALERTS.length} />

        <main className="min-w-0 flex-1 px-4 py-5 md:px-6">
          {page === "dashboard" && <Dashboard onOpenProject={openProject} />}
          {page === "live" && <LiveMonitoring onOpenProject={openProject} />}
          {page === "projects" && <ProjectsList onOpenProject={openProject} />}
          {page === "alerts" && <AlertsPage onOpenProject={openProject} />}
          {page === "reports" && <Reports />}

          {page === "project" && (
            <ProjectDetails
              // `key` resets the page's internal tab/modal state when switching projects
              key={projectId}
              projectId={projectId}
              onBack={() => go("dashboard")}
              onGoInspections={() => go("inspections")}
            />
          )}

          {page === "inspections" && (
            <Inspections status={inspectionStatus} setStatus={setInspectionStatus} onOpenInspectorApp={() => go("inspectorApp")} />
          )}

          {page === "inspectorApp" && (
            <InspectorApp onSubmit={() => setInspectionStatus("SUBMITTED")} onExit={() => go("inspections")} />
          )}
        </main>
      </div>
    </div>
  );
}

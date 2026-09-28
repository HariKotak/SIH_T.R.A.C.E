# T.R.A.C.E. — Clickable Prototype (SIH 2026)

**Transparent Resource & Audit Compliance Ecosystem**
Smart Real-Time Monitoring & Inspection App for the Department of Social Justice & Empowerment.

> Early prototype for team feedback. Everything is mock data + React state.
> No backend, AI, CCTV, WebRTC, Aadhaar, GeM or authentication.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/index.html (one self-contained file you can open or share)
```

## Demo flow (MONITOR → DETECT → VERIFY → INSPECT → REPORT)

1. Choose **Government Officer**
2. Dashboard → click **Attendance mismatch detected**
3. Project Details → **CCTV** tab → click a camera (CCTV modal)
4. **Start Surprise VC** → wait for "connected" → **End call**
5. **Order random inspection** → **Run Random Assignment** → Priya Sharma assigned
6. **View Inspector App** → **Start Inspection** → GPS verified → **Capture Evidence** → shutter
7. Checklist (tap items to change status) → **Submit Inspection**
8. Back to officer view: status is now **SUBMITTED**

Other roles: **PMU Inspector** opens the inspector app directly; **NGO / Institute** opens the
beneficiary app (Feedback / Report Issue / SOS, in English, हिंदी, ગુજરાતી).

## Code map

```
src/
├── App.tsx                  # All navigation state (role, page, inspection status)
├── data/mockData.ts         # Every number/name in the demo; edit here to change the story
├── components/
│   ├── Layout.tsx           # Header, sidebar, MONITOR→REPORT strip, page title
│   ├── ui.tsx               # Badges, Modal, PhoneFrame, simulated CCTV feed, Spinner
│   ├── Charts.tsx           # Tiny SVG bar + line charts (no chart library)
│   ├── GujaratMap.tsx       # Schematic Gujarat map with risk-coloured markers
│   └── SurpriseVC.tsx       # Fake video call (ringing → connected, timer, mute/camera)
└── screens/
    ├── Login.tsx            # Screen 1: role selection
    ├── Dashboard.tsx        # Screen 2: KPIs, alerts, map, schemes, charts
    ├── ProjectDetails.tsx   # Screen 3: key cards + Overview/CCTV/Inspections/Evidence tabs
    ├── Inspections.tsx      # Screen 4a: random assignment (officer side)
    ├── InspectorApp.tsx     # Screen 4b: mobile inspector flow (step machine)
    ├── BeneficiaryApp.tsx   # Screen 5: beneficiary SOS, 3 languages
    └── SecondaryPages.tsx   # Live Monitoring, Projects, AI Alerts, Reports (light pages)
```

Stack: React 18 + TypeScript + Tailwind CSS 3 + Vite, icons from lucide-react.
Brand colours live in `tailwind.config.js` (navy, teal, ok / warn / crit).

/** @type {import('tailwindcss').Config} */
// Brand tokens for T.R.A.C.E. — kept in one place so the whole UI stays consistent.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0A1628", // sidebar / header ground
          900: "#0F2240",
          800: "#17315A",
          700: "#234577",
        },
        teal: {
          50: "#E8F6F5",
          100: "#C9EBE8",
          500: "#0E9F97", // primary accent
          600: "#0B847E",
          700: "#086A65",
        },
        ink: {
          900: "#14202E", // primary text
          600: "#4A5868", // secondary text
          400: "#8793A1", // muted text
        },
        surface: {
          DEFAULT: "#F3F5F8", // page background (cool grey, biased to navy)
          line: "#E1E6EC",    // hairline borders
        },
        ok: "#1E8E4E",       // verified
        warn: "#D9730D",     // warning
        crit: "#C8322B",     // critical
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

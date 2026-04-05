tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Main Brand Colors
        primary: {
          DEFAULT: "#914617", // Artisan Brown
          container: "#b05e2d",
          content: "#ffffff",
        },
        secondary: {
          DEFAULT: "#8e4e14", // Warm Caramel
          container: "#ffab69",
        },
        // Neutral Surface Colors (The "Paper" and "Crumb" tones)
        surface: {
          DEFAULT: "#fff8f0", // Background
          bright: "#fff8f0",
          low: "#faf3e9",
          variant: "#e8e2d8",
          outline: "#877369",
        },
        // Action/Status Colors
        error: "#ba1a1a",
        "on-surface": "#1e1b16",
        "on-surface-variant": "#54433a",
      },
      fontFamily: {
        headline: ["Noto Serif", "serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "4px",
        lg: "8px",
        xl: "12px",
        full: "9999px",
      },
    },
  },
};
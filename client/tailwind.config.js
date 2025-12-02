export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#003F7D",
          dark: "#002D5C",
        },
        orange: {
          DEFAULT: "#F98149",
          dark: "#E55A2A",
        },
      },

      animation: {
        "modal-slide-in": "modalSlideIn 0.3s ease-out",
        "success-pop": "successPop 0.5s ease-out",
      },
      keyframes: {
        modalSlideIn: {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        successPop: {
          "0%": { transform: "scale(0)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

import daisyui from "daisyui";

export default {
  plugins: [daisyui],
  daisyui: { themes: [], logs: false },
  content: ["./**/*.tsx"],
  theme: {
    container: { center: true },
    colors: {
      "white": "#FFFFFF",
      black: {
        500: "#2C2C2C",
        800: "#383838",
        900: "#000000",
      },
      blue: {
        30: "#86b7fe",
        40: "#0D6EFD",
        50: "#E3F3FD",
        100: "#EBFAFF",
        200: "#36BCEE",
        300: "#1e22be",
        400: "#2DBEE6",
        500: "#0057B8",
        600: "#EDF7FB",
        700: "#1e3a8a",
        800: "#2c3e50",
        900: "#001E60",
        950: "#191b9e",
      },
      gray: {
        100: "#BCBEC0",
        200: "#F5F5F5",
        300: "#F4F4F4",
        400: "#F2F2F2",
        500: "#929292",
      },
      red: {
        300: "#C8102E",
        400: "#E0004D",
        900: "#a30d26",
      },
      yellow: {
        50: "#FFFAE6",
        400: "#F5D44F",
        500: "#FFCD00",
      },
      purple: {
        300: "#DBD1E9",
        500: "#9063CD",
      },
      green: {
        100: "#C5E86C",
        200: "#66A851",
        300: "#C4E86B",
      },
      orange: {
        200: "#F18952",
        300: "#F15A22",
      },
    },
  },
};

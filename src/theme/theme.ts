import { createTheme } from "@mui/material/styles";
import { Sora } from "next/font/google";

export const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sora",
});

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1d4ed8",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "var(--font-sora)",
  },
  shape: {
    borderRadius: 12,
  },
});

import { createTheme } from "@mui/material/styles";

/**
 * High Contrast Harmonious Theme
 * Light Palette: #F8FAFC (BG), #FFFFFF (Paper), #0F172A (Slate 900 Text - High Contrast), #1E40AF (Deep Primary Blue)
 * Dark Palette:  #021323 (BG), #03284E (Surface/Paper), #F8FAFC (Text Primary), #6EACDA (Primary Accent)
 */
export const getAppTheme = (mode: "light" | "dark") =>
  createTheme({
    cssVariables: true,
    shape: {
      borderRadius: 14,
    },
    palette: {
      mode,
      primary: {
        main: mode === "light" ? "#1D4ED8" : "#6EACDA",
        light: mode === "light" ? "#3B82F6" : "#90CAF9",
        dark: mode === "light" ? "#1E40AF" : "#03346E",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: mode === "light" ? "#0F172A" : "#E2E2B6",
        contrastText: mode === "light" ? "#FFFFFF" : "#021323",
      },
      background: {
        default: mode === "light" ? "#F1F5F9" : "#021323",
        paper: mode === "light" ? "#FFFFFF" : "#03284E",
      },
      text: {
        primary: mode === "light" ? "#0F172A" : "#F8FAFC",
        secondary: mode === "light" ? "#475569" : "#94A3B8",
      },
      divider:
        mode === "light"
          ? "rgba(15, 23, 42, 0.12)"
          : "rgba(110, 172, 218, 0.15)",
    },
    typography: {
      fontFamily: [
        "Prompt",
        "Inter",
        "Kanit",
        "Sarabun",
        "Roboto",
        "sans-serif",
      ].join(","),
      h5: {
        fontWeight: 700,
        letterSpacing: "-0.01em",
        color: mode === "light" ? "#0F172A" : "#F8FAFC",
      },
      h6: {
        fontWeight: 600,
        letterSpacing: "-0.01em",
        color: mode === "light" ? "#0F172A" : "#F8FAFC",
      },
      body1: {
        color: mode === "light" ? "#0F172A" : "#F8FAFC",
      },
      body2: {
        color: mode === "light" ? "#334155" : "#CBD5E1",
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            borderRadius: 16,
            border:
              mode === "light"
                ? "1px solid rgba(15, 23, 42, 0.08)"
                : "1px solid rgba(110, 172, 218, 0.12)",
            boxShadow:
              mode === "light"
                ? "0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)"
                : "0 8px 32px -4px rgba(0, 0, 0, 0.35)",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border:
              mode === "light"
                ? "1px solid rgba(15, 23, 42, 0.08)"
                : "1px solid rgba(110, 172, 218, 0.14)",
            boxShadow:
              mode === "light"
                ? "0 4px 16px rgba(15, 23, 42, 0.05)"
                : "0 6px 24px rgba(0, 0, 0, 0.3)",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#0F172A" : "#021A30",
            color: "#FFFFFF",
            boxShadow:
              mode === "light"
                ? "0 4px 20px rgba(15, 23, 42, 0.15)"
                : "0 4px 20px rgba(0, 0, 0, 0.4)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            fontWeight: 600,
            boxShadow: "none",
          },
          outlined: {
            borderColor:
              mode === "light"
                ? "rgba(15, 23, 42, 0.2)"
                : "rgba(110, 172, 218, 0.3)",
            color: mode === "light" ? "#0F172A" : "#F8FAFC",
            "&:hover": {
              borderColor: mode === "light" ? "#1D4ED8" : "#6EACDA",
              backgroundColor:
                mode === "light"
                  ? "rgba(29, 78, 216, 0.06)"
                  : "rgba(110, 172, 218, 0.1)",
            },
          },
          contained: {
            backgroundColor: mode === "light" ? "#1D4ED8" : "#6EACDA",
            color: mode === "light" ? "#FFFFFF" : "#021323",
            "&:hover": {
              backgroundColor: mode === "light" ? "#1E40AF" : "#5A9DCB",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 600,
          },
          outlined: {
            borderColor:
              mode === "light"
                ? "rgba(15, 23, 42, 0.2)"
                : "rgba(110, 172, 218, 0.3)",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 20,
            border:
              mode === "light"
                ? "1px solid rgba(15, 23, 42, 0.12)"
                : "1px solid rgba(110, 172, 218, 0.2)",
            boxShadow:
              mode === "light"
                ? "0 20px 40px rgba(15, 23, 42, 0.15)"
                : "0 24px 48px rgba(0, 0, 0, 0.6)",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === "light" ? "#FFFFFF" : "#03284E",
            color: mode === "light" ? "#0F172A" : "#F8FAFC",
            borderRight:
              mode === "light"
                ? "1px solid rgba(15, 23, 42, 0.1)"
                : "1px solid rgba(110, 172, 218, 0.15)",
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            margin: "3px 10px",
            "&.Mui-selected": {
              backgroundColor:
                mode === "light"
                  ? "rgba(29, 78, 216, 0.1)"
                  : "rgba(110, 172, 218, 0.18)",
              color: mode === "light" ? "#1D4ED8" : "#E2E2B6",
              "& .MuiListItemIcon-root": {
                color: mode === "light" ? "#1D4ED8" : "#E2E2B6",
              },
            },
            "&:hover": {
              backgroundColor:
                mode === "light"
                  ? "rgba(29, 78, 216, 0.05)"
                  : "rgba(110, 172, 218, 0.1)",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 12,
              "& fieldset": {
                borderColor:
                  mode === "light"
                    ? "rgba(15, 23, 42, 0.2)"
                    : "rgba(110, 172, 218, 0.25)",
              },
              "&:hover fieldset": {
                borderColor: mode === "light" ? "#1D4ED8" : "#6EACDA",
              },
              "&.Mui-focused fieldset": {
                borderColor: mode === "light" ? "#1D4ED8" : "#6EACDA",
                borderWidth: "1.5px",
              },
            },
          },
        },
      },
    },
  });

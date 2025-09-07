import { create } from 'zustand';

type Theme = "dark" | "light" | "system";

interface SettingsState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  resetSettings: () => void;
}

const initialState = {
  theme: "system" as Theme,
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  // Initial state
  theme: initialState.theme,

  // Actions
  setTheme: (theme) => {
    set({ theme });
    // Store in localStorage
    localStorage.setItem("spendy-theme", theme);
    // Apply theme to document
    applyThemeToDocument(theme);
  },

  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === "light" ? "dark" : "light";
    get().setTheme(newTheme);
  },

  resetSettings: () => {
    set(initialState);
    localStorage.removeItem("spendy-theme");
    applyThemeToDocument(initialState.theme);
  },
}));

// Helper function to apply theme to document
function applyThemeToDocument(theme: Theme) {
  const root = window.document.documentElement;
  
  root.classList.remove("light", "dark");
  
  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
}

// Initialize store with localStorage value
const initializeSettings = () => {
  const storedTheme = localStorage.getItem("spendy-theme") as Theme;
  if (storedTheme && ["dark", "light", "system"].includes(storedTheme)) {
    useSettingsStore.getState().setTheme(storedTheme);
  } else {
    // Apply initial theme
    applyThemeToDocument(initialState.theme);
  }
};

// Initialize on module load
if (typeof window !== 'undefined') {
  initializeSettings();
}

// Selector hooks for better performance
export const useTheme = () => useSettingsStore((state) => state.theme);
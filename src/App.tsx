import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import Page from "./pages/page";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* {children} */}
      <Page />
    </ThemeProvider>
  );
}

export default App;

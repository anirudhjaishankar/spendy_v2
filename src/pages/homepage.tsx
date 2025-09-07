import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { BrowserRouter, useRoutes, Outlet } from "react-router-dom";
import TransactionPage from "./finance-page";
import Error404 from "./error-404";

// Define routes configuration
const routesConfig = [
  {
    path: "/",
    element: <PageLayout />,
    children: [
      {
        path: "/finance/transactions",
        index: true,
        element: <TransactionPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Error404 />,
  },
];

// Component that uses Outlet for nested routes
function PageLayout() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset className="flex flex-col">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}

// Component that uses useRoutes hook
function AppRoutes() {
  const element = useRoutes(routesConfig);
  return element;
}

export default function Page() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

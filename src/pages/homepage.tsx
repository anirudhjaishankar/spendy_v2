import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { BrowserRouter, useRoutes, Outlet, useLocation } from "react-router-dom";
import { SiteHeader } from "@/components/site-header";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import FinancePage from "./finance-page";
import TransactionsPage from "./transactions-page";
import Error404 from "./error-404";

// Define routes configuration
const routesConfig = [
  {
    path: "/",
    element: <PageLayout />,
    children: [
      {
        path: "finance",
        element: <FinancePage />,
        children: [
          {
            path: "transactions",
            element: <TransactionsPage />,
          },
        ],
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
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    
    return {
      path,
      label,
      isLast: index === pathSegments.length - 1
    };
  });

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset className="flex flex-col">
        <SiteHeader />
        <div className="flex w-full flex-1 flex-col">
          <div className="@container/main flex w-full flex-1 flex-col gap-2">
            <div className="flex w-full flex-col gap-4 py-4 md:gap-6 md:py-6">
              {pathSegments.length > 0 && (
                <div className="px-4 lg:px-6">
                  <Breadcrumb className="py-2">
                    <BreadcrumbList>
                      {breadcrumbItems.map((item, index) => (
                        <React.Fragment key={item.path}>
                          {index > 0 && <BreadcrumbSeparator />}
                          <BreadcrumbItem>
                            <BreadcrumbLink href={item.path}>
                              {item.label}
                            </BreadcrumbLink>
                          </BreadcrumbItem>
                        </React.Fragment>
                      ))}
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              )}
              <Outlet />
            </div>
          </div>
        </div>
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

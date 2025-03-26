import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import data from "../app/dashboard/data.json";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset className="flex flex-col">
        <SiteHeader />
        <div className="flex w-full flex-1 flex-col">
          <div className="@container/main flex w-full flex-1 flex-col gap-2">
            <div className="flex w-full flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="w-full px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

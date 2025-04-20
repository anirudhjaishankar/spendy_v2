import { DataTable } from "../components/data-table";
import { SiteHeader } from "../components/site-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import data from "../app/dashboard/data.json";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DatePickerWithRange } from "@/components/date-range-picker";
export default function FinancePage() {
  return (
    <div>
      <SiteHeader />
      <div className="flex w-full flex-1 flex-col">
        <div className="@container/main flex w-full flex-1 flex-col gap-2">
          <div className="flex w-full flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4  lg:px-6">
              <Breadcrumb className="py-2">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/finance/transaction">
                      Finance
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/finance/transaction">
                      Transactions
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h2 className="text-3xl font-bold py-2">Transactions</h2>
              <div className="flex w-full py-2 justify-between">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Add Transaction</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Single</DropdownMenuItem>
                    <DropdownMenuItem>Bulk</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DatePickerWithRange />
              </div>
            </div>

            {/* <SectionCards />
              <div className="w-full px-4 lg:px-6">
                <ChartAreaInteractive />
              </div> */}
            {/* <DataTable data={data} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

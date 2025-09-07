import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/date-range-picker";
// import { DataTable } from "@/components/data-table";
// import data from "@/app/dashboard/data.json";

export default function TransactionsPage() {
  return (
    <div className="px-4 lg:px-6">
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
      {/* <DataTable data={data} /> */}
    </div>
  );
}
import * as React from "react";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  from?: Date;
  to?: Date;
  setRange?: (range: { from?: Date; to?: Date }) => void;
}

export function DatePickerWithRange({
  className,
  from,
  to,
  setRange,
}: DatePickerWithRangeProps) {
  // Default to current week if no dates provided
  const getDefaultRange = React.useCallback((): DateRange => {
    const now = new Date();
    return {
      from: from || startOfWeek(now, { weekStartsOn: 1 }), // Monday start
      to: to || endOfWeek(now, { weekStartsOn: 1 }), // Sunday end
    };
  }, [from, to]);

  const [date, setDate] = React.useState<DateRange | undefined>(getDefaultRange());

  // Update internal state when props change
  React.useEffect(() => {
    setDate(getDefaultRange());
  }, [getDefaultRange]);

  // Handle date change and call callback
  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (setRange && newDate) {
      setRange({
        from: newDate.from,
        to: newDate.to,
      });
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 !z-[9999] relative"
          align="end"
          side="bottom"
          avoidCollisions={false}
        >
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

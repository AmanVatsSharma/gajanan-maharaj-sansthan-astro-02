/**
 * File: src/components/ui/calendar.tsx
 * Module: ui
 * Purpose: Calendar primitive (react-day-picker) with Tailwind styling.
 * Author: Aman Sharma / Novologic/ Cursor AI
 * Last-updated: 2026-02-06
 * Notes:
 * - Keep this component stateless; style via `classNames` mapping.
 * - Mobile-optimized: compact 2rem cells, proper weekday label alignment.
 */
import * as React from "react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2 sm:p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4",
        month: "space-y-2 sm:space-y-4",
        caption: "flex justify-center pt-1 pb-1 relative items-center",
        caption_label: "text-xs sm:text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 sm:h-7 sm:w-7 bg-transparent p-0 opacity-50 hover:opacity-100 touch-manipulation"
        ),
        nav_button_previous: "absolute left-0",
        nav_button_next: "absolute right-0",
        table: "w-full border-collapse",
        head_row: "flex w-full",
        head_cell:
          "text-muted-foreground rounded-md flex-1 w-0 h-8 sm:h-9 font-medium text-[0.65rem] sm:text-[0.8rem] flex items-center justify-center uppercase",
        row: "flex w-full mt-1",
        cell: "flex-1 w-0 h-8 sm:h-9 text-center text-[0.7rem] sm:text-sm p-0 relative flex items-center justify-center [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-full sm:h-9 p-0 text-[0.7rem] sm:text-sm font-normal aria-selected:opacity-100 touch-manipulation"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

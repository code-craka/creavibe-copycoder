"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DateRangePicker() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  })
  const [preset, setPreset] = useState<string>("last30")

  const handlePresetChange = (value: string) => {
    setPreset(value)
    const now = new Date()

    switch (value) {
      case "today":
        setDate({ from: now, to: now })
        break
      case "yesterday": {
        const yesterday = new Date(now)
        yesterday.setDate(yesterday.getDate() - 1)
        setDate({ from: yesterday, to: yesterday })
        break
      }
      case "last7": {
        const last7 = new Date(now)
        last7.setDate(last7.getDate() - 7)
        setDate({ from: last7, to: now })
        break
      }
      case "last30": {
        const last30 = new Date(now)
        last30.setDate(last30.getDate() - 30)
        setDate({ from: last30, to: now })
        break
      }
      case "thisMonth": {
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        setDate({ from: firstDay, to: now })
        break
      }
      case "lastMonth": {
        const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const lastDay = new Date(now.getFullYear(), now.getMonth(), 0)
        setDate({ from: firstDay, to: lastDay })
        break
      }
      case "custom":
        // Don't change the date, just allow custom selection
        break
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Select value={preset} onValueChange={handlePresetChange}>
        <SelectTrigger className="h-9 w-[130px]">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="last7">Last 7 days</SelectItem>
          <SelectItem value="last30">Last 30 days</SelectItem>
          <SelectItem value="thisMonth">This month</SelectItem>
          <SelectItem value="lastMonth">Last month</SelectItem>
          <SelectItem value="custom">Custom range</SelectItem>
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate)
              if (newDate?.from && newDate?.to && preset !== "custom") {
                setPreset("custom")
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const segments = [
  { value: "all", label: "All Users" },
  { value: "new", label: "New Users" },
  { value: "returning", label: "Returning Users" },
  { value: "active", label: "Active Users" },
  { value: "inactive", label: "Inactive Users" },
  { value: "paid", label: "Paid Users" },
  { value: "free", label: "Free Users" },
]

export function SegmentFilter() {
  const [open, setOpen] = useState(false)
  const [selectedSegments, setSelectedSegments] = useState<string[]>(["all"])

  const toggleSegment = (value: string) => {
    if (value === "all") {
      setSelectedSegments(["all"])
      return
    }

    // Remove "all" if it's selected
    let newSelection = selectedSegments.filter((s) => s !== "all")

    if (selectedSegments.includes(value)) {
      newSelection = newSelection.filter((s) => s !== value)
      // If nothing is selected, default to "all"
      if (newSelection.length === 0) {
        newSelection = ["all"]
      }
    } else {
      newSelection.push(value)
    }

    setSelectedSegments(newSelection)
  }

  const getDisplayValue = () => {
    if (selectedSegments.includes("all")) return "All Users"
    return `${selectedSegments.length} segment${selectedSegments.length > 1 ? "s" : ""}`
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          <div className="flex items-center gap-2 truncate">
            <Users className="h-4 w-4" />
            <span>{getDisplayValue()}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search segments..." />
          <CommandList>
            <CommandEmpty>No segment found.</CommandEmpty>
            <CommandGroup>
              {segments.map((segment) => (
                <CommandItem key={segment.value} value={segment.value} onSelect={() => toggleSegment(segment.value)}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedSegments.includes(segment.value) ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {segment.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

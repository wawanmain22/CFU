import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/Components/ui/button"
import { Calendar } from "@/Components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"

interface DatePickerProps {
  value?: Date
  onChange?: (date?: Date) => void
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [selectedMonth, setSelectedMonth] = React.useState<number>(value ? value.getMonth() : new Date().getMonth())
  const [selectedYear, setSelectedYear] = React.useState<number>(value ? value.getFullYear() : new Date().getFullYear())

  // Generate array of years from 1900 to current year
  const years = Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => 1900 + i)
  
  // Array of months
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  // Handle month/year selection
  React.useEffect(() => {
    if (value) {
      const newDate = new Date(value.getTime())
      newDate.setMonth(selectedMonth)
      newDate.setFullYear(selectedYear)
      onChange?.(newDate)
    }
  }, [selectedMonth, selectedYear])

  const handleDateSelect = (date?: Date) => {
    if (date) {
      // Create new date at noon to avoid timezone issues
      const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0)
      onChange?.(newDate)
      setSelectedMonth(newDate.getMonth())
      setSelectedYear(newDate.getFullYear())
    } else {
      onChange?.(undefined)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex gap-2 p-3">
          <Select
            value={selectedMonth.toString()}
            onValueChange={(value) => setSelectedMonth(parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={month} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.reverse().map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDateSelect}
          month={new Date(selectedYear, selectedMonth)}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
} 
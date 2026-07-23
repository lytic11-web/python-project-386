import { useState } from "react"
import { format, addDays, isSameDay, parseISO } from "date-fns"
import { ru } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Slot, EventType } from "@/types/api"

interface SlotPickerProps {
  eventType: EventType
  slots: Slot[]
  selectedDate: Date
  onDateChange: (date: Date) => void
  onSlotSelect: (slot: Slot) => void
  selectedSlot: Slot | null
}

export function SlotPicker({
  eventType,
  slots,
  selectedDate,
  onDateChange,
  onSlotSelect,
  selectedSlot,
}: SlotPickerProps) {
  const today = new Date()
  const maxDate = addDays(today, 13)

  const availableSlots = slots.filter((s) => s.available)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDateChange(addDays(selectedDate, -1))}
          disabled={isSameDay(selectedDate, today)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-center">
          <div className="font-semibold">
            {format(selectedDate, "d MMMM yyyy", { locale: ru })}
          </div>
          <div className="text-sm text-muted-foreground">
            {eventType.name} · {eventType.durationMinutes} мин
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDateChange(addDays(selectedDate, 1))}
          disabled={isSameDay(selectedDate, maxDate)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {slots.map((slot) => (
          <Button
            key={`${slot.date}-${slot.startTime}`}
            variant={
              selectedSlot?.startTime === slot.startTime &&
              selectedSlot?.date === slot.date
                ? "default"
                : slot.available
                ? "outline"
                : "ghost"
            }
            className={
              !slot.available
                ? "opacity-50 cursor-not-allowed line-through"
                : ""
            }
            disabled={!slot.available}
            onClick={() => onSlotSelect(slot)}
          >
            {slot.startTime}
            {selectedSlot?.startTime === slot.startTime &&
              selectedSlot?.date === slot.date && (
                <Check className="ml-1 h-3 w-3" />
              )}
          </Button>
        ))}
      </div>

      {availableSlots.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          На эту дату нет свободных слотов
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { format } from "date-fns"
import { CheckCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EventTypeCard } from "@/components/EventTypeCard"
import { SlotPicker } from "@/components/SlotPicker"
import { BookingForm } from "@/components/BookingForm"
import { listEventTypes, listSlots, createBooking } from "@/api/client"
import type { EventType, Slot } from "@/types/api"

function utcToLocalTime(date: string, time: string): string {
  return new Date(`${date}T${time}:00Z`).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

type Step = "select-type" | "select-slot" | "fill-form" | "success"

export function HomePage() {
  const [step, setStep] = useState<Step>("select-type")
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)

  const { data: eventTypes, isLoading: typesLoading } = useQuery({
    queryKey: ["event-types"],
    queryFn: listEventTypes,
  })

  const { data: slots, isLoading: slotsLoading } = useQuery({
    queryKey: ["slots", selectedEventType?.id, format(selectedDate, "yyyy-MM-dd")],
    queryFn: () =>
      selectedEventType
        ? listSlots(selectedEventType.id, format(selectedDate, "yyyy-MM-dd"))
        : Promise.resolve([]),
    enabled: !!selectedEventType,
  })

  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      setStep("success")
    },
  })

  const handleSelectType = (eventType: EventType) => {
    setSelectedEventType(eventType)
    setSelectedDate(new Date())
    setStep("select-slot")
  }

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot)
    setStep("fill-form")
  }

  const handleBookingSubmit = (data: { guestName: string; guestEmail: string; guestNotes?: string }) => {
    if (!selectedEventType || !selectedSlot) return
    bookingMutation.mutate({
      eventTypeId: selectedEventType.id,
      startTime: new Date(`${selectedSlot.date}T${selectedSlot.startTime}:00Z`).toISOString(),
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestNotes: data.guestNotes,
    })
  }

  const handleReset = () => {
    setStep("select-type")
    setSelectedEventType(null)
    setSelectedSlot(null)
    bookingMutation.reset()
  }

  if (step === "success") {
    return (
      <div className="max-w-md mx-auto py-12">
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Запись подтверждена!</h2>
            <p className="text-muted-foreground mb-6">
              Вы записаны на {selectedEventType?.name} · {selectedSlot?.date} · {selectedSlot ? utcToLocalTime(selectedSlot.date, selectedSlot.startTime) : ""}
            </p>
            <Button onClick={handleReset} className="w-full">
              Записаться ещё
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {step === "select-type" && (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Запишитесь на встречу</h1>
            <p className="text-muted-foreground">
              Выберите тип встречи и подходящее время
            </p>
          </div>

          {typesLoading ? (
            <div className="text-center py-12 text-muted-foreground">Загрузка...</div>
          ) : eventTypes?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Пока нет доступных типов встреч
            </div>
          ) : (
            <div className="grid gap-4">
              {eventTypes?.map((et) => (
                <EventTypeCard key={et.id} eventType={et} onSelect={handleSelectType} />
              ))}
            </div>
          )}
        </div>
      )}

      {step === "select-slot" && selectedEventType && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setStep("select-type")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">Выберите время</h2>
          </div>

          {slotsLoading ? (
            <div className="text-center py-12 text-muted-foreground">Загрузка слотов...</div>
          ) : (
            <SlotPicker
              eventType={selectedEventType}
              slots={slots || []}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onSlotSelect={handleSlotSelect}
              selectedSlot={selectedSlot}
            />
          )}
        </div>
      )}

      {step === "fill-form" && selectedEventType && selectedSlot && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setStep("select-slot")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">Ваши данные</h2>
          </div>

          <BookingForm
            eventType={selectedEventType}
            slot={selectedSlot}
            onSubmit={handleBookingSubmit}
            onCancel={() => setStep("select-slot")}
            isLoading={bookingMutation.isPending}
          />

          {bookingMutation.isError && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              {bookingMutation.error instanceof Error
                ? bookingMutation.error.message
                : "Ошибка при создании записи"}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

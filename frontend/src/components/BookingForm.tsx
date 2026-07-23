import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Slot, EventType } from "@/types/api"

interface BookingFormProps {
  eventType: EventType
  slot: Slot
  onSubmit: (data: { guestName: string; guestEmail: string; guestNotes?: string }) => void
  onCancel: () => void
  isLoading?: boolean
}

export function BookingForm({ eventType, slot, onSubmit, onCancel, isLoading }: BookingFormProps) {
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [guestNotes, setGuestNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ guestName, guestEmail, guestNotes: guestNotes || undefined })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Подтвердите запись</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-muted rounded-md text-sm">
          <div><strong>{eventType.name}</strong></div>
          <div className="text-muted-foreground">
            {slot.date} · {slot.startTime} – {slot.endTime}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Ваше имя</label>
            <Input
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Иван Иванов"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="ivan@example.com"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Комментарий (опционально)</label>
            <Textarea
              value={guestNotes}
              onChange={(e) => setGuestNotes(e.target.value)}
              placeholder="Дополнительная информация..."
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Создание..." : "Записаться"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Назад
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

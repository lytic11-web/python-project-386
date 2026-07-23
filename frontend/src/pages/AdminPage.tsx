import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { format, parseISO } from "date-fns"
import { ru } from "date-fns/locale"
import {
  Plus,
  Trash2,
  Edit3,
  Clock,
  Calendar,
  User,
  Mail,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  listEventTypes,
  createEventType,
  updateEventType,
  deleteEventType,
  listBookings,
  deleteBooking,
} from "@/api/client"
import type { EventType, EventTypeCreate, EventTypeUpdate } from "@/types/api"

export function AdminPage() {
  const queryClient = useQueryClient()
  const [isEventTypeDialogOpen, setIsEventTypeDialogOpen] = useState(false)
  const [editingEventType, setEditingEventType] = useState<EventType | null>(null)
  const [eventTypeForm, setEventTypeForm] = useState<EventTypeCreate>({
    name: "",
    description: "",
    durationMinutes: 30,
  })

  const { data: eventTypes } = useQuery({
    queryKey: ["event-types"],
    queryFn: listEventTypes,
  })

  const { data: bookings } = useQuery({
    queryKey: ["bookings"],
    queryFn: listBookings,
  })

  const createMutation = useMutation({
    mutationFn: createEventType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-types"] })
      setIsEventTypeDialogOpen(false)
      resetForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EventTypeUpdate }) =>
      updateEventType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event-types"] })
      setIsEventTypeDialogOpen(false)
      setEditingEventType(null)
      resetForm()
    },
  })

  const deleteEventTypeMutation = useMutation({
    mutationFn: deleteEventType,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["event-types"] }),
  })

  const deleteBookingMutation = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
  })

  const resetForm = () => {
    setEventTypeForm({ name: "", description: "", durationMinutes: 30 })
  }

  const handleOpenCreate = () => {
    setEditingEventType(null)
    resetForm()
    setIsEventTypeDialogOpen(true)
  }

  const handleOpenEdit = (et: EventType) => {
    setEditingEventType(et)
    setEventTypeForm({
      name: et.name,
      description: et.description || "",
      durationMinutes: et.durationMinutes,
    })
    setIsEventTypeDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingEventType) {
      updateMutation.mutate({ id: editingEventType.id, data: eventTypeForm })
    } else {
      createMutation.mutate(eventTypeForm)
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Управление</h1>

      {/* Типы событий */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Типы встреч</h2>
          <Button onClick={handleOpenCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Добавить
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {eventTypes?.map((et) => (
            <Card key={et.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{et.name}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleOpenEdit(et)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => deleteEventTypeMutation.mutate(et.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {et.description && (
                  <p className="text-sm text-muted-foreground">{et.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">
                  <Clock className="mr-1 h-3 w-3" />
                  {et.durationMinutes} мин
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {eventTypes?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border rounded-lg">
            Нет типов встреч. Создайте первый.
          </div>
        )}
      </section>

      {/* Бронирования */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Предстоящие встречи</h2>

        <div className="space-y-3">
          {bookings
            ?.filter((b) => new Date(b.startTime) > new Date())
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
            .map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge>{booking.eventTypeName}</Badge>
                        <span className="text-sm text-muted-foreground">
                          <Calendar className="inline h-3 w-3 mr-1" />
                          {format(parseISO(booking.startTime), "d MMMM yyyy, HH:mm", { locale: ru })}
                          {" — "}
                          {format(parseISO(booking.endTime), "HH:mm", { locale: ru })}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span>
                          <User className="inline h-3 w-3 mr-1" />
                          {booking.guestName}
                        </span>
                        <span>
                          <Mail className="inline h-3 w-3 mr-1" />
                          {booking.guestEmail}
                        </span>
                      </div>
                      {booking.guestNotes && (
                        <p className="text-sm text-muted-foreground">{booking.guestNotes}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => deleteBookingMutation.mutate(booking.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {bookings?.filter((b) => new Date(b.startTime) > new Date()).length === 0 && (
          <div className="text-center py-8 text-muted-foreground border rounded-lg">
            Нет предстоящих встреч
          </div>
        )}
      </section>

      {/* Диалог создания/редактирования */}
      <Dialog open={isEventTypeDialogOpen} onOpenChange={setIsEventTypeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEventType ? "Редактировать тип встречи" : "Новый тип встречи"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Название</label>
              <Input
                value={eventTypeForm.name}
                onChange={(e) =>
                  setEventTypeForm({ ...eventTypeForm, name: e.target.value })
                }
                placeholder="Например, Консультация"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Описание</label>
              <Textarea
                value={eventTypeForm.description}
                onChange={(e) =>
                  setEventTypeForm({ ...eventTypeForm, description: e.target.value })
                }
                placeholder="Описание типа встречи..."
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Длительность (мин)</label>
              <Input
                type="number"
                min={15}
                max={480}
                value={eventTypeForm.durationMinutes}
                onChange={(e) =>
                  setEventTypeForm({
                    ...eventTypeForm,
                    durationMinutes: parseInt(e.target.value) || 30,
                  })
                }
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingEventType ? "Сохранить" : "Создать"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEventTypeDialogOpen(false)}
              >
                Отмена
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

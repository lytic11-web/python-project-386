import { Clock, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { EventType } from "@/types/api"

interface EventTypeCardProps {
  eventType: EventType
  onSelect: (eventType: EventType) => void
}

export function EventTypeCard({ eventType, onSelect }: EventTypeCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>{eventType.name}</CardTitle>
        {eventType.description && (
          <CardDescription>{eventType.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {eventType.durationMinutes} мин
          </div>
          <Button onClick={() => onSelect(eventType)}>
            Выбрать
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

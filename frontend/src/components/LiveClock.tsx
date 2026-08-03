import { memo, useEffect, useState } from "react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

export const LiveClock = memo(function LiveClock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const date = format(now, "d MMMM yyyy", { locale: ru })
  const time = format(now, "HH:mm:ss", { locale: ru })
  const weekday = format(now, "EEEE", { locale: ru })

  return (
    <div className="mb-2">
      <p className="text-3xl font-bold">{time}</p>
      <p className="text-lg text-muted-foreground">
        Сегодня, {weekday}, {date}
      </p>
    </div>
  )
})

import { Link, useLocation } from "react-router-dom"
import { Calendar, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
            <Calendar className="h-5 w-5" />
            Запись на звонок
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              to="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/" ? "text-primary" : "text-muted-foreground"
              )}
            >
              Запись
            </Link>
            <Link
              to="/admin"
              className={cn(
                "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/admin" ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Settings className="h-4 w-4" />
              Управление
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

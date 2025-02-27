import { Menu, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { Link } from "react-router-dom"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-4xl flex h-14 items-center px-4">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">SafeStreet</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/submit"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Reportar
            </Link>
            <Link
              to="/about"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Sobre
            </Link>
            <Link
              to="/faq"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              FAQ
            </Link>
            <Link
              to="/contact"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Contacto
            </Link>
            <Link
              to="/admin"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Admin
            </Link>
            <a
              href="https://instagram.com/safestreetporto"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1"
            >
              Instagram
              <ExternalLink className="h-3 w-3" />
            </a>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
          </div>
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 w-9 p-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4">
                  <Link
                    to="/submit"
                    className="text-sm font-medium transition-colors"
                  >
                    Reportar
                  </Link>
                  <Link
                    to="/about"
                    className="text-sm font-medium transition-colors"
                  >
                    Sobre
                  </Link>
                  <Link
                    to="/faq"
                    className="text-sm font-medium transition-colors"
                  >
                    FAQ
                  </Link>
                  <Link
                    to="/contact"
                    className="text-sm font-medium transition-colors"
                  >
                    Contacto
                  </Link>
                  <Link
                    to="/admin"
                    className="text-sm font-medium transition-colors"
                  >
                    Admin
                  </Link>
                  <a
                    href="https://instagram.com/safestreetporto"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    Instagram
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </div>
    </header>
  )
}
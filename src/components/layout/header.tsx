import { Menu, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-4xl flex h-14 items-center px-4">
        <div className="mr-4 flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">SafeStreet</span>
          </a>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <a
              href="/about"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Sobre
            </a>
            <a
              href="/faq"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              FAQ
            </a>
            <a
              href="/contact"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Contacto
            </a>
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
                  <a
                    href="/about"
                    className="text-sm font-medium transition-colors"
                  >
                    Sobre
                  </a>
                  <a
                    href="/faq"
                    className="text-sm font-medium transition-colors"
                  >
                    FAQ
                  </a>
                  <a
                    href="/contact"
                    className="text-sm font-medium transition-colors"
                  >
                    Contacto
                  </a>
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
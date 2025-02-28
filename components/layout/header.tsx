"use client"

import { Menu, LogIn, User, MapPin, Shield } from "lucide-react"
import { Button } from "../ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../ui/sheet"
import { ModeToggle } from "../mode-toggle"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const routes = [
  {
    href: '/',
    label: 'Início',
  },
  {
    href: '/reportar',
    label: 'Reportar',
  },
  {
    href: '/faq',
    label: 'FAQ',
  },
  {
    href: '/contacto',
    label: 'Contacto',
  },
]

export function Header() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [open, setOpen] = useState(false);
  
  // Check authentication status on component mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };
    
    checkAuth();
    
    // Listen for storage events to update auth state
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('storage'));
  };
  
  const getLinkClass = (path: string) => {
    return pathname === path
      ? "text-foreground"
      : "text-muted-foreground hover:text-foreground";
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-dashed bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-6xl px-4 flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold">Rua Segura</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`${getLinkClass(route.href)} flex items-center gap-1.5`}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center">
            {isAuthenticated ? (
              <>
                <Button asChild variant="ghost" size="sm" className="mr-2 border-dashed">
                  <Link href="/admin" className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    Admin
                  </Link>
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="mr-2 border-dashed"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild variant="ghost" size="sm" className="mr-2 border-dashed">
                <Link href="/login" className="flex items-center gap-1.5">
                  <LogIn className="h-3.5 w-3.5" />
                  Login
                </Link>
              </Button>
            )}
            <Separator orientation="vertical" className="h-6 mx-2 border-dashed" />
            <ModeToggle />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden ml-2">
                <Button variant="outline" size="icon" className="border-dashed">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0 border-dashed">
                <MobileNav 
                  routes={routes} 
                  setOpen={setOpen} 
                  isAuthenticated={isAuthenticated}
                  handleLogout={handleLogout}
                />
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </div>
    </header>
  )
}

function MobileNav({ 
  routes, 
  setOpen, 
  isAuthenticated, 
  handleLogout 
}: { 
  routes: { href: string; label: string }[]; 
  setOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  handleLogout: () => void;
}) {
  return (
    <div className="grid gap-2 py-6">
      <Link
        href="/"
        className="flex items-center space-x-2 px-4"
        onClick={() => setOpen(false)}
      >
        <Shield className="h-6 w-6 text-primary" />
        <span className="font-bold">Rua Segura</span>
      </Link>
      <Separator className="my-4 border-dashed" />
      <nav className="grid gap-2 text-lg font-medium">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex py-2 px-4 hover:bg-accent hover:text-accent-foreground rounded-md",
            )}
            onClick={() => setOpen(false)}
          >
            {route.label}
          </Link>
        ))}
        
        {isAuthenticated ? (
          <>
            <Link
              href="/admin"
              className="flex items-center gap-1.5 py-2 px-4 hover:bg-accent hover:text-accent-foreground rounded-md"
              onClick={() => setOpen(false)}
            >
              <User className="h-3.5 w-3.5 mr-1" />
              Admin
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
              className="flex py-2 px-4 hover:bg-accent hover:text-accent-foreground rounded-md text-left text-lg font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 py-2 px-4 hover:bg-accent hover:text-accent-foreground rounded-md"
            onClick={() => setOpen(false)}
          >
            <LogIn className="h-3.5 w-3.5 mr-1" />
            Login
          </Link>
        )}
      </nav>
    </div>
  );
} 
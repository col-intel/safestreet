"use client"

import { Menu, LogIn, User } from "lucide-react"
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

export function Header() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check authentication status on component mount and when localStorage changes
  useEffect(() => {
    // Function to check auth status
    const checkAuthStatus = () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(authStatus);
    };
    
    // Check on mount
    checkAuthStatus();
    
    // Listen for storage events (when localStorage changes in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isAuthenticated') {
        checkAuthStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab updates
    const handleCustomEvent = () => checkAuthStatus();
    window.addEventListener('authChange', handleCustomEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleCustomEvent);
    };
  }, []);
  
  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authChange'));
  };
  
  // Function to determine if a link is active
  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };
  
  // Function to get link class based on active state
  const getLinkClass = (path: string) => {
    return isActive(path)
      ? "transition-colors text-foreground font-semibold border-b-2 border-primary pb-[1px]"
      : "transition-colors hover:text-foreground/80 text-foreground/60";
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-4xl flex h-14 items-center px-4">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Rua Segura</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/reportar"
              className={getLinkClass('/reportar')}
            >
              Reportar
            </Link>
            <Link
              href="/sobre"
              className={getLinkClass('/sobre')}
            >
              Sobre
            </Link>
            <Link
              href="/associacoes"
              className={getLinkClass('/associacoes')}
            >
              Associações
            </Link>
            <Link
              href="/faq"
              className={getLinkClass('/faq')}
            >
              FAQ
            </Link>
            <Link
              href="/contacto"
              className={getLinkClass('/contacto')}
            >
              Contacto
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin"
                  className={`${getLinkClass('/admin')} flex items-center gap-1`}
                >
                  <User className="h-3 w-3" />
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="transition-colors hover:text-foreground/80 text-foreground/60 text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className={`${getLinkClass('/login')} flex items-center gap-1`}
              >
                <LogIn className="h-3 w-3" />
                Login
              </Link>
            )}
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
                    href="/reportar"
                    className={`text-sm font-medium ${getLinkClass('/reportar')}`}
                  >
                    Reportar
                  </Link>
                  <Link
                    href="/sobre"
                    className={`text-sm font-medium ${getLinkClass('/sobre')}`}
                  >
                    Sobre
                  </Link>
                  <Link
                    href="/associacoes"
                    className={`text-sm font-medium ${getLinkClass('/associacoes')}`}
                  >
                    Associações
                  </Link>
                  <Link
                    href="/faq"
                    className={`text-sm font-medium ${getLinkClass('/faq')}`}
                  >
                    FAQ
                  </Link>
                  <Link
                    href="/contacto"
                    className={`text-sm font-medium ${getLinkClass('/contacto')}`}
                  >
                    Contacto
                  </Link>
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/admin"
                        className={`text-sm font-medium ${getLinkClass('/admin')} flex items-center gap-1`}
                      >
                        <User className="h-3 w-3" />
                        Admin
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="text-sm font-medium text-foreground/60 text-left"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className={`text-sm font-medium ${getLinkClass('/login')} flex items-center gap-1`}
                    >
                      <LogIn className="h-3 w-3" />
                      Login
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </div>
    </header>
  )
} 
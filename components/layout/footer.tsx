"use client"

import Link from "next/link"
import { Shield } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="border-t border-dashed border-border bg-background/95">
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg">Rua Segura</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Plataforma para reportar e acompanhar incidentes de segurança na cidade do Porto.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:col-span-2">
            <div className="flex flex-col gap-3">
              <h3 className="font-medium">Navegação</h3>
              <div className="flex flex-col gap-2">
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Início
                </Link>
                <Link href="/reportar" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Reportar
                </Link>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
                <Link href="/associacoes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Associações
                </Link>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <h3 className="font-medium">Informações</h3>
              <div className="flex flex-col gap-2">
                <Link href="/contacto" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contacto
                </Link>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacidade
                </Link>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Termos
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-8 border-dashed" />
        
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Rua Segura. Todos os direitos reservados.
          </p>
          <p className="text-center text-sm text-muted-foreground md:text-right">
            Feito por cidadãos preocupados e{" "}
            <a
              href="https://ci.vc"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Collective Intelligence
            </a>{" "}
            no Porto, Portugal.
          </p>
        </div>
      </div>
    </footer>
  )
} 
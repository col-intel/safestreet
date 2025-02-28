"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container mx-auto max-w-4xl flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
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
        <div className="flex gap-4">
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Privacidade
          </Link>
          <Link
            href="/terms"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Termos
          </Link>
        </div>
      </div>
    </footer>
  )
} 
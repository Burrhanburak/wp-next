"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">WhatsApp Bulk</span>
        </Link>

        <div className="hidden gap-6 md:flex">
          <Link href="/features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Pricing
          </Link>
          <Link href="/docs" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Documentation
          </Link>
          <Link href="/blog" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Blog
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}

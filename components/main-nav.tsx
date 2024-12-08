'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const items = [
  {
    title: 'Overview',
    href: '/dashboard',
  },
  {
    title: 'Messages',
    href: '/dashboard/messages',
  },
  {
    title: 'Templates',
    href: '/dashboard/templates',
  },
  {
    title: 'Contacts',
    href: '/dashboard/contacts',
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-6">
      <Link href="/dashboard" className="hidden items-center space-x-2 md:flex">
        <span className="hidden font-bold sm:inline-block">
          WhatsApp Bulk Messaging
        </span>
      </Link>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === item.href ? 'text-foreground' : 'text-foreground/60'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

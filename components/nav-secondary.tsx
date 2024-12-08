'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Settings, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const items = [
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings
  },
  {
    title: 'Help',
    href: '/dashboard/help',
    icon: HelpCircle
  }
]

export function NavSecondary() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Tooltip key={item.href} delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant={isActive ? 'secondary' : 'ghost'}
                size="default"
                className="h-10 w-full justify-start px-4"
              >
                <Link href={item.href}>
                  <Icon className="mr-2 h-5 w-5" />
                  {item.title}
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              {item.title}
            </TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}

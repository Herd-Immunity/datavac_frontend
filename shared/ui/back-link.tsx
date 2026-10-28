'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SIDE_MENU_TABLET_LABEL_CLASS } from '@/shared/ui/SideMenu/nav-config'
import { sideMenuFont } from '@/shared/ui/SideMenu/side-menu-font'

function BackChevronIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 12 12" aria-hidden className="block">
      <path
        d="M7.5 9.5 4 6l3.5-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export type BackLinkProps = {
  href?: string
  label?: string
  className?: string
}

export function BackLink({ href, label = 'Назад', className }: BackLinkProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if(!href) {
      e.preventDefault() 
      window.history.length > 1 ? router.back() : router.push('/')           
    }
  }

  return (
    <Link
      href={href || '#'}
      onClick = {handleClick}
      className={[
        sideMenuFont.className,
        SIDE_MENU_TABLET_LABEL_CLASS,
        'inline-flex items-center gap-2 text-fg no-underline',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-card">
        <BackChevronIcon />
      </span>
      <span>{label}</span>
    </Link>
  )
}

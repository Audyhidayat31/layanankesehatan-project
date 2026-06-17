'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import React from 'react'

interface AuthLinkProps extends React.ComponentProps<typeof Link> {
  fallbackHref?: string
}

export function AuthLink({ href, fallbackHref = '/register', children, onClick, ...props }: AuthLinkProps) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAuthenticated) {
      e.preventDefault()
      router.push(fallbackHref)
      return
    }
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}

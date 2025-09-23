"use client"

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type Variant = 'success' | 'error' | 'info'

export function useFlashToast() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function showToast(variant: Variant, message: string) {
    const sp = new URLSearchParams(Array.from(searchParams.entries()))
    // normalize: remove other keys to avoid conflicting messages
    sp.delete('toast'); sp.delete('message'); sp.delete('error'); sp.delete('success')
    if (variant === 'success') {
      sp.set('success', message)
    } else if (variant === 'error') {
      sp.set('error', message)
    } else {
      sp.set('toast', 'info'); sp.set('message', message)
    }
    router.replace(`${pathname}?${sp.toString()}` as any, { scroll: false })
  }

  return {
    showToast,
    showSuccess: (msg: string) => showToast('success', msg),
    showError: (msg: string) => showToast('error', msg),
    showInfo: (msg: string) => showToast('info', msg),
  }
}

"use client"

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type ToastVariant = 'success' | 'error' | 'info'

export function FlashToast() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const { show, message, variant } = useMemo(() => {
    const toast = searchParams.get('toast') as ToastVariant | null
    const message = searchParams.get('message')
    const error = searchParams.get('error')
    const success = searchParams.get('success')

    if (error) {
      return { show: true, message: error, variant: 'error' as ToastVariant }
    }
    if (success) {
      return { show: true, message: success, variant: 'success' as ToastVariant }
    }
    if (toast && message) {
      return { show: true, message, variant: toast }
    }
    return { show: false, message: '', variant: 'info' as ToastVariant }
  }, [searchParams])

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!show || !message) return
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 3000)
    const clean = setTimeout(() => {
      // remove query params to avoid re-showing on back/forward
      const sp = new URLSearchParams(Array.from(searchParams.entries()))
      sp.delete('toast'); sp.delete('message'); sp.delete('error'); sp.delete('success')
      router.replace(`${pathname}?${sp.toString()}` as any, { scroll: false })
    }, 3500)
    return () => { clearTimeout(t); clearTimeout(clean) }
  }, [show, message, router, pathname, searchParams])

  if (!visible || !message) return null

  const styles: Record<ToastVariant, string> = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[1000]">
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className={`pointer-events-auto text-white px-4 py-3 rounded shadow-lg ${styles[variant]}`}>
          <span className="text-sm font-medium">{message}</span>
        </div>
      </div>
    </div>
  )
}

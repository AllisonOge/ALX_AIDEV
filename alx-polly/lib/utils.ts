import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildToastQuery(params: { success?: string; error?: string; toast?: 'success'|'error'|'info'; message?: string }) {
  const sp = new URLSearchParams()
  if (params.success) sp.set('success', params.success)
  if (params.error) sp.set('error', params.error)
  if (params.toast && params.message) {
    sp.set('toast', params.toast)
    sp.set('message', params.message)
  }
  const qs = sp.toString()
  return qs ? `?${qs}` : ''
}

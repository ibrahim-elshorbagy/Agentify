import { usePage } from '@inertiajs/react'

export function useTrans() {
  const { translations } = usePage().props

  function t(key, replacements = {}) {
    let value = translations[key] || key
    Object.entries(replacements).forEach(([k, v]) => {
      value = value.replace(`:${k}`, v)
    })
    return value
  }

  return { t }
}

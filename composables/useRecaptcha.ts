'use client'

import { useCallback, useEffect } from 'react'

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}

export function useRecaptcha() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    return () => {
      const existingScript = document.querySelector(
        `script[src="${script.src}"]`
      )
      if (existingScript) {
        document.body.removeChild(existingScript)
      }
    }
  }, [])

  const executeRecaptcha = useCallback(
    async (action: string = 'submit'): Promise<string | null> => {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

      if (!siteKey) {
        console.error('reCAPTCHA site key is not configured')
        return null
      }

      return new Promise(resolve => {
        if (typeof window.grecaptcha === 'undefined') {
          console.error('reCAPTCHA script not loaded')
          resolve(null)
          return
        }

        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(siteKey, { action })
            .then(token => {
              resolve(token)
            })
            .catch(error => {
              console.error('reCAPTCHA execution error:', error)
              resolve(null)
            })
        })
      })
    },
    []
  )

  return { executeRecaptcha }
}

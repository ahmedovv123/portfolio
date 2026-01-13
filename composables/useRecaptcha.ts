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
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

    if (!siteKey) {
      console.warn(
        'reCAPTCHA site key is not configured. Add NEXT_PUBLIC_RECAPTCHA_SITE_KEY to your .env.local file.'
      )
      return
    }

    // Check if script already exists
    const existingScript = document.querySelector(
      `script[src*="recaptcha/api.js"]`
    )
    if (existingScript) {
      return
    }

    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
    script.async = true
    script.defer = true
    script.onerror = () => {
      console.error('Failed to load reCAPTCHA script')
    }
    document.body.appendChild(script)

    return () => {
      const scriptToRemove = document.querySelector(
        `script[src*="recaptcha/api.js"]`
      )
      if (scriptToRemove) {
        document.body.removeChild(scriptToRemove)
      }
    }
  }, [])

  const executeRecaptcha = useCallback(
    async (action: string = 'submit'): Promise<string | null> => {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

      if (!siteKey) {
        console.error(
          'reCAPTCHA site key is not configured. Add NEXT_PUBLIC_RECAPTCHA_SITE_KEY to your .env.local file.'
        )
        return null
      }

      return new Promise(resolve => {
        // Wait for script to load with timeout
        let attempts = 0
        const maxAttempts = 50 // 5 seconds max wait

        const checkRecaptcha = () => {
          if (typeof window.grecaptcha !== 'undefined') {
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
          } else if (attempts < maxAttempts) {
            attempts++
            setTimeout(checkRecaptcha, 100)
          } else {
            console.error(
              'reCAPTCHA script not loaded after 5 seconds. Make sure NEXT_PUBLIC_RECAPTCHA_SITE_KEY is set correctly.'
            )
            resolve(null)
          }
        }

        checkRecaptcha()
      })
    },
    []
  )

  return { executeRecaptcha }
}

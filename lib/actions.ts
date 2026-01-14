'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { ContactFormSchema, NewsletterFormSchema } from '@/lib/schemas'
import ContactFormEmail from '@/emails/contact-form-email'

type ContactFormInputs = z.infer<typeof ContactFormSchema>
type NewsletterFormInputs = z.infer<typeof NewsletterFormSchema>
const resend = new Resend(process.env.RESEND_API_KEY)

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  if (!secretKey) {
    console.error('reCAPTCHA secret key is not configured')
    return false
  }

  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `secret=${secretKey}&response=${token}`
      }
    )

    const data = await response.json()
    return data.success === true && data.score >= 0.8
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return false
  }
}

export async function sendEmail(
  data: ContactFormInputs,
  recaptchaToken: string
) {
  const result = ContactFormSchema.safeParse(data)

  if (
    result.data?.website_url_field &&
    result.data?.website_url_field.trim() !== ''
  ) {
    // honeypot detected
    return { success: true }
  }

  if (result.error) {
    return { error: result.error.format() }
  }

  // Verify reCAPTCHA token
  const isValidRecaptcha = await verifyRecaptcha(recaptchaToken)

  if (!isValidRecaptcha) {
    return { error: 'Bot verification failed. Please try again.' }
  }

  try {
    const { name, email, message } = result.data
    const { data, error } = await resend.emails.send({
      from: 'hello@ahmetahmedov.com',
      to: [email],
      cc: ['ahmedovv123@gmail.com'],
      subject: 'Contact form submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      react: ContactFormEmail({ name, email, message })
    })

    if (!data || error) {
      throw new Error('Failed to send email')
    }

    return { success: true }
  } catch (error) {
    return { error }
  }
}

export async function subscribe(data: NewsletterFormInputs) {
  const result = NewsletterFormSchema.safeParse(data)

  if (result.error) {
    return { error: result.error.format() }
  }

  try {
    // const { email } = result.data
    // const { data, error } = await resend.contacts.create({
    //   email: email,
    //   audienceId: process.env.RESEND_AUDIENCE_ID as string
    // })
    //
    // if (!data || error) {
    //   throw new Error('Failed to subscribe')
    // }

    // TODO: Send a welcome email

    return { success: true }
  } catch (error) {
    return { error }
  }
}

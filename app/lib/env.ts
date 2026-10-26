import { z } from 'zod'

const emailJs = z.object({
  VITE_EMAILJS_SERVICE_ID: z.string().min(1),
  VITE_EMAILJS_TEMPLATE_ID: z.string().min(1),
  VITE_EMAILJS_PUBLIC_KEY: z.string().min(1),
})

// Read when a message is sent, so the build and the tests don't need the keys
export function emailJsEnv() {
  const env = emailJs.parse(import.meta.env)
  return {
    serviceId: env.VITE_EMAILJS_SERVICE_ID,
    templateId: env.VITE_EMAILJS_TEMPLATE_ID,
    publicKey: env.VITE_EMAILJS_PUBLIC_KEY,
  }
}

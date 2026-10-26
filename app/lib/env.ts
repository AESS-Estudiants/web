const KEYS = [
  'VITE_EMAILJS_SERVICE_ID',
  'VITE_EMAILJS_TEMPLATE_ID',
  'VITE_EMAILJS_PUBLIC_KEY',
] as const

// Read when a message is sent, so the build and the tests don't need the keys
export function emailJsEnv() {
  const env = import.meta.env as Record<string, string | undefined>
  const missing = KEYS.filter((key) => !env[key])
  if (missing.length > 0) throw new Error(`Missing environment variables: ${missing.join(', ')}`)
  return {
    serviceId: env.VITE_EMAILJS_SERVICE_ID as string,
    templateId: env.VITE_EMAILJS_TEMPLATE_ID as string,
    publicKey: env.VITE_EMAILJS_PUBLIC_KEY as string,
  }
}

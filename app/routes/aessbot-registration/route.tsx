import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { aessbot } from '~/content/aessbot'
import { useRegistrationOpen } from '~/content/aessbot-registration'
import { AESSBOT_REGISTRATION_INDEXED } from '~/lib/indexed-paths'
import { pageMeta } from '~/lib/seo'
import type { Route } from './+types/route'
import { NextSteps } from './sections/NextSteps'
import { RegistrationForm } from './sections/RegistrationForm'
import { Reminders } from './sections/Reminders'

export function meta(_: Route.MetaArgs) {
  const { meta } = aessbot.registration
  return pageMeta({
    title: meta.title,
    description: meta.description,
    path: '/aessbot/inscripcio',
    noindex: !AESSBOT_REGISTRATION_INDEXED,
  })
}

// Outside the registration period there is nothing to sign up for, so the page sends you to /aessbot.
// Past the deadline that happens in the browser, even before the status is changed to finished.
export default function AessbotRegistrationPage() {
  const navigate = useNavigate()
  const closed = !useRegistrationOpen(aessbot)

  useEffect(() => {
    if (closed) navigate('/aessbot', { replace: true })
  }, [closed, navigate])

  if (closed) return null

  const { registration } = aessbot
  return (
    <>
      <Reminders reminders={registration.reminders} />
      <RegistrationForm form={registration.form} />
      <NextSteps steps={registration.steps} />
    </>
  )
}

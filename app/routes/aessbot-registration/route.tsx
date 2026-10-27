import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { aessbot } from '~/content/aessbot'
import { AESSBOT_REGISTRATION_INDEXED, pageMeta } from '~/lib/seo'
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

// Before the edition is announced there is nothing to sign up for, so the page sends you to /aessbot
export default function AessbotRegistrationPage() {
  const navigate = useNavigate()
  const comingSoon = aessbot.status === 'coming-soon'

  useEffect(() => {
    if (comingSoon) navigate('/aessbot', { replace: true })
  }, [comingSoon, navigate])

  if (comingSoon) return null

  const { registration } = aessbot
  return (
    <>
      <Reminders reminders={registration.reminders} />
      <RegistrationForm form={registration.form} />
      <NextSteps steps={registration.steps} />
    </>
  )
}

import { useEffect, useState } from 'react'
import type { Aessbot } from './schemas'

export const AESSBOT_REGISTRATION_PATH = '/aessbot/inscripcio'

type Registration = Pick<Aessbot, 'status' | 'registrationDeadline'>

// Written in at build time (see build-constants.ts). Importing aessbot.json here would put the
// whole file in a chunk shared with the AESSBot pages, which the home would then download.
declare const __AESSBOT_REGISTRATION__: Registration

/** The status and deadline from aessbot.json, without the rest of its content */
export const aessbotRegistration = __AESSBOT_REGISTRATION__

const MINUTE = 60_000

/**
 * Whether the deadline is still ahead. The prerendered page goes by the time of the build, the
 * browser then checks the clock, and a page left open changes within a minute of the deadline.
 */
export function useBeforeDeadline(deadline: string) {
  const [before, setBefore] = useState(() => __BUILD_TIME__ < new Date(deadline).getTime())

  useEffect(() => {
    const end = new Date(deadline).getTime()
    const update = () => setBefore(Date.now() < end)
    update()
    const timer = setInterval(update, MINUTE)
    return () => clearInterval(timer)
  }, [deadline])

  return before
}

/** Whether people can sign up at a given time */
export function isRegistrationOpenAt({ status, registrationDeadline }: Registration, now: number) {
  return status === 'registration' && now < new Date(registrationDeadline).getTime()
}

/** Whether people can sign up: the status says registration and the deadline hasn't passed */
export function useRegistrationOpen({ status, registrationDeadline }: Registration) {
  const beforeDeadline = useBeforeDeadline(registrationDeadline)
  return status === 'registration' && beforeDeadline
}

// Values written into the bundle at build time, for vite.config.ts and vitest.config.ts.
// The raw file, so the configs can import this module without the app's aliases.
import aessbot from './aessbot.json' with { type: 'json' }

export const BUILD_CONSTANTS = {
  // Only the two fields the home needs, so it doesn't download the whole AESSBot content
  __AESSBOT_REGISTRATION__: JSON.stringify({
    status: aessbot.status,
    registrationDeadline: aessbot.registrationDeadline,
  }),
}

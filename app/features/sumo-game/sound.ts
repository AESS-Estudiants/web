// Tiny 8-bit sound effects with the Web Audio API (created on the first user gesture)
type ToneOptions = { type?: OscillatorType; volume?: number; slide?: number; delay?: number }

export type Sound = ReturnType<typeof createSound>

export function createSound() {
  let ctx: AudioContext | null = null
  let muted = false

  const tone = (
    frequency: number,
    duration: number,
    { type = 'square', volume = 0.06, slide = 0, delay = 0 }: ToneOptions = {},
  ) => {
    if (muted || !ctx) return
    const start = ctx.currentTime + delay
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(frequency, start)
    if (slide)
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, frequency + slide), start + duration)
    gain.gain.setValueAtTime(volume, start)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    osc.connect(gain).connect(ctx.destination)
    osc.start(start)
    osc.stop(start + duration + 0.02)
  }

  return {
    unlock() {
      if (!ctx) {
        const Context =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
        if (Context) ctx = new Context()
      }
      void ctx?.resume()
    },
    setMuted(value: boolean) {
      muted = value
    },
    tick: () => tone(440, 0.08),
    go: () => tone(880, 0.18),
    bump: (strength: number) => tone(120 + strength * 2, 0.07, { type: 'triangle', volume: 0.08 }),
    dash: () => tone(300, 0.12, { slide: 400, volume: 0.04 }),
    fall: () => tone(500, 0.45, { slide: -440, volume: 0.05 }),
    win: () => {
      for (const [i, f] of [523, 659, 784, 1046].entries()) tone(f, 0.14, { delay: i * 0.11 })
    },
    lose: () => {
      for (const [i, f] of [392, 330, 262].entries())
        tone(f, 0.2, { delay: i * 0.16, type: 'triangle', volume: 0.07 })
    },
    close() {
      void ctx?.close()
    },
  }
}

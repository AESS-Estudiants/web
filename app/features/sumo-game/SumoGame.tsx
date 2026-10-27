import { Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { IconButton } from '~/components/buttons'
import { createSumoGame, type SumoGame as Game } from './engine'
import styles from './SumoGame.module.css'

const MUTE_KEY = 'aessbot-sumo-muted'

function readMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === '1'
  } catch {
    return false
  }
}

// Pixel-art minisumo against the CPU, drawn on a canvas
export function SumoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameRef = useRef<Game | null>(null)
  const [muted, setMuted] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return
    const game = createSumoGame(canvasRef.current, {
      onState: (phase) => setPlaying(phase === 'play'),
    })
    const savedMuted = readMuted()
    setMuted(savedMuted)
    game.setMuted(savedMuted)
    gameRef.current = game
    return () => game.destroy()
  }, [])

  const toggleSound = () => {
    const next = !muted
    setMuted(next)
    gameRef.current?.setMuted(next)
    try {
      localStorage.setItem(MUTE_KEY, next ? '1' : '0')
    } catch {
      // The preference just isn't remembered
    }
  }

  return (
    <div className={styles.game}>
      {/* biome-ignore lint/a11y/noInteractiveElementToNoninteractiveRole: the game takes the keyboard while focused, which is what the application role announces */}
      <canvas
        ref={canvasRef}
        className={styles.screen}
        width={160}
        height={120}
        tabIndex={0}
        role="application"
        aria-label="Minijoc de sumo: mou el teu robot amb les fletxes o WASD i treu el robot de la CPU del ring. Espai per embestir."
      />
      <div className={styles.bar}>
        <p className={styles.help}>
          <span className={styles.helpKeys}>
            <kbd>←</kbd>
            <kbd>↑</kbd>
            <kbd>↓</kbd>
            <kbd>→</kbd> o <kbd>WASD</kbd> per moure't · <kbd>Espai</kbd> per embestir
          </span>
          <span className={styles.helpTouch}>Arrossega el dit sobre la pantalla per moure't</span>
        </p>
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.dash}
            onPointerDown={(event) => {
              event.preventDefault()
              gameRef.current?.dash()
            }}
          >
            {playing ? 'Embestir' : 'Jugar'}
          </button>
          <IconButton
            icon={muted ? VolumeX : Volume2}
            label="Silencia el so"
            size={40}
            aria-pressed={muted}
            onClick={toggleSound}
          />
        </div>
      </div>
    </div>
  )
}

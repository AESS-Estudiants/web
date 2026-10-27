import { drawText, drawTextCentered } from './pixel-font'
import { createSound } from './sound'

// Logical resolution: everything is drawn on this pixel grid and scaled up without smoothing
export const WIDTH = 160
export const HEIGHT = 120

// Colours come from the design tokens, so the game follows the site palette
const PALETTE_TOKENS = {
  bg: '--bg-page',
  dots: '--bg-surface',
  ringSide: '--bg-section-alt',
  ring: '--bg-surface',
  line: '--text-primary',
  ink: '--bg-page',
  paper: '--text-primary',
  steel: '--text-muted',
  muted: '--text-disabled',
  text: '--text-secondary',
  accent: '--text-accent',
  cpu: '--accent-strong',
  panel: '--bg-section-alt',
  ink700: '--border-strong',
} as const

type Palette = Record<keyof typeof PALETTE_TOKENS, string>

function readPalette(element: Element): Palette {
  const styles = getComputedStyle(element)
  const entries = Object.entries(PALETTE_TOKENS).map(([key, token]) => [
    key,
    styles.getPropertyValue(token).trim() || 'gray',
  ])
  return Object.fromEntries(entries) as Palette
}

let PALETTE: Palette

type Phase = 'title' | 'countdown' | 'play' | 'point' | 'over'
type Player = 'p1' | 'cpu'
type Facing = 0 | 1 | 2 | 3

type Robot = {
  x: number
  y: number
  vx: number
  vy: number
  facing: Facing
  trim: string
  dash: number
  cooldown: number
  fall: number
  out: boolean
}

export type SumoGame = {
  dash: () => void
  setMuted: (value: boolean) => void
  destroy: () => void
}

// The HUD (names, lives, round and dash bar) takes the top rows; the ring is drawn 4px deep
const HUD_BOTTOM = 13
const RING_DEPTH = 4
// Ring centred in the space under the HUD, counting its side
const RING = { x: WIDTH / 2, y: Math.round((HUD_BOTTOM + HEIGHT - RING_DEPTH) / 2), r: 44 }
const ROBOT_R = 6.5
const ACCEL = 210
const MAX_SPEED = 60
const FRICTION = 3.2
const DASH_SPEED = 105
const DASH_TIME = 0.22
const DASH_COOLDOWN = 1.4
const POINTS_TO_WIN = 2
const WINS_KEY = 'aessbot-sumo-wins'

// Top view of a minisumo robot facing right: ink outline, paper body,
// top bar (trim colour), scoop at the front, wheels on the sides, two eyes.
const SPRITE = [
  '..kkkkk.....',
  '.kkkkkkk....',
  'kwwwwwwwwsk.',
  'kwttwwwwwssk',
  'kwttwwwkwssk',
  'kwttwwwwwssk',
  'kwttwwwwwssk',
  'kwttwwwkwssk',
  'kwttwwwwwssk',
  'kwwwwwwwwsk.',
  '.kkkkkkk....',
  '..kkkkk.....',
]

const rotate = (rows: string[]) =>
  (rows[0] ?? '').split('').map((_, x) =>
    rows
      .map((row) => row[x])
      .reverse()
      .join(''),
  )
// Sprites for facing right, down, left, up
const SPRITES = [SPRITE, rotate(SPRITE), rotate(rotate(SPRITE)), rotate(rotate(rotate(SPRITE)))]

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
const len = (x: number, y: number) => Math.hypot(x, y)

function readWins() {
  try {
    return Number(localStorage.getItem(WINS_KEY)) || 0
  } catch {
    return 0
  }
}

function saveWins(value: number) {
  try {
    localStorage.setItem(WINS_KEY, String(value))
  } catch {
    // storage unavailable (private mode): wins just aren't remembered
  }
}

function makeRobot(x: number, y: number, facing: Facing, trim: string): Robot {
  return { x, y, vx: 0, vy: 0, facing, trim, dash: 0, cooldown: 0, fall: 0, out: false }
}

function paintBackground() {
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas
  ctx.fillStyle = PALETTE.bg
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
  ctx.fillStyle = PALETTE.dots
  for (let y = 3; y < HEIGHT; y += 6) for (let x = 3; x < WIDTH; x += 6) ctx.fillRect(x, y, 1, 1)

  // Dohyo, drawn pixel by pixel so the edges stay crisp: side, top, outer edge, inner circle, spokes
  const { x: cx, y: cy, r } = RING
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const d = len(x + 0.5 - cx, y + 0.5 - cy)
      const dSide = len(x + 0.5 - cx, y + 0.5 - (cy + RING_DEPTH))
      let color: string | null = null
      if (d <= r + 2) {
        color = PALETTE.ring
        if (d > r - 1) color = PALETTE.line
        else if (d > r - 9 && d <= r - 7) color = PALETTE.line
        else if (d > r - 7) {
          const angle = Math.atan2(y - cy, x - cx)
          const segment = ((angle + Math.PI) / (Math.PI * 2)) * 12
          if (Math.abs(segment - Math.round(segment)) < 0.06) color = PALETTE.line
        }
      } else if (dSide <= r + 2) {
        color = PALETTE.ringSide
      }
      if (color) {
        ctx.fillStyle = color
        ctx.fillRect(x, y, 1, 1)
      }
    }
  }
  // Starting lines
  ctx.fillStyle = PALETTE.steel
  ctx.fillRect(cx - 12, cy - 4, 1, 8)
  ctx.fillRect(cx + 11, cy - 4, 1, 8)
  return canvas
}

function drawRobot(ctx: CanvasRenderingContext2D, robot: Robot) {
  const sprite = SPRITES[robot.facing] ?? SPRITE
  const size = sprite.length
  // Falling off the ring: shrink and fade into the dark
  const scale = robot.fall ? Math.max(0, 1 - robot.fall * 1.6) : 1
  if (scale <= 0) return
  const colors: Record<string, string> = {
    k: PALETTE.ink,
    w: PALETTE.paper,
    t: robot.trim,
    s: PALETTE.steel,
  }
  const ox = Math.round(robot.x - (size * scale) / 2)
  const oy = Math.round(robot.y - (size * scale) / 2)
  const px = Math.max(1, Math.round(scale))
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const c = sprite[y]?.[x]
      if (!c || c === '.') continue
      ctx.fillStyle = colors[c] ?? PALETTE.paper
      ctx.fillRect(ox + Math.floor(x * scale), oy + Math.floor(y * scale), px, px)
    }
  }
}

// 5x4 pixel hearts: solid = life left, outline = life lost
const HEART_FULL = ['.#.#.', '#####', '.###.', '..#..']
const HEART_EMPTY = ['.#.#.', '#.#.#', '.#.#.', '..#..']

function drawLives(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  lives: number,
  color: string,
  alignRight: boolean,
  blink: { on: boolean } | null,
) {
  for (let i = 0; i < POINTS_TO_WIN; i++) {
    const hx = alignRight ? x - (POINTS_TO_WIN - i) * 7 : x + i * 7
    // The life that was just lost blinks while the point banner is shown
    const justLost = Boolean(blink) && i === lives
    const full = i < lives || (justLost && Boolean(blink?.on))
    const rows = full ? HEART_FULL : HEART_EMPTY
    ctx.fillStyle = full ? color : PALETTE.muted
    rows.forEach((row, ry) => {
      for (let rx = 0; rx < 5; rx++) if (row[rx] === '#') ctx.fillRect(hx + rx, y + ry, 1, 1)
    })
  }
}

/**
 * Creates the AESSBot sumo mini-game on a canvas.
 * `hooks.onState(state)` is called when the phase changes (used by the page for the mobile dash button).
 */
export function createSumoGame(
  canvas: HTMLCanvasElement,
  hooks: { onState?: (phase: Phase) => void } = {},
): SumoGame {
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas 2D is not available')
  const ctx = context
  PALETTE = readPalette(canvas)
  const background = paintBackground()
  const sound = createSound()

  const input = {
    up: false,
    down: false,
    left: false,
    right: false,
    stick: null as { x: number; y: number } | null,
    dash: false,
  }
  const state = {
    phase: 'title' as Phase,
    timer: 0,
    round: 1,
    score: { p1: 0, cpu: 0 },
    shake: 0,
    message: '',
    wins: readWins(),
    lastWinner: null as Player | null,
  }
  let p1 = makeRobot(RING.x - 19, RING.y, 0, PALETTE.accent)
  let cpu = makeRobot(RING.x + 19, RING.y, 2, PALETTE.cpu)
  let started = false
  let cpuBrain = { t: 0, jitterX: 0, jitterY: 0 }

  const setPhase = (phase: Phase, timer = 0) => {
    state.phase = phase
    state.timer = timer
    hooks.onState?.(phase)
  }

  const resetRound = () => {
    p1 = makeRobot(RING.x - 19, RING.y, 0, PALETTE.accent)
    cpu = makeRobot(RING.x + 19, RING.y, 2, PALETTE.cpu)
    started = true
    setPhase('countdown', 3)
    sound.tick()
  }

  const startMatch = () => {
    state.score = { p1: 0, cpu: 0 }
    state.round = 1
    resetRound()
  }

  // Player pressed the "action" input: start / restart, or dash while playing
  const action = () => {
    sound.unlock()
    if (state.phase === 'title' || state.phase === 'over') startMatch()
    else if (state.phase === 'play') input.dash = true
  }

  const facingFrom = (vx: number, vy: number, current: Facing): Facing => {
    if (len(vx, vy) < 6) return current
    return Math.abs(vx) > Math.abs(vy) ? (vx > 0 ? 0 : 2) : vy > 0 ? 1 : 3
  }

  const steer = (robot: Robot, ax: number, ay: number, power: number, dt: number) => {
    const l = len(ax, ay)
    if (l > 0) {
      robot.vx += (ax / l) * ACCEL * power * Math.min(1, l) * dt
      robot.vy += (ay / l) * ACCEL * power * Math.min(1, l) * dt
    }
  }

  const tryDash = (robot: Robot, dx: number, dy: number) => {
    if (robot.cooldown > 0) return
    const l = len(dx, dy) || 1
    robot.vx = (dx / l) * DASH_SPEED
    robot.vy = (dy / l) * DASH_SPEED
    robot.dash = DASH_TIME
    robot.cooldown = DASH_COOLDOWN
    sound.dash()
  }

  const integrate = (robot: Robot, dt: number) => {
    robot.cooldown = Math.max(0, robot.cooldown - dt)
    robot.dash = Math.max(0, robot.dash - dt)
    const max = robot.dash > 0 ? DASH_SPEED : MAX_SPEED
    const speed = len(robot.vx, robot.vy)
    if (speed > max) {
      robot.vx *= max / speed
      robot.vy *= max / speed
    }
    const damping = Math.exp(-FRICTION * dt)
    robot.vx *= damping
    robot.vy *= damping
    robot.x += robot.vx * dt
    robot.y += robot.vy * dt
    robot.facing = facingFrom(robot.vx, robot.vy, robot.facing)
  }

  const collide = () => {
    const dx = cpu.x - p1.x
    const dy = cpu.y - p1.y
    const dist = len(dx, dy)
    const minDist = ROBOT_R * 2
    if (dist >= minDist || dist === 0) return
    const nx = dx / dist
    const ny = dy / dist
    const overlap = (minDist - dist) / 2
    p1.x -= nx * overlap
    p1.y -= ny * overlap
    cpu.x += nx * overlap
    cpu.y += ny * overlap
    const approach = (p1.vx - cpu.vx) * nx + (p1.vy - cpu.vy) * ny
    if (approach <= 0) return
    // A dashing robot hits harder and keeps more of its momentum
    const p1Power = p1.dash > 0 ? 1.5 : 1
    const cpuPower = cpu.dash > 0 ? 1.5 : 1
    const impulse = approach * 0.9
    p1.vx -= nx * impulse * cpuPower * 0.8
    p1.vy -= ny * impulse * cpuPower * 0.8
    cpu.vx += nx * impulse * p1Power
    cpu.vy += ny * impulse * p1Power
    state.shake = Math.min(2, approach / 30)
    if (approach > 9) sound.bump(approach)
  }

  const updateCpu = (dt: number) => {
    const difficulty = 0.57 + state.round * 0.08
    cpuBrain.t -= dt
    if (cpuBrain.t <= 0) {
      cpuBrain = {
        t: 0.35 + Math.random() * 0.4,
        jitterX: (Math.random() - 0.5) * 12,
        jitterY: (Math.random() - 0.5) * 12,
      }
    }
    // Aim slightly ahead of the player, but retreat to the centre when close to the edge
    let tx = p1.x + p1.vx * 0.25 + cpuBrain.jitterX - cpu.x
    let ty = p1.y + p1.vy * 0.25 + cpuBrain.jitterY - cpu.y
    const fromCenter = len(cpu.x - RING.x, cpu.y - RING.y)
    if (fromCenter > RING.r * 0.72) {
      const k = (fromCenter - RING.r * 0.72) / (RING.r * 0.28)
      tx = tx * (1 - k) + (RING.x - cpu.x) * k * 2
      ty = ty * (1 - k) + (RING.y - cpu.y) * k * 2
    }
    steer(cpu, tx, ty, difficulty, dt)
    const toPlayer = len(p1.x - cpu.x, p1.y - cpu.y)
    if (toPlayer < 24 && toPlayer > 13 && Math.random() < dt * 1.15 * difficulty) {
      tryDash(cpu, p1.x - cpu.x, p1.y - cpu.y)
    }
  }

  const scorePoint = (winner: Player) => {
    state.score[winner] += 1
    state.lastWinner = winner
    if (state.score[winner] >= POINTS_TO_WIN) {
      setPhase('over', 0)
      if (winner === 'p1') {
        state.wins += 1
        saveWins(state.wins)
        sound.win()
      } else {
        sound.lose()
      }
    } else {
      setPhase('point', 1.6)
    }
  }

  const update = (dt: number) => {
    state.shake = Math.max(0, state.shake - dt * 10)
    if (state.phase === 'countdown') {
      const before = Math.ceil(state.timer)
      state.timer -= dt
      if (Math.ceil(state.timer) !== before && state.timer > 0) sound.tick()
      if (state.timer <= 0) {
        setPhase('play')
        sound.go()
      }
      return
    }
    if (state.phase === 'point') {
      for (const robot of [p1, cpu]) if (robot.out) robot.fall += dt
      state.timer -= dt
      if (state.timer <= 0) {
        state.round += 1
        resetRound()
      }
      return
    }
    if (state.phase === 'over') {
      for (const robot of [p1, cpu]) if (robot.out) robot.fall += dt
      return
    }
    if (state.phase !== 'play') return
    state.timer -= dt // time since "JA!", used to hide the banner

    // Player input: keyboard or touch stick
    let ax = (input.right ? 1 : 0) - (input.left ? 1 : 0)
    let ay = (input.down ? 1 : 0) - (input.up ? 1 : 0)
    if (input.stick) {
      ax = input.stick.x
      ay = input.stick.y
    }
    steer(p1, ax, ay, 1, dt)
    if (input.dash) {
      input.dash = false
      const dx = ax || cpu.x - p1.x
      const dy = ay || cpu.y - p1.y
      tryDash(p1, dx, dy)
    }
    updateCpu(dt)
    integrate(p1, dt)
    integrate(cpu, dt)
    collide()

    const p1Out = len(p1.x - RING.x, p1.y - RING.y) > RING.r
    const cpuOut = len(cpu.x - RING.x, cpu.y - RING.y) > RING.r
    if (p1Out || cpuOut) {
      p1.out = p1Out
      cpu.out = cpuOut
      sound.fall()
      if (p1Out && cpuOut) {
        // Both fell: replay the round
        setPhase('point', 1.6)
        state.lastWinner = null
        state.round -= 1
      } else {
        scorePoint(p1Out ? 'cpu' : 'p1')
      }
    }
  }

  const render = () => {
    ctx.save()
    const shakeX = state.shake ? Math.round((Math.random() - 0.5) * state.shake) : 0
    const shakeY = state.shake ? Math.round((Math.random() - 0.5) * state.shake) : 0
    ctx.translate(shakeX, shakeY)
    ctx.drawImage(background, 0, 0)

    if (started) {
      // Draw the lower robot last so overlaps look right
      for (const robot of [p1, cpu].sort((a, b) => a.y - b.y)) drawRobot(ctx, robot)
      if (state.phase === 'play' || state.phase === 'countdown') {
        drawTextCentered(ctx, 'TU', p1.x, p1.y - 14, PALETTE.accent)
      }
    }
    ctx.restore()

    // HUD
    drawText(ctx, 'TU', 5, 5, PALETTE.accent)
    const showLoss = state.phase === 'point' || state.phase === 'over'
    const blinkOn = Math.floor(performance.now() / 150) % 2 === 0
    const p1Blink = showLoss && state.lastWinner === 'cpu' ? { on: blinkOn } : null
    const cpuBlink = showLoss && state.lastWinner === 'p1' ? { on: blinkOn } : null
    drawLives(ctx, 15, 5, POINTS_TO_WIN - state.score.cpu, PALETTE.accent, false, p1Blink)
    drawText(ctx, 'CPU', WIDTH - 16, 5, PALETTE.cpu)
    drawLives(ctx, WIDTH - 19, 5, POINTS_TO_WIN - state.score.p1, PALETTE.paper, true, cpuBlink)
    if (state.phase !== 'title')
      drawTextCentered(ctx, `RONDA ${state.round}`, WIDTH / 2, 5, PALETTE.muted)
    if (state.phase === 'play') {
      // Dash charge bar under the HUD
      const charge = 1 - p1.cooldown / DASH_COOLDOWN
      ctx.fillStyle = PALETTE.muted
      ctx.fillRect(5, 12, 22, 1)
      ctx.fillStyle = charge >= 1 ? PALETTE.paper : PALETTE.accent
      ctx.fillRect(5, 12, Math.round(22 * charge), 1)
    }

    // Solid panel with a 1px border so the pixel text stays readable over the ring
    // Equal padding top and bottom; a bigger gap after the (scaled) title than between body lines
    const PAD = 9
    type Line = [text: string, color: string, scale?: number]
    const panel = (lines: Line[], centerY = RING.y + RING_DEPTH / 2) => {
      const scaleOf = (i: number) => lines[i]?.[2] ?? 1
      const gapAfter = (i: number) => (i === lines.length - 1 ? 0 : scaleOf(i) > 1 ? 9 : 5)
      const lineHeight = (i: number) => 5 * scaleOf(i)
      const content = lines.reduce((sum, _, i) => sum + lineHeight(i) + gapAfter(i), 0)
      const h = content + PAD * 2
      const top = Math.round(centerY - h / 2)
      ctx.fillStyle = PALETTE.ink700
      ctx.fillRect(8, top - 1, WIDTH - 16, h + 2)
      ctx.fillStyle = PALETTE.panel
      ctx.fillRect(9, top, WIDTH - 18, h)
      let y = top + PAD
      lines.forEach(([text, color, scale = 1], i) => {
        drawTextCentered(ctx, text, WIDTH / 2, y, color, scale)
        y += lineHeight(i) + gapAfter(i)
      })
    }

    if (state.phase === 'title') {
      const title: Line[] = [
        ['SUMO AESSBOT', PALETTE.paper, 2],
        ['TREU LA CPU DEL RING', PALETTE.text],
        ['CLICA O PREM ESPAI', PALETTE.accent],
      ]
      // Inside the panel: under it, it would sit on the ring
      if (state.wins) title.push([`VICTORIES: ${state.wins}`, PALETTE.muted])
      panel(title)
    } else if (state.phase === 'countdown') {
      drawTextCentered(
        ctx,
        String(Math.ceil(state.timer)),
        WIDTH / 2,
        RING.y - 30,
        PALETTE.paper,
        2,
      )
    } else if (state.phase === 'play' && state.timer > -0.6) {
      drawTextCentered(ctx, 'JA!', WIDTH / 2, RING.y - 30, PALETTE.paper, 2)
    } else if (state.phase === 'point') {
      const text =
        state.lastWinner === 'p1'
          ? 'PUNT PER A TU!'
          : state.lastWinner === 'cpu'
            ? 'PUNT PER A LA CPU'
            : 'EMPAT, REPETIM'
      panel([[text, PALETTE.paper]], RING.y - 34)
    } else if (state.phase === 'over') {
      const won = state.lastWinner === 'p1'
      panel([
        [won ? 'HAS GUANYAT!' : 'GUANYA LA CPU', won ? PALETTE.paper : PALETTE.text, 2],
        [won ? 'ESTAS A PUNT PER AL 2027' : 'ENTRENA PER AL 2027', PALETTE.text],
        ['ESPAI PER TORNAR-HI', PALETTE.accent],
      ])
    }
  }

  // Canvas backing store: integer multiple of the logical size for crisp pixels
  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    const scale = Math.max(
      1,
      Math.ceil((rect.width * Math.min(window.devicePixelRatio, 2)) / WIDTH),
    )
    if (canvas.width !== WIDTH * scale) {
      canvas.width = WIDTH * scale
      canvas.height = HEIGHT * scale
    }
    ctx.setTransform(scale, 0, 0, scale, 0, 0)
    ctx.imageSmoothingEnabled = false
    render()
  }
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)

  // Fixed time step loop, paused when off-screen or the tab is hidden
  let frame = 0
  let last = 0
  let running = false
  const loop = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000 || 0)
    last = now
    update(dt)
    render()
    frame = requestAnimationFrame(loop)
  }
  const start = () => {
    if (running) return
    running = true
    last = performance.now()
    frame = requestAnimationFrame(loop)
  }
  const stop = () => {
    running = false
    cancelAnimationFrame(frame)
  }
  const visibility = new IntersectionObserver(([entry]) =>
    entry?.isIntersecting ? start() : stop(),
  )
  visibility.observe(canvas)
  const onVisibility = () => (document.hidden ? stop() : start())
  document.addEventListener('visibilitychange', onVisibility)
  start()

  // Keyboard: only while the game has focus, so the page still scrolls normally
  type Direction = 'up' | 'down' | 'left' | 'right'
  const keys: Record<string, Direction> = {
    ArrowUp: 'up',
    KeyW: 'up',
    ArrowDown: 'down',
    KeyS: 'down',
    ArrowLeft: 'left',
    KeyA: 'left',
    ArrowRight: 'right',
    KeyD: 'right',
  }
  const onKeyDown = (event: KeyboardEvent) => {
    const direction = keys[event.code]
    if (direction) {
      input[direction] = true
      event.preventDefault()
    } else if (event.code === 'Space' || event.code === 'Enter') {
      if (!event.repeat) action()
      event.preventDefault()
    }
  }
  const onKeyUp = (event: KeyboardEvent) => {
    const direction = keys[event.code]
    if (direction) input[direction] = false
  }
  const onBlur = () =>
    Object.assign(input, { up: false, down: false, left: false, right: false, stick: null })
  canvas.addEventListener('keydown', onKeyDown)
  canvas.addEventListener('keyup', onKeyUp)
  canvas.addEventListener('blur', onBlur)

  // Pointer: tap to start; while playing, drag anywhere on the canvas as a joystick
  let origin: { x: number; y: number; id: number } | null = null
  const onPointerDown = (event: PointerEvent) => {
    canvas.focus({ preventScroll: true })
    if (state.phase !== 'play') {
      action()
      return
    }
    origin = { x: event.clientX, y: event.clientY, id: event.pointerId }
    canvas.setPointerCapture(event.pointerId)
  }
  const onPointerMove = (event: PointerEvent) => {
    if (!origin || event.pointerId !== origin.id) return
    const dx = event.clientX - origin.x
    const dy = event.clientY - origin.y
    const l = len(dx, dy)
    input.stick = l < 6 ? null : { x: clamp(dx / 40, -1, 1), y: clamp(dy / 40, -1, 1) }
  }
  const onPointerUp = (event: PointerEvent) => {
    if (origin && event.pointerId === origin.id) {
      origin = null
      input.stick = null
    }
  }
  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerup', onPointerUp)
  canvas.addEventListener('pointercancel', onPointerUp)

  resize()

  return {
    dash: () => {
      sound.unlock()
      if (state.phase === 'play') input.dash = true
      else action()
    },
    setMuted: (value) => sound.setMuted(value),
    destroy() {
      stop()
      resizeObserver.disconnect()
      visibility.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('keydown', onKeyDown)
      canvas.removeEventListener('keyup', onKeyUp)
      canvas.removeEventListener('blur', onBlur)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      sound.close()
    },
  }
}

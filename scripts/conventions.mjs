// Shared naming rules for commits, PR titles and branches
export const TYPES = [
  'feat',
  'fix',
  'chore',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'build',
  'ci',
  'revert',
]

const MAX_LENGTH = 100
const HEADER = new RegExp(`^(${TYPES.join('|')}): [a-z0-9\`].*[^.\\s]$`)
const BRANCH = new RegExp(`^(${TYPES.join('|')})/[a-z0-9]+(-[a-z0-9]+)*$`)
export const LONG_LIVED_BRANCHES = ['main', 'dev']

// Returns an error message, or null when the message is valid
export function validateMessage(text) {
  const lines = text
    .split('\n')
    .filter((line) => !line.startsWith('#'))
    .map((line) => line.trimEnd())
    .filter((line) => line !== '')

  if (lines.length === 0) return 'The message is empty.'
  if (lines.length > 1) return 'Use a single line, without a body.'

  const [header] = lines
  if (header.length > MAX_LENGTH) return `Keep it under ${MAX_LENGTH} characters.`
  if (!HEADER.test(header)) {
    return `Use "type: reason" in lowercase, without a final dot. Types: ${TYPES.join(', ')}.`
  }
  return null
}

export function validateBranch(name) {
  if (LONG_LIVED_BRANCHES.includes(name) || BRANCH.test(name)) return null
  return `Use "type/short-reason" with hyphens, e.g. feat/button-component. Types: ${TYPES.join(', ')}.`
}

// pre-push hook: checks branch names and asks before pushing straight to main or dev.
// Git passes "<local_ref> <local_sha> <remote_ref> <remote_sha>" lines on stdin.
import { closeSync, openSync, readFileSync, readSync, writeSync } from 'node:fs'
import { LONG_LIVED_BRANCHES, validateBranch } from './conventions.mjs'

const input = readFileSync(0, 'utf8').trim()
const refs = input ? input.split('\n').map((line) => line.split(' ')) : []
const branchOf = (ref) => ref.replace('refs/heads/', '')

for (const [localRef] of refs) {
  if (!localRef.startsWith('refs/heads/')) continue
  const error = validateBranch(branchOf(localRef))
  if (error) {
    console.error(`✗ Branch "${branchOf(localRef)}": ${error}`)
    process.exit(1)
  }
}

const protectedTargets = refs
  .map(([, , remoteRef]) => remoteRef)
  .filter((ref) => ref?.startsWith('refs/heads/') && LONG_LIVED_BRANCHES.includes(branchOf(ref)))

if (protectedTargets.length === 0) process.exit(0)

let tty
try {
  tty = openSync('/dev/tty', 'r+')
} catch {
  process.exit(0) // non-interactive environment (CI)
}

for (const ref of protectedTargets) {
  writeSync(tty, `\n⚠️  About to push straight to "${branchOf(ref)}". Continue? [y/N] `)
  const buffer = Buffer.alloc(16)
  const answer = buffer.toString('utf8', 0, readSync(tty, buffer)).trim().toLowerCase()
  if (answer !== 'y' && answer !== 'yes') {
    writeSync(tty, '✗ Push aborted.\n')
    closeSync(tty)
    process.exit(1)
  }
}
closeSync(tty)

import { describe, expect, it } from 'vitest'
import { validateBranch, validateMessage } from './conventions.mjs'

describe('validateMessage', () => {
  it.each([
    'feat: add button component',
    'fix: restore focus after closing the mobile menu',
    'chore: upgrade to react 19',
  ])('accepts "%s"', (message) => {
    expect(validateMessage(message)).toBeNull()
  })

  it.each([
    ['feat: Add button', 'starts with an uppercase letter'],
    ['feature: add button', 'uses an unknown type'],
    ['feat: add button.', 'ends with a dot'],
    ['feat(ui): add button', 'has a scope'],
    ['feat:add button', 'has no space after the colon'],
    ['feat: add button\n\nlonger body', 'has a body'],
    [`feat: ${'a'.repeat(100)}`, 'is too long'],
    ['', 'is empty'],
  ])('rejects "%s" because it %s', (message) => {
    expect(validateMessage(message)).not.toBeNull()
  })

  it('ignores comment lines added by git', () => {
    expect(validateMessage('feat: add button\n# Please enter the commit message')).toBeNull()
  })
})

describe('validateBranch', () => {
  it.each(['main', 'dev', 'feat/button-component', 'chore/setup-git-workflow', 'fix/menu'])(
    'accepts "%s"',
    (branch) => {
      expect(validateBranch(branch)).toBeNull()
    },
  )

  it.each(['feature/button', 'feat/Button', 'feat/button_component', 'fix/a--b', 'button'])(
    'rejects "%s"',
    (branch) => {
      expect(validateBranch(branch)).not.toBeNull()
    },
  )
})

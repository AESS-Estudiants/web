import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import { BUILD_CONSTANTS } from './app/content/build-constants.ts'

// Separate from vite.config.ts so tests don't load the React Router plugin
export default defineConfig({
  define: BUILD_CONSTANTS,
  resolve: {
    alias: { '~': fileURLToPath(new URL('./app', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    include: ['app/**/*.test.{ts,tsx}', 'scripts/**/*.test.{js,mjs,ts}'],
    setupFiles: ['app/test/setup.ts'],
    coverage: { include: ['app/**', 'scripts/**'], exclude: ['**/*.test.*', 'app/test/**'] },
  },
})

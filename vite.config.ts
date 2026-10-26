import { fileURLToPath } from 'node:url'
import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import { imagetools } from 'vite-imagetools'

// `import photo from './photo.jpg?responsive'` gives AVIF, WebP and JPEG at several widths
const RESPONSIVE = new URLSearchParams({
  w: '480;800;1200;1600',
  format: 'avif;webp;jpg',
  as: 'picture',
})

export default defineConfig({
  plugins: [
    imagetools({
      defaultDirectives: (url) =>
        url.searchParams.has('responsive') ? RESPONSIVE : new URLSearchParams(),
      cache: { enabled: true, dir: './node_modules/.cache/imagetools' },
    }),
    reactRouter(),
  ],
  resolve: { alias: { '~': fileURLToPath(new URL('./app', import.meta.url)) } },
})

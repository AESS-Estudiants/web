# AESS Estudiants · Web

Website of AESS Estudiants, the robotics student association of ETSETB (UPC). Live at [aessestudiants.org](https://aessestudiants.org).

## Stack

React 19 · React Router 8 (prerendered static pages) · Vite · TypeScript · CSS Modules · Biome · Vitest · Playwright · pnpm.

## Getting started

```bash
nvm use                          # Node version from .nvmrc
corepack enable                  # pnpm version pinned in package.json
pnpm install
cp .env.example .env             # EmailJS keys, only needed to send the contact form
pnpm dev                         # http://localhost:5173
```

| Command        | What it does                                                                  |
| -------------- | ----------------------------------------------------------------------------- |
| `pnpm build`   | Production build with one prerendered HTML page per route                     |
| `pnpm test`    | Unit and component tests                                                      |
| `pnpm e2e`     | End-to-end, accessibility and SEO tests                                       |
| `pnpm preview` | Serves the production build like Vercel (clean URLs, real 404)                |
| `pnpm tokens`  | Regenerates `app/styles/tokens.css` from the Figma export in `design-tokens/` |

## Structure

```
app/
  routes/       one folder per page (URL in Catalan, folder in English, mapped in routes.ts)
  components/   design system, same families as Figma
  features/     self-contained blocks with their own logic (e.g. sumo-game)
  content/      all editable texts and data, validated by schemas.ts
  assets/       photos, served as responsive AVIF/WebP/JPEG
  styles/       tokens.css (generated), base.css, motion.css
public/         PDFs, SVG logos and the share image
```

## Editing content

All texts, courses, projects, FAQs, AESSBot editions and sponsors live in `app/content/` as JSON, in Catalan. Edit the file and open a PR; the build and the tests fail if a field is missing or a link or photo doesn't exist. Text fields marked as rich text accept `**bold**` and `[links](/path)`.

- **Photos**: put them in `app/assets/images/<page>/` (JPEG, 2000 px wide is plenty) and refer to them as `<page>/<file>.jpg` with an `alt` text. Sizes and formats are generated at build time.
- **AESSBot**: `status` in `app/content/aessbot.json` picks the page. `coming-soon` shows the minigame page, `registration` the full edition with the registration page at `/aessbot/inscripcio`, and `finished` the edition without registration. Update the edition texts, dates and form link before switching.

## Design

Source of truth: the Figma file **AESS** (Desktop, Mobile, Components, Foundations). Components only use the semantic tokens from `tokens.css` (`var(--bg-page)`, `var(--space-16)`…); hardcoded colours fail the checks.

## Workflow

- **Branches**: `main` is production, `dev` is the development trunk (with its own preview). Work in short-lived `type/short-reason` branches from `dev`, e.g. `feat/button-component`. Releases are a PR from `dev` to `main`.
- **Commits**: one line, `type: reason` (`feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `revert`).
- **PRs**: small, one topic each, title in the same format, short plain description.
- **Hooks** (lefthook, installed with `pnpm install`): format with Biome, type check, and commit message and branch name checks.
- **CI** runs lint, types, tests, build, e2e and Lighthouse on every PR. Vercel deploys a preview for each PR and for `dev`, and production from `main`.
- **Vercel settings**: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID` and `VITE_EMAILJS_PUBLIC_KEY` for the contact form, and Web Analytics enabled (it only loads on aessestudiants.org). Redirects, security headers and the content security policy are in `vercel.json`.

## License

Code under the MIT License. Content, photos and logos of AESS Estudiants: all rights reserved.

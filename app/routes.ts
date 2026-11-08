import { index, type RouteConfig, route } from '@react-router/dev/routes'
import site from './content/site.json' with { type: 'json' }

// Public URLs are in Catalan; route modules are named in English
const routes = [
  index('routes/home/route.tsx'),
  route('aessbot', 'routes/aessbot/route.tsx'),
  route('aessbot/inscripcio', 'routes/aessbot-registration/route.tsx'),
  route('cursos', 'routes/courses/route.tsx'),
  route('projectes', 'routes/projects/route.tsx'),
  route('uneix-te', 'routes/join/route.tsx'),
  route('contacte', 'routes/contact/route.tsx'),
  route('sitemap.xml', 'routes/sitemap/route.ts'),
  route('robots.txt', 'routes/robots/route.ts'),
  route('*', 'routes/not-found/route.tsx'),
] satisfies RouteConfig

// Pages switched off in site.json (hiddenPaths) aren't built, so their URL shows the 404 page
export default routes.filter(
  (entry) => entry.path === undefined || !site.hiddenPaths.includes(`/${entry.path}`),
) satisfies RouteConfig

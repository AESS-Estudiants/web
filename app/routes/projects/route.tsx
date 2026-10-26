import { projects } from '~/content/projects'
import { pageMeta } from '~/lib/seo'
import type { Route } from './+types/route'
import { Active } from './sections/Active'
import { Activities } from './sections/Activities'
import { Hero } from './sections/Hero'
import { Intro } from './sections/Intro'
import { Join } from './sections/Join'

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: 'Projectes',
    description:
      'Descobreix les iniciatives en robòtica i electrònica que impulsem des del taller.',
    path: '/projectes',
  })
}

export default function ProjectsPage() {
  return (
    <>
      <Hero hero={projects.hero} />
      <Intro intro={projects.intro} />
      <Active active={projects.active} />
      <Activities activities={projects.activities} />
      <Join join={projects.join} />
    </>
  )
}

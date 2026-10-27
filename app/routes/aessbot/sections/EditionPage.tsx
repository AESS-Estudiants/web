import type { Aessbot } from '~/content/schemas'
import { Competition } from './Competition'
import { EditionFaq } from './EditionFaq'
import { EditionHero } from './EditionHero'
import { Info } from './Info'
import { Rules } from './Rules'
import { Schedule } from './Schedule'
import { Sponsors } from './Sponsors'

type EditionPageProps = {
  content: Aessbot
  /** Shows the registration button and countdown */
  registrationOpen: boolean
}

// The full edition page, shown once the edition is announced
export function EditionPage({ content, registrationOpen }: EditionPageProps) {
  const { edition } = content
  return (
    <>
      <EditionHero
        hero={edition.hero}
        registration={registrationOpen ? edition.registration : undefined}
      />
      <Competition competition={edition.competition} editions={content.editions.items} />
      <Info info={edition.info} />
      <Schedule schedule={edition.schedule} />
      <Rules rules={edition.rules} />
      <Sponsors sponsors={edition.sponsors} />
      <EditionFaq faq={edition.faq} />
    </>
  )
}

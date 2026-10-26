import { SectionHeader } from '~/components/content'
import { Section } from '~/components/layout'
import { FormEmbed } from '~/components/media'
import type { AessbotRegistration } from '~/content/schemas'
import styles from './RegistrationForm.module.css'

export function RegistrationForm({ form }: { form: AessbotRegistration['form'] }) {
  return (
    <Section tone="alt" id="formulari-inscripcio" labelledBy="formulari-inscripcio-title">
      <SectionHeader
        id="formulari-inscripcio-title"
        title={form.title}
        subtitle={form.description}
        className={styles.header}
      />
      <FormEmbed url={form.url} title={form.frameTitle} />
    </Section>
  )
}

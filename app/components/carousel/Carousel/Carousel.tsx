import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { type ReactNode, useCallback, useEffect, useState } from 'react'
import { Icon } from '~/components/icons'
import { cx } from '~/lib/cx'
import styles from './Carousel.module.css'

type CarouselProps = {
  /** Accessible name of the whole carousel */
  label: string
  slides: ReactNode[]
  className?: string
}

export function Carousel({ label, slides, className }: CarouselProps) {
  const [viewportRef, embla] = useEmblaCarousel({ align: 'start' })
  const [selected, setSelected] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(slides.length > 1)

  const sync = useCallback(() => {
    if (!embla) return
    setSelected(embla.selectedScrollSnap())
    setCanPrev(embla.canScrollPrev())
    setCanNext(embla.canScrollNext())
  }, [embla])

  useEffect(() => {
    if (!embla) return
    sync()
    embla.on('select', sync).on('reInit', sync)
    return () => {
      embla.off('select', sync).off('reInit', sync)
    }
  }, [embla, sync])

  return (
    <section
      className={cx(styles.carousel, className)}
      aria-roledescription="carrusel"
      aria-label={label}
    >
      <div ref={viewportRef} className={styles.viewport}>
        <div className={styles.track}>
          {slides.map((slide, index) => (
            // biome-ignore lint/a11y/useSemanticElements: the ARIA carousel pattern uses a group per slide, not a fieldset
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: slides are static and never reordered
              key={index}
              className={styles.slide}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${index + 1} de ${slides.length}`}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            className={cx(styles.arrow, styles.prev)}
            aria-label="Diapositiva anterior"
            disabled={!canPrev}
            onClick={() => embla?.scrollPrev()}
          >
            <Icon icon={ChevronLeft} size={20} />
          </button>
          <button
            type="button"
            className={cx(styles.arrow, styles.next)}
            aria-label="Diapositiva següent"
            disabled={!canNext}
            onClick={() => embla?.scrollNext()}
          >
            <Icon icon={ChevronRight} size={20} />
          </button>
          <div className={styles.indicators}>
            {slides.map((_, index) => (
              <button
                // biome-ignore lint/suspicious/noArrayIndexKey: one indicator per static slide
                key={index}
                type="button"
                className={styles.indicator}
                aria-label={`Mostra la diapositiva ${index + 1}`}
                aria-current={index === selected}
                onClick={() => embla?.scrollTo(index)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

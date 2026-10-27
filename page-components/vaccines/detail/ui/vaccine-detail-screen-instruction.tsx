import type { VaccineInstructionSection } from './vaccine-detail-screen-instruction.types'
import { Heading, Text } from '@datavac/ui-kit'

type VaccineDetailScreenInstructionProps = {
  sections: VaccineInstructionSection[]
}

export function VaccineDetailScreenInstruction({ sections }: VaccineDetailScreenInstructionProps) {
  return (
    <article>
      <div className="flex flex-col gap-6">
        {sections.map((section) => {
          const sectionId = `instruction-section-${section.title.toLowerCase().replace(/\s+/g, '-')}`

          const contentParts = Array.isArray(section.content)
            ? section.content
            : section.content
                .split('\n')
                .map((item) => item.trim())
                .filter(Boolean)

          return (
            <section key={section.title} aria-labelledby={sectionId}>
              <Heading
                as="h2"
                size="lg"
                id={sectionId}
                className="font-medium leading-snug text-accent xl:text-xl xl:leading-6"
              >
                {section.title}
              </Heading>

              {section.variant === 'bullets' ? (
                <ul className="mt-3 ml-2 list-disc pl-5">
                  {contentParts.map((item, index) => (
                    <li key={`${section.title}-${index}`}>
                      <Text size="sm" className="text-fg">
                        {item}
                      </Text>
                    </li>
                  ))}
                </ul>
              ) : contentParts.length === 1 ? (
                <Text size="sm" className="mt-3 text-fg">
                  {contentParts[0]}
                </Text>
              ) : (
                <div className="mt-3 flex flex-col gap-2">
                  {contentParts.map((paragraph, index) => (
                    <Text key={`${section.title}-${index}`} size="sm" className="text-fg">
                      {paragraph}
                    </Text>
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </article>
  )
}

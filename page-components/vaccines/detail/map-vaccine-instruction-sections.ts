import type { Vaccine } from '@/shared/types/api'
import { ADMINISTRATION_CODE_TO_LABEL } from '@/page-components/vaccines/lib/map-administration-methods'
import type { VaccineInstructionSection } from './ui/vaccine-detail-screen-instruction.types'

export function mapVaccineInstructionSections(vaccine: Vaccine): VaccineInstructionSection[] {
  const sections: VaccineInstructionSection[] = []

  if (vaccine.age_allowed) {
    sections.push({
      title: 'Допустимый возраст',
      content: `Вакцина ${vaccine.name} показана для применения ${vaccine.age_allowed}.`,
    })
  }

  const seenCodes = new Set<string>()
  const methodLabels = (vaccine.administration_methods ?? [])
    .filter((m) => m.code || m.note)
    .filter((m) => {
      const key = m.code ?? m.note ?? ''
      if (seenCodes.has(key)) return false
      seenCodes.add(key)
      return true
    })
    .map((m) => (m.code ? ADMINISTRATION_CODE_TO_LABEL[m.code] ?? m.code : m.note!))

  if (methodLabels.length > 0) {
    sections.push({
      title: 'Способы введения',
      content: methodLabels.length === 1
        ? `Вакцину ${vaccine.name} следует вводить ${methodLabels[0]}.`
        : methodLabels,
    })
  }

  if (vaccine.indications) {
    sections.push({ title: 'Показания', content: vaccine.indications })
  }

  if (vaccine.interaction_info) {
    sections.push({ title: 'Взаимодействие с препаратами', content: vaccine.interaction_info })
  }

  if (vaccine.compatibility_info) {
    sections.push({
      title: 'Одновременное введение с другими вакцинами',
      content: vaccine.compatibility_info,
    })
  }

  if (vaccine.storage_conditions) {
    sections.push({ title: 'Хранение', content: vaccine.storage_conditions })
  }

  sections.push({
    title: 'Полный текст инструкции',
    content: vaccine.instruction_url || 'Инструкция не доступна',
  })

  return sections
}

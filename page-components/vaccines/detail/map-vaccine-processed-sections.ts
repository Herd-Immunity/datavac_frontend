import type { Vaccine } from '@/shared/types/api'
import { mapVaccineInfections } from '@/page-components/vaccines/lib/map-vaccine-infections'
import { ADMINISTRATION_CODE_TO_LABEL } from '@/page-components/vaccines/lib/map-administration-methods'
import { buildVaccinesPageHref } from '@/page-components/vaccines/model/sort'
import { mediaUrl } from '@/shared/api/media-url'
import type { ProcessedLinkItem, ProcessedSection } from './ui/vaccine-detail-screen-processed.types'

function mapInfectionItems(vaccine: Vaccine): ProcessedLinkItem[] {
  return mapVaccineInfections(vaccine.infections).map(({ name, href, id }) => ({
    id: id != null ? `infection-${id}` : `infection-${name}`,
    label: name,
    ...(href ? { href } : {}),
  }))
}

function pregnancyStatus(vaccine: Vaccine): { icon: 'neutral' | 'attention'; text: string } {
  return vaccine.pregnancy_usage_status
    ? { icon: 'neutral', text: 'Разрешена' }
    : { icon: 'attention', text: 'Не разрешена' }
}

const CONTRAINDICATION_TYPE_LABELS: Record<string, string> = {
  absolute: 'Абсолютные',
  relative: 'Временные',
  temporary: 'Временные',
}

const INGREDIENT_ROLE_LABELS: Record<string, string> = {
  active: 'Действующее вещество',
  auxiliary: 'Вспомогательное вещество',
}

export function mapVaccineProcessedSections(vaccine: Vaccine): ProcessedSection[] {
  const sections: ProcessedSection[] = []

  if (vaccine.official_name) {
    sections.push({
      kind: 'text',
      title: 'Полное название вакцины',
      text: vaccine.official_name,
    })
  }

  if (vaccine.infections.length > 0) {
    sections.push({
      kind: 'linkList',
      title: 'Инфекция',
      items: mapInfectionItems(vaccine),
    })
  }

  const seenAdminRows = new Set<string>()
  const administrationRows = vaccine.administration_methods
    .filter((m) => m.code || m.note || m.age_group)
    .filter((m) => {
      const key = `${m.code ?? ''}|${m.age_group ?? ''}|${m.note ?? ''}`
      if (seenAdminRows.has(key)) return false
      seenAdminRows.add(key)
      return true
    })
    .map((m) => ({
      ageRange: m.age_group || vaccine.age_allowed || 'не указан',
      description: (m.code ? ADMINISTRATION_CODE_TO_LABEL[m.code] ?? m.code : null) || m.note || 'не указан',
      method: m.code ?? undefined,
      note: m.note,
      listIconUrl: mediaUrl(m.list_icon_url),
      detailImageUrl: mediaUrl(m.detail_image_url),
    }))

  if (administrationRows.length > 0) {
    sections.push({
      kind: 'administration',
      title: 'Способы введения',
      rows: administrationRows,
    })
  }

  if (vaccine.contraindications.length > 0) {
    const grouped = vaccine.contraindications.reduce<
      Record<string, { id: number; name: string; type: string }[]>
    >((acc, c) => {
      if (!acc[c.type]) acc[c.type] = []
      acc[c.type].push(c)
      return acc
    }, {})

    sections.push({
      kind: 'groupedLinkList',
      title: 'Противопоказания',
      groups: Object.entries(grouped).map(([type, items]) => ({
        label: CONTRAINDICATION_TYPE_LABELS[type] ?? type,
        items: items.map((c) => ({
          id: `contraindication-${c.id}`,
          label: c.name,
          href: buildVaccinesPageHref({ contraindicationId: c.id }),
        })),
      })),
    })
  }

  if (vaccine.ingredients.length > 0) {
    const grouped = vaccine.ingredients.reduce<
      Record<string, { id: number; name: string; role: string }[]>
    >((acc, i) => {
      if (!acc[i.role]) acc[i.role] = []
      acc[i.role].push(i)
      return acc
    }, {})

    sections.push({
      kind: 'groupedLinkList',
      title: 'Ингредиенты',
      groups: Object.entries(grouped).map(([role, items]) => ({
        label: INGREDIENT_ROLE_LABELS[role] ?? role,
        items: items.map((i) => ({
          id: `ingredient-${i.id}`,
          label: i.name,
          href: buildVaccinesPageHref({ ingredientId: i.id }),
        })),
      })),
    })
  }

  sections.push({
    kind: 'status',
    title: 'Применение при беременности и грудном вскармливании',
    ...pregnancyStatus(vaccine),
  })

  if (vaccine.interaction_info) {
    sections.push({
      kind: 'text',
      title: 'Взаимодействие с препаратами',
      text: vaccine.interaction_info,
    })
  }

  if (vaccine.compatibility_info) {
    sections.push({
      kind: 'text',
      title: 'Одновременное введение с другими вакцинами',
      text: vaccine.compatibility_info,
    })
  }

  if (vaccine.storage_conditions) {
    sections.push({
      kind: 'text',
      title: 'Хранение',
      text: vaccine.storage_conditions,
    })
  }

  return sections
}

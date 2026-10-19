import type { Vaccine } from '@/shared/types/api'
import { ADMINISTRATION_CODE_TO_LABEL } from '@/page-components/vaccines/lib/map-administration-methods'
import { mediaUrl } from '@/shared/api/media-url'
import { mapVaccineInstructionSections } from '../map-vaccine-instruction-sections'
import type {
  VaccinePdfContraindicationGroup,
  VaccinePdfData,
  VaccinePdfIngredientGroup,
} from './vaccine-pdf.types'
import { PDF_LOGO_SRC } from './pdf-assets'

const INGREDIENT_ROLE_LABELS: Record<string, string> = {
  active: 'Действующее вещество',
  auxiliary: 'Вспомогательное вещество',
  antibiotic: 'Антибиотик',
}

const CONTRAINDICATION_TYPE_LABELS: Record<string, string> = {
  absolute: 'Абсолютные',
  relative: 'Временные',
  temporary: 'Временные',
}

/** Sections already shown in the structured part of the PDF — skip duplicates below the divider. */
const STRUCTURED_INSTRUCTION_TITLES = new Set([
  'Допустимый возраст',
  'Способы введения',
  'Взаимодействие с препаратами',
  'Одновременное введение с другими вакцинами',
  'Хранение',
])

/** Present on the vaccine screen, absent from the PDF mockup. */
const PDF_OMITTED_INSTRUCTION_TITLES = new Set(['Полный текст инструкции'])

function groupIngredientsByRole(
  ingredients: Vaccine['ingredients'],
): VaccinePdfIngredientGroup[] {
  const byRole = new Map<string, string[]>()

  for (const item of ingredients) {
    const roleKey = item.role || 'other'
    const list = byRole.get(roleKey) ?? []
    list.push(item.name)
    byRole.set(roleKey, list)
  }

  return Array.from(byRole.entries()).map(([role, names]) => ({
    role: INGREDIENT_ROLE_LABELS[role] ?? role,
    names,
  }))
}

function groupContraindications(
  contraindications: Vaccine['contraindications'],
): VaccinePdfContraindicationGroup[] {
  const byType = new Map<string, string[]>()

  for (const item of contraindications) {
    const key = item.type || 'other'
    const list = byType.get(key) ?? []
    list.push(item.name)
    byType.set(key, list)
  }

  return Array.from(byType.entries()).map(([type, items]) => ({
    label: CONTRAINDICATION_TYPE_LABELS[type] ?? type,
    items,
  }))
}

function splitStorageLines(value: string | null): string[] {
  if (!value) return []
  return value
    .split(/\n+|(?<=\.)\s+(?=[А-ЯA-Z«"])/)
    .map((line) => line.trim())
    .filter(Boolean)
}

function formatRevisionDate(value: string | null): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()
  return `${dd}.${mm}.${yyyy}`
}

function administrationTitle(method: {
  code: string | null
  note: string | null
}): string {
  if (method.note?.trim()) return method.note.trim()
  if (method.code) return ADMINISTRATION_CODE_TO_LABEL[method.code] ?? method.code
  return 'не указан'
}

export function mapVaccineToPdfData(vaccine: Vaccine): VaccinePdfData {
  const pregnancyAllowed = vaccine.pregnancy_usage_status

  const instructionSections = mapVaccineInstructionSections(vaccine).filter(
    (section) =>
      !STRUCTURED_INSTRUCTION_TITLES.has(section.title) &&
      !PDF_OMITTED_INSTRUCTION_TITLES.has(section.title),
  )

  return {
    name: vaccine.name,
    officialName: vaccine.official_name,
    infections: vaccine.infections.map((i) => i.name),
    ageAllowed: vaccine.age_allowed,
    administrationMethods: vaccine.administration_methods
      .filter((m) => m.code || m.note || m.age_group)
      .map((m) => ({
        title: administrationTitle(m),
        ageGroup: m.age_group,
        imageSrc: mediaUrl(m.detail_image_url) ?? `/images/administration/no_illustration.png`,
      })),
    contraindicationGroups: groupContraindications(vaccine.contraindications),
    ingredients: groupIngredientsByRole(vaccine.ingredients),
    interactionInfo: vaccine.interaction_info,
    pregnancyLabel: pregnancyAllowed ? 'Разрешена' : 'Не разрешена',
    pregnancyCaution: !pregnancyAllowed,
    compatibilityInfo: vaccine.compatibility_info,
    storageConditions: vaccine.storage_conditions,
    storageLines: splitStorageLines(vaccine.storage_conditions),
    instructionSections,
    specialistUrl: vaccine.instruction_url,
    nonspecUrl: vaccine.nonspec_url,
    orgComment: vaccine.comment?.text ?? null,
    revisionDate: formatRevisionDate(vaccine.revision_date),
    logoSrc: PDF_LOGO_SRC,
  }
}

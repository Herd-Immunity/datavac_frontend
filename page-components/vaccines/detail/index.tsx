import { fetchAllVaccineIds, fetchVaccineById } from '@/shared/api/vaccines'
import { BackLink } from '@/shared/ui/back-link'
import { mapVaccineToDetailPageData } from '@/page-components/vaccines/detail/map-vaccine-detail'
import { VaccineDetailLayout } from '@/page-components/vaccines/detail/vaccine-detail-layout'
import { VaccineSummarySidebar } from '@/page-components/vaccines/ui/vaccine-summary-sidebar'
import { notFound } from 'next/navigation'
import { VaccineDetailContentConnected } from './ui/vaccine-detail-content-connected'
import { VaccineInstructionLinks } from './ui/vaccine-instruction-links'

export async function generateStaticParams() {
  const ids = await fetchAllVaccineIds()
  return ids.map((id) => ({ id: String(id) }))
}

function formatRevisionDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${day}.${month}.${year}`
}

export default async function VaccineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const vaccine = await fetchVaccineById(Number(id))

  if (!vaccine) notFound()

  const { summary, processedSections, instructionSections, orgComment } =
    mapVaccineToDetailPageData(vaccine)

  return (
    <div>
      <BackLink href="/vaccines" label="Назад к вакцинам" className="mb-4" />

      <div className="flex items-start justify-between gap-6 mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-fg">{vaccine.name}</h1>
          {!vaccine.is_available_in_rf && (
            <p className="text-base font-semibold text-fg">Вакцина недоступна в РФ</p>
          )}
          {vaccine.revision_date && (
            <p className="text-base text-fg-muted">
              Дата последней ревизии: {formatRevisionDate(vaccine.revision_date)}
            </p>
          )}
        </div>
        <VaccineInstructionLinks
          officialLinkUrl={vaccine.nonspec_url}
          instructionSpecialistUrl={vaccine.instruction_url}
        />
      </div>

      <VaccineDetailLayout sidebar={<VaccineSummarySidebar {...summary} />}>
        <VaccineDetailContentConnected
          processedSections={processedSections}
          instructionSections={instructionSections}
          orgComment={orgComment}
        />
      </VaccineDetailLayout>
    </div>
  )
}

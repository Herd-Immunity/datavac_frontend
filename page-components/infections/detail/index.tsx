import { fetchAllInfectionIds, fetchInfectionById } from '@/shared/api/infections'
import { BackLink } from '@/shared/ui/back-link'
import { notFound } from 'next/navigation'

const CATEGORY_LABELS: Record<string, string> = {
  national_calendar: 'Национальный календарь',
  extended: 'Расширенный',
  other: 'Другие',
}

export async function generateStaticParams() {
  const ids = await fetchAllInfectionIds()
  return ids.map((id) => ({ id: String(id) }))
}

export default async function InfectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const infection = await fetchInfectionById(Number(id))

  if (!infection) notFound()

  return (
    <div>
      <BackLink className="mb-4" />

      <h1 className="mb-6 text-2xl font-semibold text-fg">{infection.name}</h1>

      <div className="rounded-2xl bg-card p-6">
        <dl className="flex flex-col gap-3 text-sm">
          <div>
            <dt className="mb-1 text-xs text-fg-secondary">Категория</dt>
            <dd className="text-fg">{CATEGORY_LABELS[infection.category] ?? infection.category}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

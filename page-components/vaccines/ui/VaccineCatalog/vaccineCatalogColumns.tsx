'use client';

import { DataTableColumn } from '@datavac/ui-kit';
import { VaccineCatalogItem } from '../../model/catalogTypes';

export const vaccineCatalogColumns: DataTableColumn<VaccineCatalogItem>[] = [
  {
    key: 'name',
    label: 'Название вакцины',
    sortLabel: 'названию',
    width: 200,
    sortable: true,
    render: (row) => (
      <span className="flex flex-col gap-1">
        <span className="font-semibold leading-tight">{row.name}</span>
        {!row.isAvailable && (
          <span className="text-xs font-semibold text-fg">
            Вакцина не доступна в РФ
          </span>
        )}
      </span>
    ),
  },
  {
    key: 'officialName',
    label: 'Официальное название',
    sortLabel: 'официальному названию',
    flex: 1,
    sortable: true,
    render: (row) => (
      <div className="max-w-full min-w-0">
        <div className="break-words whitespace-normal">
          <span className="leading-snug">{row.officialName ?? '-'}</span>
        </div>
      </div>
    ),
  },
  {
    key: 'infections',
    label: 'Инфекции',
    width: 200,
    render: (row) => (
      <div className="flex flex-col">
        {row.infections.map((inf) => (
          <span className="leading-snug" key={inf.id}>
            {inf.name}
          </span>
        ))}
      </div>
    ),
  },
];

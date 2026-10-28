'use client';

import { type ReactNode } from 'react'
import { BackLink } from '@/shared/ui/back-link'
import { Separator } from '@/shared/ui/separator'
import { resultsLabel } from '@/shared/lib/pluralize'

type ResultsHeaderProps = {
  title: string;
  count?: number;
  backHref?: string;
  filters?: ReactNode;
  className?: string;
};

export function ResultsHeader({
  title,
  count,
  backHref,
  filters,
  className,
}: ResultsHeaderProps) {
  return (
    <div className={className}>
      <BackLink href={backHref} />

      {filters ? (
        <>
          <h1 className="pt-4 pb-4 text-2xl font-normal text-fg">{title}</h1>
          <div className="flex min-h-8 flex-wrap items-center justify-between gap-4">
            {filters}
            {count !== undefined && (
              <p className="shrink-0 text-xs font-normal text-fg-muted whitespace-nowrap">
                {resultsLabel(count)}
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 pb-4">
          <h1 className="text-2xl font-normal text-fg">{title}</h1>
          {count !== undefined && (
            <p className="shrink-0 text-xs font-normal text-fg-muted whitespace-nowrap">
              {resultsLabel(count)}
            </p>
          )}
        </div>
      )}

      <Separator className="mt-4" />
    </div>
  );
}

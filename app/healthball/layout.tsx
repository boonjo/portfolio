import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Healthball — Arsenal Injury Risk',
  description:
    'Predicting Arsenal FC player injury risk using career history, workload, and age.',
}

export default function HealthballLayout({ children }: { children: React.ReactNode }) {
  return children
}

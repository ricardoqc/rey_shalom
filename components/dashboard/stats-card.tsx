import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconColor?: string
  trend?: {
    value: string
    isPositive: boolean
  }
}

export function StatsCard({ title, value, icon: Icon, iconColor }: StatsCardProps) {
  return (
    <div className="group bg-white border border-gray-100 shadow-sm rounded-[2rem] p-8 transition-all hover:shadow-md hover:-translate-y-1 relative overflow-hidden">
      <div className={`absolute top-0 right-0 p-4 opacity-5 transition-opacity group-hover:opacity-10`}>
        <Icon className="h-20 w-20" />
      </div>
      <div className="flex items-center gap-5">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 transition-colors group-hover:bg-white border border-gray-50 shadow-inner ${iconColor}`}>
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.15em] text-text-muted mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-text-dark tracking-tighter">
              {value}
            </h3>
          </div>
        </div>
      </div>
    </div>
  )
}

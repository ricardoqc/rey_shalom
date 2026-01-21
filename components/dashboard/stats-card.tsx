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

export function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-[#ea2a33]',
  trend,
}: StatsCardProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-white/5 border border-white/10 shadow-lg backdrop-blur-sm">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="truncate text-sm font-medium text-white/60">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-white">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </div>
                {trend && (
                  <div
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      trend.isPositive ? 'text-[#4CAF50]' : 'text-[#ea2a33]'
                    }`}
                  >
                    {trend.isPositive ? '↑' : '↓'} {trend.value}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

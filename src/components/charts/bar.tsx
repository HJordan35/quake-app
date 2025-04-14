import { TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/charts/chart'

// Define the interface for the transformed data
export interface MagnitudeDistributionData {
  range: string
  count: number
}

// Define the interface for component props
export interface BarChartProps {
  data: MagnitudeDistributionData[]
  title?: string
  description?: string
  footerText?: string
  trendText?: string
  showTrend?: boolean
}

// Default chart config for magnitude distribution
const chartConfig = {
  count: {
    label: 'Earthquakes',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export function BarChartComponent({
  data,
  title = 'Earthquake Magnitude Distribution',
  description = 'Distribution by magnitude range',
  footerText = 'Showing earthquake magnitude distribution for the selected period',
  trendText = '',
  showTrend = false,
}: BarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="range" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {showTrend && (
          <div className="flex gap-2 font-medium leading-none">
            {trendText} <TrendingUp className="h-4 w-4" />
          </div>
        )}
        <div className="leading-none text-muted-foreground">{footerText}</div>
      </CardFooter>
    </Card>
  )
}

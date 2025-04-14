import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ZAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/charts/chart'

// Define the interface for earthquake depth vs magnitude data
export interface DepthMagnitudeData {
  depth: number
  magnitude: number
  region?: string
}

// Define the interface for scatter chart props
export interface ScatterChartProps {
  data: DepthMagnitudeData[]
  title?: string
  description?: string
  footerText?: string
  xAxisLabel?: string
  yAxisLabel?: string
}

// Configuration for the chart
const chartConfig = {
  scatter: {
    label: 'Earthquakes',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export function ScatterChartComponent({
  data,
  title = 'Depth vs. Magnitude',
  description = 'Relationship between earthquake depth and magnitude',
  footerText = 'Showing depth vs. magnitude for selected period',
  xAxisLabel = 'Depth (km)',
  yAxisLabel = 'Magnitude',
}: ScatterChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ScatterChart
            accessibilityLayer
            margin={{
              top: 20,
              right: 20,
              bottom: 30,
              left: 30,
            }}
          >
            <CartesianGrid />
            <XAxis
              dataKey="depth"
              name={xAxisLabel}
              type="number"
              label={{
                value: xAxisLabel,
                position: 'bottom',
              }}
              tickFormatter={value => `${value}`}
            />
            <YAxis
              dataKey="magnitude"
              name={yAxisLabel}
              type="number"
              label={{
                value: yAxisLabel,
                angle: -90,
                position: 'left',
              }}
              domain={['auto', 'auto']}
            />
            <ZAxis range={[30, 300]} />
            <ChartTooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value, name) => {
                    if (name === xAxisLabel) return [`${value} km`, name]
                    return [value, name]
                  }}
                />
              }
            />
            <Scatter name="Earthquakes" data={data} fill="var(--color-scatter)" shape="circle" />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">{footerText}</div>
      </CardFooter>
    </Card>
  )
}

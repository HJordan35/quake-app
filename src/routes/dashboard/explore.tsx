import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { BarChartComponent, MagnitudeDistributionData } from '@/components/charts/bar'
import { ScatterChartComponent, DepthMagnitudeData } from '@/components/charts/scatter'
import { useEarthquakesByTimeRange } from '@/hooks/data/useEarthquakes'
import { EarthquakeFeature, EarthquakeResponse } from '@/services/earthquake-service'

export const Route = createFileRoute('/dashboard/explore')({
  component: EarthquakeExplorer,
})

function EarthquakeExplorer() {
  const today = new Date()
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(today.getDate() - 30)
  const defaultStartTime = thirtyDaysAgo.toISOString().split('T')[0]
  const defaultEndTime = today.toISOString().split('T')[0]

  const [starttime, setStarttime] = useState(defaultStartTime)
  const [endtime, setEndtime] = useState(defaultEndTime)

  const { data, isLoading, error } = useEarthquakesByTimeRange(starttime, endtime)

  const magnitudeDistribution = transformDataForMagnitudeDistribution(data)
  const depthMagnitudeData = transformDataForDepthMagnitude(data)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl text-left font-bold">Earthquake Data Explorer</h1>
      <p className="text-left text-gray-600">View recent earthquake data from around the world using the FDSNWS API.</p>

      <div className="my-6 flex flex-col sm:flex-row justify-end gap-4">
        <div>
          <label htmlFor="starttime" className="block text-left text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            id="starttime"
            type="date"
            value={starttime}
            onChange={e => setStarttime(e.target.value)}
            className="block w-full rounded-md border  p-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="endtime" className="block text-left text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            id="endtime"
            type="date"
            value={endtime}
            onChange={e => setEndtime(e.target.value)}
            className="block w-full rounded-md border  p-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {error && <div className="p-4 text-red-700 bg-red-100 rounded-md mb-6">Error: {error.message}</div>}

      {data && !isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScatterChartComponent
            data={depthMagnitudeData}
            title="Depth vs. Magnitude Relationship"
            description={`${starttime} to ${endtime}`}
            footerText={`Each point represents one of ${data.features.length} earthquakes`}
          />
          <BarChartComponent
            data={magnitudeDistribution}
            title="Earthquake Magnitude Distribution"
            description={`${starttime} to ${endtime}`}
            footerText={`Based on ${data.features.length} earthquakes`}
          />
        </div>
      )}
    </div>
  )
}

/**
 * Transform earthquake data into magnitude distribution format for the bar chart
 */
function transformDataForMagnitudeDistribution(data: EarthquakeResponse | null): MagnitudeDistributionData[] {
  if (!data || !data.features || data.features.length === 0) {
    return []
  }

  // Define magnitude ranges
  const ranges = [
    { min: 0, max: 1, label: '0-1' },
    { min: 1, max: 2, label: '1-2' },
    { min: 2, max: 3, label: '2-3' },
    { min: 3, max: 4, label: '3-4' },
    { min: 4, max: 5, label: '4-5' },
    { min: 5, max: 6, label: '5-6' },
    { min: 6, max: 7, label: '6-7' },
    { min: 7, max: 8, label: '7-8' },
    { min: 8, max: 10, label: '8+' },
  ]

  // Initialize counts for each range
  const distributionMap = ranges.reduce(
    (acc, range) => {
      acc[range.label] = 0
      return acc
    },
    {} as Record<string, number>
  )

  // Count earthquakes in each magnitude range
  data.features.forEach((feature: EarthquakeFeature) => {
    const magnitude = feature.properties.mag

    for (const range of ranges) {
      if (magnitude >= range.min && magnitude < range.max) {
        distributionMap[range.label]++
        break
      }
      // Special case for 8+ magnitude
      if (range.label === '8+' && magnitude >= 8) {
        distributionMap[range.label]++
        break
      }
    }
  })

  // Convert to array format for the chart
  return ranges.map(range => ({
    range: range.label,
    count: distributionMap[range.label],
  }))
}

/**
 * Transform earthquake data into depth vs magnitude format for the scatter chart
 */
function transformDataForDepthMagnitude(data: EarthquakeResponse | null): DepthMagnitudeData[] {
  if (!data || !data.features || data.features.length === 0) {
    return []
  }

  // Convert features to depth-magnitude data points
  return data.features.map((feature: EarthquakeFeature) => {
    // Ensure depth is positive for better visualization
    const depth = Math.abs(feature.properties.depth)

    return {
      depth,
      magnitude: feature.properties.mag,
      region: feature.properties.flynn_region,
    }
  })
}

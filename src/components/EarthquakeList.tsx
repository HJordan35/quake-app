import { useState } from 'react'
import { useEarthquakesByTimeRange } from '../hooks/data/useEarthquakes'

/**
 * Component that displays a list of earthquakes for a specified time range
 */
export function EarthquakeList() {
  // Default to the last 7 days
  const today = new Date()
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 7)

  // Format dates as ISO strings for the API
  const defaultStartTime = sevenDaysAgo.toISOString().split('T')[0]
  const defaultEndTime = today.toISOString().split('T')[0]

  const [starttime, setStarttime] = useState(defaultStartTime)
  const [endtime, setEndtime] = useState(defaultEndTime)

  // Use our custom hook to fetch the data
  const { data, isLoading, error } = useEarthquakesByTimeRange(starttime, endtime)

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-2xl font-bold">Earthquake Data</h2>

      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <label htmlFor="starttime" className="block text-sm font-medium">
            Start Date
          </label>
          <input
            id="starttime"
            type="date"
            value={starttime}
            onChange={e => setStarttime(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label htmlFor="endtime" className="block text-sm font-medium">
            End Date
          </label>
          <input
            id="endtime"
            type="date"
            value={endtime}
            onChange={e => setEndtime(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>
      </div>

      {isLoading && <p className="text-gray-500">Loading earthquake data...</p>}

      {error && <div className="p-4 text-red-700 bg-red-100 rounded-md">Error: {error.message}</div>}

      {data && !isLoading && (
        <div>
          <p className="text-gray-500">
            Found {data.metadata.count} earthquakes between {starttime} and {endtime}
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left border">Time (UTC)</th>
                  <th className="p-2 text-left border">Location</th>
                  <th className="p-2 text-left border">Magnitude</th>
                  <th className="p-2 text-left border">Depth (km)</th>
                </tr>
              </thead>
              <tbody>
                {data.features.map(feature => (
                  <tr key={feature.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{new Date(feature.properties.time).toLocaleString()}</td>
                    <td className="p-2 border">
                      {feature.properties.flynn_region ||
                        `${feature.properties.lat.toFixed(2)}°, ${feature.properties.lon.toFixed(2)}°`}
                    </td>
                    <td className="p-2 border">
                      {feature.properties.mag.toFixed(1)} {feature.properties.magtype}
                    </td>
                    <td className="p-2 border">{Math.abs(feature.properties.depth).toFixed(1)}</td>
                  </tr>
                ))}
                {data.features.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">
                      No earthquakes found for the selected time period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

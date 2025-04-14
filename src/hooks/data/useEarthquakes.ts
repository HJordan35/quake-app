import { useState, useEffect } from 'react'
import { earthquakeService, EarthquakeResponse, EarthquakeQueryParams } from '../../services/earthquake-service'

/**
 * Hook for fetching earthquake data
 */
export function useEarthquakes(params: EarthquakeQueryParams) {
  const [data, setData] = useState<EarthquakeResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!params.starttime && !params.endtime) {
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await earthquakeService.queryEarthquakes({ ...params, limit: 10 })
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.starttime, params.endtime, params.minmagnitude, params.maxmagnitude])

  return { data, isLoading, error }
}

/**
 * Simple hook for fetching earthquake data by time range
 */
export function useEarthquakesByTimeRange(starttime?: string, endtime?: string) {
  const queryParams: EarthquakeQueryParams = { starttime, endtime }
  return useEarthquakes(queryParams)
}

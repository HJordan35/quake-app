/**
 * Service for querying earthquake data from the FDSNWS API
 */

// Base URL for the FDSNWS earthquake service
const FDSNWS_BASE_URL = 'https://www.seismicportal.eu/fdsnws/event/1'

// Interface for earthquake query parameters
export interface EarthquakeQueryParams {
  // Required time range parameters
  starttime?: string // YYYY-MM-DD[T][HH:MM:SS][.sssss]
  endtime?: string // YYYY-MM-DD[T][HH:MM:SS][.sssss]

  // Optional parameters we might support in the future
  minmagnitude?: number
  maxmagnitude?: number
  minlatitude?: number
  maxlatitude?: number
  minlongitude?: number
  maxlongitude?: number
  limit?: number
}

// Interface for earthquake geometry in GeoJSON format
export interface EarthquakeGeometry {
  type: string
  coordinates: number[] // [longitude, latitude, depth]
}

// Interface for earthquake properties
export interface EarthquakeProperties {
  source_id: string
  source_catalog: string
  lastupdate: string
  time: string
  flynn_region: string
  lat: number
  lon: number
  depth: number
  evtype: string
  auth: string
  mag: number
  magtype: string
  unid: string
}

// Interface for a single earthquake feature
export interface EarthquakeFeature {
  type: string
  geometry: EarthquakeGeometry
  id: string
  properties: EarthquakeProperties
}

// Interface for the earthquake response in GeoJSON format
export interface EarthquakeResponse {
  type: string
  metadata: {
    count: number
  }
  features: EarthquakeFeature[]
}

/**
 * Earthquake service that provides methods to query earthquake data
 */
export const earthquakeService = {
  /**
   * Query earthquakes within a specific time range
   * @param params Query parameters including starttime and endtime
   * @returns Promise with earthquake data
   */
  queryEarthquakes: async (params: EarthquakeQueryParams): Promise<EarthquakeResponse> => {
    const queryParams = new URLSearchParams()

    queryParams.append('format', 'json')

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString())
      }
    })

    try {
      const response = await fetch(`${FDSNWS_BASE_URL}/query?${queryParams.toString()}`)

      if (!response.ok) {
        if (response.status === 204) {
          return {
            type: 'FeatureCollection',
            metadata: { count: 0 },
            features: [],
          }
        }

        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      // Only log errors in non-test environments
      if (import.meta.env.MODE !== 'test') {
        console.error('Error fetching earthquake data:', error)
      }
      throw error
    }
  },

  /**
   * Helper method to query earthquakes with just starttime and endtime
   * @param starttime Start time in YYYY-MM-DD[T][HH:MM:SS][.sssss] format
   * @param endtime End time in YYYY-MM-DD[T][HH:MM:SS][.sssss] format
   * @returns Promise with earthquake data
   */
  getEarthquakesByTimeRange: async (starttime: string, endtime: string): Promise<EarthquakeResponse> => {
    return earthquakeService.queryEarthquakes({ starttime, endtime })
  },
}

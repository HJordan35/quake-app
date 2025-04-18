import { describe, it, expect, vi, beforeEach } from 'vitest'
import { earthquakeService, EarthquakeResponse } from './earthquake-service'

// Global fetch is already mocked in src/test/setup.ts

describe('earthquakeService', () => {
  const mockResponse: EarthquakeResponse = {
    type: 'FeatureCollection',
    metadata: { count: 1 },
    features: [
      {
        type: 'Feature',
        id: 'test-id',
        geometry: {
          type: 'Point',
          coordinates: [10.5, 12.3, 5.0],
        },
        properties: {
          source_id: 'source-1',
          source_catalog: 'test-catalog',
          lastupdate: '2023-01-01T00:00:00Z',
          time: '2023-01-01T00:00:00Z',
          flynn_region: 'Test Region',
          lat: 12.3,
          lon: 10.5,
          depth: 5.0,
          evtype: 'earthquake',
          auth: 'test-auth',
          mag: 5.5,
          magtype: 'ML',
          unid: 'unique-id-1',
        },
      },
    ],
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('queryEarthquakes', () => {
    it('should fetch earthquakes successfully', async () => {
      const mockFetchResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      }
      vi.mocked(fetch).mockResolvedValue(mockFetchResponse as unknown as Response)

      const result = await earthquakeService.queryEarthquakes({
        starttime: '2023-01-01',
        endtime: '2023-01-02',
        minmagnitude: 5.0,
      })

      expect(fetch).toHaveBeenCalledWith(
        'https://www.seismicportal.eu/fdsnws/event/1/query?format=json&starttime=2023-01-01&endtime=2023-01-02&minmagnitude=5'
      )

      expect(result).toEqual(mockResponse)
    })

    it('should handle 204 No Content response', async () => {
      const mockFetchResponse = {
        ok: false,
        status: 204,
      }
      vi.mocked(fetch).mockResolvedValue(mockFetchResponse as unknown as Response)

      const result = await earthquakeService.queryEarthquakes({
        starttime: '2023-01-01',
        endtime: '2023-01-02',
      })

      expect(result).toEqual({
        type: 'FeatureCollection',
        metadata: { count: 0 },
        features: [],
      })
    })

    it('should throw an error for HTTP errors', async () => {
      const mockFetchResponse = {
        ok: false,
        status: 500,
      }
      vi.mocked(fetch).mockResolvedValue(mockFetchResponse as unknown as Response)

      await expect(
        earthquakeService.queryEarthquakes({
          starttime: '2023-01-01',
          endtime: '2023-01-02',
        })
      ).rejects.toThrow('HTTP error! Status: 500')
    })

    it('should throw an error when network fails', async () => {
      const networkError = new Error('Network failure')
      vi.mocked(fetch).mockRejectedValue(networkError)

      await expect(
        earthquakeService.queryEarthquakes({
          starttime: '2023-01-01',
          endtime: '2023-01-02',
        })
      ).rejects.toThrow('Network failure')
    })
  })

  describe('getEarthquakesByTimeRange', () => {
    it('should call queryEarthquakes with correct parameters', async () => {
      const querySpy = vi.spyOn(earthquakeService, 'queryEarthquakes').mockResolvedValue(mockResponse)

      const result = await earthquakeService.getEarthquakesByTimeRange('2023-01-01', '2023-01-02')

      expect(querySpy).toHaveBeenCalledWith({ starttime: '2023-01-01', endtime: '2023-01-02' })

      expect(result).toEqual(mockResponse)
    })
  })
})

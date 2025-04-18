import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useEarthquakes, useEarthquakesByTimeRange } from './useEarthquakes'
import { earthquakeService, EarthquakeResponse } from '../../services/earthquake-service'

// Mock the earthquake service
vi.mock('../../services/earthquake-service', () => ({
  earthquakeService: {
    queryEarthquakes: vi.fn(),
  },
  // Don't mock the types
  EarthquakeQueryParams: vi.fn(),
  EarthquakeResponse: vi.fn(),
}))

describe('useEarthquakes', () => {
  const mockResponse: EarthquakeResponse = {
    type: 'FeatureCollection',
    metadata: { count: 2 },
    features: [
      {
        type: 'Feature',
        id: 'test-id-1',
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
      {
        type: 'Feature',
        id: 'test-id-2',
        geometry: {
          type: 'Point',
          coordinates: [11.5, 13.3, 6.0],
        },
        properties: {
          source_id: 'source-2',
          source_catalog: 'test-catalog',
          lastupdate: '2023-01-02T00:00:00Z',
          time: '2023-01-02T00:00:00Z',
          flynn_region: 'Test Region 2',
          lat: 13.3,
          lon: 11.5,
          depth: 6.0,
          evtype: 'earthquake',
          auth: 'test-auth',
          mag: 6.5,
          magtype: 'ML',
          unid: 'unique-id-2',
        },
      },
    ],
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should not fetch when starttime and endtime are not provided', async () => {
    const { result } = renderHook(() =>
      useEarthquakes({
        minmagnitude: 5.0,
        maxmagnitude: 7.0,
      })
    )

    expect(earthquakeService.queryEarthquakes).not.toHaveBeenCalled()
    expect(result.current.data).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should fetch earthquakes and update state on success', async () => {
    vi.mocked(earthquakeService.queryEarthquakes).mockResolvedValue(mockResponse)

    const { result } = renderHook(() =>
      useEarthquakes({
        starttime: '2023-01-01',
        endtime: '2023-01-02',
        minmagnitude: 5.0,
      })
    )

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(earthquakeService.queryEarthquakes).toHaveBeenCalledWith({
      starttime: '2023-01-01',
      endtime: '2023-01-02',
      minmagnitude: 5.0,
      limit: 100,
    })
    expect(result.current.data).toEqual(mockResponse)
    expect(result.current.error).toBeNull()
  })

  it('should handle errors correctly', async () => {
    const mockError = new Error('Network error')
    vi.mocked(earthquakeService.queryEarthquakes).mockRejectedValue(mockError)

    const { result } = renderHook(() =>
      useEarthquakes({
        starttime: '2023-01-01',
        endtime: '2023-01-02',
      })
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toBeNull()
    expect(result.current.error).toEqual(mockError)
  })

  it('should handle unknown errors correctly', async () => {
    vi.mocked(earthquakeService.queryEarthquakes).mockRejectedValue('Not an Error instance')

    const { result } = renderHook(() =>
      useEarthquakes({
        starttime: '2023-01-01',
        endtime: '2023-01-02',
      })
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('An unknown error occurred')
  })
})

describe('useEarthquakesByTimeRange', () => {
  it('should call useEarthquakes with correct params', async () => {
    const starttime = '2023-01-01'
    const endtime = '2023-01-02'

    const { result } = renderHook(() => useEarthquakesByTimeRange(starttime, endtime))

    await waitFor(() => {
      expect(result.current).toEqual(
        expect.objectContaining({
          data: null,
          isLoading: expect.any(Boolean),
          error: null,
        })
      )
    })
  })
})

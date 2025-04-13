import { useRef, useState, useCallback, useEffect } from 'react'
import Globe, { GlobeMethods } from 'react-globe.gl'
import { SeismicMessage } from '../../hooks/data/useSeismic'

interface NavGlobeProps {
  data?: SeismicMessage[]
  onPointClick?: (point: SeismicMessage) => void
  width?: number
  height?: number
  className?: string
}

interface PointData {
  id: string
  lat: number
  lng: number
  altitude: number
  radius: number
  color: string
  magnitude: number
  region: string
  time: string
  originalData: SeismicMessage
}

const NavGlobe = ({ data = [], onPointClick, width, height, className = '' }: NavGlobeProps) => {
  const globeRef = useRef<GlobeMethods>(null as unknown as GlobeMethods)
  const containerRef = useRef<HTMLDivElement>(null)
  const [pointData, setPointData] = useState<PointData[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Setup ResizeObserver to make the globe responsive
  useEffect(() => {
    if (!containerRef.current) return

    // Initialize with container size if width/height not provided
    if (!width || !height) {
      const { offsetWidth, offsetHeight } = containerRef.current
      setDimensions({
        width: width || offsetWidth,
        height: height || offsetHeight,
      })
    } else {
      setDimensions({ width, height })
    }

    // Create ResizeObserver to update dimensions when container resizes
    const resizeObserver = new ResizeObserver(entries => {
      if (!entries || !entries[0]) return

      const { contentRect } = entries[0]
      // Only update if explicit width/height were not provided
      if (!width || !height) {
        setDimensions({
          width: width || contentRect.width,
          height: height || contentRect.height,
        })
      }
    })

    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [width, height])

  // Transform seismic data for the globe
  useEffect(() => {
    if (data && data.length > 0) {
      const transformedData = data.map(item => ({
        id: item.data.id,
        lat: item.data.properties.lat,
        lng: item.data.properties.lon,
        altitude: 0.01,
        radius: Math.max(0.5, item.data.properties.mag) / 10,
        color: getMagnitudeColor(item.data.properties.mag),
        magnitude: item.data.properties.mag,
        region: item.data.properties.flynn_region,
        time: item.data.properties.time,
        originalData: item,
      }))

      setPointData(transformedData)
    }
  }, [data])

  // Get color based on earthquake magnitude
  const getMagnitudeColor = (magnitude: number): string => {
    if (magnitude < 2) return 'rgba(0, 255, 0, 0.8)' // Green for small
    if (magnitude < 4) return 'rgba(255, 255, 0, 0.8)' // Yellow for medium
    if (magnitude < 6) return 'rgba(255, 165, 0, 0.8)' // Orange for large
    return 'rgba(255, 0, 0, 0.8)' // Red for very large
  }

  // Handle point click
  const handlePointClick = useCallback(
    (point: object) => {
      const typedPoint = point as PointData
      if (onPointClick && typedPoint.originalData) {
        onPointClick(typedPoint.originalData)
      }

      // Animate to the point's location
      if (globeRef.current) {
        globeRef.current.pointOfView(
          {
            lat: typedPoint.lat,
            lng: typedPoint.lng,
            altitude: 1.5,
          },
          1000
        )
      }
    },
    [onPointClick]
  )

  return (
    <div
      ref={containerRef}
      className={`globe-container ${className}`}
      style={{
        width: width || '100%',
        height: height || '100%',
        position: 'relative',
      }}
    >
      {dimensions.width > 0 && dimensions.height > 0 && (
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundColor="rgba(0,0,0,0)"
          pointsData={pointData}
          pointLat="lat"
          pointLng="lng"
          pointAltitude="altitude"
          pointRadius="radius"
          pointColor="color"
          pointLabel={point => {
            const typedPoint = point as PointData
            return `
              <div style="font-family: Arial; background: rgba(0,0,0,0.7); color: white; padding: 5px; border-radius: 5px;">
                <div>Magnitude: ${typedPoint.magnitude.toFixed(1)}</div>
                <div>Region: ${typedPoint.region}</div>
                <div>Time: ${new Date(typedPoint.time).toLocaleString()}</div>
              </div>
            `
          }}
          onPointClick={handlePointClick}
          pointsMerge={false}
          atmosphereColor="rgba(120, 160, 240, 0.3)"
        />
      )}
    </div>
  )
}

export default NavGlobe

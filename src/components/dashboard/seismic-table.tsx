import { formatDistanceToNow } from 'date-fns'

interface SeismicMessage {
  action: string
  data: {
    type: string
    geometry: {
      type: string
      coordinates: [number, number, number]
    }
    id: string
    properties: {
      flynn_region: string
      lat: number
      lon: number
      mag: number
      magtype: string
      time: string
      [key: string]: unknown
    }
    [key: string]: unknown
  }
}

interface SeismicTableProps {
  parsedMessages: SeismicMessage[]
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return {
      full: new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'medium',
      }).format(date),
      relative: formatDistanceToNow(date, { addSuffix: true }),
    }
  } catch {
    return { full: dateString, relative: 'Invalid date' }
  }
}

export function SeismicTable({ parsedMessages }: SeismicTableProps) {
  if (parsedMessages.length === 0) {
    return <p className="text-gray-400">No seismic events received yet.</p>
  }

  return (
    <div className="rounded-md border">
      <div className="max-h-[350px] overflow-auto">
        <div className="min-w-full divide-y">
          <div className="sticky top-0 z-10 bg-background">
            <div className="grid grid-cols-3 gap-4 py-2 px-6">
              <div className="text-left font-medium">Region</div>
              <div className="text-left font-medium">Magnitude</div>
              <div className="text-left font-medium">Time</div>
            </div>
          </div>
          <div className="divide-y">
            {parsedMessages.map((message, index) => {
              const { flynn_region, lat, lon, mag, time } = message.data.properties
              const formattedTime = formatDate(time)

              return (
                <div key={index} className="grid grid-cols-3 gap-4 py-2 px-6">
                  <div className="text-left">
                    <div className="flex text-xs flex-col">
                      {flynn_region}
                      <span className="text-xs text-gray-400">
                        {lat.toFixed(4)}, {lon.toFixed(4)}
                      </span>
                    </div>
                  </div>
                  <div className={`text-left text-xs ${getMagnitudeColor(mag)}`}>{mag.toFixed(1)}</div>
                  <div className="text-left text-xs" title={formattedTime.full}>
                    {formattedTime.relative}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="py-3 text-center text-sm text-gray-400">List of recent seismic events</div>
    </div>
  )
}

// Helper function to get magnitude color class
function getMagnitudeColor(magnitude: number): string {
  if (magnitude >= 5) return 'text-red-500'
  if (magnitude >= 3) return 'text-amber-500'
  return 'text-green-500'
}

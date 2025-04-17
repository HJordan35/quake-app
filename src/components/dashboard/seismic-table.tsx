import { formatDistanceToNow } from 'date-fns'
import { useState, useEffect } from 'react'

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
      lastupdate: string
      [key: string]: unknown
    }
    [key: string]: unknown
  }
}

interface SeismicTableProps {
  parsedMessages: SeismicMessage[]
  onSelectItem?: (index: number, item: SeismicMessage) => void
  initialSelectedIndex?: number | null
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

export function SeismicTable({ parsedMessages, onSelectItem, initialSelectedIndex }: SeismicTableProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(initialSelectedIndex || null)

  useEffect(() => {
    if (initialSelectedIndex !== undefined && initialSelectedIndex !== selectedIndex) {
      setSelectedIndex(initialSelectedIndex)
    }
  }, [initialSelectedIndex, selectedIndex])

  if (parsedMessages.length === 0) {
    return <p>No seismic events received yet.</p>
  }

  const handleSelectItem = (index: number) => {
    setSelectedIndex(index)
    if (onSelectItem) {
      onSelectItem(index, parsedMessages[index])
    }
  }

  return (
    <div className="rounded-md border h-full min-h-[300px] relative">
      <div className="absolute top-0 left-0 right-0 bg-background py-2 px-4 border-b z-10">
        <div className="grid grid-cols-[2fr_1fr_1.5fr] gap-4">
          <div className="text-left font-medium">Region</div>
          <div className="text-center font-medium">Magnitude</div>
          <div className="text-left font-medium">Time</div>
        </div>
      </div>

      <div className="absolute top-[41px] bottom-[45px] left-0 right-0 overflow-y-auto">
        {parsedMessages.map((message, index) => {
          const { flynn_region, lat, lon, mag, lastupdate } = message.data.properties
          const formattedTime = formatDate(lastupdate)
          const isSelected = index === selectedIndex

          return (
            <div
              key={index}
              className={`grid grid-cols-[2fr_1fr_1.5fr] gap-4 py-2 px-4 border-b hover:bg-white/5 cursor-pointer transition-colors duration-150 ${
                isSelected ? 'bg-white/10' : ''
              }`}
              onClick={() => handleSelectItem(index)}
            >
              <div className="text-left">
                <div className="flex flex-col text-xs">
                  {flynn_region}
                  <span className="text-gray-400 text-xs">
                    {lat.toFixed(4)}, {lon.toFixed(4)}
                  </span>
                </div>
              </div>
              <div
                className={`text-center text-xs ${
                  mag >= 5 ? 'text-red-500' : mag >= 3 ? 'text-amber-500' : 'text-green-500'
                }`}
              >
                {mag.toFixed(1)}
              </div>
              <div className="text-left text-xs" title={formattedTime.full}>
                {formattedTime.relative}
              </div>
            </div>
          )
        })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 py-3 text-center text-sm text-gray-400 border-t border-white/10 bg-background">
        List of recent seismic events
      </div>
    </div>
  )
}

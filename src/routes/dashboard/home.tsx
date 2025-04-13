import { createFileRoute } from '@tanstack/react-router'
import { useSeismic } from '@/hooks/data/useSeismic'
import { SeismicTable } from '@/components/dashboard/seismic-table'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/dashboard/home')({
  component: RouteComponent,
})

function RouteComponent() {
  const { parsedMessages, connectionStatus, averagePerHour, maxMagnitude, averageMagnitude } = useSeismic()

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-left">Recent Seismic Events</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${connectionStatus === 'Open' ? 'bg-green-500' : 'bg-red-500'}`}
            ></div>
            <p className="text-sm text-gray-400">Connection: {connectionStatus}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <Card className="w-1/2">
              <CardHeader>
                <CardDescription className="text-left text-xs">Seismic Events</CardDescription>
                <CardTitle className="text-left text-2xl">{parsedMessages.length}</CardTitle>
                <CardDescription className="text-left text-xs">
                  {parsedMessages.length === 0
                    ? 'No events yet'
                    : `Approximately ${averagePerHour.toFixed(2)} per hour`}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="w-1/2">
              <CardHeader>
                <CardDescription className="text-left text-xs">Max Magnitude</CardDescription>
                <CardTitle className="text-left text-2xl">{maxMagnitude ?? 'N/A'}</CardTitle>
                <CardDescription className="text-left text-xs">
                  {parsedMessages.length === 0 ? 'No events yet' : `Average Magnitude: ${averageMagnitude.toFixed(2)}`}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {parsedMessages.length > 0 ? (
            <SeismicTable parsedMessages={parsedMessages} />
          ) : (
            <p className="text-gray-400">
              No seismic events received yet.{' '}
              {connectionStatus === 'Open' ? 'Waiting for data...' : 'Check connection status.'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

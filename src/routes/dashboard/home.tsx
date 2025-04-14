import { createFileRoute } from '@tanstack/react-router'
import { useSeismic } from '@/hooks/data/useSeismic'
import { SeismicTable } from '@/components/dashboard/seismic-table'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import NavGlobe from '@/components/globe/nav-globe'

export const Route = createFileRoute('/dashboard/home')({
  component: RouteComponent,
})

function RouteComponent() {
  const { parsedMessages, connectionStatus, averagePerHour, maxMagnitude, averageMagnitude } = useSeismic()

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 mb-4">
        <h1 className="text-3xl font-bold text-left">Recent Seismic Events</h1>
        <div className="flex items-center mt-2">
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${connectionStatus === 'Open' ? 'bg-green-500' : 'bg-red-500'}`}
            ></div>
            <p className="text-sm text-gray-400">Connection: {connectionStatus} (Mock Data)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="flex flex-col h-full">
          <div className="flex flex-row gap-4 shrink-0 mb-4">
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

          <div className="flex-1 min-h-0">
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
        <div className="h-full">
          <NavGlobe data={parsedMessages} onPointClick={() => {}} />
        </div>
      </div>
    </div>
  )
}

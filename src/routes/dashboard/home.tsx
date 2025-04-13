import { createFileRoute } from '@tanstack/react-router'
import { useSeismic } from '@/hooks/data/useSeismic'
export const Route = createFileRoute('/dashboard/home')({
  component: RouteComponent,
})

function RouteComponent() {
  const { parsedMessages, connectionStatus } = useSeismic()

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Seismic Data</h1>
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${connectionStatus === 'Open' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <p className="text-sm">Connection Status: {connectionStatus}</p>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Recent Seismic Events</h2>
        {parsedMessages.length > 0 ? (
          <div className="overflow-auto max-h-[500px] border border-gray-700 rounded-md">
            {parsedMessages.map((message, index) => (
              <div key={index} className="p-3 border-b border-gray-700 hover:bg-gray-800">
                <pre className="text-sm whitespace-pre-wrap overflow-x-auto">{JSON.stringify(message, null, 2)}</pre>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">
            No seismic events received yet.{' '}
            {connectionStatus === 'Open' ? 'Waiting for data...' : 'Check connection status.'}
          </p>
        )}
      </div>
    </div>
  )
}

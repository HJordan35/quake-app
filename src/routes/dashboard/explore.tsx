import { createFileRoute } from '@tanstack/react-router'
import { EarthquakeList } from '../../components/EarthquakeList'

export const Route = createFileRoute('/dashboard/explore')({
  component: EarthquakeComponent,
})

function EarthquakeComponent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Earthquake Data Explorer</h1>
      <p className="mb-6 text-gray-600">View recent earthquake data from around the world using the FDSNWS API.</p>

      <EarthquakeList />
    </div>
  )
}

import { SeismicMessage } from '../hooks/data/useSeismic'

// Generate a random time within the last 24 hours
const getRandomRecentTime = (): string => {
  const now = new Date()
  const hoursAgo = Math.floor(Math.random() * 24)
  const minutesAgo = Math.floor(Math.random() * 60)
  const secondsAgo = Math.floor(Math.random() * 60)
  now.setHours(now.getHours() - hoursAgo)
  now.setMinutes(now.getMinutes() - minutesAgo)
  now.setSeconds(now.getSeconds() - secondsAgo)
  return now.toISOString()
}

// Create mock data with seismic events around the world
export const mockSeismicData: SeismicMessage[] = [
  // Pacific Ring of Fire
  {
    action: 'create',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [142.7, 38.3, 35], // Japan
      },
      id: 'mock-1',
      properties: {
        flynn_region: 'Japan',
        lat: 38.3,
        lon: 142.7,
        mag: 6.7,
        magtype: 'mww',
        time: getRandomRecentTime(),
      },
    },
  },
  {
    action: 'create',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-74.5, -13.6, 58], // Peru
      },
      id: 'mock-2',
      properties: {
        flynn_region: 'Peru',
        lat: -13.6,
        lon: -74.5,
        mag: 5.2,
        magtype: 'mb',
        time: getRandomRecentTime(),
      },
    },
  },
  {
    action: 'create',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [125.1, -8.4, 25], // Indonesia
      },
      id: 'mock-3',
      properties: {
        flynn_region: 'Timor Region, Indonesia',
        lat: -8.4,
        lon: 125.1,
        mag: 4.6,
        magtype: 'mb',
        time: getRandomRecentTime(),
      },
    },
  },
  {
    action: 'create',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-155.5, 19.4, 6], // Hawaii
      },
      id: 'mock-4',
      properties: {
        flynn_region: 'Island of Hawaii',
        lat: 19.4,
        lon: -155.5,
        mag: 3.1,
        magtype: 'ml',
        time: getRandomRecentTime(),
      },
    },
  },
  {
    action: 'create',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-118.3, 34.1, 10], // California
      },
      id: 'mock-5',
      properties: {
        flynn_region: 'Southern California',
        lat: 34.1,
        lon: -118.3,
        mag: 2.7,
        magtype: 'ml',
        time: getRandomRecentTime(),
      },
    },
  },

  // Mediterranean Belt
  {
    action: 'create',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [15.5, 38.2, 40], // Italy
      },
      id: 'mock-6',
      properties: {
        flynn_region: 'Sicily, Italy',
        lat: 38.2,
        lon: 15.5,
        mag: 4.2,
        magtype: 'md',
        time: getRandomRecentTime(),
      },
    },
  },
  {
    action: 'create',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [28.7, 40.5, 15], // Turkey
      },
      id: 'mock-7',
      properties: {
        flynn_region: 'Western Turkey',
        lat: 40.5,
        lon: 28.7,
        mag: 5.8,
        magtype: 'mww',
        time: getRandomRecentTime(),
      },
    },
  },

  // Himalayan Belt
  {
    action: 'create',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [86.1, 27.8, 20], // Nepal
      },
      id: 'mock-8',
      properties: {
        flynn_region: 'Nepal',
        lat: 27.8,
        lon: 86.1,
        mag: 5.1,
        magtype: 'mb',
        time: getRandomRecentTime(),
      },
    },
  },

  // Mid-Atlantic Ridge
  {
    action: 'create',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-28.6, 38.5, 10], // Azores
      },
      id: 'mock-9',
      properties: {
        flynn_region: 'Azores Islands Region',
        lat: 38.5,
        lon: -28.6,
        mag: 3.8,
        magtype: 'mb',
        time: getRandomRecentTime(),
      },
    },
  },
  {
    action: 'create',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-17.5, 65.0, 8], // Iceland
      },
      id: 'mock-10',
      properties: {
        flynn_region: 'Iceland',
        lat: 65.0,
        lon: -17.5,
        mag: 3.5,
        magtype: 'ml',
        time: getRandomRecentTime(),
      },
    },
  },

  // New Zealand
  {
    action: 'create',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [176.0, -38.1, 15], // New Zealand
      },
      id: 'mock-11',
      properties: {
        flynn_region: 'North Island, New Zealand',
        lat: -38.1,
        lon: 176.0,
        mag: 4.3,
        magtype: 'ml',
        time: getRandomRecentTime(),
      },
    },
  },

  // Australia (intraplate - rarer)
  {
    action: 'create',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [138.7, -34.9, 5], // South Australia
      },
      id: 'mock-12',
      properties: {
        flynn_region: 'Near Adelaide, Australia',
        lat: -34.9,
        lon: 138.7,
        mag: 2.8,
        magtype: 'ml',
        time: getRandomRecentTime(),
      },
    },
  },

  // Chile
  {
    action: 'create',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-70.7, -33.0, 85], // Chile
      },
      id: 'mock-13',
      properties: {
        flynn_region: 'Central Chile',
        lat: -33.0,
        lon: -70.7,
        mag: 5.9,
        magtype: 'mww',
        time: getRandomRecentTime(),
      },
    },
  },

  // Mexico
  {
    action: 'create',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-98.5, 16.3, 40], // Mexico
      },
      id: 'mock-14',
      properties: {
        flynn_region: 'Oaxaca, Mexico',
        lat: 16.3,
        lon: -98.5,
        mag: 4.7,
        magtype: 'mb',
        time: getRandomRecentTime(),
      },
    },
  },

  // Alaska
  {
    action: 'create',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-150.0, 61.5, 70], // Alaska
      },
      id: 'mock-15',
      properties: {
        flynn_region: 'Southern Alaska',
        lat: 61.5,
        lon: -150.0,
        mag: 3.9,
        magtype: 'ml',
        time: getRandomRecentTime(),
      },
    },
  },

  // Philippines
  {
    action: 'create',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [123.9, 10.7, 35], // Philippines
      },
      id: 'mock-16',
      properties: {
        flynn_region: 'Leyte, Philippines',
        lat: 10.7,
        lon: 123.9,
        mag: 4.8,
        magtype: 'mb',
        time: getRandomRecentTime(),
      },
    },
  },

  // Caribbean
  {
    action: 'create',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-61.5, 14.5, 25], // Caribbean
      },
      id: 'mock-17',
      properties: {
        flynn_region: 'Martinique Region, Windward Islands',
        lat: 14.5,
        lon: -61.5,
        mag: 3.2,
        magtype: 'md',
        time: getRandomRecentTime(),
      },
    },
  },

  // Iran
  {
    action: 'create',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [51.4, 35.7, 12], // Iran
      },
      id: 'mock-18',
      properties: {
        flynn_region: 'Northern Iran',
        lat: 35.7,
        lon: 51.4,
        mag: 4.1,
        magtype: 'mb',
        time: getRandomRecentTime(),
      },
    },
  },

  // China
  {
    action: 'create',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [103.4, 30.6, 18], // China
      },
      id: 'mock-19',
      properties: {
        flynn_region: 'Sichuan, China',
        lat: 30.6,
        lon: 103.4,
        mag: 5.3,
        magtype: 'mww',
        time: getRandomRecentTime(),
      },
    },
  },

  // Russia (Kamchatka)
  {
    action: 'create',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [158.5, 53.1, 60], // Kamchatka
      },
      id: 'mock-20',
      properties: {
        flynn_region: 'Kamchatka Peninsula, Russia',
        lat: 53.1,
        lon: 158.5,
        mag: 6.2,
        magtype: 'mww',
        time: getRandomRecentTime(),
      },
    },
  },
]

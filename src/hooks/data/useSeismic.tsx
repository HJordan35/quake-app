import { useState, useEffect, useRef } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { mockSeismicData } from '../../mocks/mockSeismicData'

export interface SeismicMessage {
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

interface UseSeismicOptions {
  useMockData?: boolean
  mockDataDelay?: number
}

const useSeismic = (options: UseSeismicOptions = {}) => {
  const { useMockData = true, mockDataDelay = 1000 } = options
  const [socketUrl] = useState('wss://www.seismicportal.eu/standing_order/websocket')
  const [messageHistory, setMessageHistory] = useState<MessageEvent[]>([])
  const [parsedMessages, setParsedMessages] = useState<SeismicMessage[]>([])
  const mountTime = useRef(new Date().getTime())
  const [averagePerHour, setAveragePerHour] = useState(0)
  const [averageMagnitude, setAverageMagnitude] = useState(0)
  const [maxMagnitude, setMaxMagnitude] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState<string>('Uninstantiated')
  const mocking = useRef(false)

  useEffect(() => {
    if (useMockData && !mocking.current) {
      mocking.current = true
      setConnectionStatus('Open (Mock Data)')

      setParsedMessages([])

      const addMockData = async () => {
        for (let i = 0; i < mockSeismicData.length; i++) {
          await new Promise(resolve => setTimeout(resolve, mockDataDelay))
          setParsedMessages(prev => [...prev, mockSeismicData[i]])
        }
      }

      addMockData()
    }
  }, [useMockData, mockDataDelay])

  useEffect(() => {
    const updateAverage = () => {
      const currentTime = new Date().getTime()
      const elapsedTimeMs = currentTime - mountTime.current
      const elapsedHours = elapsedTimeMs / (1000 * 60 * 60)
      const timeForCalculation = Math.max(elapsedHours, 1 / 60)
      const eventsPerHour = parsedMessages.length / timeForCalculation
      setAveragePerHour(eventsPerHour)
    }

    updateAverage()
  }, [parsedMessages])

  useEffect(() => {
    if (parsedMessages.length > 0) {
      const updateAverageMagnitude = () => {
        const totalMagnitude = parsedMessages.reduce((sum, message) => sum + message.data.properties.mag, 0)
        const averageMagnitude = totalMagnitude / parsedMessages.length
        setAverageMagnitude(averageMagnitude)
      }

      const updateMaxMagnitude = () => {
        const maxMagnitude = Math.max(...parsedMessages.map(message => message.data.properties.mag))
        setMaxMagnitude(maxMagnitude)
      }

      updateAverageMagnitude()
      updateMaxMagnitude()
    }
  }, [parsedMessages])

  // Skip WebSocket setup if using mock data
  const { lastMessage, readyState } = useWebSocket(useMockData ? null : socketUrl, {
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    shouldReconnect: () => true,
    onOpen: () => {
      console.log('WebSocket connection established')
      setConnectionStatus('Open')
    },
    onClose: () => {
      console.log('WebSocket connection closed')
      setConnectionStatus('Closed')
    },
    onError: (event: Event) => {
      console.error('WebSocket error:', event)
      setConnectionStatus('Error')
    },
    onMessage: (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)
        console.log('Message received:', data)
        return data
      } catch (error) {
        console.error('Failed to parse message:', error)
        return null
      }
    },
  })

  // Only process WebSocket messages if not using mock data
  useEffect(() => {
    if (!useMockData && lastMessage !== null) {
      setMessageHistory(prev => prev.concat(lastMessage))

      try {
        const data = JSON.parse(lastMessage.data)
        setParsedMessages(prev => [...prev, data])
      } catch (error) {
        console.error('Failed to parse message:', error)
      }
    }
  }, [lastMessage, useMockData])

  // Set connection status based on readyState when not using mock data
  useEffect(() => {
    if (!useMockData) {
      const statusMap = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
      }
      setConnectionStatus(statusMap[readyState])
    }
  }, [readyState, useMockData])

  return {
    messageHistory,
    parsedMessages,
    connectionStatus,
    averagePerHour,
    averageMagnitude,
    maxMagnitude,
  }
}

export { useSeismic }

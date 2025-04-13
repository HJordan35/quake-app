import { useState, useEffect, useCallback, useRef } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'

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

const useSeismic = () => {
  const [socketUrl] = useState('wss://www.seismicportal.eu/standing_order/websocket')
  const [messageHistory, setMessageHistory] = useState<MessageEvent[]>([])
  const [parsedMessages, setParsedMessages] = useState<SeismicMessage[]>([])
  const mountTime = useRef(new Date().getTime())
  const [averagePerHour, setAveragePerHour] = useState(0)
  const [averageMagnitude, setAverageMagnitude] = useState(0)
  const [maxMagnitude, setMaxMagnitude] = useState(0)

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
  }, [parsedMessages])

  const onOpen = useCallback(() => {
    console.log('WebSocket connection established')
  }, [])

  const onClose = useCallback(() => {
    console.log('WebSocket connection closed')
  }, [])

  const onMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data)
      console.log('Message received:', data)
      return data
    } catch (error) {
      console.error('Failed to parse message:', error)
      return null
    }
  }, [])

  const onError = useCallback((event: Event) => {
    console.error('WebSocket error:', event)
  }, [])

  const { lastMessage, readyState } = useWebSocket(socketUrl, {
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    shouldReconnect: () => true,
    onOpen,
    onClose,
    onError,
    onMessage,
  })

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory(prev => prev.concat(lastMessage))

      try {
        const data = JSON.parse(lastMessage.data)
        setParsedMessages(prev => [...prev, data])
      } catch (error) {
        console.error('Failed to parse message:', error)
      }
    }
  }, [lastMessage])

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState]

  return {
    messageHistory,
    parsedMessages,
    connectionStatus,
    averagePerHour,
  }
}

export { useSeismic }

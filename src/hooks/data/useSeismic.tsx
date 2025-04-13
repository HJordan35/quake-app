import { useState, useEffect, useCallback } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'

interface SeismicMessage {
  data: Record<string, unknown>
  [key: string]: unknown
}

const useSeismic = () => {
  const [socketUrl] = useState('wss://www.seismicportal.eu/standing_order/websocket')
  const [messageHistory, setMessageHistory] = useState<MessageEvent[]>([])
  const [parsedMessages, setParsedMessages] = useState<SeismicMessage[]>([])

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
  }
}

export { useSeismic }

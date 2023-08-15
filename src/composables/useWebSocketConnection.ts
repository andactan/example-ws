import WebSocketAsPromised from 'websocket-as-promised'
import { ref } from 'vue'

export function useWebSocketConnection() {
  const buffer = ref<string>('')
  const isOpen = ref<boolean>(false)
  const error = ref<string>('')
  const ws = ref<WebSocketAsPromised | null>(null)

  const connect = async (url: string) => {
    ws.value = new WebSocketAsPromised(url, {
      packMessage: (data) => JSON.stringify(data),
      unpackMessage: (data) => JSON.parse(data),
      attachRequestId: (data, requestId) => Object.assign({ id: requestId }, data), // attach requestId to message as `id` field
      extractRequestId: (data) => data && data.id
    })

    const onOpen = async () => {
      ws.value
        ?.open()
        .then(() => (isOpen.value = true))
        .catch((err) => (error.value = err))
    }
    onOpen()
    ws.value?.onMessage.addListener((data) => (buffer.value = data))
  }

  const send = async (payload: string) => {
    const isJSON = (str: string) => {
      try {
        JSON.parse(str)
      } catch (e) {
        return false
      }
      return true
    }
    const _payload = isJSON(payload) ? JSON.parse(payload) : { message: payload }
    ws.value?.sendPacked(_payload)

    return _payload
  }

  return { connect, send, buffer }
}

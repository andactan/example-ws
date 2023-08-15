<script setup lang="ts">
import { useWebSocketConnection } from './composables/useWebSocketConnection'
import { ref, watch, toRef, type Ref } from 'vue'

const sent = ref<HTMLDivElement | null>(null)
const received = ref<HTMLDivElement | null>(null)
const url = ref<string>('')
const message = ref<string>('')
const { connect, send, buffer } = useWebSocketConnection()

watch(buffer, () => {
  console.log(typeof buffer.value)
  const newElement = document.createElement('div')
  const newTextNode = document.createTextNode(buffer.value)
  newElement.appendChild(newTextNode)
  received.value?.appendChild(newElement)
  received.value?.lastElementChild?.scrollIntoView()
})

const handleConnectClick = async (event: Event) => {
  event.preventDefault()
  await connect(url.value)
}

const handleSendMessageClick = async (event: Event) => {
  event.preventDefault()

  const request = await send(message.value)

  const newElement = document.createElement('div')
  const newTextNode = document.createTextNode(JSON.stringify(request))
  newElement.appendChild(newTextNode)
  sent.value?.appendChild(newElement)
}

const handleClearMessagesClick = (event: Event, container: Ref<HTMLDivElement | null>) => {
  event?.preventDefault()
  container.value?.replaceChildren()
}
</script>

<template>
  <div class="">
    <div id="group">
      <div class="grid grid-cols-12 gap-1">
        <div class="col-span-1 border-2 border-solid">URL</div>
        <div class="col-span-8"><input class="border-2 border-solid w-full" v-model="url" /></div>
        <div class="col-span-2">
          <button @click="handleConnectClick" class="bg-orange-300 border-2 border-solid w-full">
            Connect
          </button>
        </div>
      </div>
      <div class="grid grid-cols-12 gap-1">
        <div class="col-span-1 border-2 border-solid">Message</div>
        <div class="col-span-8">
          <input class="border-2 border-solid w-full" v-model="message" />
        </div>
        <div class="col-span-2">
          <button
            class="bg-orange-300 border-2 border-solid w-full"
            @click="handleSendMessageClick"
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
    <!-- Log containers -->
    <div id="container" class="grid grid-cols-2">
      <div>
        <div>
          Sent
          <button
            class="bg-orange-300 border-solid border-2"
            @click="(event) => handleClearMessagesClick(event, toRef(sent))"
          >
            Clear Messages
          </button>
        </div>
        <div class="message-box border-2 border-solid overflow-y-auto" ref="sent"></div>
      </div>
      <div>
        <div>
          Received
          <button
            class="bg-orange-300 border-solid border-2"
            @click="(event) => handleClearMessagesClick(event, toRef(received))"
          >
            Clear Messages
          </button>
        </div>
        <div class="message-box border-2 border-solid overflow-y-auto" ref="received"></div>
      </div>
    </div>
  </div>
</template>
<style scoped>
#group {
  min-height: 10vh;
}

.message-box {
  min-height: 80vh;
  max-height: 80vh;
}
</style>

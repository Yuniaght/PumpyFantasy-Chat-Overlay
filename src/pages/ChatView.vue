<script setup>
import { ref, onUnmounted } from 'vue';
import DialogBubble from '@/component/DialogBubble.vue';
import { StreamerbotClient } from '@streamerbot/client';

const messageList = ref([])

const client = new StreamerbotClient({
  host: '127.0.0.1',
  port: 8080,
  endpoint: '/',
  password: '',
}
)

client.on('Twitch.ChatMessage', ({event, data}) => {
  console.log(event)
  console.log(data)
  let newMessage = {
    messageID: data.messageId,
    color: data.user.color,
    name: data.user.name,
    type: event.source,
    message: data.parts,
    createdAt: data.meta.createdAt
  }
  messageList.value.push(newMessage)
})

client.on('YouTube.Message', ({event, data}) => {
  console.log(event)
  console.log(data)
  let newMessage = {
    messageID: data.eventId,
    name: data.user.name,
    type: event.source,
    message: data.parts,
    cratedAt: data.createdAt
  }
  messageList.value.push(newMessage)
})

onUnmounted(() => {
  client.disconnect();
});
</script>

<template>
<div>
  <template v-for="n in 10" :key="n">
    <DialogBubble :platform="n % 2 == 1 ? 'twitch' : 'youtube'" />
  </template>
  <div v-for="message in messageList">
    <pre>{{ message }}</pre>
  </div>
</div>
</template>

<style scoped> 

</style>
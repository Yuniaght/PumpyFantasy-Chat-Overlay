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
  console.log(data)
  let newMessage = {
    messageID: data.eventId,
    color: '',
    name: data.user.name,
    type: event.source,
    message: data.parts,
    createdAt: data.createdAt
  }
  messageList.value.push(newMessage)
})

onUnmounted(() => {
  client.disconnect();
});
</script>

<template>
  <section class="chat-container">
    <TransitionGroup name="fade" tag="div" class="chat-list">
      <DialogBubble v-for="message, messageID in messageList" :key="messageID" :message="message" />
    </TransitionGroup>
  </section>
</template>

<style scoped> 
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(100px);
}

.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
}
</style>
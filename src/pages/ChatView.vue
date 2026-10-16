<script setup>
import { ref, onUnmounted } from 'vue';
import DialogBubble from '@/component/DialogBubble.vue';
import { StreamerbotClient } from '@streamerbot/client';

const messageList = ref([])
const clientReady = ref(false)

const getParamsFromUrl = () => {
  const fullHash = window.location.hash
  const queryString = fullHash.includes('?') ? fullHash.split('?')[1] : ''
  const searchParams = new URLSearchParams(queryString)

  const params = {
    fontSizePseudo: searchParams.get('font-size-pseudo'),
    fontSizeText: searchParams.get('font-size-text'),
    borderColor: searchParams.get('border-color'),
    pseudoBgColor: searchParams.get('pseudo-bg-color'),
    bubbleBgColor: searchParams.get('bubble-bg-color'),
    useTwitchColor: searchParams.has('use-twitch-color') 
      ? searchParams.get('use-twitch-color') === 'true' 
      : true,
    softenTwitchColor: searchParams.has('soften-twitch-color') 
      ? searchParams.get('soften-twitch-color') === 'true' 
      : true, 
    chatDirection: searchParams.get('chat-direction') || 'bottom-up',
    ignoredUsers: searchParams.has('ignored-users') 
      ? searchParams.get('ignored-users').split(',').map(u => u.trim().toLowerCase()).filter(Boolean) 
      : []
  }

  return params
}

const urlParams = getParamsFromUrl()

const client = new StreamerbotClient({
  host: '127.0.0.1',
  port: 8080,
  endpoint: '/',
  password: '',
  onConnect: () => {
    clientReady.value = true
  },
  onDisconnect: () => {
    clientReady.value = false
  }
}
)

const isIgnoredUser = (name) => {
  if (!name) return false
  return urlParams.ignoredUsers.includes(name.trim().toLowerCase())
}

client.on('Twitch.ChatMessage', ({event, data}) => {
  if (isIgnoredUser(data.user?.name)) return
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
  if (isIgnoredUser(data.user?.name)) return
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
  <section :class="['chat-container', urlParams.chatDirection]">
    <div v-if="!clientReady" class="connexion"><span class="dots">Connexion en cours</span></div>
    <TransitionGroup name="fade" tag="div" class="chat-list">
      <DialogBubble v-for="message, messageID in messageList" :key="messageID" :message="message" :params="urlParams"/>
    </TransitionGroup>
  </section>
</template>

<style scoped> 
.chat-container.bottom-up .fade-enter-from,
.chat-container.bottom-up .fade-leave-to {
  opacity: 0;
  transform: translateY(100px);
}

.chat-container.top-down .fade-enter-from,
.chat-container.top-down .fade-leave-to {
  opacity: 0;
  transform: translateY(-100px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease-out;
}

.fade-move {
  transition: transform 0.4s ease-out;
}

.fade-leave-active {
  position: absolute;
}

.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  padding: 16px;
}

.chat-container.bottom-up {
  justify-content: flex-end;
}
.chat-container.bottom-up .chat-list {
  display: flex;
  flex-direction: column;
}

.chat-container.top-down {
  justify-content: flex-start;
}
.chat-container.top-down .chat-list {
  display: flex;
  flex-direction: column-reverse; 
}

.connexion {
  font-family: 'sour-gummy', sans-serif;
  font-size: 1.5rem;
  padding: 24px;
  border: 4px solid #ffc5de;
  border-radius: 24px;
  text-align: center;
  margin: 2rem;
}

.dots::after {
  content: '';
  animation: loading-dots 1.5s infinite;
}

@keyframes loading-dots {
  0% { content: ''; }
  25% { content: '.'; }
  50% { content: '..'; }
  75% { content: '...'; }
  100% { content: ''; }
}
</style>
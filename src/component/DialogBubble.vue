<script setup>
defineProps(['message'])

</script>

<template>
  <div>
    <h2>
      {{ message.name }}
    </h2>
    <p>
      <template v-for="element in message.message">
        <template v-if="message.type === 'Twitch'">
          <span v-if="element.type == 'text'"> {{ element.text }}</span>
          <img 
              v-else-if="element.type == 'emote'" 
              :src="element.imageUrl" 
              :alt="element.text" 
              class="chat-emote"
            />
        </template>
        <template v-if="message.type === 'YouTube'">
          <span v-if="'text' in element && !('emoji' in element)"> {{ element.text }}</span>
          <img 
              v-else-if="'emoji' in element" 
              :src="element.image" 
              :alt="element.emoji" 
              class="chat-emote"
            />
        </template>
      </template>
    </p>
  </div>
</template>

<style scoped> 
div {
  position: relative;
  margin-top: 36px;
}

h2, p {
  border: 4px solid;
  border-color: v-bind("message.color !== '' ? `color-mix(in srgb, ${message.color} 55%, #ffffff)` :  '#ffc5d3'"); 
  font-family: "Sour-gummy", sans-serif;
  font-weight: 700;
}

h2 {
  padding: 8px;
  max-width: 300px;
  border-radius: 100px;
  font-size: 1.75rem;
  background-color: v-bind("message.color !== '' ? `color-mix(in srgb, ${message.color} 55%, #ffffff)` :  '#ffc5d3'"); ;
  width: fit-content;
  position: absolute;
  top: -50px;
  right: v-bind("message.type === 'YouTube' ? '0' : 'auto'");
  overflow:hidden; 
  white-space: nowrap; 
  text-overflow: ellipsis;
}

p {
 padding: 24px;
 padding-top: 48px;
 border-radius: 24px;
 font-size: 1.25rem;
 margin-left: v-bind("message.type === 'YouTube' ? '0px' : '24px'");
 margin-right: v-bind("message.type === 'YouTube' ? '24px' : '0px'");
 background-color: #fafafa;
}

.chat-emote {
  height: 1.25rem;
  vertical-align: middle;
  display: inline-block;
}
</style>
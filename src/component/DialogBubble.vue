<script setup>
import { computed } from 'vue'
const props = defineProps(['message', 'params'])

const DEFAULTS = {
  fontSizePseudo: 1.75,
  fontSizeText: 1.25,
  borderColor: '#ffc5d3',
  pseudoBgColor: '#ffc5d3',
  bubbleBgColor: '#fafafa',
  useTwitchColor: true,
  softenTwitchColor: true
}

const effectiveFontSizePseudo = computed(() => {
  const val = props.params?.['font-size-pseudo'] ?? props.params?.fontSizePseudo
  return (val !== undefined && val !== null) ? `${val}rem` : `${DEFAULTS.fontSizePseudo}rem`
})

const effectiveFontSizeText = computed(() => {
  const val = props.params?.['font-size-text'] ?? props.params?.fontSizeText
  return (val !== undefined && val !== null) ? `${val}rem` : `${DEFAULTS.fontSizeText}rem`
})

const effectiveBorderColor = computed(() => {
  const useTwitch = props.params?.['use-twitch-color'] ?? props.params?.useTwitchColor ?? DEFAULTS.useTwitchColor
  const softenTwitch = props.params?.['soften-twitch-color'] ?? props.params?.softenTwitchColor ?? DEFAULTS.softenTwitchColor

  if (useTwitch && props.message.color && props.message.color !== '') {
    return softenTwitch 
      ? `color-mix(in srgb, ${props.message.color} 55%, #ffffff)` 
      : props.message.color
  }

  const customBorder = props.params?.['border-color'] ?? props.params?.borderColor
  return (customBorder !== undefined && customBorder !== null && customBorder !== '') 
    ? customBorder 
    : DEFAULTS.borderColor
})

const effectivePseudoBgColor = computed(() => {
  const useTwitch = props.params?.['use-twitch-color'] ?? props.params?.useTwitchColor ?? DEFAULTS.useTwitchColor
  const softenTwitch = props.params?.['soften-twitch-color'] ?? props.params?.softenTwitchColor ?? DEFAULTS.softenTwitchColor

  if (useTwitch && props.message.color && props.message.color !== '') {
    return softenTwitch 
      ? `color-mix(in srgb, ${props.message.color} 55%, #ffffff)` 
      : props.message.color
  }

  const customPseudoBg = props.params?.['pseudo-bg-color'] ?? props.params?.pseudoBgColor
  return (customPseudoBg !== undefined && customPseudoBg !== null && customPseudoBg !== '') 
    ? customPseudoBg 
    : DEFAULTS.pseudoBgColor
})

const effectiveBubbleBgColor = computed(() => {
  const customBubbleBg = props.params?.['bubble-bg-color'] ?? props.params?.bubbleBgColor
  return (customBubbleBg !== undefined && customBubbleBg !== null && customBubbleBg !== '') 
    ? customBubbleBg 
    : DEFAULTS.bubbleBgColor
})
</script>

<template>
  <div>
    <h2>
      {{ message.name }}
    </h2>
    <p>
      <template v-for="(element, index) in message.message" :key="index">
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
h2, div {
  border: 4px solid;
  border-color: v-bind(effectiveBorderColor);
  font-family: "Sour-gummy", sans-serif;
  font-weight: 700;
}

div {
  position: relative;
  margin-top: 36px;
  border-radius: 24px;
  padding: 24px;
  padding-top: 3rem;
  margin-left: v-bind("message.type === 'YouTube' ? '0px' : '24px'");
  margin-right: v-bind("message.type === 'YouTube' ? '24px' : '0px'");
  background-color: v-bind(effectiveBubbleBgColor);
}

h2 {
  padding: 8px;
  max-width: 300px;
  border-radius: 100px;
  font-size: v-bind(effectiveFontSizePseudo);
  background-color: v-bind(effectivePseudoBgColor);
  width: fit-content;
  position: absolute;
  top: calc(-28px - ((v-bind(effectiveFontSizePseudo) - 1.75rem) * 0.28));
  right: v-bind("message.type === 'YouTube' ? '-24px' : 'auto'");
  left: v-bind("message.type === 'Twitch' ? '-24px' : 'auto'");
  overflow: hidden; 
  white-space: nowrap; 
  text-overflow: ellipsis;
}

p {
  font-family: "Sour-gummy", sans-serif;
  font-size: v-bind(effectiveFontSizeText);
}

.chat-emote {
  height: 1.25rem;
  vertical-align: middle;
  display: inline-block;
}
</style>
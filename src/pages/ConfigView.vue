<script setup>
import { ref, computed } from 'vue'
import DialogBubble from '@/component/DialogBubble.vue'


const DEFAULTS = {
  fontSizePseudo: 1.75,
  fontSizeText: 1.25,
  borderColor: '#ffc5d3',
  pseudoBgColor: '#ffc5d3',
  bubbleBgColor: '#fafafa',
  useTwitchColor: true,
  softenTwitchColor: true,
  chatDirection: 'bottom-up',
  ignoredUsers: []
}

const fontSizePseudo = ref(DEFAULTS.fontSizePseudo)
const fontSizeText = ref(DEFAULTS.fontSizeText)
const borderColor = ref(DEFAULTS.borderColor)
const pseudoBgColor = ref(DEFAULTS.pseudoBgColor)
const bubbleBgColor = ref(DEFAULTS.bubbleBgColor)
const useTwitchColor = ref(DEFAULTS.useTwitchColor)
const softenTwitchColor = ref(DEFAULTS.softenTwitchColor)
const chatDirection = ref(DEFAULTS.chatDirection)

const bubbleParam = ref({
  fontSizePseudo: fontSizePseudo,
  fontSizeText: fontSizeText,
  borderColor: borderColor,
  pseudoBgColor: pseudoBgColor,
  bubbleBgColor: bubbleBgColor,
  useTwitchColor: useTwitchColor,
  softenTwitchColor: softenTwitchColor,
})

const currentIgnoredInput = ref('')
const ignoredUsers = ref([...DEFAULTS.ignoredUsers])

const addIgnoredUser = () => {
  const pseudo = currentIgnoredInput.value.trim()
  if (pseudo && !ignoredUsers.value.includes(pseudo)) {
    ignoredUsers.value.push(pseudo)
  }
  currentIgnoredInput.value = ''
}

const removeIgnoredUser = (index) => {
  ignoredUsers.value.splice(index, 1)
}

const inputExistingUrl = ref('')

const importParamsFromUrl = () => {
  try {
    const rawUrl = inputExistingUrl.value.trim()
    if (!rawUrl) return

    let queryString = ''
    if (rawUrl.includes('?')) {
      queryString = rawUrl.split('?')[1]
    } else if (rawUrl.includes('#')) {
      const hashPart = rawUrl.split('#')[1]
      if (hashPart.includes('?')) {
        queryString = hashPart.split('?')[1]
      }
    }

    const searchParams = new URLSearchParams(queryString)

    fontSizePseudo.value = searchParams.has('font-size-pseudo') ? parseFloat(searchParams.get('font-size-pseudo')) : DEFAULTS.fontSizePseudo
    fontSizeText.value = searchParams.has('font-size-text') ? parseFloat(searchParams.get('font-size-text')) : DEFAULTS.fontSizeText
    borderColor.value = searchParams.has('border-color') ? searchParams.get('border-color') : DEFAULTS.borderColor
    pseudoBgColor.value = searchParams.has('pseudo-bg-color') ? searchParams.get('pseudo-bg-color') : DEFAULTS.pseudoBgColor
    bubbleBgColor.value = searchParams.has('bubble-bg-color') ? searchParams.get('bubble-bg-color') : DEFAULTS.bubbleBgColor
    useTwitchColor.value = searchParams.has('use-twitch-color') ? searchParams.get('use-twitch-color') === 'true' : DEFAULTS.useTwitchColor
    softenTwitchColor.value = searchParams.has('soften-twitch-color') ? searchParams.get('soften-twitch-color') === 'true' : DEFAULTS.softenTwitchColor
    chatDirection.value = searchParams.has('chat-direction') ? searchParams.get('chat-direction') : DEFAULTS.chatDirection
    
    if (searchParams.has('ignored-users')) {
      ignoredUsers.value = searchParams.get('ignored-users').split(',').filter(Boolean)
    } else {
      ignoredUsers.value = []
    }

    alert('Paramètres importés avec succès !')
  } catch (e) {
    alert("Erreur lors de l'analyse de l'URL.")
    console.error(e)
  }
}

const obsUrl = computed(() => {
  const basePath = window.location.href.split('#')[0]
  const params = new URLSearchParams()
  
  if (fontSizePseudo.value !== DEFAULTS.fontSizePseudo) params.set('font-size-pseudo', fontSizePseudo.value)
  if (fontSizeText.value !== DEFAULTS.fontSizeText) params.set('font-size-text', fontSizeText.value)
  if (borderColor.value !== DEFAULTS.borderColor) params.set('border-color', borderColor.value)
  if (pseudoBgColor.value !== DEFAULTS.pseudoBgColor) params.set('pseudo-bg-color', pseudoBgColor.value)
  if (bubbleBgColor.value !== DEFAULTS.bubbleBgColor) params.set('bubble-bg-color', bubbleBgColor.value)
  if (useTwitchColor.value !== DEFAULTS.useTwitchColor) params.set('use-twitch-color', useTwitchColor.value)
  if (softenTwitchColor.value !== DEFAULTS.softenTwitchColor) params.set('soften-twitch-color', softenTwitchColor.value)
  if (chatDirection.value !== DEFAULTS.chatDirection) params.set('chat-direction', chatDirection.value)
  
  if (ignoredUsers.value.length > 0) {
    params.set('ignored-users', ignoredUsers.value.join(','))
  }

  const queryString = params.toString()
  return queryString ? `${basePath}#/chat?${queryString}` : `${basePath}#/chat`
})

const copyToClipboard = () => {
  navigator.clipboard.writeText(obsUrl.value)
  alert('URL OBS copiée dans le presse-papier !')
}

const previewMessage = {
    messageID: 'preview-1',
    color: '#FF0000',
    name: 'PseudoExemple',
    type: 'Twitch',
    message: [
      { type: 'text', text: 'Ceci est un message de prévisualisation ! ✨' }
    ],
    createdAt: new Date().toISOString()
  }
</script>

<template>
  <section class="config-container">
    <h1>Configuration de l'overlay Chat</h1>
    <div class="main-layout">
      <div class="left-panel">
        <div class="card import-card">
          <label><strong>Importer une URL existante :</strong></label>
          <div class="input-action-group">
            <input 
              type="text" 
              v-model="inputExistingUrl" 
              placeholder="Collez l'URL ici..." 
            />
            <button @click="importParamsFromUrl">Importer</button>
          </div>
        </div>
        <div class="card preview-card">
          <h2>Prévisualisation du Chat</h2>
          <div :class="['preview-wrapper', chatDirection]">
            <DialogBubble :message="previewMessage" :params="bubbleParam"/>
          </div>
        </div>
      </div>
      <div class="right-panel card">
        <h2>Paramètres</h2>
        <div class="url-box">
          <label><strong>URL finale pour OBS :</strong></label>
          <div class="url-input-group">
            <input type="text" :value="obsUrl" disabled />
            <button @click="copyToClipboard">Copier</button>
          </div>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>Taille police pseudos (rem) : {{ fontSizePseudo }}rem</label>
            <input type="range" v-model.number="fontSizePseudo" min="1" max="3" step="0.05" />
          </div>
          <div class="form-group">
            <label>Taille police texte (rem) : {{ fontSizeText }}rem</label>
            <input type="range" v-model.number="fontSizeText" min="0.8" max="2.5" step="0.05" />
          </div>
          <div class="form-group">
            <label>Couleur des bordures :</label>
            <input type="color" v-model="borderColor" />
          </div>
          <div class="form-group">
            <label>Fond du pseudo :</label>
            <input type="color" v-model="pseudoBgColor" />
          </div>
          <div class="form-group">
            <label>Fond de la bulle :</label>
            <input type="color" v-model="bubbleBgColor" />
          </div>
          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" v-model="useTwitchColor" />
              Utiliser la couleur Twitch pour la bordure
            </label>
            <div v-if="useTwitchColor">
              <label>
                <input type="checkbox" v-model="softenTwitchColor" />
                Adoucir la couleur Twitch
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>Sens du chat :</label>
            <select v-model="chatDirection">
              <option value="bottom-up">De bas en haut (Nouveaux en bas)</option>
              <option value="top-down">De haut en bas (Nouveaux en haut)</option>
            </select>
          </div>

          <div class="form-group full-width">
            <label>Pseudos ignorés (Entrée pour valider) :</label>
            <input 
              type="text" 
              v-model="currentIgnoredInput" 
              @keydown.enter.prevent="addIgnoredUser" 
              placeholder="Entrer un pseudo et appuyer sur Entrée..."
            />
            <div class="tags-container">
              <span v-for="(user, index) in ignoredUsers" :key="index" class="tag">
                {{ user }}
                <button type="button" @click="removeIgnoredUser(index)">×</button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.config-container {
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
  font-family: sans-serif;
}

h1 {
  margin-bottom: 24px;
}

.main-layout {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 24px;
  align-items: start;
}

.card {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.left-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.import-card, .preview-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-action-group, .url-input-group {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.input-action-group input, .url-input-group input, input[type="text"], select {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
}

.input-action-group button, .url-input-group button {
  padding: 8px 16px;
  background: #ffc5d3;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.url-box {
  margin-bottom: 24px;
  background: #f0f0f0;
  padding: 14px;
  border-radius: 12px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.full-width {
  grid-column: span 2;
}

.checkbox-group {
  flex-direction: column;
  align-items: left;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
}

.tag {
  background: #ffc5d3;
  padding: 4px 10px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
}

.tag button {
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
}
</style>
<script setup>
import DialogBubble from '@/component/DialogBubble.vue';

</script>

<template>
<div>
  <template v-for="n in 10" :key="n">
    <DialogBubble :platform="n % 2 == 1 ? 'twitch' : 'youtube'" />
  </template>
  
</div>
</template>

<style scoped> 

</style>
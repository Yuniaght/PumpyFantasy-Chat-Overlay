<script setup>

defineProps({
  platform: String
})


</script>

<template>
  <div>
    <h2>
      Icylephoque - {{ platform }}
    </h2>
    <p> 
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur, unde? Corporis labore iure hic sint nesciunt, inventore illum assumenda deleniti ipsum! Neque aspernatur, distinctio tempore error repellendus enim tenetur harum asperiores. Totam, qui iure voluptatibus aliquam eaque est. Dicta aspernatur nostrum reprehenderit repudiandae? Reprehenderit vel ut in saepe! Natus, minus?
    </p>
  </div>
</template>

<style scoped> 
div {
  position: relative;
  margin-top: 36px;
}

h2, p {
  border: 4px solid #ffc5d3;
  font-family: "Sour-gummy", sans-serif;
  font-weight: 700;
}

h2 {
  padding: 8px;
  max-width: 300px;
  border-radius: 100px;
  font-size: 1.75rem;
  background-color: #ffc5d3;
  width: fit-content;
  position: absolute;
  top: -50px;
  right: v-bind("platform === 'youtube' ? '0' : 'auto'");
  overflow:hidden; 
  white-space: nowrap; 
  text-overflow: ellipsis;
}

p {
 padding: 24px;
 padding-top: 48px;
 border-radius: 24px;
 font-size: 1.25rem;
 margin-left: v-bind("platform === 'youtube' ? '0px' : '24px'");
 margin-right: v-bind("platform === 'youtube' ? '24px' : '0px'");
 background-color: #fafafa;
}
</style>
<script setup lang="ts">
const props = defineProps([
  "title",
  "icon"
])

const emit = defineEmits(['closeWindow'])

const closeWindow = () => {
  emit('closeWindow');
}

</script>

<style scoped>
.popup-window {
  position: fixed;
  top: 25vh;
  left: 25vw;
  height: 50vh;
  width: 50vw;

  display: flex;
  flex-direction: column;
}
</style>

<template>
<div class="popup-window vaunch-window vaunch-solid-bg"
  tabindex="0"
  @keydown.esc="closeWindow">
  <span ref="titlebar" class="window-title folder-title greyscale-title">
    <span><i :class="['fa-solid', 'fa-'+props.icon]"></i></span>
    <span class="window-title-text">{{ props.title }}</span>
    <span v-on:click="closeWindow" class="window-close"
      ><i class="fa-solid fa-circle-xmark"></i
    ></span>
  </span>

  <div class="window-inner">
    <slot></slot>
  </div>

</div>
</template>
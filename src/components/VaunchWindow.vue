<script setup lang="ts">
const props = defineProps([
  "title",
  "icon",
  "small"
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
.window-inner {
  overflow-y: auto;
  height: 100%;
}

.window-title {
  display: flex;
  flex-direction: row;
}
.window-title-text {
  flex: 1;
}
.window-close:hover {
  cursor: pointer;
}

.popup-window-small {
  top: 45vh;
  left: 42.5vw;
  height: 15vh;
  width: 20vw;
}

</style>

<template>
<div :class="{'popup-window':true, 'vaunch-window':true, 'vaunch-solid-bg':true, 'popup-window-small':props.small}"
  tabindex="0"
  @keydown.esc="closeWindow">
  <span ref="titlebar" class="window-title folder-title greyscale-title">
    <span><i :class="['fa-solid', 'fa-'+props.icon]"></i></span>
    <span class="window-title-text">{{ props.title }}</span>
    <span v-on:click="closeWindow" class="window-close">
    <i class="fa-solid fa-close"></i>
    </span>
  </span>

  <div class="window-inner">
    <slot></slot>
  </div>

</div>
</template>
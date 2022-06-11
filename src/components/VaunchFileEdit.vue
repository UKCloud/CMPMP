<script setup lang="ts">
  const props = defineProps(['file'])

  const emit = defineEmits(['closeEdit'])

  const closeWindow = () => {
    emit('closeEdit');
  }

</script>

<style scoped>
.edit-window {
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
<div class="edit-window vaunch-window vaunch-solid-bg"
  tabindex="0"
  @keydown.esc="closeWindow">
  <span ref="titlebar" class="window-title folder-title greyscale-title">
    <span><i class="fa-solid fa-pencil"></i></span>
    <span class="window-title-text">Edit - {{ file.titleCase() }}</span>
    <span v-on:click="closeWindow" class="window-close"
      ><i class="fa-solid fa-circle-xmark"></i
    ></span>
  </span>
  <input type="text" :value=" file.fileName " />
</div>
</template>
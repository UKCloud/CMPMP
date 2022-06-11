<script setup lang="ts">
import VaunchWindow from "./VaunchWindow.vue";
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
<VaunchWindow :title="'Edit - ' + file.titleCase()" :icon="'pencil'" v-on:close-window="closeWindow">
  <div>
    <label :for="file.getIdSafeName() + '-filename'">Name: </label><input type="text" :id="file.getIdSafeName() + '-filename'" :value=" file.fileName " />
  </div>
</VaunchWindow>
</template>
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

#edit-container {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
  padding: 0.5rem 0;
}

.edit-attr {
  width: 50%;
  display: flex;
  flex-direction: row;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border-radius: 5px;
}

.edit-buttons {
  display: flex;
  justify-content: center;
}
.edit-buttons div {
  margin: 0 0.5rem;
}
</style>

<template>
<VaunchWindow :title="'Edit - ' + file.titleCase()" :icon="'pencil'" v-on:close-window="closeWindow">
  <div id="edit-container">
    <div class="edit-attributes">
      <div class="edit-filename edit-attr">
        <label :for="file.getIdSafeName() + '-filename'">Name: </label>
        <input class="commandInput" type="text" :id="file.getIdSafeName() + '-filename'" :value=" file.fileName " />
      </div>
  
      <div class="edit-content edit-attr">
        <label :for="file.getIdSafeName() + '-filename'">Content: </label>
        <input class="commandInput" type="text" :id="file.getIdSafeName() + '-filename'" :value=" file.content " />
      </div>
    </div>
    <div class="edit-buttons">
      <div>
        <div class="vaunch-button">
          <span class="vaunch-button-text">Save</span>
        </div>
      </div>
        <div class="vaunch-button" @click="closeWindow">
          <span class="vaunch-button-text" >Close</span>
        </div>
    </div>
  </div>
</VaunchWindow>
</template>
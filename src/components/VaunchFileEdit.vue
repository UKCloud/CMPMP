<script setup lang="ts">
import VaunchWindow from "./VaunchWindow.vue";
import VaunchButton from "./VaunchButton.vue";
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

.edit-buttons {
  display: flex;
  justify-content: center;
  border-top: solid thin rgba(0, 0, 0, 0.25);
  padding-top: 0.5rem;
}
.edit-buttons div {
  margin: 0 0.5rem;
}

.edit-attributes {
  overflow: auto;
  padding: 0 1rem;
}

.edit-segment {
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: solid thin rgba(0, 0, 0, 0.25);
  border-radius: 5px;
}

.edit-attr {
  width: 50%;
  display: flex;
  flex-direction: row;
  margin: 1rem 0;
  width: 100%;
  justify-content: space-around;
}

.edit-input {
  border: none;
  background: none;
  font-size: 1rem;
  flex: 1;
}
.edit-input:focus {
  outline: none;
}
</style>

<template>
<VaunchWindow :title="'Edit - ' + file.titleCase()" :icon="'pencil'" v-on:close-window="closeWindow">
  <div id="edit-container">
    <div class="edit-attributes">
      
      <div class="edit-segment">
        <h2>File Content</h2>
        <div class="edit-filename edit-attr">
          <label :for="file.getIdSafeName() + '-filename'">Name: </label>
          <input class="edit-input" type="text" :id="file.getIdSafeName() + '-filename'" :value=" file.fileName " />
        </div>
  
        <div v-if="file.filetype == 'VaunchQuery'" class="edit-content edit-attr">
          <label :for="file.getIdSafeName() + '-filename'">Prefix: </label>
          <input class="edit-input" type="text" :id="file.getIdSafeName() + '-filename'" :value=" file.prefix " />
        </div>
    
        <div class="edit-content edit-attr">
          <label :for="file.getIdSafeName() + '-filename'">Content: </label>
          <input class="edit-input" type="text" :id="file.getIdSafeName() + '-filename'" :value=" file.content " />
        </div>
      </div>

      <div class="edit-segment">
        <h2>File Customisation</h2>

        <h3>Icon</h3>
        <div>
          <div class="edit-filename edit-attr">
            <label :for="file.getIdSafeName() + '-filename'">Icon Name: </label>
            <input class="edit-input" type="text" :id="file.getIdSafeName() + '-filename'" :value=" file.fileName " />
          </div>
          <div class="edit-filename edit-attr">
            <label :for="file.getIdSafeName() + '-filename'">Icon Name: </label>
            <input class="edit-input" type="text" :id="file.getIdSafeName() + '-filename'" :value=" file.fileName " />
          </div>
        </div>

      </div>

    </div>
    <div class="edit-buttons">
      <div>
        <VaunchButton icon="save" text="Save" />
      </div>
      <div>
        <VaunchButton icon="close" text="Close" @click="closeWindow" />
      </div>
    </div>
  </div>
</VaunchWindow>
</template>
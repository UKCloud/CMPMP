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
  flex-direction: column;
  margin: 1rem 0;
  width: 100%;
  justify-content: left;
}

.edit-label {
  min-width: 10%;
  max-width: 15%;
}

.edit-input {
  border: none;
  background: none;
  font-size: 1rem;
  min-width: 30%;
  max-width: 50%;
  flex-shrink: 1;
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
        <div class="edit-attr">
          <span>Edit the name of the file</span>
          <div>
            <label class="edit-label" :for="file.getIdSafeName() + '-filename'">Name: </label>
            <input class="edit-input" type="text" :id="file.getIdSafeName() + '-filename'" :value=" file.fileName " />
          </div>
        </div>

        <div class="edit-attr">
          <div>Edit the folder the file is in</div>
          <div>
            <label class="edit-label" :for="file.getIdSafeName() + '-folder'">Folder: </label>
            <input class="edit-input" type="text" :id="file.getIdSafeName() + '-filename'" :value=" file.parent.name " />
          </div>
        </div>
  
        <div v-if="file.filetype == 'VaunchQuery'" class="edit-attr">
          <span>Edit the prefix used of the file</span>
          <div>
            <label class="edit-label" :for="file.getIdSafeName() + '-prefix'">Prefix: </label>
            <input class="edit-input" type="text" :id="file.getIdSafeName() + '-prefix'" :value=" file.prefix " />
          </div>
        </div>
    
        <div class="edit-attr">
          <span>Edit the link content of the file</span>
          <div>
            <label class="edit-label" :for="file.getIdSafeName() + '-content'">Content: </label>
            <input class="edit-input" type="text" :id="file.getIdSafeName() + '-content'" :value=" file.content " />
          </div>
        </div>
      </div>

      <div class="edit-segment">
        <h2>File Customisation</h2>

        <h3>Icon</h3>
        <div>
          <div class="edit-attr">
            <span>Edit the icon name for the file</span>
            <div>
              <label class="edit-label" :for="file.getIdSafeName() + '-icon-name'">Icon Name: </label>
              <input class="edit-input" type="text" :id="file.getIdSafeName() + '-icon-name'" :value=" file.icon " />
            </div>
          </div>
          <div class="edit-attr">
            <span>Edit the icon class for the file</span>
            <div>
              <label class="edit-label" :for="file.getIdSafeName() + '-icon-class'">Icon Class: </label>
              <input class="edit-input" type="text" :id="file.getIdSafeName() + '-icon-class'" :value=" file.iconClass " />
            </div>
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
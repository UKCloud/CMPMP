<script setup lang="ts">
import VaunchWindow from "./VaunchWindow.vue";
import VaunchButton from "./VaunchButton.vue";
import { ref } from "vue";
import { useConfigStore } from "@/stores/config";
import { VaunchSetIcon } from "@/models/commands/fs/VaunchSetIcon";
import { type VaunchResponse, ResponseType } from "@/models/VaunchResponse";
import { handleResponse } from "@/utilities/response";
import { VaunchMv } from "@/models/commands/fs/VaunchMv";
const props = defineProps(['folder'])

const emit = defineEmits(['closeEdit'])
const config = useConfigStore();

const newName = ref();
const newIcon = ref();
const newIconClass = ref();

const closeWindow = () => {
  emit('closeEdit');
}

const saveFolder = () => {
  // .value.value is used here to get the .value of the reference,
  // a HTMLInputElement, which itself has a .value property
  let folderPath:string = props.folder.name;

  // Edit the icon of the folder
  if (newIcon.value.value != props.folder.icon || newIconClass.value.value != props.folder.iconClass) {
    let setIcon = new VaunchSetIcon();
    let response: VaunchResponse = setIcon.execute([folderPath, newIcon.value.value, newIconClass.value.value])
    if (response.type == ResponseType.Error) return handleResponse(response);
  }

  // If the name of the folder has changed, attempt to move it
  // Do this last so the originalPath variable can be used for all other commands
  if (newName.value.value != props.folder.name) {
    let mv = new VaunchMv();
    let response: VaunchResponse = mv.execute([folderPath, newName.value.value]);
    if (response.type == ResponseType.Error) return handleResponse(response);
  }
  // Once all edits are made, close the window
  closeWindow();
}
</script>

<style scoped>
#edit-container {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  flex-grow: 1;
}

.edit-buttons {
  display: flex;
  justify-content: center;
  border-top: solid thin rgba(0, 0, 0, 0.25);
  padding: 0.5rem 0;
}

.edit-buttons div {
  margin: 0 0.5rem;
}

.edit-attributes {
  overflow: auto;
  padding: 0 1rem;
}

#edit-form {
  display: flex;
  flex-direction: row;
}

.edit-segment {
  padding: 0.5rem;
  margin: 0.5rem;
  border: solid thin rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  flex: 1;
}

.edit-attr {
  width: 50%;
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
  width: 100%;
  justify-content: left;
}

.edit-input-container {
  display: flex;
  justify-content: left;
}

.edit-label {
  padding-right: 0.5em;
}

.edit-input {
  border: none;
  background: none;
  font-size: 1rem;
  flex-grow: 1;
  border-bottom: solid thin v-bind("config.color.text") !important;
  color: v-bind("config.color.text");
}

.edit-input:focus {
  outline: none;
}
</style>

<template>
  <VaunchWindow :title="'Edit - ' + folder.titleCase()" :icon="'pencil'" v-on:close-window="closeWindow">
    <div id="edit-container">
      <div class="edit-attributes">
        <form id="edit-form" @submit.prevent="saveFolder">

          <div class="edit-segment">
            <h2>Folder Properties</h2>

            <div class="edit-attr">
              <span>Edit the name of the folder</span>
              <div class="edit-input-container">
                <label class="edit-label" :for="folder.getIdSafeName() + '-filename'">Name: </label>
                <input autocomplete="off" ref="newName" class="edit-input" type="text"
                  :id="folder.getIdSafeName() + '-filename'" :value="folder.name" />
              </div>
            </div>

            <div class="edit-attr">
              <span>Edit the icon used for the folder</span>
              <div class="edit-input-container">
                <label class="edit-label" :for="folder.getIdSafeName() + '-icon'">Icon: </label>
                <input autocomplete="off" ref="newIcon" class="edit-input" type="text"
                  :id="folder.getIdSafeName() + '-icon'" :value="folder.icon" />
              </div>
            </div>

            <div class="edit-attr">
              <span>Edit the icon class for the folder</span>
              <div class="edit-input-container">
                <label class="edit-label" :for="folder.getIdSafeName() + '-icon-class'">Icon Class: </label>
                <input autocomplete="off" ref="newIconClass" class="edit-input" type="text"
                  :id="folder.getIdSafeName() + '-icon-class'" :value="folder.iconClass" />
              </div>
            </div>
          </div>
          <input style="display:none" type="submit" />
        </form>
      </div>
    </div>
    <div class="edit-buttons">
      <div>
        <VaunchButton icon="save" text="Save" @click="saveFolder" />
      </div>
      <div>
        <VaunchButton icon="close" text="Close" @click="closeWindow" />
      </div>
    </div>
  </VaunchWindow>
</template>
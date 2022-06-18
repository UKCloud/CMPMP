<script setup lang="ts">
import VaunchWindow from "./VaunchWindow.vue";
import VaunchButton from "./VaunchButton.vue";
import { reactive, ref } from "vue";
import { VaunchMv } from "@/models/commands/fs/VaunchMv";
import { ResponseType, type VaunchResponse } from "@/models/VaunchResponse";
import { VaunchEditFile } from "@/models/commands/fs/VaunchEditFile";
import { VaunchSetIcon } from "@/models/commands/fs/VaunchSetIcon";
import { VaunchSetDescription } from "@/models/commands/fs/VaunchSetDescription";
import { useConfigStore } from "@/stores/config";
import { handleResponse } from "@/utilities/response";
const props = defineProps(['folder'])

const emit = defineEmits(['closeAdd'])
const config = useConfigStore();

const newName = ref();
const newFolder = ref();
const newPrefix = ref();
const newContent = ref();
const newIcon = ref();
const newIconClass = ref();
const newDescription = ref();

const state = reactive({
  fileType: "lnk",
});
const setFileType = (event: any) => {
  console.log(event.target.value);
  state.fileType = event.target.value;
}

const closeWindow = () => {
  emit('closeAdd');
}

const createFile = () => {
  // Once the file is created, close the window
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
  width: 100%;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
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
  <VaunchWindow :title="'Add file to - ' + folder.titleCase()" :icon="'plus'" v-on:close-window="closeWindow">
    <div id="edit-container">
      <form id="edit-form" @submit.prevent="createFile">
        <div class="edit-attributes">

          <div class="edit-segment">
            <h2>File Type</h2>
            <div class="edit-attr">
              <p>
                Link File: A simple link to a hardcoded site, e.g 'https://example.com'
              </p>
              <p>
                Query File: A dynamic link to a site based on your input when running.
                Replaces '${}' or ${1}, ${2} etc... with provided arguments
              </p>
              <div class="edit-input-container">
                <label class="edit-label" :for="folder.getIdSafeName() + '-type'">File Type: </label>
                <select @change="setFileType($event)">
                  <option value="lnk">Link (.lnk)</option>
                  <option value="qry">Query (.qry)</option>
                </select>
              </div>
            </div>
          </div>

          <div  class="edit-segment">
            <h2 v-if="state.fileType == 'lnk'">Link File Properties</h2>
            <h2  v-if="state.fileType == 'qry'">Query File Properties</h2>
            
          </div>

          <input style="display:none" type="submit" />
        </div>
      </form>
    </div>
    <div class="edit-buttons">
      <div>
        <VaunchButton icon="plus" text="Create" @click="createFile" />
      </div>
      <div>
        <VaunchButton icon="close" text="Close" @click="closeWindow" />
      </div>
    </div>
  </VaunchWindow>
</template>
<script setup lang="ts">
import VaunchWindow from "./VaunchWindow.vue";
import VaunchButton from "./VaunchButton.vue";
import { reactive, ref } from "vue";
import { ResponseType, type VaunchResponse } from "@/models/VaunchResponse";
import { VaunchSetIcon } from "@/models/commands/fs/VaunchSetIcon";
import { VaunchSetDescription } from "@/models/commands/fs/VaunchSetDescription";
import { useConfigStore } from "@/stores/config";
import { handleResponse } from "@/utilities/response";
import { VaunchTouch } from "@/models/commands/fs/VaunchTouch";
import { VaunchSetPosition } from "@/models/commands/fs/VaunchSetPosition";
const props = defineProps(['folder'])

const emit = defineEmits(['closeAdd'])
const config = useConfigStore();

const newName = ref();
const newPrefix = ref();
const newContent = ref();
const newPos = ref();
const newIcon = ref();
const newIconClass = ref();
const newDescription = ref();

const state = reactive({
  fileType: "lnk",
});
const setFileType = (event: any) => {
  state.fileType = event.target.value;
}

const closeWindow = () => {
  emit('closeAdd');
}

function missingFieldResponse(fields:string[]) {
  let plural = fields.length > 1;
  return handleResponse({
    type: ResponseType.Error,
    message: `Missing required field${plural? 's':''}: ${fields.join(", ")}`,
    filetype: "VaunchSystem",
    name: "touch",
  })
}

const createFile = async () => {

  // Ensure required fields are set
  let missingFields:string[] = [];
  if (newName.value.value == "") missingFields.push("Name")
  if (state.fileType == "qry" && newPrefix.value.value == "") missingFields.push("Prefix")
  if (newContent.value.value == "") missingFields.push("Content")
  if (missingFields.length > 0) return missingFieldResponse(missingFields);

  // Ensure that the file ends with .<extension> and is in good filename format
  // eg replacing spaces with underscores, and lower case etc...
  let baseName:string = (newName.value.value as string).toLowerCase()
                                                       .replace(/\s+/g, '_');
  let fileName:string = baseName + (baseName.endsWith(`.${state.fileType}`) ? '' : `.${state.fileType}`)

  // After checks have passed, touch the file, prefixing the file's folder
  let touch = new VaunchTouch();
  let filePath = `${props.folder.name}/${fileName}`
  let content:string = newContent.value.value
  if (state.fileType == "lnk") {
    let response:VaunchResponse = await touch.execute([filePath, content])
    if (response.type == ResponseType.Error) return handleResponse(response);
  } else if (state.fileType == "qry") {
    let prefix:string = newPrefix.value.value
    let response:VaunchResponse = await touch.execute([filePath, prefix, content])
    if (response.type == ResponseType.Error) return handleResponse(response);
  }

  // If the file was made successfully, perform all other customisation for the file
  // Edit the icon of the file
  if (newIcon.value.value != "" || newIconClass.value.value != "" ) {
    let setIcon = new VaunchSetIcon();
    let response: VaunchResponse = await setIcon.execute([filePath, newIcon.value.value.toLowerCase(), newIconClass.value.value.toLowerCase()])
    if (response.type == ResponseType.Error) return handleResponse(response);
  }

  // Edit the description of the file
  if (newDescription.value.value != "") {
    let setDesc = new VaunchSetDescription();
    let response: VaunchResponse = await setDesc.execute([filePath, newDescription.value.value])
    if (response.type == ResponseType.Error) return handleResponse(response);
  }

  // If the file position is set, run set-pos
  if (newPos.value.value) {
    let setPos = new VaunchSetPosition();
    let response: VaunchResponse = await setPos.execute([filePath, newPos.value.value.toLowerCase()])
    if (response.type == ResponseType.Error) return handleResponse(response);
  }

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
  overflow-y: auto;
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

.create-file-container {
  display: flex;
  flex-direction: row;
}

.edit-label {
  padding-right: 0.5em;
}

.edit-input {
  width: 50%;
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

@media (max-width: 768px) {
  .create-file-container {
    flex-direction: column;
  }
}
</style>

<template>
  <VaunchWindow :title="folder.titleCase() +': Create File'" 
    :icon="folder.icon" :icon-class="folder.iconClass" v-on:close-window="closeWindow">
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

          <div class="create-file-container">
            <div class="edit-segment">
              <h2 v-if="state.fileType == 'lnk'">Link File Content</h2>
              <h2 v-if="state.fileType == 'qry'">Query File Content</h2>

              <div class="edit-attr">
                <span>Set the name of the file</span>
                <div class="edit-input-container">
                  <label class="edit-label" for="new-filename">Name: </label>
                  <input autocapitalize="none" autocomplete="off" ref="newName" class="edit-input" type="text" id="new-filename" />
                </div>
              </div>

              <div v-if="state.fileType == 'qry'" class="edit-attr">
                <span>Set the prefix used for the file</span>
                <div class="edit-input-container">
                  <label class="edit-label" for="new-prefix">Prefix: </label>
                  <input autocapitalize="none" autocomplete="off" ref="newPrefix" class="edit-input" type="text" id="new-prefix" />
                </div>
              </div>

              <div class="edit-attr">
                <span>Set the link content of the file</span>
                <div class="edit-input-container">
                  <label class="edit-label" for="new-content">Destination: </label>
                  <input autocapitalize="none" autocomplete="off" ref="newContent" class="edit-input" type="text" id="new-content" />
                </div>
              </div>
            </div>

            <div class="edit-segment">
              <h2 v-if="state.fileType == 'lnk'">Link File Customisation</h2>
              <h2 v-if="state.fileType == 'qry'">Query File Customisation</h2>

              <div class="edit-attr">
                <span>Edit the position of the file</span>
                <div class="edit-input-container">
                  <label class="edit-label" for="new-position">Position: </label>
                  <input autocapitalize="none" autocomplete="off" ref="newPos" class="edit-input" type="text"
                    id="new-position" value="" />
                </div>
              </div>
              <div class="edit-attr">
                <span>Edit the icon used for the file</span>
                <div class="edit-input-container">
                  <label class="edit-label" for="new-icon-name">Icon Name: </label>
                  <input autocapitalize="none" autocomplete="off" ref="newIcon" class="edit-input" type="text"
                    id="new-icon-name" value="file" />
                </div>
              </div>
              <div class="edit-attr">
                <span>Edit the icon class for the file</span>
                <div class="edit-input-container">
                  <label class="edit-label" for="new-icon-class">Icon Class: </label>
                  <select ref="newIconClass" id="new-icon-class">
                    <option value="solid">Solid</option>
                    <option value="brands">Brands</option>
                  </select>
                </div>
              </div>
              <div class="edit-attr">
                <span>Edit the description for the file</span>
                <div class="edit-input-container">
                  <label class="edit-label" for="new-description">File Description: </label>
                  <input autocomplete="off" ref="newDescription" class="edit-input" type="text"
                    id="new-description" />
                </div>
              </div>
            </div>
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
<script setup lang="ts">
import VaunchWindow from "./VaunchWindow.vue";
import VaunchButton from "./VaunchButton.vue";
import { ref } from "vue";
import { VaunchMv } from "@/models/commands/fs/VaunchMv";
import { ResponseType, type VaunchResponse } from "@/models/VaunchResponse";
import { VaunchEditFile } from "@/models/commands/fs/VaunchEditFile";
import { VaunchSetIcon } from "@/models/commands/fs/VaunchSetIcon";
import { VaunchSetDescription } from "@/models/commands/fs/VaunchSetDescription";
import { useConfigStore } from "@/stores/config";
  const props = defineProps(['file'])

  const emit = defineEmits(['closeEdit','sendResponse'])
  const config = useConfigStore();

  const newName = ref();
  const newFolder = ref();
  const newPrefix = ref();
  const newContent = ref();
  const newIcon = ref();
  const newIconClass = ref();
  const newDescription = ref();

  const closeWindow = () => {
    emit('closeEdit');
  }

  const saveFile = () => {
    // .value.value is used here to get the .value of the reference,
    // a HTMLInputElement, which itself has a .value property
    
    let originalPath = props.file.getFilePath();

    // Edit the content of the file, if prefix is present, it is a query file
    // and should be the firs arg after the filename
    let editArgs:string[] = [];
    if (newPrefix.value) {
      // If prefix has changed, add it to the editArgs
      if (newPrefix.value.value != props.file.prefix) editArgs.push(newPrefix.value.value);
    }
    // If the link content has changed, add it to the editArgs
    if (newContent.value.value != props.file.content) editArgs.push(newContent.value.value);
    if (editArgs.length > 0) {
      // Edit the file, using the originalPath to get to the file
      let edit = new VaunchEditFile();
      let response:VaunchResponse = edit.execute([originalPath, ...editArgs]);
      if (response.type == ResponseType.Error) {
        emit("sendResponse", response);
        return;
      }
    }

    // Edit the icon of the file
    if (newIcon.value.value != props.file.icon || newIconClass.value.value != props.file.iconClass ) {
      let setIcon = new VaunchSetIcon();
      let response:VaunchResponse = setIcon.execute([originalPath, newIcon.value.value, newIconClass.value.value])
      if (response.type == ResponseType.Error) {
        emit("sendResponse", response);
        return;
      }
    }

    // Edit the description of the file
    if (newDescription.value.value != props.file.description ) {
      let setDesc = new VaunchSetDescription();
      let response:VaunchResponse = setDesc.execute([originalPath, newDescription.value.value])
      if (response.type == ResponseType.Error) {
        emit("sendResponse", response);
        return;
      }
    }

    // If the name/folder of the file has changed, attempt to move it
    // Do this last so the originalPath variable can be used for all other commands
    if (newFolder.value.value != props.file.parent.name || newName.value.value != props.file.fileName ) {
      let newPath = `${newFolder.value.value}/${newName.value.value}`
      let mv = new VaunchMv();
      let response:VaunchResponse = mv.execute([originalPath, newPath]);
      if (response.type == ResponseType.Error) {
        emit("sendResponse", response);
        return;
      }
    }

    // Once all edits are made, close the window
    closeWindow();
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
  border-bottom: solid thin v-bind("config.color.text") !important;
  color: v-bind("config.color.text");
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
            <input ref="newName" class="edit-input" type="text" :id="file.getIdSafeName() + '-filename'" :value=" file.fileName " />
          </div>
        </div>

        <div class="edit-attr">
          <div>Edit the folder the file is in</div>
          <div>
            <label class="edit-label" :for="file.getIdSafeName() + '-folder'">Folder: </label>
            <input ref="newFolder" class="edit-input" type="text" :id="file.getIdSafeName() + '-filename'" :value=" file.parent.name " />
          </div>
        </div>
  
        <div v-if="file.filetype == 'VaunchQuery'" class="edit-attr">
          <span>Edit the prefix used of the file</span>
          <div>
            <label class="edit-label" :for="file.getIdSafeName() + '-prefix'">Prefix: </label>
            <input ref="newPrefix" class="edit-input" type="text" :id="file.getIdSafeName() + '-prefix'" :value=" file.prefix " />
          </div>
        </div>
    
        <div class="edit-attr">
          <span>Edit the link content of the file</span>
          <div>
            <label class="edit-label" :for="file.getIdSafeName() + '-content'">Content: </label>
            <input ref="newContent" class="edit-input" type="text" :id="file.getIdSafeName() + '-content'" :value=" file.content " />
          </div>
        </div>
      </div>

      <div class="edit-segment">
        <h2>File Customisation</h2>
        <div>
          <div class="edit-attr">
            <span>Edit the icon name for the file</span>
            <div>
              <label class="edit-label" :for="file.getIdSafeName() + '-icon-name'">Icon Name: </label>
              <input ref="newIcon" class="edit-input" type="text" :id="file.getIdSafeName() + '-icon-name'" :value=" file.icon " />
            </div>
          </div>
          <div class="edit-attr">
            <span>Edit the icon class for the file</span>
            <div>
              <label class="edit-label" :for="file.getIdSafeName() + '-icon-class'">Icon Class: </label>
              <input ref="newIconClass" class="edit-input" type="text" :id="file.getIdSafeName() + '-icon-class'" :value=" file.iconClass " />
            </div>
          </div>
          <div class="edit-attr">
            <span>Edit the description for the file</span>
            <div>
              <label class="edit-label" :for="file.getIdSafeName() + '-description'">File Description: </label>
              <input ref="newDescription" class="edit-input" type="text" :id="file.getIdSafeName() + '-description'" :value=" file.description " />
            </div>
          </div>
        </div>

      </div>

    </div>
    <div class="edit-buttons">
      <div>
        <VaunchButton icon="save" text="Save" @click="saveFile" />
      </div>
      <div>
        <VaunchButton icon="close" text="Close" @click="closeWindow" />
      </div>
    </div>
  </div>
</VaunchWindow>
</template>
<script setup lang="ts">
import { VaunchRm } from '@/models/commands/fs/VaunchRm';
import { type VaunchResponse, ResponseType } from '@/models/VaunchResponse';
import { ref, reactive, onMounted } from 'vue'
import VaunchFileEdit from './VaunchFileEdit.vue'
import VaunchConfirm from './VaunchConfirm.vue'
import { useSessionStore } from '@/stores/sessionState';
import { focusVaunchInput } from '@/utilities/inputUtils';
import VaunchOption from './VaunchOption.vue';

const props = defineProps(['file', 'context', 'xPos', 'yPos'])
const optionContainer = ref()
const sessionConfig = useSessionStore();

const state = reactive({
  showEdit:false,
  showDelete:false,
})

onMounted(() => {
  if (sessionConfig.action) {
    setWindow(sessionConfig.action, true);
    sessionConfig.action = "";
  }
})

const deleteFile = () => {
  let rm = new VaunchRm();
  let filePath = `${props.file.getParentName()}/${props.file.fileName}`;
  rm.execute([filePath])
  sessionConfig.showFileOptions = false;
}

const executeFile = (args:string[]) => {
  let response: VaunchResponse = props.file.execute(args);
  if (response.type == ResponseType.UpdateInput) {
    sessionConfig.vaunchInput = response.message;
    focusVaunchInput()
  }
  setWindow('edit', false);
}

const copyLink = () => {
  // Get the URL for the file, and then write the content to the clipboard
  let destination = props.file.getCorrectURL();
  navigator.clipboard.writeText(destination);
  sessionConfig.showFileOptions = false;
}

const setWindow = (window:string, show:boolean) => {
  switch (window) {
    case "edit":
      state.showEdit = show;
      break;
    case "delete":
      state.showDelete = show;
      break;
  }
  if (show) {
    optionContainer.value.hideOptions();
  } else sessionConfig.showFileOptions = false;
}
</script>

<template>
<VaunchOption :x-pos="props.xPos" :y-pos="props.yPos" ref="optionContainer">
  <template v-slot:options>
    <div class="option-title">
        <i :class="['fa-' + file.iconClass, 'fa-' + file.icon, 'option-icon']"></i>{{ file.titleCase() }}
    </div>

    <div class="options-segment">
      <div v-if="file.filetype == 'VaunchLink'" class="option-entry" @click="executeFile([])">
        <i class="fa-solid fa-link option-icon" />Open
      </div>
      <div v-if="file.filetype == 'VaunchLink'" class="option-entry" @click="executeFile(['_blank'])">
        <i class="fa-solid fa-up-right-from-square option-icon" />Open in New Tab
      </div>
      <div v-if="file.filetype == 'VaunchLink'" class="option-entry" @click="copyLink()">
        <i class="fa-solid fa-clipboard option-icon" />Copy Link
      </div>
      <div v-if="file.filetype == 'VaunchQuery'" class="option-entry" @click="executeFile([])">
        <i class="fa-solid fa-ellipsis option-icon" />Autofill Input
      </div>
    </div>

    <div class="options-segment">
      <div class="option-entry" @click="setWindow('edit', true)"><i class="fa-solid fa-pencil option-icon" />Edit File</div>
      <div class="option-entry" @click="setWindow('delete', true)"><i class="fa-solid fa-trash option-icon" />Delete File</div>
    </div>
  </template>

  <template v-slot:windows>
    <VaunchFileEdit v-if="state.showEdit" :file="file" :context="context" v-on:close-edit="setWindow('edit', false)"/>
    <VaunchConfirm v-if="state.showDelete"
      v-on:close-window="setWindow('delete', false)"
      v-on:answer-yes="deleteFile()"
      v-on:answer-no="setWindow('delete', false)"
      title="Are You Sure?"
      icon="trash"
      :ask-text="'Are you sure you want to delete '+file.titleCase()+'?'" />
  </template>
</VaunchOption>
</template>
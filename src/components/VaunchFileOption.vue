<script setup lang="ts">
import { VaunchRm } from '@/models/commands/fs/VaunchRm';
import { type VaunchResponse, ResponseType } from '@/models/VaunchResponse';
import { ref, onMounted, onUpdated, reactive } from 'vue'
import VaunchFileEdit from './VaunchFileEdit.vue'
import VaunchConfirm from './VaunchConfirm.vue'

  const props = defineProps(['file', 'xPos', 'yPos'])
  const emit = defineEmits(["dismissSelf", "set-input", "sendResponse"]);
  const option = ref()
  const optionContainer = ref()

  const state = reactive({
    showEdit:false,
    showDelete:false,
  })

  onMounted(() => {
    let element:HTMLElement = option.value;
    element.style.top = `${props.yPos}px`;
    element.style.left = `${props.xPos}px`;
  })

  onUpdated(() => {
    let element:HTMLElement = option.value;
    element.style.top = `${props.yPos}px`;
    element.style.left = `${props.xPos}px`;
  })

  const deleteFile = () => {
    let rm = new VaunchRm();
    let filePath = `${props.file.getParentName()}/${props.file.fileName}`;
    rm.execute([filePath])
    dismiss();
  }

  const executeFile = (args:string[]) => {
    let response: VaunchResponse = props.file.execute(args);
    if (response.type == ResponseType.UpdateInput) {
      emit("set-input", response.message);
    }
    hideEditWindow();
  }

  const showEditWindow = () => {
    state.showEdit = true;
    (optionContainer.value as HTMLElement).style.display = "none";
  }
  const showDeleteWindow = () => {
    state.showDelete = true;
    (optionContainer.value as HTMLElement).style.display = "none";
  }
  const hideEditWindow = () => {
    state.showEdit = false;
    emit('dismissSelf');
  }
  const hideDeleteWindow = () => {
    state.showDelete = false;
    emit('dismissSelf');
  }

  const sendResponse = (response:VaunchResponse) => {
    emit("sendResponse", response)
  }

  const dismiss = () => {
    emit('dismissSelf');
  }
</script>

<style scoped>
.option-outer {
  position: absolute;
}
.vaunch-option {
  max-width: 15em;
  min-width: 7em;
  word-break: break-all;
  height: 7em;
  z-index: 10;
  border: solid thin rgba(100, 100, 100, 0.25);
  overflow: visible;
}

.options-container {
  border-radius: inherit;
  background-color: inherit;
  padding: 0.5em 0;
}

.options-container div {
  background-color: inherit;
}

.options-container .selectable-entries:not(:last-child) {
  padding-bottom: 0.5rem;
  border-bottom: solid 1px rgba(0, 0, 0, 0.25);
}

.options-title {
  padding-bottom: 0.5rem !important;
  border-bottom: solid 1px rgba(0, 0, 0, 0.25);
}

.option-icon {
  padding-right: 0.5em;
  width: 1.5rem;
}

.selectable-entries{
  margin-top: 0.5em;
}

.selectable-entries * {
  transition: filter 0.25s;
}
.selectable-entries *:hover {
  filter: hue-rotate(30deg) invert(20%);
  cursor: pointer;
}

.option-entry {
  padding: 0 0.5em;
}
</style>

<template>
<div class="option-outer" v-click-away="dismiss" ref="option">
  <div class="vaunch-option vaunch-window vaunch-solid-bg" ref="optionContainer">
  <div class="options-container">

    <div class="options-title option-entry"><i :class="['fa-' + file.iconClass, 'fa-' + file.icon, 'option-icon']"></i>{{ file.titleCase() }}</div>
    <div class="selectable-entries">
      <div v-if="file.filetype == 'VaunchLink'" class="option-entry" @click="executeFile([])">
        <i class="fa-solid fa-link option-icon" />Open
      </div>
      <div v-if="file.filetype == 'VaunchLink'" class="option-entry" @click="executeFile(['_blank'])">
        <i class="fa-solid fa-up-right-from-square option-icon" />Open in New Tab
      </div>
      <div v-if="file.filetype == 'VaunchQuery'" class="option-entry" @click="executeFile([])">
        <i class="fa-solid fa-ellipsis option-icon" />Autofill Input
      </div>
    </div>
    <div class="selectable-entries">
      <div class="option-entry" @click="showEditWindow()"><i class="fa-solid fa-pencil option-icon" />Edit File</div>
      <div class="option-entry" @click="showDeleteWindow()"><i class="fa-solid fa-trash option-icon" />Delete File</div>
    </div>

  </div>
  </div>
  <VaunchFileEdit v-if="state.showEdit" :file="file" v-on:close-edit="hideEditWindow()" v-on:send-response="sendResponse"/>
  <VaunchConfirm v-if="state.showDelete"
    v-on:close-window="hideDeleteWindow()" 
    v-on:answer-yes="deleteFile()"
    v-on:answer-no="hideDeleteWindow()"
    title="Are You Sure?"
    icon="trash"
    :ask-text="'Are you sure you want to delete '+file.titleCase()+'?'" />
</div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useSessionStore } from '@/stores/sessionState';
import VaunchOption from './VaunchOption.vue';
import VaunchFolderEdit from './VaunchFolderEdit.vue';
import VaunchAppEdit from './VaunchAppEdit.vue';
import { VaunchExport } from '@/models/commands/config/VaunchExport';
import { ResponseType, type VaunchResponse } from '@/models/VaunchResponse';
import { handleResponse } from '@/utilities/response';
import { VaunchImport } from '@/models/commands/config/VaunchImport';
import VaunchConfirm from './VaunchConfirm.vue';

const props = defineProps(['folder', 'xPos', 'yPos'])
const optionContainer = ref()
const sessionConfig = useSessionStore();

const state = reactive({
  showEdit:false,
  showAdd:false,
  showExport:false,
  showImport:false,
})

const setWindow = (window:string, show:boolean) => {
  switch (window) {
    case "add":
      state.showAdd = show;
      break;
    case "edit":
      state.showEdit = show;
      break;
    case "export":
      state.showExport = show;
      break;
    case "import":
      state.showImport = show;
      break;
  }
  if (show) {
    optionContainer.value.hideOptions();
  } else sessionConfig.showAppOptions = false;
}

const exportVaunch = () => {
  let vaunchExport = new VaunchExport();
  let response:VaunchResponse = vaunchExport.execute([]);
  if (response.type != ResponseType.Success) {
    handleResponse(response);
  }
  setWindow("", false);
}

const importVaunch = () => {
  let vaunchImport = new VaunchImport();
  let response:VaunchResponse = vaunchImport.execute([]);
  if (response.type != ResponseType.Success) {
    handleResponse(response);
  }
  setWindow("", false);
}
</script>

<template>
<VaunchOption :x-pos="props.xPos" :y-pos="props.yPos" ref="optionContainer">
  <template v-slot:options>
    <div class="option-title">
        <i class="fa-solid fa-cog option-icon"></i> Vaunch Settings
    </div>

    <div class="options-segment">
      <div class="option-entry" @click="setWindow('add', true)"><i class="fa-solid fa-plus option-icon" />Add Folder</div>
      <div class="option-entry" @click="setWindow('edit', true)"><i class="fa-solid fa-pencil option-icon" />Vaunch Settings</div>
      <div class="option-entry" @click="setWindow('export', true)"><i class="fa-solid fa-file-export option-icon" />Export Vaunch</div>
      <div class="option-entry" @click="setWindow('import', true)"><i class="fa-solid fa-file-import option-icon" />Import Vaunch</div>
    </div>
  </template>

  <template v-slot:windows>
    <VaunchFolderEdit v-if="state.showAdd" :add-new="true" v-on:close-edit="setWindow('add', false)"/>
    <VaunchAppEdit v-if="state.showEdit" :add-new="true" v-on:close-edit="setWindow('edit', false)"/>
    <VaunchConfirm v-if="state.showExport"
      v-on:close-window="setWindow('export', false)"
      v-on:answer-yes="exportVaunch"
      v-on:answer-no="setWindow('export', false)"
      title="Export Vaunch Settings?"
      icon="file-export"
      ask-text="Do you want to export your Vaunch settings?" />
    <VaunchConfirm v-if="state.showImport"
      v-on:close-window="setWindow('import', false)"
      v-on:answer-yes="importVaunch"
      v-on:answer-no="setWindow('import', false)"
      title="Import Vaunch Settings?"
      icon="file-import"
      ask-text="Do you want to import Vaunch settings from a file?" />
  </template>
</VaunchOption>
</template>
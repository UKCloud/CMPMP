<script setup lang="ts">
import { VaunchRmdir } from '@/models/commands/fs/VaunchRmdir';
import { ref, reactive } from 'vue'
import VaunchConfirm from './VaunchConfirm.vue'
import { useSessionStore } from '@/stores/sessionState';
import VaunchOption from './VaunchOption.vue';
import VaunchFolderEdit from './VaunchFolderEdit.vue';
import VaunchFileAdd from './VaunchFileAdd.vue';
import { VaunchExport } from '@/models/commands/config/VaunchExport';
import { ResponseType, type VaunchResponse } from '@/models/VaunchResponse';
import { handleResponse } from '@/utilities/response';
import { VaunchImport } from '@/models/commands/config/VaunchImport';

const props = defineProps(['folder', 'xPos', 'yPos'])
const optionContainer = ref()
const sessionConfig = useSessionStore();

const state = reactive({
  showEdit:false,
  showDelete:false,
  showAdd:false,
})

const setWindow = (window:string, show:boolean) => {
  switch (window) {
    case "add":
      state.showAdd = show;
      break;
    case "edit":
      state.showEdit = show;
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
      <div class="option-entry" @click="exportVaunch"><i class="fa-solid fa-file-export option-icon" />Export Vaunch</div>
      <div class="option-entry" @click="importVaunch"><i class="fa-solid fa-file-import option-icon" />Import Vaunch</div>
    </div>
  </template>

  <template v-slot:windows>
    <VaunchFolderEdit v-if="state.showAdd" :add-new="true" v-on:close-edit="setWindow('add', false)"/>
  </template>
</VaunchOption>
</template>
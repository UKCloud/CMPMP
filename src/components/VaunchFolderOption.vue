<script setup lang="ts">
import { VaunchRmdir } from '@/models/commands/fs/VaunchRmdir';
import { ref, reactive } from 'vue'
import VaunchConfirm from './VaunchConfirm.vue'
import { useSessionStore } from '@/stores/sessionState';
import VaunchOption from './VaunchOption.vue';

const props = defineProps(['folder', 'xPos', 'yPos'])
const optionContainer = ref()
const sessionConfig = useSessionStore();

const state = reactive({
  showEdit:false,
  showDelete:false,
})


const deleteFolder = () => {
  let rm = new VaunchRmdir();
  let folderPath = `${props.folder.name}`;
  rm.execute(["-f", folderPath])
  sessionConfig.showFolderOptions = false;
}

const showEditWindow = () => {
  state.showEdit = true;
  optionContainer.value.hideOptions();
}
const showDeleteWindow = () => {
  state.showDelete = true;
  optionContainer.value.hideOptions();
}
const hideEditWindow = () => {
  state.showEdit = false;
  sessionConfig.showFolderOptions = false;
}
const hideDeleteWindow = () => {
  state.showDelete = false;
  sessionConfig.showFolderOptions = false;
}
</script>

<template>
<VaunchOption :x-pos="props.xPos" :y-pos="props.yPos" ref="optionContainer">
  <template v-slot:options>
    <div class="option-title">
        <i :class="['fa-' + folder.iconClass, 'fa-' + folder.icon, 'option-icon']"></i>{{ folder.titleCase() }}
    </div>

    <div class="options-segment">
      <div class="option-entry" @click="showDeleteWindow()"><i class="fa-solid fa-trash option-icon" />Delete Folder</div>
    </div>
  </template>

  <template v-slot:windows>
    <!-- <VaunchFileEdit v-if="state.showEdit" :folder="folder" v-on:close-edit="hideEditWindow()"/> -->
    <VaunchConfirm v-if="state.showDelete"
      v-on:close-window="hideDeleteWindow()" 
      v-on:answer-yes="deleteFolder()"
      v-on:answer-no="hideDeleteWindow()"
      title="Are You Sure?"
      icon="trash"
      :ask-text="'Are you sure you want to delete '+folder.titleCase()+'?'" />
  </template>
</VaunchOption>
</template>
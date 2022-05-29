<script lang="ts">
import { defineComponent } from "vue";
import { useConfigStore } from "@/stores/config";
import VaunchTooltip from "./VaunchTooltip.vue";
import { extend } from "@vue/shared";
import { VaunchCommand } from "@/models/VaunchCommand";

export default defineComponent({
  name: "VaunchGuiCommand",
  setup() {
    const config = useConfigStore();
    return {
      config,
      commandInput: "",
    }
  },
  props: {
    file: {type: extend(VaunchCommand)},
    parentFolderName: {type: String, required: true},
    isFuzzy: {type: Boolean, default: false}
  },
  methods: {
    execute(file:VaunchCommand, args:string[]) {
      file.execute(args);
      (this.$refs.commandInputBox as HTMLInputElement).value = "";
    },
    handleClick(file:VaunchCommand, args:string[]) {
      console.log("I'll handle it");
      this.execute(file, args);
    }
  },
  components: { VaunchTooltip },
  emits: ['set-input']
})
</script>

<style scoped>
.file {
  display: flex;
  justify-content: space-between;
  width: auto;
  min-width: 95%;
  max-width: 95%;
  padding: 1em;
  margin: 0.5em;
  box-shadow: none;
  overflow-wrap: break-word;
  border: solid thin rgba(100, 100, 100, 0.1);
  user-select: none;
}

.file:hover {
  cursor: pointer;
  filter: contrast(1.5);
}

.filename {
  padding-left: 0.5rem;
}

.file-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.file-inner * {
  border: solid thin black
}

.commandInput {
  border: none;
  background: none;
  font-size: 1rem;
}
.commandInput:focus {
  outline: none;
}

</style>

<template>
<div :key="file.fileName" class="file vaunch-window" 
@click.exact="handleClick(file, [])"
:id="parentFolderName+'-'+file.getIdSafeName()">
  <div>
    <i :class="['fa-' + file.iconClass, 'fa-' + file.icon, 'file-icon']"></i>
    <span v-if="config.titleCase" :class="{filename: !isFuzzy}">{{ file.titleCase() }}</span>
    <span v-if="!config.titleCase" :class="{filename: !isFuzzy}">{{ file.fileName }}</span>
    <input class="commandInput" @keydown.enter.prevent="execute(file, commandInput.split(' '))"
    v-model="commandInput" type="text"
    ref="commandInputBox" />
  </div>
</div>
</template>
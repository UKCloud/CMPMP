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
      if (file.hasArgs) {
        (this.$refs.commandInputBox as HTMLInputElement).focus();
      } else {
        this.execute(file, args);
      }
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
  filter: hue-rotate(30deg);
}

.command-inner {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-items: center;
  width: 100%;
}

.command-name {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.file-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.command-input-container {
  width: 100%;
  flex: 1;
}

.commandInput {
  border: none;
  background: none;
  font-size: 1rem;
  width: 100%;
  flex: 1;
}
.commandInput:focus {
  outline: none;
}

</style>

<template>
<div :key="file.fileName" class="file vaunch-window" 
@click.exact="handleClick(file, [])"
:id="parentFolderName+'-'+file.getIdSafeName()">
  <div class="command-inner">
    <i class="fa-solid fa-chevron-right file-icon"></i>
    <span class="command-name">{{ file.titleCase() }}<span v-if="file.hasArgs">:</span></span>
    <input v-if="file.hasArgs" class="commandInput" @keydown.enter.prevent="execute(file, commandInput.split(' '))"
    v-model="commandInput" type="text"
    ref="commandInputBox" />
  </div>
  <VaunchTooltip v-if="file.description.length  > 0" :tip-for="'commands-'+file.getIdSafeName()" :tip-file="file"/>
</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useConfigStore } from "@/stores/config";
import VaunchTooltip from "./VaunchTooltip.vue";
import { VaunchFile } from "@/models/VaunchFile";
import { extend } from "@vue/shared";

export default defineComponent({
  name: "VaunchGuiFile",
  setup() {
    const config = useConfigStore();
    return {
      config
    }
  },
  // props: ["file", "parentFolderName"],
  props: {
    file: {type: extend(VaunchFile)},
    parentFolderName: {type: String, required: true}
  },
  methods: {
    execute(file:VaunchFile, args:string[]) {
      let response = file.execute(args);
      if (response) {
        this.$emit('set-input', response)
      }
    }
  },
  components: { VaunchTooltip },
  emits: ['set-input']
})
</script>

<style scoped>
.file {
  width: auto;
  max-width: 40%;
  padding: 1em;
  margin: 0.5em;
  box-shadow: none;
  transition: background-color 0.15s ease-in-out;
}

.file:hover {
  cursor: pointer;
  background-color: var(--color-vaunch-window-highlight);
  transition: background-color 0.15s ease-in-out;
}

.file-name {
  padding-left: 0.5rem;
}

</style>

<template>
<div :key="file.fileName" class="file vaunch-window" 
@click.exact="execute(file, [])"
@click.ctrl="execute(file, ['_blank'])"
@click.middle="execute(file, ['_blank'])"
:id="parentFolderName+'-'+file.getIdSafeName()">
  <i :class="['fa-' + file.iconClass, 'fa-' + file.icon, 'file-icon']"></i>
  <span v-if="config.titleCase" class="file-name">{{ file.titleCase() }}</span>
  <span v-if="!config.titleCase" class="file-name">{{ file.fileName }}</span>
  <VaunchTooltip :tip-for="parentFolderName+'-'+file.getIdSafeName()" :tip-content="file.getDescription()"/>
</div>
</template>
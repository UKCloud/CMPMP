<script lang="ts">
import { defineComponent } from "vue";
import { useConfigStore } from "@/stores/config";
import VaunchTooltip from "./VaunchTooltip.vue";
import { extend } from "@vue/shared";
import { VaunchUrlFile } from "@/models/VaunchUrlFile";

export default defineComponent({
  name: "VaunchGuiFile",
  setup() {
    const config = useConfigStore();
    return {
      config
    }
  },
  props: {
    file: {type: extend(VaunchUrlFile)},
    parentFolderName: {type: String, required: true},
    isFuzzy: {type: Boolean, default: false}
  },
  methods: {
    execute(file:VaunchUrlFile, args:string[]) {
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
  display: flex;
  justify-content: space-between;
  width: auto;
  min-width: 20%;
  max-width: 100%;
  padding: 1em;
  margin: 0.5em;
  box-shadow: none;
  overflow-wrap: break-word;
  border: solid thin rgba(100, 100, 100, 0.25);
  user-select: none;
}

.file:hover {
  cursor: pointer;
  filter: contrast(1.5);
}

.filename {
  padding-left: 0.5rem;
}

</style>

<template>
<div :key="file.fileName" class="file vaunch-window" 
@click.exact="execute(file, [])"
@click.ctrl="execute(file, ['_blank'])"
@click.middle="execute(file, ['_blank'])"
:id="parentFolderName+'-'+file.getIdSafeName()">
  <div>
    <i :class="['fa-' + file.iconClass, 'fa-' + file.icon, 'file-icon']"></i>
    <span v-if="isFuzzy" class="filename">{{ file.getParentName(config.titleCase) }}: </span>
    <span v-if="config.titleCase" :class="{filename: !isFuzzy}">{{ file.titleCase() }}</span>
    <span v-if="!config.titleCase" :class="{filename: !isFuzzy}">{{ file.fileName }}</span>
  </div>
  <span v-if="isFuzzy">Hits: {{ file.hits }}</span>
  <VaunchTooltip :tip-for="parentFolderName+'-'+file.getIdSafeName()" :tip-file="file"/>
</div>
</template>
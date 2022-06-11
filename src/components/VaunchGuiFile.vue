<script lang="ts">
import { defineComponent } from "vue";
import { useConfigStore } from "@/stores/config";
import VaunchTooltip from "./VaunchTooltip.vue";
import { extend } from "@vue/shared";
import { VaunchUrlFile } from "@/models/VaunchUrlFile";
import { ResponseType, type VaunchResponse } from "@/models/VaunchResponse";
import VaunchFileOption from "./VaunchFileOption.vue";

export default defineComponent({
  name: "VaunchGuiFile",
  setup() {
    const config = useConfigStore();
    return {
      config,
    };
  },
  data() {
    let showOptions:boolean = false;
    let optionX:number = 0;
    let optionY:number = 0;
    return {
      showOptions,
      optionX,
      optionY,
    }
  },
  props: {
    file: { type: extend(VaunchUrlFile) },
    parentFolderName: { type: String, required: true },
    isFuzzy: { type: Boolean, default: false },
  },
  methods: {
    execute(file: VaunchUrlFile, args: string[]) {
      let response: VaunchResponse = file.execute(args);
      if (response.type == ResponseType.UpdateInput) {
        this.$emit("set-input", response.message);
      }
    },
    toggleOptions(event:any) {
      this.$emit('showFileOption', this.file, event.clientX, event.clientY)
    }
  },
  components: { VaunchTooltip, VaunchFileOption },
  emits: ["set-input","showFileOption"],
});
</script>

<style scoped>

.file:hover {
  cursor: pointer;
  filter: hue-rotate(30deg) invert(20%);
}

.filename {
  padding-left: 0.5rem;
}

.fuzzyInfo {
  width: 30%;
}

.description {
  margin-left: 5rem;
  flex: 1;
}

@media (max-width: 768px) {
  .description {
    display: none;
  }
  .fuzzyInfo {
    width: auto;
  }
}
</style>

<template>
  <div
    :key="file.fileName"
    class="file vaunch-window"
    @click.exact="execute(file, [])"
    @click.ctrl="execute(file, ['_blank'])"
    @click.middle.exact="execute(file, ['_blank'])"
    @click.right.prevent="toggleOptions($event)"
    :id="parentFolderName + '-' + file.getIdSafeName()"
  >
    <div :class="{ fuzzyInfo: isFuzzy }">
      <i :class="['fa-' + file.iconClass, 'fa-' + file.icon, 'file-icon']"></i>
      <span v-if="isFuzzy" class="filename">{{ file.getParentName(config.titleCase) }}:
      </span>
      <span v-if="config.titleCase" :class="{ filename: !isFuzzy }">
        {{ file.titleCase() }}
      </span>
      <span v-if="!config.titleCase" :class="{ filename: !isFuzzy }">
        {{ file.fileName }}
      </span>
    </div>
    <span v-if="isFuzzy" class="description"> {{ file.getDescription() }}</span>
    <span v-if="isFuzzy">Hits: {{ file.hits }}</span>
    <VaunchTooltip
      v-if="!isFuzzy"
      :tip-for="parentFolderName + '-' + file.getIdSafeName()"
      :tip-file="file"
    />
  </div>
</template>

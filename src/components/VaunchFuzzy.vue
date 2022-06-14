<script setup lang="ts">
import { ref, watch } from "vue";
import VaunchGuiFile from "./VaunchGuiFile.vue";

const props = defineProps(["fuzzyMatches", "currentIndex"])
const emit = defineEmits(["set-input"])

const files = ref();

const getCurrentIndex = () => props.currentIndex;

const passInput = (input:string) => emit("set-input", input);

watch(getCurrentIndex, (newIndex:number) => {
  let fileElement = files.value as typeof VaunchGuiFile[];
  let elem: HTMLElement = fileElement[newIndex].$el as HTMLElement;
  let parent: HTMLElement | null = elem.parentElement;
  if (parent) {
    let topPos = elem.offsetTop - parent.offsetTop;
    parent.scroll({
      top: topPos,
      behavior: "smooth",
    });
  }
});
</script>

<style>
#fuzzy-container {
  display: flex;
  flex-direction: column;
  width: 65vw;
  max-height: 35vh;
  margin-bottom: 1em;
}

#fuzzy-title {
  position: relative;
  width: 100%;
  padding-left: 1em;
  font-size: 1.2rem;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 5px 5px 0 0;
}

#fuzzy-title span {
  padding-left: 0.5rem;
}

#fuzzy-file-container {
  justify-content: left;
  justify-items: left;
  flex-direction: row;
  flex-wrap: wrap;
}

#fuzzy-file-container .file {
  width: 100%;
}

.highlight {
  filter: hue-rotate(30deg) invert(20%);
}

@media (max-width: 768px) {
  #fuzzy-container {
    width: 80vw;
  }
}

/* Small devices (landscape phones, 576px and up) */
@media (max-width: 576px) {
  #fuzzy-container {
    width: 95vw;
  }
}
</style>

<template>
  <div id="fuzzy-container" class="vaunch-window">
    <span class="folder-title">
      <i class="fa-solid fa-magnifying-glass"></i>
      <span class="folder-name">Fuzzy Search</span>
    </span>
    <div class="file-container" id="fuzzy-file-container">
      <VaunchGuiFile
        ref="files"
        :class="{ highlight: file === fuzzyMatches[currentIndex] }"
        v-on:set-input="passInput"
        v-for="file in fuzzyMatches"
        :key="file.fileName"
        :file="file"
        :parent-folder-name="'fuzzy'"
        :is-fuzzy="true"
      />
    </div>
  </div>
</template>

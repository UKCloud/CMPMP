<script lang="ts">
import { defineComponent } from "vue";
import VaunchGuiFile from "./VaunchGuiFile.vue";

export default defineComponent({
  name: "VaunchFuzzy",
  props: ['fuzzyMatches','currentIndex'],
  components: {
    VaunchGuiFile
  },
  methods: {
  passInput(input:string) {
    this.$emit('set-input', input)
  },
},
})
</script>

<style scoped>
#fuzzy-container {
  display: flex;
  flex-direction: column;
  width: 65vw;
  min-height: 35vh;
  max-height: 40vh;
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
  flex-direction: column;
}

.highlight {
  filter: contrast(1.5);
}

</style>

<template>
  <div id="fuzzy-container" class="vaunch-window">
    <span class="folder-title">
      <i class="fa-solid fa-magnifying-glass"></i>
      <span class="folder-name">Fuzzy Search</span>
    </span>
    <div class="file-container" id="fuzzy-file-container">
      <VaunchGuiFile :class="{highlight: file === fuzzyMatches[currentIndex]}"
      v-on:set-input="passInput" v-for="file in fuzzyMatches"
      :file="file" :parent-folder-name="'fuzzy'"
      :is-fuzzy="true"/>
    </div>
  </div>
</template>
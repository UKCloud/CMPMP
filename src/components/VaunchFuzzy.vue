<script lang="ts">
import { defineComponent } from "vue";
import VaunchGuiFile from "./VaunchGuiFile.vue";

export default defineComponent({
  name: "VaunchFuzzy",
  props: ['fuzzyMatches'],
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
  /* padding: 1em; */
  width: 65vw;
  height: 50vh;
  margin-bottom: 2em;
}
.vaunch-folder {

  margin: 0.75rem;
  min-width: 20vw;
  max-width: 30vw;
  width: auto;
  height: 27.5vh;
  backdrop-filter: unset !important;
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
}

.highlight {
  filter: contrast(0.8);
}

</style>

<template>
  <div id="fuzzy-container" class="vaunch-window">
    <span id="fuzzy-title">
      <i class="fa-solid fa-magnifying-glass"></i>
      <span class="folder-name">Fuzzy Search</span>
    </span>
    <div class="file-container" id="fuzzy-file-container">
      <VaunchGuiFile :class="{highlight: file === fuzzyMatches[0]}" v-on:set-input="passInput" v-for="file in fuzzyMatches" :file="file" :parent-folder-name="'fuzzy'" />
    </div>
  </div>
</template>
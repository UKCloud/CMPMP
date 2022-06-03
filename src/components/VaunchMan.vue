<script lang="ts">
import { useConfigStore } from "@/stores/config";
import { defineComponent } from "vue";
import VaunchManualEntry from "./VaunchManualEntry.vue";

export default defineComponent({
  name: "VaunchMan",
  props: ['commands'],
  components: {
    VaunchManualEntry
  },
  data() {
    return {
      searchInput: "",
      matches: 0,
    };
  },
  methods: {
    closeWindow() {
      const config = useConfigStore();
      config.helpCommand = "";
      config.showHelp = false;
    }
  },
  mounted() {
    const config = useConfigStore();
    if (config.helpCommand) {
      this.searchInput = config.helpCommand;
    }
  },
  watch: {
    searchInput(val: string) {
      this.matches = 0;
      (this.$refs.manualItems as any[]).forEach(item => {
        if (item.command.fileName.toLowerCase().includes(val.toLowerCase())) {
          item.$el.classList.remove("hidden");
          if (val != "") this.matches++;
        } else {
          item.$el.classList.add("hidden");
        }
      });
    }
  }
})
</script>

<style scoped>
#vaunch-man-container {
  position: absolute;
  top: 25vh;
  left: 25vw;
  height: 50vh;
  width: 50vw;

  display: flex;
  flex-direction: column;
}

#manual-inner {
  padding: 1rem;
  overflow-y: auto;
}

.manual-container {
  display: flex;
  flex-direction: column;
}

#man-title {
  display: flex;
  flex-direction: row;
}
#man-title-text {
  flex: 1;
}
#man-close:hover {
  cursor: pointer;
}

#manual-search-label {
  font-size: 1.25rem;
  padding-right: 0.5rem;
}

#manual-search-input {
  background-color: unset;
  font-size: 1.25rem;
  border: solid thin rgba(0, 0, 0, 0);
}

#manual-search-input:focus {
  outline: none;
}

#search-container {
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: solid thin rgba(0, 0, 0, 0.25);
  border-radius: 5px;
}
</style>

<template>
<div ref="window" id="vaunch-man-container" class="vaunch-window vaunch-solid-bg">
    <span ref="titlebar" id="man-title" class="folder-title greyscale-title">
      <span id="man-icon"><i class="fa-solid fa-info"></i></span>
      <span id="man-title-text">Help</span>
      <span v-on:click="closeWindow" id="man-close"><i class="fa-solid fa-circle-xmark"></i></span>
    </span>
    <div id="manual-inner">
      <div id="search-container">
        <label id="manual-search-label" for="manual-search-input">Search:</label>
        <input id="manual-search-input" class="commandInput" type="text" v-model="searchInput"/>
        <div v-if="matches != 0 || searchInput != ''">Matches: {{ matches }}</div>
      </div>
      <div class="manual-container">
          <VaunchManualEntry v-for="command in commands" :command="command" ref="manualItems" />
      </div>
    </div>
</div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import VaunchManualEntry from "./VaunchManualEntry.vue";

import { useSessionStore } from "@/stores/sessionState";
import VaunchWindow from "./VaunchWindow.vue";

export default defineComponent({
  name: "VaunchMan",
  props: ["commands"],
  components: {
    VaunchManualEntry,
    VaunchWindow
},
  data() {
    return {
      searchInput: "",
      matches: 0,
    };
  },
  methods: {
    closeWindow() {
      const sessionConfig = useSessionStore();
      sessionConfig.helpCommand = "";
      sessionConfig.showHelp = false;
    },
  },
  mounted() {
    const sessionConfig = useSessionStore();
    if (sessionConfig.helpCommand) {
      this.searchInput = sessionConfig.helpCommand;
    }
  },
  watch: {
    searchInput(val: string) {
      this.matches = 0;
      (this.$refs.manualItems as any[]).forEach((item) => {
        if (item.command.fileName.toLowerCase().includes(val.toLowerCase())) {
          item.$el.classList.remove("hidden");
          if (val != "") this.matches++;
        } else {
          item.$el.classList.add("hidden");
        }
      });
    },
  },
});
</script>

<style scoped>

.manual-container {
  display: flex;
  flex-direction: column;
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
<VaunchWindow :title="'Help'" :icon="'info'" v-on:close-window="closeWindow">
    <div id="search-container">
    <label id="manual-search-label" for="manual-search-input">Search:</label>
    <input
      id="manual-search-input"
      class="commandInput"
      type="text"
      v-model="searchInput"/>
    <div v-if="matches != 0 || searchInput != ''">
      Matches: {{ matches }}
    </div>
  </div>
  <div class="manual-container">
    <VaunchManualEntry
      v-for="command in commands"
      :command="command"
      :key="command.fileName"
      ref="manualItems"/>
  </div>
</VaunchWindow>
</template>

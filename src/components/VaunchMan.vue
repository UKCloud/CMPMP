<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import VaunchManualEntry from "./VaunchManualEntry.vue";

import { useSessionStore } from "@/stores/sessionState";
import VaunchWindow from "./VaunchWindow.vue";
import { useConfigStore } from "@/stores/config";

defineProps(["commands"]);
const sessionConfig = useSessionStore();

const config = useConfigStore();
const data = reactive({
  searchInput: "",
  matches: 0,
})

const manualItems = ref();

const closeWindow = () => {
  sessionConfig.helpCommand = "";
  sessionConfig.showHelp = false;
}

onMounted(() => {
  if (sessionConfig.helpCommand) {
    data.searchInput = sessionConfig.helpCommand;
  }
});

function arrayIncludesSubStr(list:string[], subString:string):boolean {
  let match = list.find(entry => {
    return entry.includes(subString);
  })
  // If a match was found, return true
  return match !== undefined;
}

const getSearchInput = () => data.searchInput;
watch(getSearchInput, (val: string) => {
  data.matches = 0;
  (manualItems.value as any[]).forEach((item) => {
    if (arrayIncludesSubStr(item.command.getNames(), val.toLowerCase())) {
      item.$el.classList.remove("hidden");
      if (val != "") data.matches++;
    } else {
      item.$el.classList.add("hidden");
    }
  });
});
</script>

<style scoped>
#help-container {
  padding: 0 1rem;
}

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
  border: none;
  background: none;
  font-size: 1rem;
  width: 100%;
  flex: 1;
  border-bottom: solid thin v-bind("config.color.text");
  color: v-bind("config.color.text");
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

#search-box {
  display: flex;
  width: 20rem;
}
</style>

<template>
<VaunchWindow :title="'Help'" :icon="'info'" v-on:close-window="closeWindow">
<div id="help-container">
  <div id="search-container">
    <div id="search-box">
      <label id="manual-search-label" for="manual-search-input">Search:</label>
      <input
        id="manual-search-input"
        type="text"
        v-model="data.searchInput"/>
    </div>
    <div v-if="data.matches != 0 || data.searchInput != ''">
      Matches: {{ data.matches }}
    </div>
  </div>
  <div class="manual-container">
    <VaunchManualEntry
      v-for="command in commands"
      :command="command"
      :key="command.fileName"
      ref="manualItems"/>
  </div>
</div>
</VaunchWindow>
</template>

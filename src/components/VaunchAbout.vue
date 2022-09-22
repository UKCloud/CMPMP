<script setup lang="ts">
import VaunchWindow from './VaunchWindow.vue';
import VaunchButton from './VaunchButton.vue';
import { useSessionStore } from "@/stores/sessionState";

const sessionConfig = useSessionStore();
const appVersion = sessionConfig.appVersion;
const appBuildDate = sessionConfig.buildDate;

const emit = defineEmits(['closeWindow'])
</script>

<style scoped>
#about-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

#about-text {
  margin: 0.5em;
  display: flex;
  flex-direction: column;
  flex: 1;
}


.confirm-buttons {
  display: flex;
  justify-content: center;
  border-top: solid thin rgba(0, 0, 0, 0.25);
  flex: 0;
}

#build-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

#source-link {
  color: inherit;
}
</style>

<template>
  <VaunchWindow :small="true" title="About Vaunch" icon="question-circle"
    v-on:close-window="emit('closeWindow')">
    <div id="about-container">
      <div id="about-text">
        <div id="build-info">
          <span>
            Vaunch version: {{ appVersion ? appVersion : "Version not found" }}
          </span>
          <span>
            Build date: {{ appBuildDate ? appBuildDate : "Build date not found" }}
          </span>
        </div>
        <span>
          View source code on <a id="source-link" href="https://github.com/kirimson/Vaunch">Github</a>
        </span>
      </div>
      <div class="confirm-buttons">
        <div>
          <VaunchButton text="Close" @click="emit('closeWindow')" />
        </div>
      </div>
    </div>
  </VaunchWindow>
</template>
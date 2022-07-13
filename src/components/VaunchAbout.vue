<script setup lang="ts">
import VaunchWindow from './VaunchWindow.vue';
import VaunchButton from './VaunchButton.vue';
import { onMounted, reactive } from 'vue';

const state = reactive({
  version:"",
  buildDate:"",
})

const emit = defineEmits(['closeWindow'])

function makeRequest (url:string, done:CallableFunction) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onload = function () {
    done(xhr.responseText);
  };
  xhr.onerror = function () {
    done("unknown");
  };
  xhr.send();
}

onMounted(() => {
  // let xHttp = new XMLHttpRequest();
  // xHttp.onreadystatechange = function () {
  //   if (this.readyState == 4 && this.status == 200) {
  //     state.version = this.responseText;
  //     console.log(state.version);
  //   } else if (this.readyState == 4 && this.status == 404) { 
  //     state.version = "unknown_version"; 
  //   }
  // };
  // xHttp.open("version.txt", true);
  // xHttp.send();
  makeRequest('version.txt', (result:string) => state.version = result )
  makeRequest('build_date.txt', (result:string) => state.buildDate = result )
})
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
            Vaunch version: {{ state.version }}
          </span>
          <span>
            Build date: {{ state.buildDate }}
          </span>
        </div>
        <span>
          View Source code on <a id="source-link" href="https://github.com/kirimson/Vaunch">Github</a>
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
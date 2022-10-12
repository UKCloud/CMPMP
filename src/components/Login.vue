<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import { useSessionStore } from "@/stores/sessionState";

import VaunchButton from "./VaunchButton.vue";
import { useConfigStore } from "@/stores/config";
import VaunchWindow from "./VaunchWindow.vue";
import { useDashboardStore } from "@/stores/dashboard";

const retrievedData:Ref<Boolean> = ref(false);
const config = useConfigStore();
const dashboards = useDashboardStore();
const sessionConfig = useSessionStore();

const props = defineProps({
  context: {
    type: String,
    default: ""
  }
})

onMounted(() => {
  fetch(sessionConfig.users, {
    credentials: "include"

  }).then(response => response.json())
    .then(response => {
      sessionConfig.email = response.email;
      retrievedData.value = true;
      // Get the dashboard from backend once logged in
      dashboards.getDashboard();
    })
})


</script>
       
<template>
    <div v-if="sessionConfig.email && retrievedData" class="nav vaunch-window">
      <div id="nav-inner">
        <div id="context">
          Current Context: {{props.context}}
        </div>
        <div id="logout-section">
          <div>
            {{sessionConfig.email}}
          </div>
          <a :href="sessionConfig.logout">
            <VaunchButton text="Log Out" />
          </a>
        </div>
      </div>
    </div>

    <div v-else-if=retrievedData>
      <VaunchWindow :small="true" title="Welcome to CMP²" :canClose="false">
        <div id="login">
          <span>Please login with your identity provider to access your dashboard.</span>
          <a :href="sessionConfig.login">
            <VaunchButton text="Log In" />
          </a>
        </div>
      </VaunchWindow>
    </div>
</template>
    
<style scoped>
a {
  color: inherit;
  text-decoration: none;
}

#login-container {
  display: flex;
  align-items: center;
  text-align: center;
}

#nav-inner {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-height: 3em;
}

.nav {
  width: 100%;
  border-radius: 0;
}

#login {
  padding: 20px 20px 20px 20px;
  display: flex;
  flex-direction: column;;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}

#context {
  padding-left: 1rem;
}

#logout-section {
  display: flex;
  align-items: center;
}

.vaunch-window>#login {
  flex-grow: 1;
}

.folder-title {
  display: flex;
  background: v-bind("config.color.window");
}
</style>
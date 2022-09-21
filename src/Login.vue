<script setup lang="ts">
import { onMounted, reactive, ref, type Ref } from "vue";
import { useSessionStore } from "./stores/sessionState";

const sessionConfig = useSessionStore();
onMounted(() => {
  fetch('http://localhost:9000/users', {
    credentials: "include"

  }).then(response => response.json())
    .then(response => (sessionConfig.email = response.email))
})

</script>
       
<template>
  <div :class="{nav: sessionConfig.email}" id="login-container">
    <div class="vaunch-window">
      <h1 id="logout" v-if=sessionConfig.email><a href='http://localhost:9000/logout'>Log Out</a></h1>
      <h1 id="login" v-else><a href='http://localhost:9000/login'>Log In</a></h1>
      <div>
        {{sessionConfig.email}}
      </div>
    </div>
  </div>

</template>
    
<style scoped>
#login-container {
  display: flex;
  align-items: center;
  text-align: center;

}

.vaunch-window {
  width: 100%;
}

.nav {
  width: 100%;
}

#login-container:not(.nav) {
  flex-grow: 1
}

.vaunch-window>#login {
  padding: 20px 20px 20px 20px;
  text-align: center;
  flex-grow: 1;
}
</style>
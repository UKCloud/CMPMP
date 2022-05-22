import { createApp } from "vue";
import { createPinia } from "pinia";

import Vaunch from "./Vaunch.vue";

const app = createApp(Vaunch);

app.use(createPinia());

app.mount("#app");

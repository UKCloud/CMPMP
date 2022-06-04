import { createApp } from "vue";
import { createPinia } from "pinia";

import VaunchApp from "./VaunchApp.vue";

const app = createApp(VaunchApp);

app.use(createPinia());

app.mount("#app");

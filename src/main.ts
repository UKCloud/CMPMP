import { createApp } from "vue";
import { createPinia } from "pinia";
import VueClickAway from "vue3-click-away";

import VaunchApp from "./VaunchApp.vue";

const app = createApp(VaunchApp);

app.use(createPinia());
app.use(VueClickAway);

app.mount("#app");

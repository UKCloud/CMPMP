import { createApp } from "vue";
import { createPinia } from "pinia";
import VueClickAway from "vue3-click-away";

import VaunchApp from "./VaunchApp.vue";

const app = createApp(VaunchApp);

app.use(createPinia());
// Vue click away adds a new directive for elements
// that fires when the user has clicked away from that element
app.use(VueClickAway);

app.mount("#app");

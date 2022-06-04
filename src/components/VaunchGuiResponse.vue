<script lang="ts">
import { defineComponent } from "vue";
import { useSessionStore } from "@/stores/sessionState";

export default defineComponent({
  name: "VaunchGuiResponse",
  props: ["response"],
  setup() {
    const sessionConfig = useSessionStore();
    return {
      sessionConfig,
    };
  },
  mounted() {
    // Fade out and dismiss the window after three seconds
    setTimeout(this.dismiss, 3000);
  },
  methods: {
    dismiss() {
      let responseWindow: HTMLElement = this.$refs
        .responseWindow as HTMLElement;

      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let self = this;
      responseWindow.classList.add("fade-out");
      responseWindow.addEventListener("transitionend", function () {
        self.sessionConfig.showResponse = false;
      });
    },
  },
});
</script>

<style scoped>
.response-window-container {
  position: absolute;
  top: 23vh;
  left: 25vw;
  width: 50vw;

  z-index: 10;
  transition: opacity 1s;
}

#response-window {
  display: flex;
  flex-direction: column;
  font-size: 1rem;
}

#error-title {
  width: 100%;
}

#response-inner {
  position: relative;
  padding: 1rem;
}
</style>

<template>
  <div class="response-window-container" ref="responseWindow">
    <div class="vaunch-window" id="response-window">
      <span
        v-if="response.type == 'error'"
        id="error-title"
        class="folder-title">
        <i class="fa-solid fa-circle-exclamation"></i>
        <span id="man-title-text">Error</span>
      </span>
      <span
        v-if="response.type == 'info'"
        id="error-title"
        class="folder-title">
        <i class="fa-solid fa-circle-information"></i>
        <span id="man-title-text">Info</span>
      </span>
      <div id="response-inner">
        {{ response.message }}
        <div v-if="response.filetype == 'VaunchCommand'">
          For usage information, use: <code>man {{ response.name }}</code>
        </div>
      </div>
    </div>
  </div>
</template>

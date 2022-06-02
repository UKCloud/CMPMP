<script lang="ts">
import { useConfigStore } from "@/stores/config";
import { defineComponent } from "vue";
import VaunchManualEntry from "./VaunchManualEntry.vue";

export default defineComponent({
  name: "VaunchMan",
  props: ['commands'],
  components: {
    VaunchManualEntry
  },
  methods: {
    closeWindow() {
      const config = useConfigStore();
      config.showHelp = false;
    }
  },
  mounted() {
    var offset = [0,0];
    var titlebar = (this.$refs.titlebar as HTMLElement);
    var window = (this.$refs.window as HTMLElement);
    var isDown = false;

    titlebar.addEventListener('mousedown', function(e) {
    isDown = true;
    offset = [
        window.offsetLeft - e.clientX,
        window.offsetTop - e.clientY
    ];
    }, true);

    document.addEventListener('mouseup', function() {
      isDown = false;
    }, true);

    document.addEventListener('mousemove', function(e) {
      e.preventDefault();
      if (isDown) {
        window.style.left = (e.clientX + offset[0]) + 'px';
        window.style.top  = (e.clientY + offset[1]) + 'px';
      }
    }, true);
  }
})
</script>

<style scoped>
#vaunch-man-container {
  position: absolute;
  top: 25vh;
  left: 25vw;
  height: 50vh;
  width: 50vw;

  display: flex;
  flex-direction: column;
}

#manual-inner {
  padding: 1rem;
  overflow-y: auto;
}

.manual-container {
  display: flex;
  flex-direction: column;
}

#man-title {
  display: flex;
  flex-direction: row;
}
#man-title-text {
  flex: 1;
}
#man-close:hover {
  cursor: pointer;
}
</style>

<template>
<div ref="window" id="vaunch-man-container" class="vaunch-window vaunch-solid-bg">
    <span ref="titlebar" id="man-title" class="folder-title greyscale-title">
      <span id="man-icon"><i class="fa-solid fa-info"></i></span>
      <span id="man-title-text">Help</span>
      <span v-on:click="closeWindow" id="man-close"><i class="fa-solid fa-circle-xmark"></i></span>
    </span>
    <div id="manual-inner">
      <div>
      </div>
      <div vi class="manual-container">
          <VaunchManualEntry v-for="command in commands" :command="command"  />
      </div>
    </div>
</div>
</template>
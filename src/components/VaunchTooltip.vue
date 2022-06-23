<script setup lang="ts">
import { onMounted } from "vue";
import { useConfigStore } from "@/stores/config";

import tippy, { followCursor } from "tippy.js/headless";
import "tippy.js/dist/tippy.css";

const props = defineProps(["tipFor","tipFile"]);

onMounted(() => {
  tippy("#" + props.tipFor, {
  content: props.tipFile,
  followCursor: true,
  plugins: [followCursor],
  arrow: false,
  placement: "right-end",
  render(instance: any) {
    // The recommended structure is to use the popper as an outer wrapper
    // element, with an inner `box` element
    const popper = document.createElement("div");
    const box = document.createElement("div");

    popper.appendChild(box);

    box.classList.add("tippy-box", "vaunch-tippy", "vaunch-window");
    box.textContent = instance.props.content.getDescription();

    const config = useConfigStore();
    function onUpdate(prevProps: any, nextProps: any) {
      // DOM diffing
      if (prevProps.content !== nextProps.content.getDescription()) {
        box.textContent = nextProps.content.getDescription();
      }
      // Color diffing
      if (
        box.style.background != config.color.windowOpaque ||
        box.style.color != config.color.text
      ) {
        box.style.background = config.color.windowOpaque;
        box.style.color = config.color.text;
      }
    }
    return {popper,onUpdate};
    },
  });
})
</script>

<style>
.vaunch-tippy {
  padding: 0.5em;
  border: solid thin rgba(100, 100, 100, 0.1);
}
@media (max-width: 768px) { 
  .vaunch-tippy {
    display: none;
  }
}
</style>

// eslint-disable-next-line vue/valid-template-root
<template></template>

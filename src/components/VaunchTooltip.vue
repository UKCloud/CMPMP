<script lang="ts">
import { defineComponent } from "vue";

import tippy, { followCursor } from "tippy.js/headless";
import "tippy.js/dist/tippy.css";
import { useConfigStore } from "@/stores/config";

export default defineComponent({
  name: "VaunchTooltip",
  props: ["tipFor", "tipFile"],
  mounted() {
    tippy("#" + this.tipFor, {
      content: this.tipFile,
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

        return {
          popper,
          onUpdate,
        };
      },
    });
  },
});
</script>

<style>
.vaunch-tippy {
  padding: 0.5em;
  border: solid thin rgba(100, 100, 100, 0.1);
  filter: contrast(1.5);
}
</style>

<template></template>

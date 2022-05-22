<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "VaunchInput",
  data() {
    return {
      vaunchInput: "",
    };
  },
  props: ["autocomplete"],
  emits: ["sendInput"],
  watch: {
    vaunchInput(val: string) {
      // Emit the current input string to Vaunch
      let splitCommand = val.split(" ");
      this.$emit("sendInput", splitCommand);
    },
  },
  methods: {
    complete() {
      this.vaunchInput = this.autocomplete;
    },
  },
});
</script>

<style scoped>
#vaunch-input-container {
  position: relative;
  width: 75vw;
  height: 5rem;
}
/* Common styles for both inputs */
#vaunch-input-container input {
  position: absolute;
  font-size: 3em;
  width: 100%;
  padding: 0.2em 0.75em;
  border-radius: 5px;
  border: none;
}

#vaunch-input-container input:focus {
  outline: none;
}

.vaunch-input {
  color: var(--color-vaunchinput-text);
  background: none;
  z-index: 2;
}

.vaunch-autocomplete {
  z-index: 1;
  position: absolute;
  opacity: 0.8;

  color: var(--color-autocomplete);
  backdrop-filter: blur(10px);
  background: var(--color-vaunchinput);
}
</style>

<template>
  <div id="vaunch-input-container">
    <input
      class="vaunch-input"
      type="text"
      v-model="vaunchInput"
      @keydown.tab.prevent="complete"
    />
    <input class="vaunch-autocomplete" type="text" :value="autocomplete" />
  </div>
</template>

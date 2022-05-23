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
  emits: ["sendInput", "command"],
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
    sendCommand() {
      this.$emit("command", this.vaunchInput)
      this.vaunchInput = "";
    }
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
  border: none;
}

#vaunch-input-container input:focus {
  outline: none;
}

#vaunch-input {
  background: none;
  z-index: 2;
  color: inherit;
}

#vaunch-autocomplete {
  z-index: 1;
  position: absolute;
  opacity: 0.8;

  color: var(--color-autocomplete);
  background: none;
}
</style>

<template>
  <div id="vaunch-input-container" class="vaunch-window">
    <input
      id="vaunch-input"
      type="text"
      v-model="vaunchInput"
      @keydown.tab.prevent="complete"
      @keydown.enter.prevent="sendCommand"
    />
    <input id="vaunch-autocomplete" type="text" :value="autocomplete" />
  </div>
</template>

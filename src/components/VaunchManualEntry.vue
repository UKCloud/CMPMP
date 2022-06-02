<script lang="ts">
import { VaunchCommand } from "@/models/VaunchCommand";
import type { VaunchManual } from "@/models/VaunchManual";
import { defineComponent } from "vue";

export default defineComponent({
  name: "VaunchMan",
  props: ["command"],
  data() {
    let manual:VaunchManual = this.$props.command.manual
    return {
      manual
    }
  }
})
</script>

<style scoped>
.manual-entry {
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: solid thin rgba(0, 0, 0, 0.25);
  border-radius: 5px;
}
.command-title {
  font-size: 1.5rem;
}
</style>

<template>
<div class="manual-entry">
  <span class="command-title">{{ command.fileName }}:</span>
  <div class="command-ailiases">
    <span v-if="command.aliases.length">Aliases: <span v-for="(ailias, index) in command.aliases">{{ ailias }}<span v-if="index != command.aliases.length - 1">, </span></span></span>
  </div>
  <div>
    {{ command.description }}
  </div>
</div>
</template>
<script lang="ts">
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
h1,h2 {
  font-weight: normal;
  text-decoration: underline;
}
h2 {
  margin-top: 0.5rem;
  border: solid thin black;
}

.parameter * {
  white-space: no-wrap;
}

.example-list {
  list-style: none;
  padding-left: 0;
  margin-left: 0;
}

.example-list li:not(:last-child) {
    margin-bottom: 1rem;
}

.description p:not(:last-child){
  padding-bottom: 0.25rem;
}
</style>

<template>
<div class="manual-entry">
  <h1 class="command-title">{{ command.fileName }}</h1>
  <div v-if="command.aliases.length" class="command-ailiases">
    Alias{{ command.aliases.length > 1 ? "es" : ""}}: <span v-for="(ailias, index) in command.aliases">{{ ailias + (index != command.aliases.length-1 ? ", ":"") }}</span>
  </div>
  <!-- Print out the description, separating indices as new paragraphs -->
  <div class="description">
    <p v-for="descriptionLine in manual.description">
      {{ descriptionLine }}
    </p>
  </div>

  <!-- If Parameters are defined, show the usage of the command -->
  <div v-if="manual.parameters.length">
    <h2>Synopsis</h2>
    <code>
      {{ command.fileName }}
    <span class="parameter" v-for="(parameter, index) in manual.parameters">
      {{ (parameter.optional ? "[":"") + parameter.name + (parameter.repeatable ? "...":"") + (parameter.optional ? "]":"") + 
      (index != manual.parameters.length-1 ? " ":"")}}
    </span>
    </code>
  </div>

  <!-- If Examples are defined, show examples for the command -->
  <div v-if="manual.examples.length">
    <h2>Examples</h2>
    <ul class="example-list">
      <li v-for="example in manual.examples">
        <code>
          {{ command.fileName }}
          <span class="parameter" v-for="(argument, index) in example.args">
            {{ argument + (index != example.args.length-1 ? " " : "")}}
          </span>
        </code>
        <div class="description">
          <p v-for="descriptionLine in example.description">
            {{ descriptionLine }}
          </p>
        </div>
      </li>
    </ul>
  </div>

</div>
</template>
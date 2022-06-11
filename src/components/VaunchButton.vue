<script setup lang="ts">
const props = defineProps(["text","icon"])
</script>

<style scoped>
.vaunch-button {
  min-width: 7rem;
  max-width: 15rem;
  padding: 0.25rem;
  margin: 0.5rem;
  text-align: center;
  color: inherit;
  background: rgba(150, 150, 150, 0.25);
  transition: background-color 0.25s;
  border: solid thin rgba(100, 100, 100, 0.25);
  border-radius: 5px;
}
.vaunch-button-text {
  font-size: 1rem;
}
.vaunch-button-icon {
  padding-right: 0.5rem;
}

.vaunch-button:hover {
  background: rgba(100, 100, 100, 0.5);
  cursor: pointer;
}

</style>

<template>
<div class="vaunch-button">
  <i v-if="props.icon" :class="['vaunch-button-icon', 'fa-solid', 'fa-'+props.icon]"></i>
  <span class="vaunch-button-text">{{ props.text }}</span>
</div>
</template>
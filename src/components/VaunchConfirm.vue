<script setup lang="ts">
import VaunchWindow from './VaunchWindow.vue';
import VaunchButton from './VaunchButton.vue';

const props = defineProps(["askText","askLines","title","icon"])

const emit = defineEmits(["closeWindow", "answerYes", "answerNo"])

</script>

<style scoped>
.confirm-text {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1;
}

.confirm-container {
  display: flex;
  height: 100%;
  flex-direction: column;
}

.confirm-buttons {
  display: flex;
  justify-content: center;
  border-top: solid thin rgba(0, 0, 0, 0.25);
  flex: 0;
}
</style>

<template>
  <VaunchWindow :small="true" :title="title" :icon="icon" v-on:close-window="emit('closeWindow')">
    <div class="confirm-container">
      <div v-if="props.askText" class="confirm-text">
        {{ askText }}
      </div>
      <div v-if="props.askLines" class="confirm-text">
        <span v-for="line in props.askLines">{{ line }}</span>
      </div>
      <div class="confirm-buttons">
        <div>
          <VaunchButton icon="check" text="Yes" @click="emit('answerYes')" />
        </div>
        <div>
          <VaunchButton icon="close" text="No" @click="emit('answerNo')" />
        </div>
      </div>
    </div>
  </VaunchWindow>

</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props = defineProps({
  "title": {
    type: String
  },
  "icon": {
    type: String
  },
  "iconClass": {
    type: String
  },
  "small": {
    type: Boolean
  },
  "canClose": {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['closeWindow'])

const vaunchWindow = ref();
onMounted(() => {
  vaunchWindow.value.focus()
})

const closeWindow = () => {
  if (props.canClose) emit('closeWindow');
}

</script>

<style scoped>
.popup-window {
  position: fixed;
  top: 25vh;
  left: 25vw;
  height: 50vh;
  width: 50vw;

  display: flex;
  flex-direction: column;
}

.popup-window:focus {
  outline: none;
}

.window-inner {
  display: flex;
  flex-direction: column;;
  overflow-y: auto;
  height: 100%;
}

.window-title {
  display: flex;
  flex-direction: row;
}
.window-title-text {
  flex: 1;
}
.window-close:hover {
  cursor: pointer;
}

.popup-window-small {
  top: 40vh;
  left: 35vw;
  height: 20vh;
  width: 25vw;
}

</style>

<template>
<div :class="{'popup-window':true, 'vaunch-window':true, 'vaunch-solid-bg':true, 'popup-window-small':props.small}"
  ref="vaunchWindow"
  v-click-away="closeWindow"
  tabindex="0"
  @keydown.esc="closeWindow">
  <span ref="titlebar" class="window-title folder-title greyscale-title">
    <span v-if="props.icon"><i :class="['fa-'+ (props.iconClass ? props.iconClass : 'solid'), 'fa-'+props.icon]"></i></span>
    <span class="window-title-text">{{ props.title }}</span>
    <span v-if="props.canClose" v-on:click="closeWindow" class="window-close">
    <i class="fa-solid fa-close"></i>
    </span>
  </span>

  <div class="window-inner">
    <slot></slot>
  </div>

</div>
</template>

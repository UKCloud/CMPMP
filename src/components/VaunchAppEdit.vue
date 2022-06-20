<script setup lang="ts">
import VaunchWindow from "./VaunchWindow.vue";
import VaunchButton from "./VaunchButton.vue";
import { ref } from "vue";
import { defaultconfig, useConfigStore } from "@/stores/config";
import { VaunchSetIcon } from "@/models/commands/fs/VaunchSetIcon";
import { type VaunchResponse, ResponseType } from "@/models/VaunchResponse";
import { handleResponse } from "@/utilities/response";

const emit = defineEmits(['closeEdit'])
const config = useConfigStore();

const showGui = ref();
const titleCase = ref();
const showCommands = ref();
const fuzzy = ref();

const defaultFile = ref();
const windowColor = ref();
const textColor = ref();
const highlightColor = ref();

const currentColours = {
  window: config.color.window == defaultconfig.color.window ? 'default' : rgbaToHex(config.color.window),
  text: config.color.text == defaultconfig.color.text ? 'default' : config.color.text,
  highlight: config.color.highlight == defaultconfig.color.highlight ? 'default' : config.color.highlight
}

function rgbaToHex(color:string):string {
  let rgbaMatch = color.match(/rgba\((\d+),\s+(\d+),\s+(\d+),\s+\d+\.\d+\)/)
  console.log(rgbaMatch);
  if (rgbaMatch) {
    let r = parseInt(rgbaMatch[1]).toString(16).padStart(2,'0');
    let g = parseInt(rgbaMatch[2]).toString(16).padStart(2,'0');
    let b = parseInt(rgbaMatch[3]).toString(16).padStart(2,'0');
    return `#${r}${g}${b}`;
  }
  return "default";
}

const closeWindow = () => {
  emit('closeEdit');
}

const saveApp = () => {
  console.log("saving...");
}
</script>

<style scoped>
#edit-container {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
}

.edit-buttons {
  display: flex;
  justify-content: center;
  border-top: solid thin rgba(0, 0, 0, 0.25);
  padding: 0.5rem 0;
}

.edit-buttons div {
  margin: 0 0.5rem;
}

.edit-attributes {
  overflow: auto;
  width: 100%;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
}

#edit-form {
  display: flex;
  flex-direction: row;
}

.edit-segment {
  padding: 0.5rem;
  margin: 0.5rem;
  border: solid thin rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  flex: 1;
}

.edit-attr {
  width: 50%;
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
  width: 100%;
  justify-content: left;
}

.edit-input-container {
  display: flex;
  justify-content: left;
  align-items: center;
}

.edit-label {
  padding-right: 0.5em;
}

.edit-input {
  border: none;
  background: none;
  font-size: 1rem;
  flex-grow: 0;
  width: 30%;
  border-bottom: solid thin v-bind("config.color.text") !important;
  color: v-bind("config.color.text");
}

.edit-input:focus {
  outline: none;
}

.edit-checkbox:checked {
  background-color: v-bind("config.color.highlight");
}

input[type="checkbox"] {
  -webkit-appearance: none;
  appearance: none;
  width: 1.15em;
  height: 1.15em;
  border: solid thin rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  display: grid;
  place-content: center;
  background-color: v-bind("config.color.text");
}

input[type="checkbox"]::before {
  content: "";
  width: 0.65em;
  height: 0.65em;
  clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  visibility: hidden;
  background-color: v-bind("config.color.text");
}

input[type="checkbox"]:checked {
  background-color: v-bind("config.color.highlight");
}

input[type="checkbox"]:checked::before {
  visibility: visible;
}
</style>

<template>
  <VaunchWindow title="Vaunch Settings" :icon="'pencil'" v-on:close-window="closeWindow">
    <div id="edit-container">
      <form id="edit-form" @submit.prevent="saveApp">
        <div class="edit-attributes">

          <div class="edit-segment">
            <h2>Vaunch UI Properties</h2>

            <div class="edit-attr">
              <span>Show/Hide the GUI, this includes folders and the command window</span>
              <div class="edit-input-container">
                <label class="edit-label" for="gui-checkbox">Show GUI: </label>
                <input autocomplete="off" ref="showGui" type="checkbox" :checked="config.showGUI" id="gui-checkbox"
                  value="true" />
              </div>
            </div>

            <div class="edit-attr">
              <span>Enable/Disable Title Case. This will set if file/folder names are
                converted to title case, replacing '-' and '_' with spaces</span>
              <div class="edit-input-container">
                <label class="edit-label" for="titlecase-checkbox">Enable Title Case: </label>
                <input autocomplete="off" ref="titleCase" type="checkbox" :checked="config.titleCase"
                  id="titlecase-checkbox" value="true" />
              </div>
            </div>

            <div class="edit-attr">
              <span>Toggle Commands Folder Visibility. Toggles if the 'Commands' folder is visible
                on the left-hand side, commands can also be executed from this window.
                If the GUI is hidden, the commands window will also be hidden</span>
              <div class="edit-input-container">
                <label class="edit-label" for="showcommands-checkbox">Show Commands Window: </label>
                <input autocomplete="off" ref="showCommands" type="checkbox" :checked="config.showCommands"
                  id="showcommands-checkbox" value="true" />
              </div>
            </div>

            <div class="edit-attr">
              <span>Enable/Disable Fuzzy Search. If enabled, typing in the command box will show files
                that match the current input to quickly execute a matching file</span>
              <div class="edit-input-container">
                <label class="edit-label" for="fuzzy-checkbox">Enable Fuzzy Search: </label>
                <input autocomplete="off" ref="fuzzy" type="checkbox" :checked="config.fuzzy" id="fuzzy-checkbox"
                  value="true" />
              </div>
            </div>

          </div>

          <div class="edit-segment">
            <h2>Vaunch Config Properties</h2>

            <div class="edit-attr">
              <span>Set the default search file. Can either be the prefix for the file, or its filepath</span>
              <div class="edit-input-container">
                <label class="edit-label" for="search-input">Default Search File: </label>
                <input autocomplete="off" ref="defaultFile" type="text" 
                :value="config.defaultFile" class="edit-input" id="search-input"/>
              </div>
            </div>

            <h3>Vaunch Colour Properties</h3>
            <div class="edit-attr">
              <span>Set the window colour, this also impacts the colour of files, and folder/window titles.
                Colours can be css colour names, rg
              </span>
              <div class="edit-input-container">
                <label class="edit-label" for="search-input">Window Color: </label>
                <input autocomplete="off" ref="defaultFile" type="text" 
                :value="currentColours.window" class="edit-input" id="search-input"/>
              </div>
            </div>
          </div>

          <input style="display:none" type="submit" />
        </div>
      </form>
    </div>
    <div class="edit-buttons">
      <div>
        <VaunchButton icon="save" text="Save" @click="saveApp" />
      </div>
      <div>
        <VaunchButton icon="close" text="Close" @click="closeWindow" />
      </div>
    </div>
  </VaunchWindow>
</template>
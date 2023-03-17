import { defineStore } from 'pinia'
import * as monaco from "monaco-editor";
import { useDark, useToggle } from "@vueuse/core";
const isDark = useDark();
const toggleDark = useToggle(isDark);
monaco.editor.setTheme(isDark.value ? 'vs-dark' : 'vs');


export const useSettingsStore = defineStore("settings", {
  state: () => {
    return {
        showAside: true,
        isDark: isDark
    };
  },
  actions: {
    toggleDark(){
      toggleDark();
      monaco.editor.setTheme(this.isDark ? 'vs-dark' : 'vs');
    }
  }
});
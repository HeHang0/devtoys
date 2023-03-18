import { defineStore } from 'pinia'
import * as monaco from "monaco-editor";
import { useDark, useToggle } from "@vueuse/core";
import { storage, StorageKey } from '@/utils/storage';
const isDark = useDark();
const toggleDark = useToggle(isDark);
monaco.editor.setTheme(isDark.value ? 'vs-dark' : 'vs');


export const useSettingsStore = defineStore("settings", {
  state: () => {
    return {
        showAside: Boolean(storage.getValue(StorageKey.ShowAside, true)),
        isDark: isDark
    };
  },
  actions: {
    toggleDark(){
      toggleDark();
      monaco.editor.setTheme(this.isDark ? 'vs-dark' : 'vs');
    },
    setAsideShow(show: boolean) {
      this.showAside = show;
      storage.setValue(StorageKey.ShowAside, show)
    }
  }
});
import { defineStore } from 'pinia'
import * as monaco from "monaco-editor";
import { storage, StorageKey } from '@/utils/storage';
import type { RouteLocationRaw } from 'vue-router';
import { setFontFamily } from '@/utils/utils';
export enum AppTheme {
  Auto = "auto",
  Dark = "dark",
  Light = "light"
}
let appTheme = storage.getValue(StorageKey.AppTheme, AppTheme.Auto)
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
const handleThemeChange = (event: MediaQueryListEvent|boolean) => {
  if(appTheme !== AppTheme.Auto && typeof event !== 'boolean') return;
  const isDark = typeof event === 'boolean' ? event : event.matches
  const html = document.querySelector("html")
  if(html) html.className = isDark ? 'dark' : ''
  monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs');
};

// 监听主题变化事件
darkModeMediaQuery.addEventListener('change', handleThemeChange);
const isDark = () => appTheme === AppTheme.Auto ? darkModeMediaQuery.matches : appTheme === AppTheme.Dark
handleThemeChange(isDark())

const fontFamily: string[] = storage.getValue(StorageKey.FontFamily, ["Courier", "cursive"])

export const useSettingsStore = defineStore("settings", {
  state: () => {
    return {
      showAside: Boolean(storage.getValue(StorageKey.ShowAside, true)),
      rememberRouter: Boolean(storage.getValue(StorageKey.RememberRouter, true)),
      lastRouter: storage.getValue(StorageKey.LastRouter, ''),
      appTheme: appTheme,
      fontFamily: setFontFamily(fontFamily)
    };
  },
  actions: {
    setAsideShow(show: boolean) {
      this.showAside = show;
      storage.setValue(StorageKey.ShowAside, show)
    },
    setRouterRemember(remember: boolean) {
      this.rememberRouter = remember;
      storage.setValue(StorageKey.RememberRouter, remember)
    },
    setLastRouter(routerPath: RouteLocationRaw) {
      if (!routerPath || routerPath == "/") storage.removeKey(StorageKey.LastRouter)
      else storage.setValue(StorageKey.LastRouter, routerPath)
    },
    appThemeChange(theme: AppTheme) {
      this.appTheme = theme
      appTheme = theme
      handleThemeChange(isDark())
      storage.setValue(StorageKey.AppTheme, theme)
    },
    setFontFamily(font: string[]) {
      this.fontFamily = setFontFamily(font)
      storage.setValue(StorageKey.FontFamily, this.fontFamily)
      return this.fontFamily
    }
  }
});
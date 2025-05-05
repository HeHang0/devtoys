import { defineStore } from 'pinia';
import { storage, StorageKey } from '@/utils/storage';
import type { RouteLocationRaw } from 'vue-router';
import { setFontFamily } from '@/utils/utils';
import { allMenus } from './menu';

export enum AppTheme {
  Auto = 'auto',
  Dark = 'dark',
  Light = 'light'
}

export enum EditorType {
  Default = 'Default',
  MonacoEditor = 'Monaco Editor',
  PicaPicoEditor = 'PicaPico Editor'
}

let appTheme = storage.getValue(StorageKey.AppTheme, AppTheme.Auto);
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
const handleThemeChange = (event: MediaQueryListEvent | boolean) => {
  if (appTheme !== AppTheme.Auto && typeof event !== 'boolean') return;
  const isDark = typeof event === 'boolean' ? event : event.matches;
  const html = document.querySelector('html');
  if (html) html.className = isDark ? 'dark' : 'light';
  const monaco = (window as any).monaco;
  monaco && monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs');
};

// 监听主题变化事件
darkModeMediaQuery.addEventListener('change', handleThemeChange);
const isDark = () =>
  appTheme === AppTheme.Auto
    ? darkModeMediaQuery.matches
    : appTheme === AppTheme.Dark;
handleThemeChange(isDark());

const fontFamily: string[] = storage.getValue(StorageKey.FontFamily, [
  'Courier',
  'cursive'
]);

const handleFavorites = (routers: string[]) =>
  Array.isArray(routers) ? allMenus.filter(m => routers.includes(m.key)) : [];

function getDefaultMapType(): 'google' | 'amap' | 'maptiler' {
  const mapType = storage.getValue(StorageKey.MapType, '');
  return mapType || (navigator.language.includes('zh') ? 'amap' : 'maptiler');
}

export const useSettingsStore = defineStore('settings', {
  state: () => {
    return {
      showAside: navigator.userAgent.toLowerCase().includes('mobile')
        ? false
        : Boolean(storage.getValue(StorageKey.ShowAside, true)),
      rememberRouter: Boolean(
        storage.getValue(StorageKey.RememberRouter, true)
      ),
      mobile: navigator.userAgent.toLowerCase().includes('mobile'),
      appTheme: appTheme,
      fontFamily: setFontFamily(fontFamily),
      favoriteRouters: handleFavorites(
        storage.getValue<string[]>(StorageKey.FavoriteRouters, [])
      ),
      editorType: storage.getValue(
        StorageKey.EditorType,
        EditorType.MonacoEditor
      ),
      editorWrap: storage.getValue(StorageKey.EditorWrap, true),
      imageProxy: storage.getValue(StorageKey.ImageProxy, ''),
      mapType: getDefaultMapType(),
      mapKeyGoogle: storage.getValue(StorageKey.MapKeyGoogle, ''),
      mapKeyAmap: storage.getValue(StorageKey.MapKeyAmap, ''),
      mapKeyAmapSecret: storage.getValue(StorageKey.MapKeyAmapSecret, ''),
      mapKeyMaptiler: storage.getValue(StorageKey.MapKeyMaptiler, '')
    };
  },
  actions: {
    isDark() {
      return isDark();
    },
    setAsideShow(show: boolean) {
      this.showAside = show;
      storage.setValue(StorageKey.ShowAside, show);
    },
    setRouterRemember(remember: boolean) {
      this.rememberRouter = remember;
      storage.setValue(StorageKey.RememberRouter, remember);
    },
    appThemeChange(theme: AppTheme) {
      this.appTheme = theme;
      appTheme = theme;
      handleThemeChange(isDark());
      storage.setValue(StorageKey.AppTheme, theme);
    },
    setFontFamily(font: string[]) {
      this.fontFamily = setFontFamily(font);
      storage.setValue(StorageKey.FontFamily, this.fontFamily);
      return this.fontFamily;
    },
    addFavoriteRouter(routePath: string) {
      const i = this.favoriteRouters.findIndex(m => m.key == routePath);
      if (i >= 0) return;
      const menu = allMenus.find(m => m.key == routePath);
      if (!menu) return;
      this.favoriteRouters.push(menu);
      storage.setValue(
        StorageKey.FavoriteRouters,
        this.favoriteRouters.map(m => m.key)
      );
    },
    removeFavoriteRouter(routePath: string) {
      const i = this.favoriteRouters.findIndex(m => m.key == routePath);
      if (i >= 0) {
        this.favoriteRouters.splice(i, 1);
        storage.setValue(
          StorageKey.FavoriteRouters,
          this.favoriteRouters.map(m => m.key)
        );
      }
    },
    editorTypeChange() {
      storage.setValue(StorageKey.EditorType, this.editorType);
    },
    editorWrapChange() {
      storage.setValue(StorageKey.EditorWrap, this.editorWrap);
    },
    mapKeyChange() {
      storage.setValue(StorageKey.MapType, this.mapType);
    },
    mapKeyGoogleChange() {
      storage.setValue(StorageKey.MapKeyGoogle, this.mapKeyGoogle);
    },
    mapKeyAmapChange() {
      storage.setValue(StorageKey.MapKeyAmap, this.mapKeyAmap);
    },
    mapKeyAmapSecretChange() {
      storage.setValue(StorageKey.MapKeyAmapSecret, this.mapKeyAmapSecret);
    },
    mapKeyMaptilerChange() {
      storage.setValue(StorageKey.MapKeyMaptiler, this.mapKeyMaptiler);
    },
    setImageProxy(proxy: string) {
      if (proxy) {
        storage.setValue(StorageKey.ImageProxy, proxy);
      } else {
        storage.removeKey(StorageKey.ImageProxy);
      }
    }
  },
  getters: {
    favExists: state => (key: string) => {
      return state.favoriteRouters.findIndex(m => m.key == key) >= 0;
    }
  }
});

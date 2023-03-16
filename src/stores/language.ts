import { defineStore } from 'pinia'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import enUs from 'element-plus/dist/locale/en.mjs'
export enum Language {
    ZhCN = 'zh',
    EnUS = 'en'
}

export const useLanguageStore = defineStore("language", {
  state: () => {
    return {
        locale: zhCn
    };
  },
  actions: {
    changeLanguage(language: Language) {
        switch (language) {
            case Language.EnUS:
                this.locale = enUs;
                break;
        
            default:
                this.locale = zhCn;
                break;
        }
    }
  }
});
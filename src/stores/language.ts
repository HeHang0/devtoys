import { defineStore } from 'pinia';
import { storage, StorageKey } from '@/utils/storage';
import moment from 'moment';
import 'moment/dist/locale/zh-cn';
import elementZhCn from 'element-plus/dist/locale/zh-cn.mjs';
import elementEn from 'element-plus/dist/locale/en.mjs';
import elementJA from 'element-plus/dist/locale/ja.mjs';
import { language as zhCn } from './locale/zh-cn';
import { language as en } from './locale/en';
import { language as ja } from './locale/ja';

export enum Language {
  Auto = 'auto',
  ZhCN = 'zh-cn',
  EnUS = 'en',
  JA = 'ja'
}
const localLanguageMap: Record<string, Record<string, string>> = {
  'zh-cn': zhCn,
  en: en,
  ja: ja
};
let locale = storage.getValue<Language>(StorageKey.Language, Language.Auto);
function handleLanguageChange(event: Event | Language) {
  if (typeof event !== 'string' && locale !== Language.Auto) return;
  var browserLanguage: string = (
    navigator.language || (navigator as any).userLanguage
  ).toLocaleLowerCase();
  let language = typeof event === 'string' ? event : browserLanguage;
  if (language === Language.Auto) language = browserLanguage;
  if (language.includes('zh')) language = Language.ZhCN;
  else if (language.includes('en')) language = Language.EnUS;
  else if (language.includes('ja')) language = Language.JA;
  switch (language) {
    case Language.EnUS:
      moment.locale('en');
      break;
    case Language.JA:
      moment.locale('ja');
      break;
    default:
      moment.locale('zh-cn');
      break;
  }
  return language;
}
function getElementLocale(language: string | undefined) {
  switch (language) {
    case Language.EnUS:
      return elementEn;
    case Language.JA:
      return elementJA;

    default:
      return elementZhCn;
  }
}
window.addEventListener('languagechange', handleLanguageChange);
let localLanguage = handleLanguageChange(locale);

export const useLanguageStore = defineStore('language', {
  state: () => {
    return {
      elementLocale: getElementLocale(localLanguage),
      locale: locale
    };
  },
  actions: {
    changeLanguage(language: Language) {
      storage.setValue(StorageKey.Language, language);
      this.locale = language;
      locale = language;
      localLanguage = handleLanguageChange(locale);
      this.elementLocale = getElementLocale(localLanguage);
    }
  },
  getters: {
    t: state => (key: string) => {
      if (!key) return '';
      let locale = state.locale == Language.Auto ? localLanguage : state.locale;
      if (!locale) locale = Language.EnUS;
      if (localLanguageMap[locale] && localLanguageMap[locale][key]) {
        return localLanguageMap[locale][key];
      }
      return key;
    }
  }
});

import { defineStore } from "pinia"
import { storage, StorageKey } from "@/utils/storage"
import moment from 'moment'
import 'moment/dist/locale/zh-cn'
import elementZhCn from "element-plus/dist/locale/zh-cn.mjs"
import elementEn from "element-plus/dist/locale/en.mjs"
import { language as zhCn } from "./locale/zh-cn"
import { language as en } from "./locale/en"

export enum Language {
    Auto = "auto",
    ZhCN = "zh-cn",
    EnUS = "en",
}
let locale = storage.getValue<Language>(StorageKey.Language, Language.Auto);
const handleLanguageChange = (event: Event | Language) => {
    if(typeof event !== 'string' && locale !== Language.Auto) return;
    var browserLanguage: string = (navigator.language || (navigator as any).userLanguage).toLocaleLowerCase();
    let language = typeof event === 'string' ? event : browserLanguage;
    if(language === Language.Auto) language = browserLanguage;
    if(language.includes("zh")) language = Language.ZhCN
    else if(language.includes("en")) language = Language.EnUS
    moment.locale(language == Language.ZhCN ? 'zh-cn' : 'en');
    return language
}
window.addEventListener('languagechange', handleLanguageChange);
let localLanguage = handleLanguageChange(locale)

export const useLanguageStore = defineStore("language", {
    state: () => {
        return {
            elementLocale: localLanguage == Language.ZhCN ? elementZhCn : elementEn,
            locale: locale
        }
    },
    actions: {
        changeLanguage(language: Language) {
            storage.setValue(StorageKey.Language, language);
            this.locale = language
            locale = language;
            localLanguage = handleLanguageChange(locale)
            this.elementLocale = localLanguage == Language.ZhCN ? elementZhCn : elementEn
        },
    },
    getters: {
        t: state => (key: string) => {
            if (!key) return ""
            if ((state.locale == Language.Auto ? localLanguage : state.locale) == Language.ZhCN && zhCn[key]) {
                return zhCn[key]
            }
            if (en[key]) return en[key]
            return key
        },
    },
})

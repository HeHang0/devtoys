import { defineStore } from "pinia"
import elementZhCn from "element-plus/dist/locale/zh-cn.mjs"
import elementEn from "element-plus/dist/locale/en.mjs"
import { language as zhCn } from "./locale/zh-cn"
import { language as en } from "./locale/en"
import moment from 'moment'
import 'moment/dist/locale/zh-cn'
moment.locale('zh-cn')
export enum Language {
    ZhCN = "zh",
    EnUS = "en",
}

export const useLanguageStore = defineStore("language", {
    state: () => {
        return {
            elementLocale: elementZhCn,
            locale: Language.ZhCN,
        }
    },
    actions: {
        changeLanguage(language: Language) {
            switch (language) {
                case Language.EnUS:
                    this.elementLocale = elementZhCn
                    this.locale = Language.EnUS
                    moment.locale('en')
                    break

                default:
                    this.elementLocale = elementEn
                    this.locale = Language.ZhCN
                    moment.locale('zh-cn')
                    break
            }
        },
    },
    getters: {
        t: state => (key: string) => {
            if (!key) return ""
            if (state.locale == Language.ZhCN && zhCn[key]) {
                return zhCn[key]
            }
            if (en[key]) return en[key]
            return key
        },
    },
})

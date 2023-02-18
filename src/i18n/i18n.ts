/*
 * @Date: 2021-08-11 20:02:37
 * @LastEditTime: 2022-07-07 21:58:04
 * @LastEditors: Cheryl.Hua
 */
// src/i18n.js
import { getDefalutLanguage } from '@/utils/helper'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en_US from './locales/en_US'
import zh_CN from './locales/zh_CN'

const resources = {
  en_US: {
    translation: en_US,
  },
  zh_CN: {
    translation: zh_CN,
  },
}

// console.log('当前语言', getLanguage())
const defaultLanguage = getDefalutLanguage()

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: defaultLanguage, //如果當前切換的語言沒有對應的翻譯則使用這個語言，
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

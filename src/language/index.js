import Vue from 'vue'
import VueI18n from 'vue-i18n'
import cn from './cn.js'
import en from './en.js'
import {getLocale, setLocale} from "../utils/localStorage";

Vue.use(VueI18n);

let locale = getLocale();
if (!locale) {
  locale = 'en';
  setLocale(locale)
}

const messages = {
  en,
  cn
}

const i18n = {
  locale,
  messages
}

export default i18n;

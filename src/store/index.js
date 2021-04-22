import Vue from 'vue'
import Vuex from 'vuex'
import {book} from './modules/book.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    "book": book
  },
  getters: {
    getBookTest: state => {
      return state.book.test;
    }
  }
})

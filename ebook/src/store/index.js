import Vue from 'vue'
import Vuex from 'vuex'
import book from './modules/book.js'
import getters from './getters';
import actions from './actions';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  modules: {
    book
  },
  getters,
  actions
})

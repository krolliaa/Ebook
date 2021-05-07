import Vue from 'vue'
import lazyLoad from 'vue-lazyload'

Vue.use(lazyLoad, {
  error: require('../assets/images/loadingg2.jpg'),
  loading: require('../assets/images/loadingg2.jpg')
})

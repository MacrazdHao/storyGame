import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

const test = {
  test1: `${a}-${this.b.c}`,
  a: 11111,
  b: {
    c: 22222
  }
}
console.log(test)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

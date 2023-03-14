import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import GhDialog from './components/install/Dialog'
import GhAlert from './components/install/Alert'
import GhLoading from './components/install/Loading'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(GhDialog)
Vue.use(GhAlert)
Vue.use(GhLoading)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

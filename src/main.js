import Vue from 'vue'
import App from './App.vue'
import createRouter from './router'
import createStore from './store'
import { sync } from 'vuex-router-sync'
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
export default function createApp() {
  const router = createRouter()
  const store = createStore()
  sync(store, router)

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return { app, router, store }
}

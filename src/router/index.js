import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Sceen from '../views/Sceen.vue'
import Maker from '../views/Maker.vue'
import VoiceGame from '../views/VoiceGame.vue'
import Sudoku from '../views/Sudoku.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/sceen',
    name: 'Sceen',
    component: Sceen
  },
  {
    path: '/maker',
    name: 'Maker',
    component: Maker
  },
  {
    path: '/voiceGame',
    name: 'VoiceGame',
    component: VoiceGame
  },
  {
    path: '/sudoku',
    name: 'Sudoku',
    component: Sudoku
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../components/Login.vue'
import Home from '../components/Home.vue'
import Pet from '../components/Pet.vue'
import Tutor from '../components/Tutor.vue'
import Agendamento from '../components/Agendamento.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/tutor',
    name: 'tutor',
    component: Tutor
  },
  {
    path: '/pet',
    name: 'pet',
    component: Pet
  },
  {
    path: '/agendamento',
    name: 'agendamento',
    component: Agendamento
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
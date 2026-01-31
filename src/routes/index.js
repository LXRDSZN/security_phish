import { createRouter, createWebHistory } from 'vue-router'
import LoginViews from '@/views/Login/LoginViews.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LoginViews
    },
    {
      path: '/Dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard/DashboardViews.vue') 
    },
    {
      path:'/Registrate',
      name:'Registrate',
      component: () => import('@/views/Registro/RegistroView.vue')
    },
    {
      path:'/Materias',
      name:'Materias',
      component : () => import ('@/views/Materias/MateriasView.vue')
    },
  ]
})

export default router

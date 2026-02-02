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
      path:'/Sign_up',
      name:'Sign_up',
      component: () => import('@/views/Registro/RegistroView.vue')
    },
    {
      path: '/Radar',
      name: 'Radar',
      component: ()=> import('@/views/Radar/RadarViews.vue')
    },
    {
      path: '/Embarcaciones',
      name: 'Embarcaciones',
      component: ()=> import('@/views/Embarcaciones/EmbarcacionesViews.vue')
    },
    {
      path: '/Zonas_protegidas',
      name: 'Zonas_protegidas',
      component: ()=> import('@/views/Zonas_Protegidas/ZonasRestringidasViews.vue')
    },
    {
      path: '/Alertas',
      name: 'Alertas',
      component: ()=> import('@/views/Alertas/AlertasViews.vue')
    },
    {
      path: '/Estadisticas',
      name: 'Estadisticas',
      component: ()=> import('@/views/Estadisticas/EstadisticasViews.vue')
    },
    {
      path: '/Reportes',
      name: 'Reportes',
      component: ()=> import('@/views/Reportes/ReportesViews.vue')
    },
    {
      path: '/Configuracion',
      name: 'Configuracion',
      component: ()=> import('@/views/Configuracion/ConfiguracionViews.vue')
    },
  ]
})

export default router

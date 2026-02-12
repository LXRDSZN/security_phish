import { createRouter, createWebHistory } from 'vue-router'
import LoginViews from '@/views/Login/LoginViews.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LoginViews,
      meta: { layout: 'auth' }
    },
    {
      path:'/Sign_up',
      name:'Sign_up',
      component: () => import('@/views/Registro/RegistroView.vue'),
      meta: { layout: 'auth' }
    },
    {
      path: '/Dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard/DashboardViews.vue'),
      meta: { layout: 'dashboard' }
    },
    {
      path: '/Radar',
      name: 'Radar',
      component: ()=> import('@/views/Radar/RadarViews.vue'),
      meta: { layout: 'dashboard' }
    },
    {
      path: '/Embarcaciones',
      name: 'Embarcaciones',
      component: ()=> import('@/views/Embarcaciones/EmbarcacionesViews.vue'),
      meta: { layout: 'dashboard' }
    },
    {
      path: '/Zonas_protegidas',
      name: 'Zonas_protegidas',
      component: ()=> import('@/views/Zonas_Protegidas/ZonasRestringidasViews.vue'),
      meta: { layout: 'dashboard' }
    },
    {
      path: '/Alertas',
      name: 'Alertas',
      component: ()=> import('@/views/Alertas/AlertasViews.vue'),
      meta: { layout: 'dashboard' }
    },
    {
      path: '/Estadisticas',
      name: 'Estadisticas',
      component: ()=> import('@/views/Estadisticas/EstadisticasViews.vue'),
      meta: { layout: 'dashboard' }
    },
    {
      path: '/Reportes',
      name: 'Reportes',
      component: ()=> import('@/views/Reportes/ReportesViews.vue'),
      meta: { layout: 'dashboard' }
    },
    {
      path: '/Configuracion',
      name: 'Configuracion',
      component: ()=> import('@/views/Configuracion/ConfiguracionViews.vue'),
      meta: { layout: 'dashboard' }
    },
  ]
})

export default router

//Importaciones del Sistema
import { createRouter, createWebHistory } from 'vue-router'
// import UserAPI from '@/api/UserAPI';

//Importaciones del los Layouts
import DefaultAdminLayout from '@/layouts/DefaultAdminLayout.vue'
import DefaultDriverLayout from '@/layouts/DefaultDriverLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'active',
  routes: [
    // Rutas Protegidas
    {
      path: '/',
      name: 'general',
      component: DefaultDriverLayout,
      redirect: '/',
      meta: {requiresAuth: true},
      children: [
        {
          path: '/',
          name: 'dashboard',
          component: () => import('../views/DashboardDriverView.vue'),
        },
      ]
    },
    {
      path: '/admin',
      name: 'general-admin',
      component: DefaultAdminLayout,
      redirect: '/admin/dashboard',
      meta: {requiresAuth: true},
      children: [
        {
          path: 'dashboard',
          name: 'dashboard-admin',
          component: () => import('../views/DashboardAdminView.vue'),
        },
      ]
    },

    // Rutas no protegidas
    {
      path: '/auth',
      name: 'auth',
      component: AuthLayout,
      redirect: '/auth/login',
      children: [
        {
          path: '/auth/login',
          name: 'login',
          component: () => import('../auth/views/LoginView.vue'),
        },
        {
          path: '/auth/register',
          name: 'register',
          component: () => import('../auth/views/RegisterView.vue'),
        },
      
      ]
    },
    {path: '/:pathMatch(.*)*', component: () => import('../views/NoFoundView.vue')},
  ]

})

// router.beforeEach(async (to, from, next) => { // En cada cambio de paginas que requieren autencicaion , checara el user sino, lo manda al login

//   const requiresAuth = to.matched.some(url => url.meta.requiresAuth);

//   if(requiresAuth) { 

//     try {

//       const {data} = await UserAPI.auth();
//       next();

//      // console.log(data);
      
//     } catch (error) {

//       next({name: 'login'});

//       console.log(error.response.data.msg);
      
//     }

//   } else {
//     next();
//   }

// })

export default router

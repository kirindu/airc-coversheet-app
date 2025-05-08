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
      redirect: '/auth/login',
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


router.beforeEach((to, from, next) => {
  const userRaw = localStorage.getItem('USER');
  const requiresAuth = to.matched.some(route => route.meta.requiresAuth);

  if (requiresAuth && !userRaw) {
    return next({ name: 'login' });
  }

  if (userRaw) {
    let user;
    try {
      user = JSON.parse(userRaw);
    } catch (e) {
      localStorage.removeItem('USER');
      return next({ name: 'login' });
    }

    let role =''

    if(user.data.rol) {
      role = user.data.rol;
    } else {
      role = user.data.user.rol;
    }

    // Redirección inteligente si accede al root o rutas incorrectas
    if (to.name === 'general' || to.path === '/') {
      if (role === 'Admin' && to.name !== 'dashboard-admin') {
        return next({ name: 'dashboard-admin' });
      } else if (role === 'Driver' && to.name !== 'dashboard') {
        return next({ name: 'dashboard' });
      }
    }
  }

  return next();
});




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

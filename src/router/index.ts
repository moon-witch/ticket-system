import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/LandingView.vue'
import NotFound from '@/views/404.vue'
import {supabase} from "@/../supabase";
import {useAccountStore} from "@/stores/accounts";
import {getNameFromId} from "@/helpers/getName";
import {ref} from "vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/landing',
      name: 'landing',
      component: Landing
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: () => import('../views/TicketListView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/tickets/:id',
      name: 'ticket',
      component: () => import('../views/TicketView.vue')
    },
    {
      path: '/customer/tickets',
      name: 'customerTickets',
      component: () => import('../views/customer/CustomerTicketListView.vue')
    },
    {
      path: '/customer/tickets/:id',
      name: 'customerTicket',
      component: () => import('../views/customer/CustomerTicketView.vue')
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  ]
})

const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

router.beforeEach(async (to, from) => {

  if (!localStorage.getItem('loggedIn') && (to.name === 'login' || to.name === 'register')) {
    return;
  }
  if(!await getUser()){
    localStorage.removeItem('loggedIn')
    return { name: 'login' }
  }
  if (await getUser()) {
    const timesWaited = ref(0)
    const waitForRole = () => new Promise(resolve => {
      const checkRole = () => {
        const role = useAccountStore().currentUserRole
            ? getNameFromId(useAccountStore().userRoles, useAccountStore().currentUserRole!.role_id, 'role_id')
            : null;
        if (role !== null) {
          resolve(role);
        } else {
          if (timesWaited.value < 2) {
            timesWaited.value++
            setTimeout(checkRole, 500);
          } else {
            timesWaited.value = 0
            resolve(null)
          }
        }
      };
      checkRole();
    });

    const currentRole = await waitForRole();

    if (currentRole === 'customer' && to.name !== 'customerTickets' && to.name !== 'customerTicket' && to.name !== 'landing') {
      console.log('Destination Void: Redirecting to list of tickets');
      return { name: 'customerTickets' };
    }
    if (to.name === 'login' || to.name === 'register') {
      console.log('Already Logged in')
      return { name: 'landing'}
    }
  }
})

export default router

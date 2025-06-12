import { createRouter, createWebHistory } from 'vue-router'

// 🔽 Widoki użytkownika
import Home from '../views/Home.vue'
import Shop from '../views/Shop.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import Cart from '../views/Cart.vue'
import PaymentSuccess from '../views/PaymentSuccess.vue'
import ProductDetails from '../views/ProductDetails.vue'
import AdminMessages from '../views/AdminMessages.vue'

// 🔽 Widoki admina
import Admin from '../views/Admin.vue'
import EditProducts from '../views/EditProducts.vue'

// 🔽 Czat do zamówienia
import OrderMessages from '../views/OrderMessages.vue'

// 🔽 Lista tras
const routes = [
  { path: '/', component: Home },
  { path: '/shop', component: Shop },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/cart', component: Cart },
  { path: '/payment-success', component: PaymentSuccess },
  { path: '/product/:id', component: ProductDetails },
  { path: '/order/:orderId/messages', component: OrderMessages, meta: { requiresAuth: true } },
  {
  path: '/user/messages',
  component: () => import('../views/UserMessages.vue'),
  meta: { requiresAuth: true }
},


  // 🔐 Admin
  { path: '/admin', component: Admin, meta: { requiresAuth: true } },
  { path: '/admin/edit-products', component: EditProducts, meta: { requiresAuth: true } },
  { path: '/admin/messages', component: AdminMessages, meta: { requiresAuth: true } }
]

// 🔽 Tworzenie routera
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🔐 Ochrona tras wymagających logowania



import { getToken, updateAuthFromToken, authState } from '../auth';

router.beforeEach((to, from, next) => {
  updateAuthFromToken();

  const isLoggedIn = authState.isLoggedIn;
  const isAdmin = authState.isAdmin;

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } else if (to.path === '/profile' && isAdmin) {
    next('/admin'); // ⛔ zablokuj adminowi wejście na /profile
  } else {
    next();
  }
});

export default router

<template>
  <nav class="navbar navbar-expand-lg fixed-top shadow-sm main-navbar">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand" @click="isMenuOpen = false">
        <span class="brand-white">NIECH</span><span class="brand-green">ROŚNIE</span>
      </router-link>

      <!-- Toggle przycisk -->
      <button
        class="navbar-toggler"
        type="button"
        @click="isMenuOpen = !isMenuOpen"
      >
        <i class="fa-solid fa-bars text-white"></i>
      </button>

      <!-- Rozwijane menu -->
      <div class="navbar-collapse" :class="{ show: isMenuOpen }" id="navbarMain">
        <ul class="navbar-nav ms-auto d-flex align-items-center gap-2">
          <li class="nav-item">
            <router-link class="nav-link" to="/" @click="isMenuOpen = false">Strona główna</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/shop" @click="isMenuOpen = false">Sklep</router-link>
          </li>

          <li class="nav-item" v-if="isLoggedIn && !isAdmin">
            <router-link class="nav-link" to="/cart" @click="isMenuOpen = false">Koszyk</router-link>
          </li>
          <li class="nav-item" v-if="isLoggedIn && !isAdmin">
            <router-link class="nav-link position-relative" to="/user/messages" @click="isMenuOpen = false">
              Wiadomości
              <span
                v-if="unreadCount > 0"
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              >
                {{ unreadCount }}
              </span>
            </router-link>
          </li>

          <li class="nav-item" v-if="isLoggedIn && isAdmin">
            <router-link class="nav-link" to="/admin/orders" @click="isMenuOpen = false">Zamówienia</router-link>
          </li>
          <li class="nav-item" v-if="isLoggedIn && isAdmin">
            <router-link class="nav-link position-relative" to="/admin/messages" @click="isMenuOpen = false">
              Wiadomości
              <span
                v-if="adminUnreadCount > 0"
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              >
                {{ adminUnreadCount }}
              </span>
            </router-link>
          </li>

          <li class="nav-item" v-if="!isLoggedIn">
            <router-link class="nav-link" to="/login" @click="isMenuOpen = false">Logowanie</router-link>
          </li>
          <li class="nav-item" v-if="!isLoggedIn">
            <router-link class="nav-link" to="/register" @click="isMenuOpen = false">Rejestracja</router-link>
          </li>
          <li class="nav-item" v-if="isLoggedIn">
            <router-link class="nav-link" to="/profile" @click="isMenuOpen = false">Profil</router-link>
          </li>
          <li class="nav-item" v-if="isLoggedIn">
            <button class="btn btn-sm btn-outline-light ms-2" @click="logout">Wyloguj</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { authState, logout } from '../auth';

export default {
  data() {
    return {
      isMenuOpen: false
    };
  },
  computed: {
    isLoggedIn() {
      return authState.isLoggedIn;
    },
    isAdmin() {
      return authState.isAdmin;
    },
    unreadCount() {
      return authState.unreadCount || 0;
    },
    adminUnreadCount() {
      return authState.adminUnreadCount || 0;
    },
  },
  methods: {
    logout() {
      logout();
      this.$router.push('/');
      this.isMenuOpen = false;
    },
  },
  mounted() {
    console.log('🔐 Navbar mounted');
    console.log('👤 isLoggedIn:', this.isLoggedIn);
    console.log('👑 isAdmin:', this.isAdmin);
  },
};
</script>

<style scoped>
/* 🔽 Domyślnie na desktopie: menu rozwinięte */
.navbar-collapse {
  display: flex !important;
  justify-content: flex-end;
}

/* 🔽 Na ekranach mobilnych: dodajemy animację rozwijania */
@media (max-width: 991px) {
  .navbar-collapse {
    display: block !important;
    opacity: 0;
    max-height: 0;
    padding-top: 0;
    overflow: hidden;
    transition: all 0.4s ease;
  }

  .navbar-collapse.show {
    opacity: 1;
    max-height: 500px;
    padding-top: 10px;
  }
}
</style>


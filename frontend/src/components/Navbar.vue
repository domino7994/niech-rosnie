<template>
  <nav class="navbar navbar-expand-lg fixed-top shadow-sm main-navbar">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">
        <span class="brand-white">NIECH</span><span class="brand-green">ROŚNIE</span>
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarMain"
      >
        <i class="fa-solid fa-bars text-white"></i>
      </button>

      <div class="collapse navbar-collapse" id="navbarMain">
        <ul class="navbar-nav ms-auto d-flex align-items-center gap-2">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Strona główna</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/shop">Sklep</router-link>
          </li>

          <li class="nav-item" v-if="isLoggedIn && !isAdmin">
            <router-link class="nav-link" to="/cart">Koszyk</router-link>
          </li>
          <li class="nav-item" v-if="isLoggedIn && !isAdmin">
            <router-link class="nav-link position-relative" to="/user/messages">
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
            <router-link class="nav-link" to="/admin/orders">Zamówienia</router-link>
          </li>
          <li class="nav-item" v-if="isLoggedIn && isAdmin">
            <router-link class="nav-link position-relative" to="/admin/messages">
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
            <router-link class="nav-link" to="/login">Logowanie</router-link>
          </li>
          <li class="nav-item" v-if="!isLoggedIn">
            <router-link class="nav-link" to="/register">Rejestracja</router-link>
          </li>
          <li class="nav-item" v-if="isLoggedIn">
            <router-link class="nav-link" to="/profile">Profil</router-link>
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
    },
  },
};
</script>

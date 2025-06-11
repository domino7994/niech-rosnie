<template>
  <div id="app">
    <!-- 🔝 Nawigacja -->
    <nav class="main-nav">
      <div class="nav-left">
        <router-link to="/" class="nav-link">🏡 Strona główna</router-link>
        <router-link to="/shop" class="nav-link">🛍️ Sklep</router-link>
        <router-link to="/cart" class="nav-link">🧺 Koszyk</router-link>
        <router-link v-if="isLoggedIn" to="/profile" class="nav-link">👤 Profil</router-link>
      </div>

      <div class="nav-right">
        <router-link v-if="!isLoggedIn" to="/login" class="nav-link">🔐 Logowanie</router-link>
        <router-link v-if="!isLoggedIn" to="/register" class="nav-link">📝 Rejestracja</router-link>
        <button v-if="isLoggedIn" @click="logout" class="logout-button">🚪 Wyloguj</button>
      </div>
    </nav>

    <!-- 📦 Widok strony -->
    <router-view />
  </div>
</template>

<script>
import { authState, logout } from './auth';

export default {
  name: 'App',
  computed: {
    isLoggedIn() {
      return authState.isLoggedIn;
    }
  },
  methods: {
    logout() {
      logout();
      this.$router.push('/');
    }
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f9fdf7;
}

.main-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #e6f2e2;
  padding: 1rem 2rem;
  border-bottom: 1px solid #d0e6cd;
  flex-wrap: wrap;
}

.nav-left,
.nav-right {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: #2f5130;
  font-weight: 600;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #4f7942;
}

.logout-button {
  background-color: #4f7942;
  color: white;
  border: none;
  padding: 0.4rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.logout-button:hover {
  background-color: #3a5f33;
}
</style>

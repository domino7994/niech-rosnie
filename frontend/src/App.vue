<template>
  <div id="app">
    <!-- 🔝 Nawigacja -->
    <nav class="main-nav">
      <div class="nav-left">
        <router-link to="/" class="nav-link">🏡 Strona główna</router-link>
        <router-link to="/shop" class="nav-link">🛍️ Sklep</router-link>
        <router-link v-if="isLoggedIn && !isAdmin" to="/cart" class="nav-link">🧺 Koszyk</router-link>

        <router-link v-if="isLoggedIn" to="/profile" class="nav-link">👤 Profil</router-link>
      </div>

      <div class="nav-right">
        <!-- ✉️ Wiadomości użytkownika -->
        <router-link
          v-if="isLoggedIn && !isAdmin"
          to="/user/messages"
          class="nav-link relative"
        >
          ✉️
          <span
            v-if="unreadCount > 0"
            class="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1"
          >
            {{ unreadCount }}
          </span>
        </router-link>

        <!-- ✉️ Wiadomości admina -->
        <router-link
          v-if="isLoggedIn && isAdmin"
          to="/admin/messages"
          class="nav-link relative"
        >
          ✉️
          <span
            v-if="adminUnreadCount > 0"
            class="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1"
          >
            {{ adminUnreadCount }}
          </span>
        </router-link>

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
import { authState, logout, updateAuthFromToken } from './auth';
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      unreadCount: 0,
      adminUnreadCount: 0
    };
  },
  computed: {
    isLoggedIn() {
      return authState.isLoggedIn;
    },
    isAdmin() {
      return authState.isAdmin;
    }
  },
  methods: {
    logout() {
      logout();
      this.$router.push('/');
    },
    async fetchAdminUnread() {
      const token = localStorage.getItem('token');
      if (authState.isAdmin && token) {
        try {
          const res = await axios.get('http://localhost:5000/api/messages/admin/unread-count', {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.adminUnreadCount = res.data.count;
        } catch (err) {
          console.error('❌ Błąd odświeżania powiadomień admina:', err);
        }
      }
    }
  },
  async created() {
    updateAuthFromToken(); // ← To powoduje, że działa admin nawet po przejściu do innych widoków

    const token = localStorage.getItem('token');
    if (token) {
      window.addEventListener('refresh-admin-messages', this.fetchAdminUnread);

      try {
        if (authState.isAdmin) {
          await this.fetchAdminUnread();
        } else {
          const res = await axios.get('http://localhost:5000/api/messages/user/unread-count', {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.unreadCount = res.data.count;
        }
      } catch (e) {
        console.error('❌ Błąd wiadomości:', e);
      }
    }
  }
};
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
  position: relative;
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

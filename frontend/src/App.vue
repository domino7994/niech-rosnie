<template>
  <div id="app" v-if="authInitDone">
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import { authState, logout, updateAuthFromToken } from './auth';
import axios from 'axios';
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',

  components: {
    Navbar,
  },

  data() {
    return {
      interval: null,
      authInitDone: false,
    };
  },

  computed: {
    isLoggedIn() {
      return authState.isLoggedIn;
    },
    isAdmin() {
      return authState.isAdmin;
    },
  },

  methods: {
    logout() {
      logout();
      this.$router.push('/');
    },

    async fetchUserUnread() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/messages/user/unread-count', {
            headers: { Authorization: `Bearer ${token}` },
          });
          authState.unreadCount = res.data.count;
        } catch (e) {
          console.error('❌ Błąd wiadomości użytkownika:', e);
        }
      }
    },

    async fetchAdminUnread() {
      const token = localStorage.getItem('token');
      if (this.isAdmin && token) {
        try {
          const res = await axios.get('http://localhost:5000/api/messages/admin/unread-count', {
            headers: { Authorization: `Bearer ${token}` },
          });
          authState.adminUnreadCount = res.data.count;
        } catch (err) {
          console.error('❌ Błąd wiadomości admina:', err);
        }
      }
    },
  },

  async created() {
    console.log('🔄 Inicjalizacja aplikacji...');
    await updateAuthFromToken();
    this.authInitDone = true;
    console.log('✅ authInitDone:', this.authInitDone);

    const token = localStorage.getItem('token');
    if (token) {
      try {
        if (authState.isAdmin) {
          await this.fetchAdminUnread();
        } else {
          await this.fetchUserUnread();
        }

        this.interval = setInterval(() => {
          if (this.isLoggedIn && this.isAdmin) this.fetchAdminUnread();
          if (this.isLoggedIn && !this.isAdmin) this.fetchUserUnread();
        }, 30000);

      } catch (e) {
        console.error('❌ Błąd inicjalizacji wiadomości:', e);
      }
    }
  },

  unmounted() {
    if (this.interval) clearInterval(this.interval);
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  font-family: 'Montserrat', sans-serif;
  background-color: #f9fdf7;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
}

#app {
  width: 100% !important;
  max-width: 100vw !important;
  margin: 0 !important;
  padding-top: 80px;
}

/* 🔝 Navbar style */
.main-navbar {
  background-color: #111;
  text-transform: uppercase;
  z-index: 999;
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.25rem;
}

.brand-white {
  color: white;
}

.brand-green {
  color: #00cc66;
}

.navbar-nav .nav-link {
  color: white !important;
  font-weight: 500;
  transition: color 0.2s ease;
  padding: 0.5rem 1rem;
}

.navbar-nav .nav-link:hover {
  color: #00cc66 !important;
}

.navbar-nav .nav-link.router-link-exact-active {
  color: #00ccff !important;
  border-bottom: 2px solid #00ccff;
}

.badge {
  font-size: 0.7rem;
}
</style>

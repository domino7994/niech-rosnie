<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
      <h2 class="text-3xl font-bold text-center text-green-700 mb-6">Logowanie</h2>

      <form @submit.prevent="login">
        <label class="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="Twój email"
          class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none mb-4"
          required
        />

        <label class="block mb-2 text-sm font-medium text-gray-700">Hasło</label>
        <input
          v-model="password"
          type="password"
          placeholder="Twoje hasło"
          class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none mb-4"
          required
        />

        <button
          type="submit"
          class="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Zaloguj się
        </button>

        <p v-if="error" class="text-red-500 text-center mt-4">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { updateAuthFromToken } from '../auth'


export default {
  data() {
    return {
      email: '',
      password: '',
      error: '',
    };
  },
  methods: {
    async login() {
      try {
        const res = await axios.post('http://localhost:5000/api/users/login', {
          email: this.email,
          password: this.password,
        });

        localStorage.setItem('token', res.data.token);
        updateAuthFromToken();

        const decoded = JSON.parse(atob(res.data.token.split('.')[1]));
        if (decoded.isAdmin) {
          this.$router.push('/admin');
        } else {
          this.$router.push('/profile');
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Błąd logowania';
      }
    },
  },
};
</script>

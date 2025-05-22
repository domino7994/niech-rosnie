<template>
    <div class="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 class="text-2xl font-bold mb-4">Rejestracja</h2>
      <form @submit.prevent="register">
        <input v-model="username" type="text" placeholder="Nazwa użytkownika" class="input" />
        <input v-model="email" type="email" placeholder="Email" class="input" />
        <input v-model="password" type="password" placeholder="Hasło" class="input" />
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded mt-4">Zarejestruj się</button>
        <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    data() {
      return {
        username: '',
        email: '',
        password: '',
        error: ''
      }
    },
    methods: {
      async register() {
        try {
          const res = await axios.post('http://localhost:5000/api/users/register', {
            username: this.username,
            email: this.email,
            password: this.password
          })
          localStorage.setItem('token', res.data.token)
          window.location.reload()
          this.$router.push('/')
        } catch (err) {
          this.error = err.response?.data?.message || 'Błąd rejestracji'
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .input {
    display: block;
    width: 100%;
    padding: 0.6rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
  </style>
  
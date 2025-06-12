<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-bold mb-6 text-green-700">📨 Twoje wiadomości</h2>

    <div v-if="loading" class="text-gray-500">Ładowanie wiadomości...</div>

    <div v-else-if="orders.length === 0" class="text-gray-500">Brak zamówień z wiadomościami.</div>

    <div v-else>
      <div
        v-for="order in orders"
        :key="order._id"
        class="border-b py-4 flex justify-between items-center"
      >
        <div>
          <p class="font-semibold text-green-800">Zamówienie: {{ order._id }}</p>
          <p class="text-sm text-gray-600">Data: {{ formatDate(order.createdAt) }}</p>
        </div>
        <router-link
          :to="`/order/${order._id}/messages`"
          class="text-sm text-green-600 hover:underline"
        >
          💬 Otwórz czat
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { getToken } from '../auth'

export default {
  data() {
    return {
      orders: [],
      loading: true
    }
  },
  async mounted() {
    try {
      const res = await axios.get('http://localhost:5000/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      this.orders = res.data
    } catch (err) {
      console.error('❌ Błąd ładowania zamówień:', err)
      alert('Nie udało się pobrać zamówień.')
    } finally {
      this.loading = false
    }
  },
  methods: {
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString('pl-PL')
    }
  }
}
</script>

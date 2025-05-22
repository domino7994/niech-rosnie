<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-bold mb-6 text-green-700">📨 Wiadomości od użytkowników</h2>

    <div v-if="loading" class="text-gray-500">Ładowanie wiadomości...</div>

    <div v-else-if="orders.length === 0" class="text-gray-500">Brak wiadomości.</div>

    <div v-else>
      <div
        v-for="order in orders"
        :key="order._id"
        class="border-b py-4 flex justify-between items-center"
      >
        <div>
          <p class="font-semibold text-green-800">Zamówienie: {{ order._id }}</p>
          <p class="text-sm text-gray-600">Użytkownik: {{ order.user.username }}</p>
          <p class="text-sm text-gray-600">Data: {{ formatDate(order.createdAt) }}</p>
        </div>

        <router-link
          :to="`/order/${order._id}/messages`"
          class="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          💬 Otwórz czat
          <span
            v-if="unreadMap[order._id]"
            class="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full"
          >
            {{ unreadMap[order._id] }}
          </span>
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
      loading: true,
      unreadMap: {} // tutaj trzymamy liczby nieprzeczytanych wiadomości
    }
  },
  async mounted() {
    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` }
      }

      // Pobieramy wszystkie zamówienia
      const res = await axios.get('http://localhost:5000/api/orders', config)

      // Tylko zamówienia z wiadomościami
      const ordersWithMessages = await Promise.all(
        res.data.map(async order => {
          const msgRes = await axios.get(`http://localhost:5000/api/messages/${order._id}`, config)
          if (msgRes.data.length > 0) {
            return { ...order, messages: msgRes.data }
          }
          return null
        })
      )

      this.orders = ordersWithMessages.filter(Boolean)

      // Pobieramy liczbę nieprzeczytanych wiadomości do każdego zamówienia
      const unreadRes = await axios.get('http://localhost:5000/api/messages/admin/unread-per-order', config)

      const map = {}
      for (const row of unreadRes.data) {
        map[row._id] = row.count
      }
      this.unreadMap = map

    } catch (err) {
      console.error('❌ Błąd pobierania wiadomości:', err)
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

<template>
  <div
  v-for="order in orders"
  :key="order._id"
  :class="['border-b py-4 flex justify-between items-center', { 'bg-purple-50': unreadMap[order._id] > 0 }]"
>
  <p class="font-semibold text-green-800">Zamówienie: {{ order?._id }}</p>
  <p class="text-sm text-gray-600">Użytkownik: {{ order.user.username }}</p>
  <p class="text-sm text-gray-600">Data: {{ formatDate(order.createdAt) }}</p>

  <button
    @click="openChat(order._id)"
    :class="[
      'px-4 py-2 rounded flex items-center gap-2',
      unreadMap[order._id] > 0 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'
    ]"
  >
    💬 Otwórz czat
    <span
      v-if="unreadMap[order._id]"
      class="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full"
    >
      {{ unreadMap[order._id] }}
    </span>
  </button>
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
      unreadMap: {}
    }
  },
  async mounted() {
    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` }
      }

      // Pobieramy zamówienia
      const res = await axios.get('http://localhost:5000/api/orders', config)

      // Tylko te, które mają wiadomości
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

      // Liczba nieprzeczytanych wiadomości
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
    },
    async markAsRead(orderId) {
      try {
        await axios.put(`http://localhost:5000/api/messages/admin/mark-read/${orderId}`, {}, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });

        this.$set(this.unreadMap, orderId, 0);

        // Rzuć event do App.vue
        window.dispatchEvent(new Event('refresh-admin-messages'));
      } catch (err) {
        console.error('❌ Błąd przy oznaczaniu jako przeczytane:', err);
      }
    },
    async openChat(orderId) {
      await this.markAsRead(orderId);
      this.$router.push(`/order/${orderId}/messages`);
    }
  }
}
</script>

<style scoped>
.bg-purple-50 {
  background-color: #f3e8ff;
}
</style>


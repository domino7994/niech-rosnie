<template>
  <div class="max-w-6xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-bold mb-6 text-green-800">📦 Zamówienia</h2>

    <div v-if="loading" class="text-gray-500">Ładowanie zamówień...</div>
    <div v-else-if="orders.length === 0" class="text-gray-500">Brak zamówień.</div>

    <table class="w-full table-auto border">
      <thead>
        <tr class="bg-gray-100 text-left text-sm text-gray-600">
          <th class="p-2">Użytkownik</th>
          <th class="p-2">Data</th>
          <th class="p-2">Suma</th>
          <th class="p-2">Status</th>
          <th class="p-2">Akcja</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order._id" class="border-t">
          <td class="p-2">{{ order.user?.username }}</td>
          <td class="p-2">{{ formatDate(order.createdAt) }}</td>
          <td class="p-2">{{ order.totalPrice.toFixed(2) }} zł</td>
          <td class="p-2">{{ order.status }}</td>
          <td class="p-2">
            <select v-model="order.status" @change="updateStatus(order)" class="border rounded px-2 py-1">
              <option>Nowe</option>
              <option>W realizacji</option>
              <option>Wysłano</option>
              <option>Dostarczono</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
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
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      this.orders = res.data
    } catch (err) {
      console.error('❌ Błąd ładowania zamówień:', err)
    } finally {
      this.loading = false
    }
  },
  methods: {
    async updateStatus(order) {
      try {
        await axios.put(
          `http://localhost:5000/api/orders/${order._id}/status`,
          { status: order.status },
          { headers: { Authorization: `Bearer ${getToken()}` } }
        )
      } catch (err) {
        console.error('❌ Błąd zmiany statusu:', err)
        alert('Nie udało się zaktualizować statusu')
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
select {
  background-color: #f9f9f9;
}
</style>

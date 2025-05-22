<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-bold mb-4 text-green-700">👤 Moje zamówienia</h2>

    <div v-if="loading" class="text-gray-500">Ładowanie zamówień...</div>

    <div v-else-if="orders.length === 0" class="text-gray-500">Brak zamówień.</div>

    <div v-else>
      <!-- 🔁 Pętla po zamówieniach -->
      <div v-for="order in orders" :key="order._id" class="border-b py-4">
        <!-- 💬 Link do wiadomości -->
<router-link
  :to="`/order/${order._id}/messages`"
  class="text-sm text-blue-600 underline mt-2 inline-block"
>
  💬 Napisz do sprzedawcy w sprawie zamówienia
</router-link>

        <p class="font-semibold text-green-800">Zamówienie: {{ order._id }}</p>
        <p>Data: {{ formatDate(order.createdAt) }}</p>
        <p>Suma: {{ order.totalPrice }} zł</p>
        <p>Status: 
          <span :class="order.isPaid ? 'text-green-600' : 'text-red-500'">
            {{ order.isPaid ? 'Opłacone' : 'Nieopłacone' }}
          </span>
        </p>

        <!-- 🟦 Przycisk PayPal dla nieopłaconych -->
        <div v-if="!order.isPaid" class="mt-2">
          <button
            @click="payWithPayPal(order._id)"
            class="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Zapłać przez PayPal
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { getToken } from '../auth'

export default {
  name: 'Profile',
  data() {
    return {
      orders: [],
      loading: true
    }
  },
  async mounted() {
    try {
      const res = await axios.get('http://localhost:5000/api/orders/my-orders', {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      })
      this.orders = res.data
    } catch (err) {
      console.error('Błąd ładowania zamówień:', err)
    } finally {
      this.loading = false
    }
  },
  methods: {
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return date.toLocaleDateString('pl-PL', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    },
    async payWithPayPal(orderId) {
      try {
        const res = await axios.post(
          `http://localhost:5000/api/orders/${orderId}/paypal/create`,
          {},
          {
            headers: {
              Authorization: `Bearer ${getToken()}`
            }
          }
        )

        const link = res.data.links.find(l => l.rel === 'approve')
        if (link) {
          window.location.href = link.href
        } else {
          alert('Nie udało się pobrać linku do płatności PayPal.')
        }
      } catch (err) {
        console.error('Błąd przy generowaniu linku PayPal:', err)
      }
    }
  }
}
</script>

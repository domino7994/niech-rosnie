<template>
  <div class="max-w-3xl mx-auto bg-white p-6 rounded shadow">
    <h2 class="text-2xl font-bold mb-4 text-green-700">🛒 Twój koszyk</h2>

    <div v-if="cart.length === 0" class="text-gray-500">Koszyk jest pusty.</div>

    <div v-else>
      <div v-for="(item, index) in cart" :key="item._id" class="mb-4 border-b pb-2">
        <h3 class="text-lg font-semibold">{{ item.name }}</h3>
        <p class="text-gray-700">{{ item.price }} zł</p>
        <button
          @click="removeFromCart(index)"
          class="mt-1 text-sm text-red-600 hover:underline"
        >
          ❌ Usuń z koszyka
        </button>
      </div>

     <p class="text-lg font-bold mt-4">Suma: {{ totalPrice.toFixed(2) }} zł</p>


      <div class="flex gap-4 mt-4">
        <button
          @click="checkout"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          Zapłać
        </button>

        <button
          @click="payWithPayPal"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          Zapłać przez PayPal
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { authState, getToken } from '../auth'

export default {
  data() {
    return {
      cart: []
    }
  },
  computed: {
    totalPrice() {
  return this.cart.reduce((sum, item) => sum + item.price, 0)
}

  },
  mounted() {
    const savedCart = localStorage.getItem('cart')
    this.cart = savedCart ? JSON.parse(savedCart) : []
  },
  methods: {
    async checkout() {
      if (!authState.isLoggedIn) {
        alert('Musisz być zalogowany, aby zapłacić!')
        this.$router.push('/login')
        return
      }

      try {
        const products = this.cart.map(p => ({
          product: p._id,
          quantity: 1
        }))

        const order = {
          products,
          totalPrice: this.totalPrice,
          shippingAddress: {
            fullName: 'Jan Kowalski',
            street: 'ul. Roślinna 12',
            city: 'Zielonowo',
            postalCode: '00-000',
            country: 'Polska'
          }
        }
console.log('📦 Zamówienie:', order)

        await axios.post('http://localhost:5000/api/orders', order, {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        })

        alert('✅ Zamówienie złożone pomyślnie!')
        localStorage.removeItem('cart')
        this.cart = []
        this.$router.push('/profile')
      } catch (err) {
        console.error('❌ Błąd składania zamówienia:', err)
        alert('Wystąpił błąd przy składaniu zamówienia.')
      }
    },

    removeFromCart(index) {
      this.cart.splice(index, 1)
      localStorage.setItem('cart', JSON.stringify(this.cart))
    },

    payWithPayPal() {
      alert('⚠️ Integracja z PayPal jeszcze nie gotowa.')
    }
  }
}
</script>

<style scoped>
</style>

<template>
 <div v-for="product in products" :key="product._id" class="p-4 bg-white rounded shadow">
  
  <!-- 🔗 Klikalna część - prowadzi do szczegółów -->
  <router-link :to="`/product/${product._id}`" class="block hover:shadow">
    <img :src="'http://localhost:5000' + product.image" class="w-full h-48 object-cover rounded mb-2" />
    <h3 class="text-xl font-semibold">{{ product.name }}</h3>
    <p class="text-sm text-gray-700">{{ product.description }}</p>
    <p class="font-bold text-green-600">{{ product.price.toFixed(2) }} zł</p>
  </router-link>

  <!-- 🛒 Przycisk "Dodaj do koszyka" -->
  <button
    @click="addToCart(product)"
    class="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded"
  >
    Dodaj do koszyka
  </button>
</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Shop',
  data() {
    return {
      products: [],
      loading: true
    }
  },
  async mounted() {
    try {
      const res = await axios.get('http://localhost:5000/api/products')
      this.products = res.data
    } catch (err) {
      console.error('Błąd pobierania produktów:', err)
    } finally {
      this.loading = false
    }
  },
  methods: {
    addToCart(product) {
      let cart = JSON.parse(localStorage.getItem('cart')) || []
      cart.push(product)
      localStorage.setItem('cart', JSON.stringify(cart))
      alert('✅ Produkt dodany do koszyka!')
    }
  }
}
</script>

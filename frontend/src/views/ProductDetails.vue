<template>
    <div class="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 class="text-2xl font-bold mb-4 text-green-700">{{ product.name }}</h2>
  
      <img
        v-if="product.image"
        :src="'http://localhost:5000' + product.image"
        class="w-full rounded mb-4"
      />
  
      <p class="mb-2">{{ product.description }}</p>
      <p class="text-green-700 font-semibold text-xl">{{ product.price }} zł</p>
  
      <!-- 📄 Link do instrukcji PDF -->
      <a
        v-if="product.pdf"
        :href="'http://localhost:5000' + product.pdf"
        target="_blank"
        class="text-blue-600 underline mt-2 inline-block"
      >
        📄 Pobierz instrukcję pielęgnacji
      </a>
  
      <!-- 🛒 Przycisk dodania do koszyka -->
      <button
        @click="addToCart(product)"
        class="mt-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        ➕ Dodaj do koszyka
      </button>
    </div>
    
  </template>
  
  
  <script>
  import axios from 'axios'
  
  export default {
    data() {
      return {
        product: {}
      }
    },
    async mounted() {
      const id = this.$route.params.id
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`)
        this.product = res.data
      } catch (err) {
        console.error('Błąd ładowania produktu:', err)
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
  
<template>
  <div class="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md grid md:grid-cols-2 gap-6">
    <!-- 🖼️ Zdjęcie produktu -->
    <div>
      <img
        v-if="product.image"
        :src="'http://localhost:5000' + product.image"
        :alt="product.name"
        class="rounded-lg w-full object-cover max-h-[400px]"
      />
    </div>

    <!-- 📄 Dane produktu -->
    <div class="flex flex-col justify-between">
      <div>
        <h1 class="text-3xl font-bold text-green-800 mb-2">{{ product.name }}</h1>
        <p class="text-gray-700 mb-4">{{ product.description }}</p>

        <p class="text-xl text-green-700 font-semibold mb-4">
          {{ Number(product.price || 0).toFixed(2) }} zł
        </p>

        <!-- 📄 Link do PDF -->
        <a
          v-if="product.pdf"
          :href="'http://localhost:5000' + product.pdf"
          target="_blank"
          class="text-blue-600 underline inline-block mb-4"
        >
          📄 Instrukcja pielęgnacji
        </a>

        <!-- 🔢 Ilość -->
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium text-gray-600">Ilość:</label>
          <input
            type="number"
            v-model.number="quantity"
            min="1"
            class="w-24 border rounded px-3 py-1"
          />
        </div>
      </div>

      <!-- 🛒 Akcje -->
      <div class="flex gap-3 mt-6 flex-wrap">
        <button
          @click="addToCart(product)"
          class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          ➕ Dodaj do koszyka
        </button>

        <button
          @click="contactSeller"
          class="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
        >
          ✉️ Napisz do sprzedawcy
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      product: {},
      quantity: 1
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
      const cart = JSON.parse(localStorage.getItem('cart')) || []

      cart.push({
        ...product,
        quantity: this.quantity
      })

      localStorage.setItem('cart', JSON.stringify(cart))
      alert('✅ Produkt dodany do koszyka!')
    },
    contactSeller() {
      // możesz dodać czat lub przekierowanie do formularza wiadomości
      this.$router.push(`/order/fake/messages`)
    }
  }
}
</script>

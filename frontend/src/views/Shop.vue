<template>
  <div class="max-w-6xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-green-800">🌿 Wszystkie produkty</h1>

    <div v-if="loading" class="text-gray-500">Ładowanie produktów...</div>
    <div v-else-if="products.length === 0" class="text-gray-500">Brak produktów do wyświetlenia.</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="product in products"
        :key="product._id"
        class="bg-white rounded shadow p-4 cursor-pointer hover:shadow-md transition"
        @click="goToProduct(product._id)"
      >
        <img
          v-if="product.image"
          :src="'http://localhost:5000' + product.image"
          :alt="product.name"
          class="w-full h-48 object-cover rounded mb-3"
        />
        <h2 class="text-lg font-semibold text-green-700">{{ product.name }}</h2>
        <p class="text-gray-500 text-sm">{{ product.description?.slice(0, 60) }}...</p>
        <p class="text-green-800 font-bold mt-2">{{ Number(product.price || 0).toFixed(2) }} zł</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      products: [],
      loading: true
    }
  },
  async mounted() {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      this.products = res.data;
    } catch (err) {
      console.error('❌ Błąd ładowania produktów:', err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    goToProduct(id) {
      this.$router.push(`/product/${id}`);
    }
  }
}
</script>

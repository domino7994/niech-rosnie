<template>
  <div class="shop">
    <h1 class="page-title">🛒 Wszystkie produkty</h1>

    <div v-if="loading" class="text-center text-gray-600">Ładowanie produktów...</div>
    <div v-else-if="products.length === 0" class="text-center text-gray-600">Brak produktów.</div>

    <div class="product-grid">
      <div v-for="product in products" :key="product._id" class="product-card">
        <img
          :src="product.imageUrl"
          :alt="product.name"
          class="product-image"
          @error="onImageError"
        />
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-description">{{ product.description }}</p>
        <p class="product-price">{{ product.price.toFixed(2) }} zł</p>

        <!-- 🔁 Warunkowy przycisk: inny dla admina -->
        <div class="text-center mt-2">
          <router-link
            v-if="isAdmin"
            to="/admin/edit-products"
            class="btn-secondary"
          >
            ✏️ Edytuj produkt
          </router-link>

          <button
            v-else
            @click="addToCart(product)"
            class="btn-primary"
          >
            ➕ Dodaj do koszyka
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { authState } from '../auth';

export default {
  name: 'Shop',
  data() {
    return {
      products: [],
      loading: true
    };
  },
  computed: {
    isAdmin() {
      return authState.isAdmin;
    }
  },
  async mounted() {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      this.products = res.data;
    } catch (err) {
      console.error('❌ Błąd pobierania produktów:', err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    addToCart(product) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push({ productId: product._id, quantity: 1 });
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('✅ Produkt dodany do koszyka!');
    },
    onImageError(event) {
      event.target.src = 'https://via.placeholder.com/150?text=Brak+zdjęcia';
    }
  }
};
</script>

<style scoped>
.shop {
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  color: #2f5130;
  margin-bottom: 2rem;
}

.product-grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}

.product-card {
  background-color: #fff;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.product-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 0.75rem;
  margin-bottom: 0.75rem;
}

.product-name {
  font-weight: 600;
  color: #2f5130;
  margin-bottom: 0.5rem;
}

.product-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.product-price {
  font-weight: bold;
  color: #4f7942;
  margin-bottom: 0.5rem;
}

.btn-primary {
  background-color: #4f7942;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #3a5f33;
}

.btn-secondary {
  background-color: #d4e5c2;
  color: #2f5130;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  text-decoration: none;
  font-weight: bold;
}

.btn-secondary:hover {
  background-color: #c3d7b4;
}
</style>

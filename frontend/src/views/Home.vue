<template>
  <div class="home-wrapper">
    <!-- 🔰 HERO / baner -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="shop-title">NIECH ROŚNIE</h1>
        <h2 class="shop-subtitle">NATURALNY SKLEP OGRODNICZY</h2>
        <p class="hero-lead">Rośnij z nami – produkty najwyższej jakości, prosto do Twojego ogrodu.</p>
        <button class="cta-button" @click="scrollToProducts">ZOBACZ PRODUKTY</button>
      </div>
    </section>

    <!-- 🛍️ Produkty -->
    <section ref="products" class="product-grid">
      <h2 class="section-title">🌿 Nasze produkty</h2>
      <div class="product-list">
        <div
          class="product-card"
          v-for="product in products"
          :key="product._id"
          @click="goToProduct(product._id)"
        >
          <img :src="product.image" :alt="`Zdjęcie produktu ${product.name}`" />

          <h3>{{ product.name }}</h3>
          <p class="price">{{ Number(product.price || 0).toFixed(2) }} zł</p>

        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Home',
  data() {
    return {
      products: [],
    };
  },
  methods: {
    async fetchProducts() {
      try {
        const res = await axios.get('/api/products');
        this.products = res.data;
      } catch (err) {
        console.error('❌ Błąd pobierania produktów:', err);
      }
    },
    goToProduct(id) {
      this.$router.push(`/product/${id}`);
    },
    scrollToProducts() {
      this.$refs.products.scrollIntoView({ behavior: 'smooth' });
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
.home-wrapper {
  font-family: 'Segoe UI', sans-serif;
}

/* 🟢 Baner */
.hero {
  background: linear-gradient(135deg, #e6f2e2, #f9fdf7);
  padding: 3rem 2rem;
  text-align: center;
  border-bottom: 1px solid #d0e6cd;
}

.shop-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2f5130;
  margin-bottom: 0.5rem;
}

.shop-subtitle {
  font-size: 1.2rem;
  font-weight: 500;
  color: #4d704d;
  margin-bottom: 1.5rem;
}

.hero-lead {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.cta-button {
  background-color: #4f7942;
  color: white;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.cta-button:hover {
  background-color: #3d5f31;
}

/* 🛒 Produkty */
.product-grid {
  padding: 2rem;
  background-color: #fafafa;
}

.section-title {
  text-align: center;
  font-size: 1.8rem;
  color: #2f5130;
  margin-bottom: 2rem;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
}

.product-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.07);
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

.product-card img {
  max-width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 0.5rem;
}

.product-card h3 {
  font-size: 1.1rem;
  margin: 0.5rem 0;
  color: #333;
}

.price {
  font-weight: bold;
  color: #4caf50;
}
</style>

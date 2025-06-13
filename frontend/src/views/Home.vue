<template>
  <div class="home">
    <!-- 🔝 Hero -->
    <section class="hero d-flex align-items-center justify-content-center text-center text-white">
      <div class="hero-content">
        <h1 class="title">NIECH <span class="highlight">ROŚNIE</span></h1>
        <p class="subtitle">NATURALNY SKLEP OGRODNICZY</p>
        <p class="description">
          Rośnij z nami – produkty najwyższej jakości, prosto do Twojego ogrodu.
        </p>
        <router-link to="/shop" class="btn-hero">ZOBACZ PRODUKTY</router-link>
      </div>
      <div class="hero-shadow"></div>
    </section>

    <!-- 🪴 Produkty -->
    <section class="products container py-5">
      <h2 class="section-title">🌿 Nasze produkty</h2>

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
        </div>
      </div>
    </section>

    <!-- 🪴 Zestawy + 💬 Opinie -->
    <section class="grid-section container py-5">
      <div class="row g-4">
        <!-- 🌿 Zestawy -->
        <div class="col-lg-6">
          <h2 class="section-title">🌿 Polecane zestawy</h2>
          <div class="product-grid">
            <div v-for="product in products.slice(0, 3)" :key="product._id" class="product-card">
              <img
                :src="product.imageUrl"
                :alt="product.name"
                class="product-image"
                @error="onImageError"
              />
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-price">{{ product.price.toFixed(2) }} zł</p>
            </div>
          </div>
        </div>

        <!-- 💬 Opinie -->
        <div class="col-lg-6">
          <h2 class="section-title">💬 Opinie klientów</h2>
          <div v-for="review in reviews" :key="review._id" class="review-card">
            <div class="stars">
              <span
                v-for="n in 5"
                :key="n"
                :class="n <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
              >★</span>
            </div>
            <p class="comment">"{{ review.comment }}"</p>
            <p class="author">– {{ review.username }}</p>
          </div>
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
      reviews: [],
      loading: true
    };
  },
  async mounted() {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      this.products = res.data.slice(0, 3);
      const reviewRes = await axios.get('http://localhost:5000/api/reviews');
      this.reviews = reviewRes.data.slice(-2).reverse();
    } catch (err) {
      console.error('❌ Błąd pobierania danych:', err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    onImageError(e) {
      e.target.src = 'https://via.placeholder.com/300x200?text=Brak+zdjęcia';
    }
  }
};
</script>

<style scoped>
.home {
  margin: 0;
  padding: 0;
}

.hero {
  position: relative;
  height: 100vh;
  background-image: url('/img/hero-big.jpg'); /* własne tło */
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.hero-shadow {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  color: white;
  text-align: center;
  max-width: 800px;
  padding: 1rem;
}

.hero h1 {
  font-size: 3rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.highlight {
  color: #00cc66;
}

.subtext {
  font-size: 1.2rem;
  margin-top: 0.5rem;
  color: #e0e0e0;
}

.desc {
  margin-top: 1rem;
  font-size: 1rem;
  color: #ccc;
}

.hero-button {
  display: inline-block;
  margin-top: 2rem;
  padding: 0.6rem 1.8rem;
  border: 2px solid white;
  border-radius: 999px;
  color: white;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.hero-button:hover {
  background-color: #00cc66;
  border-color: #00cc66;
  color: white;
}

/* 🪴 Produkty */
.section-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #2f5130;
  margin-bottom: 1.5rem;
  text-align: center;
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
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
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
}

/* 💬 Opinie */
.review-card {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stars {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.text-yellow-400 {
  color: #facc15;
}

.text-gray-300 {
  color: #d1d5db;
}

.comment {
  font-style: italic;
  color: #333;
  margin-bottom: 0.25rem;
}

.author {
  font-size: 0.9rem;
  color: #666;
}
</style>

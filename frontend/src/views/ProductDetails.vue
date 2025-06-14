<template>
  <div class="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md">
    <div v-if="product && product.price" class="grid md:grid-cols-2 items-start gap-6 lg:gap-10">
      <!-- Zdjęcie -->
      <img
        :src="product.imageUrl"
        :alt="product.name"
        class="w-full rounded shadow max-h-[400px] object-cover"
        @error="onImageError"
      />

      <!-- Informacje o produkcie -->
      <div>
        <h1 class="text-3xl font-bold text-green-800 mb-2">{{ product.name }}</h1>
        <p class="text-xl font-semibold text-green-700 mb-2">{{ product.price.toFixed(2) }} zł</p>
        <p class="text-gray-600 mb-4 whitespace-pre-line">{{ product.description }}</p>

        <!-- Link do instrukcji -->
        <a
          v-if="product.pdf"
          :href="product.pdf"
          target="_blank"
          class="text-sm text-blue-600 hover:underline"
        >
          📄 Zobacz instrukcję pielęgnacji (PDF)
        </a>

        <!-- Ilość -->
        <div class="mt-4">
          <label for="quantity" class="block text-sm font-medium text-gray-700">Ilość:</label>
          <input
            type="number"
            min="1"
            v-model.number="quantity"
            class="mt-1 w-24 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <!-- Przyciski -->
        <div class="mt-6 flex gap-4 flex-wrap">
          <button
            @click="addToCart"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all hover:scale-105"
          >
            ➕ Dodaj do koszyka
          </button>
          <button
            @click="buyNow"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all hover:scale-105"
          >
            ⚡ Kup teraz
          </button>
        </div>
      </div>
    </div>

    <!-- Opinie -->
    <div class="mt-10 border-t pt-6">
      <h2 class="text-xl font-bold text-green-800 mb-4">💬 Opinie</h2>

      <!-- Lista opinii -->
      <div v-if="reviews.length === 0" class="text-gray-500">Brak opinii.</div>
      <div v-else class="space-y-4">
        <div
          v-for="review in reviews"
          :key="review._id"
          class="border-b pb-3 text-sm text-gray-800 space-y-1"
        >
          <p class="font-semibold text-green-700">{{ review.username }}:</p>
          <p class="text-yellow-500">
            <span v-for="n in 5" :key="n">
              <span v-if="n <= review.rating">★</span>
              <span v-else class="text-gray-300">★</span>
            </span>
          </p>
          <p>{{ review.comment }}</p>
        </div>
      </div>

      <!-- Formularz dodania -->
      <div v-if="isLoggedIn && !hasReviewed" class="mt-6">
        <h3 class="font-semibold mb-2">Dodaj swoją opinię:</h3>
        <div
          class="flex items-center space-x-1 mb-2 review-stars"
          @mouseleave="hoveredRating = 0"
        >
          <span
            v-for="n in 5"
            :key="n"
            @mouseenter="hoveredRating = n"
            @mouseleave="hoveredRating = 0"
            @click.prevent="setRating(n)"
            :class="n <= Math.max(hoveredRating, newReview.rating) ? 'text-yellow-400' : 'text-gray-300'"
            class="cursor-pointer text-3xl inline-block w-auto transition transform hover:scale-125 hover:-rotate-3"
          >
            ★
          </span>
        </div>

        <textarea
          v-model="newReview.comment"
          placeholder="Treść opinii..."
          class="border px-3 py-2 rounded w-full mb-2"
        ></textarea>
        <button
          @click="submitReview"
          class="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition-all hover:scale-105"
        >
          💬 Dodaj opinię
        </button>
      </div>

      <div v-else-if="hasReviewed" class="text-sm text-gray-600 mt-4">
        ✅ Już dodałeś opinię do tego produktu.
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
      product: {},
      quantity: 1,
      reviews: [],
      newReview: { rating: 5, comment: '' },
      hoveredRating: 0,
      hasReviewed: false
    }
  },
  computed: {
    isLoggedIn() {
      return authState.isLoggedIn
    }
  },
  async mounted() {
    try {
      const id = this.$route.params.id
      const res = await axios.get(`http://localhost:5000/api/products/${id}`)
      this.product = res.data
      await this.fetchReviews()
    } catch (err) {
      console.error('❌ Błąd pobierania szczegółów produktu:', err)
      alert('Nie udało się załadować produktu.')
    }
  },
  methods: {
    addToCart() {
      const cart = JSON.parse(localStorage.getItem('cart')) || []
      cart.push({
        _id: this.product._id,
        name: this.product.name,
        price: this.product.price,
        quantity: this.quantity
      })
      localStorage.setItem('cart', JSON.stringify(cart))
      alert('✅ Dodano do koszyka!')
    },
    buyNow() {
      const item = {
        _id: this.product._id,
        name: this.product.name,
        price: this.product.price,
        quantity: this.quantity
      }
      localStorage.setItem('cart', JSON.stringify([item]))
      this.$router.push('/cart')
    },
    async fetchReviews() {
      try {
        const res = await axios.get(`http://localhost:5000/api/reviews/${this.product._id}`)
        this.reviews = res.data
        const userId = JSON.parse(atob(getToken().split('.')[1])).id
        this.hasReviewed = this.reviews.some(r => r.user === userId)
      } catch (err) {
        console.error('❌ Błąd pobierania opinii:', err)
      }
    },
    async submitReview() {
      if (!this.newReview.comment.trim()) return alert('Wpisz treść opinii.')

      try {
        await axios.post(
          `http://localhost:5000/api/reviews/${this.product._id}`,
          this.newReview,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        )
        this.newReview.comment = ''
        await this.fetchReviews()
        this.hasReviewed = true
      } catch (err) {
        console.error('❌ Błąd dodawania opinii:', err)
        alert(err.response?.data?.message || 'Błąd dodawania opinii.')
      }
    },
    setRating(n) {
      this.newReview.rating = n
    },
    onImageError(e) {
      e.target.src = 'https://via.placeholder.com/400x300?text=Brak+zdjęcia'
    }
  }
}
</script>

<style scoped>
.review-stars span {
  transition: transform 0.2s ease, color 0.2s ease;
}
.review-stars span:hover {
  transform: scale(1.25) rotate(-4deg);
  color: #facc15;
}
.review-stars span {
  display: inline-block;
}

@keyframes pop-star {
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.6) rotate(-15deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.review-stars span.animate-pop {
  animation: pop-star 0.4s ease-in-out;
}

</style>


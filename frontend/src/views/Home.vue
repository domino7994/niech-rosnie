<template>
	<div class="home">
		<!-- 🔝 Hero -->
		<section class="hero">
			<h1 class="title">NIECH ROŚNIE</h1>
			<p class="subtitle">NATURALNY SKLEP OGRODNICZY</p>
			<p class="description">
				Rośnij z nami – produkty najwyższej jakości, prosto do Twojego ogrodu.
			</p>
			<router-link to="/shop" class="btn">ZOBACZ PRODUKTY</router-link>
		</section>

		<!-- 🪴 Produkty -->
		<section class="products">
			<h2 class="section-title">🌿 Nasze produkty</h2>

			<div v-if="loading" class="text-center text-gray-600">
				Ładowanie produktów...
			</div>
			<div v-else-if="products.length === 0" class="text-center text-gray-600">
				Brak produktów.
			</div>

			<div class="product-grid">
				<div
					v-for="product in products"
					:key="product._id"
					class="product-card"
				>
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

		<!-- 🪴 Zestawy + 💬 Opinie w 2 kolumnach -->
		<section class="grid-section">
			<div class="grid-container">
				<!-- 🌿 Polecane zestawy -->
				<div class="left">
					<h2 class="section-title">🌿 Polecane zestawy</h2>
					<div class="product-grid">
						<div
							v-for="product in products.slice(0, 3)"
							:key="product._id"
							class="product-card"
						>
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

				<!-- 💬 Opinie klientów -->
				<div class="right">
					<h2 class="section-title">💬 Opinie klientów</h2>
					<div v-for="review in reviews" :key="review._id" class="review-card">
						<div class="stars">
							<span
								v-for="n in 5"
								:key="n"
								:class="
									n <= review.rating ? 'text-yellow-400' : 'text-gray-300'
								"
							>
								★
							</span>
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
			loading: true,
		};
	},
	async mounted() {
		try {
			const res = await axios.get('http://localhost:5000/api/products');
			this.products = res.data.slice(0, 3);

			const reviewRes = await axios.get('http://localhost:5000/api/reviews');
			this.reviews = reviewRes.data.slice(-2).reverse(); // ostatnie 2 opinie
		} catch (err) {
			console.error('❌ Błąd pobierania danych:', err);
		} finally {
			this.loading = false;
		}
	},
	methods: {
		onImageError(event) {
			event.target.src = 'https://via.placeholder.com/150?text=Brak+zdjęcia';
		},
	},
};
</script>

<style scoped>
.home {
	padding: 2rem;
}

.hero {
	text-align: center;
	margin-bottom: 3rem;
}

.title {
	font-size: 2.5rem;
	font-weight: bold;
	color: #2f5130;
}

.subtitle {
	font-size: 1.2rem;
	color: #4f7942;
}

.description {
	margin-top: 0.5rem;
	font-size: 1rem;
	color: #555;
}

.btn {
	margin-top: 1rem;
	background-color: #4f7942;
	color: white;
	padding: 0.5rem 1.5rem;
	border-radius: 9999px;
	text-decoration: none;
	font-weight: bold;
}

.btn:hover {
	background-color: #3a5f33;
}

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
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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
}

/* 🔧 Opinie */
.opinie {
	margin-top: 4rem;
}

.review-grid {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	max-width: 600px;
	margin: 0 auto;
	padding: 0 1rem;
}

.review-card {
	background: #fff;
	padding: 1rem 1.5rem;
	border-radius: 1rem;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	text-align: center;
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
.grid-section {
	margin-top: 4rem;
}

.grid-container {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 2rem;
	align-items: start;
	max-width: 1000px;
	margin: 0 auto;
	padding: 0 1rem;
}

.left,
.right {
	background: #ffffff;
	border-radius: 1rem;
	padding: 1.5rem;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.review-card {
	background: #f9fafb;
	padding: 1rem;
	border-radius: 1rem;
	margin-bottom: 1rem;
	text-align: center;
}

.stars {
	font-size: 1.2rem;
	margin-bottom: 0.5rem;
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

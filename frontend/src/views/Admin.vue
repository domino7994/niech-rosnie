<template>
  <div class="p-6 max-w-4xl mx-auto bg-white shadow rounded">
    <h2 class="text-2xl font-bold mb-6 text-green-700">👨‍💼 Panel administratora</h2>

    <!-- 🔔 Powiadomienia -->
    <div class="flex items-center mb-6 space-x-4">
      <span class="text-lg font-semibold text-gray-700">🔔 Powiadomienia:</span>
      <span class="text-red-600 font-bold" v-if="unreadCount > 0">
        {{ unreadCount }} nowych wiadomości 💬
      </span>
      <span class="text-gray-500" v-else>
        Brak nowych wiadomości
      </span>
      <router-link
        to="/admin/messages"
        class="ml-auto text-blue-600 underline"
      >
        📬 Zobacz wszystkie wiadomości
      </router-link>
    </div>

    <!-- Sekcja 1: Dodawanie produktu -->
    <div class="mb-8">
      <h3 class="text-xl font-semibold mb-2">➕ Dodaj nowy produkt</h3>
      <form @submit.prevent="addProduct" class="grid gap-2">
        <select v-model="newProduct.category" class="border p-2 rounded" required>
          <option disabled value="">Wybierz kategorię</option>
          <option>Do łazienki</option>
          <option>Dla początkujących</option>
          <option>Do cienia</option>
          <option>Oczyszczające powietrze</option>
        </select>
        <input v-model="newProduct.name" placeholder="Nazwa" class="border p-2 rounded" required />
        <input v-model="newProduct.price" placeholder="Cena" type="number" class="border p-2 rounded" required />
        <textarea v-model="newProduct.description" placeholder="Opis" class="border p-2 rounded"></textarea>
        <input type="file" @change="handleImageUpload" class="border p-2 rounded" />
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">Dodaj produkt</button>
      </form>
    </div>

    <!-- Sekcja 2: Podgląd zamówień -->
    <div>
      <h3 class="text-xl font-semibold mb-2">📦 Zamówienia</h3>
      <div v-for="order in orders" :key="order._id" class="border-b py-4">
        <p><strong>ID:</strong> {{ order._id }}</p>
        <p><strong>Użytkownik:</strong> {{ order.user.username }}</p>
        <p><strong>Suma:</strong> {{ order.totalPrice }} zł</p>
        <p><strong>Status:</strong> {{ order.isPaid ? 'Opłacone' : 'Nieopłacone' }}</p>
      </div>
    </div>

    <!-- Sekcja 3: Lista produktów -->
    <div class="mt-8">
      <h3 class="text-xl font-semibold mb-2">🌱 Produkty</h3>
      <div v-for="product in products" :key="product._id" class="border-b py-4">
        <p><strong>{{ product.name }}</strong> ({{ product.category }}) – {{ product.price }} zł</p>
        <p class="text-sm text-gray-600">{{ product.description }}</p>
        <button class="text-sm text-blue-600 underline mt-2" @click="startEdit(product)">✏️ Edytuj</button>
        <button class="text-sm text-red-600 underline mt-1 ml-4" @click="deleteProduct(product._id)">❌ Usuń</button>
      </div>
    </div>

    <!-- Formularz edycji -->
    <div v-if="editingProduct" class="mt-6 border-t pt-4">
      <h3 class="text-lg font-bold mb-2">Edytuj produkt</h3>
      <input v-model="editingProduct.name" placeholder="Nazwa" class="block mb-2 border px-2 py-1" />
      <input v-model="editingProduct.price" placeholder="Cena" type="number" class="block mb-2 border px-2 py-1" />
      <textarea v-model="editingProduct.description" placeholder="Opis" class="block mb-2 border px-2 py-1"></textarea>
      <input type="file" @change="handleImageUpdate" class="mb-2" />
      <input type="file" @change="handlePdfUpdate" class="mb-2" />
      <button @click="updateProduct" class="px-4 py-2 bg-blue-600 text-white rounded">📂 Zapisz zmiany</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { getToken } from '../auth'

export default {
  data() {
    return {
      orders: [],
      products: [],
      newProduct: {
        name: '',
        price: '',
        description: '',
        category: ''
      },
      imageFile: null,
      editingProduct: null,
      unreadCount: 0
    }
  },
  async mounted() {
    try {
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      this.orders = res.data
      await this.loadProducts()
      await this.fetchUnreadMessagesCount()
      setInterval(this.fetchUnreadMessagesCount, 30000) // co 30 sek. sprawdzaj nowe wiadomości
    } catch (err) {
      console.error('Błąd pobierania zamówień:', err)
    }
  },
  methods: {
    async fetchUnreadMessagesCount() {
      try {
        const res = await axios.get('http://localhost:5000/api/messages/admin/unread-count', {
          headers: { Authorization: `Bearer ${getToken()}` }
        })
        this.unreadCount = res.data.count
      } catch (err) {
        console.error('❌ Błąd pobierania liczby nieprzeczytanych wiadomości:', err)
      }
    },
    async loadProducts() {
      const res = await axios.get('http://localhost:5000/api/products')
      this.products = res.data
    },
    handleImageUpload(e) {
      this.imageFile = e.target.files[0]
    },
    async addProduct() {
      try {
        if (!this.newProduct.name || !this.newProduct.category || !this.newProduct.price || !this.imageFile) {
          alert('❌ Uzupełnij wszystkie pola i dodaj zdjęcie!')
          return
        }

        const formData = new FormData()
        formData.append('name', this.newProduct.name)
        formData.append('price', this.newProduct.price)
        formData.append('description', this.newProduct.description)
        formData.append('category', this.newProduct.category)
        formData.append('image', this.imageFile)

        await axios.post('http://localhost:5000/api/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${getToken()}`
          }
        })

        alert('✅ Produkt dodany!')
        this.newProduct = { name: '', price: '', description: '', category: '' }
        this.imageFile = null
        this.loadProducts?.()
      } catch (err) {
        console.error('Błąd przy dodawaniu produktu:', err)
        alert('❌ Nie udało się dodać produktu.')
      }
    },
    startEdit(product) {
      this.editingProduct = { ...product }
    },
    handleImageUpdate(e) {
      this.editingProduct.newImage = e.target.files[0]
    },
    handlePdfUpdate(e) {
      this.editingProduct.newPdf = e.target.files[0]
    },
    async updateProduct() {
      try {
        const formData = new FormData()
        formData.append('name', this.editingProduct.name)
        formData.append('price', this.editingProduct.price)
        formData.append('description', this.editingProduct.description)

        if (this.editingProduct.newImage) {
          formData.append('image', this.editingProduct.newImage)
        }
        if (this.editingProduct.newPdf) {
          formData.append('pdf', this.editingProduct.newPdf)
        }

        await axios.put(`http://localhost:5000/api/products/${this.editingProduct._id}`, formData, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'multipart/form-data'
          }
        })

        alert('✅ Produkt zaktualizowany!')
        this.editingProduct = null
        await this.loadProducts()
      } catch (err) {
        console.error('❌ Błąd edycji produktu:', err)
        alert('❌ Nie udało się zaktualizować produktu.')
      }
    },
    async deleteProduct(id) {
      if (!confirm('Czy na pewno chcesz usunąć ten produkt?')) return
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        })
        alert('✅ Produkt usunięty')
        await this.loadProducts()
      } catch (err) {
        console.error('❌ Błąd przy usuwaniu produktu:', err)
        alert('Błąd usuwania produktu')
      }
    }
  }
}
</script>

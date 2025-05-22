<template>
    <div class="p-6 max-w-4xl mx-auto bg-white shadow rounded">
      <h2 class="text-2xl font-bold mb-6 text-green-700">✏️ Edycja produktów</h2>
  
      <!-- Lista produktów -->
      <div v-for="product in products" :key="product._id" class="border-b py-4">
        <p><strong>{{ product.name }}</strong> – {{ product.price }} zł</p>
        <p class="text-sm text-gray-600">{{ product.description }}</p>
  
        <button
          class="text-sm text-blue-600 underline mt-2"
          @click="startEdit(product)"
        >
          ✏️ Edytuj
        </button>

        <button
  class="text-sm text-red-600 underline ml-2"
  @click="deleteProduct(product._id)"
>
  🗑️ Usuń
</button>
      </div>
  
      <!-- Formularz edycji -->
      <div v-if="editingProduct" class="mt-6 border-t pt-4">
        <h3 class="text-lg font-bold mb-2">Edytuj produkt</h3>
        <input v-model="editingProduct.name" placeholder="Nazwa" class="block mb-2 border px-2 py-1" />
        <input v-model="editingProduct.price" placeholder="Cena" type="number" class="block mb-2 border px-2 py-1" />
        <textarea v-model="editingProduct.description" placeholder="Opis" class="block mb-2 border px-2 py-1"></textarea>
        <input type="file" @change="handleImageUpdate" class="mb-2" />
        <input type="file" @change="handlePdfUpdate" class="mb-2" />
        <button @click="updateProduct" class="px-4 py-2 bg-blue-600 text-white rounded">💾 Zapisz zmiany</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import { getToken } from '../auth'
  
  export default {
    data() {
      return {
        products: [],
        editingProduct: null
      }
    },
    async mounted() {
      this.loadProducts()
    },
    methods: {
  async loadProducts() {
    try {
      const res = await axios.get('http://localhost:5000/api/products')
      this.products = res.data
    } catch (err) {
      console.error('❌ Błąd ładowania produktów:', err)
    }
  },
  startEdit(product) {
    this.editingProduct = { ...product }
  },
  handleImageUpdate(event) {
    this.editingProduct.newImage = event.target.files[0]
  },
  handlePdfUpdate(event) {
    this.editingProduct.newPdf = event.target.files[0]
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

      const res = await axios.put(
        `http://localhost:5000/api/products/${this.editingProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      alert('✅ Produkt zaktualizowany!')
      this.editingProduct = null
      this.loadProducts()
    } catch (err) {
      console.error('❌ Błąd edycji produktu:', err)
      alert('Błąd przy edycji produktu')
    }
  },

  // ✅ Dodaj to tutaj:
  async deleteProduct(id) {
    if (!confirm('Czy na pewno chcesz usunąć ten produkt?')) return

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })

      alert('✅ Produkt usunięty')
      this.loadProducts()
    } catch (err) {
      console.error('❌ Błąd przy usuwaniu produktu:', err)
      alert('Błąd usuwania produktu')
    }
  }
}

      
      
    }
    
  
  
  </script>
  
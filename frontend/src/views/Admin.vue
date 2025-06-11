<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded shadow">
    <h1 class="text-2xl font-bold mb-4 text-green-700">Panel administratora – Dodaj produkt</h1>

    <form @submit.prevent="addProduct" class="space-y-4">
      <input v-model="name" type="text" placeholder="Nazwa produktu" class="input" required />
      <input v-model.number="price" type="number" placeholder="Cena" class="input" required />
      <input v-model="description" type="text" placeholder="Opis" class="input" required />
      <input v-model="category" type="text" placeholder="Kategoria" class="input" required />

      <input type="file" @change="onImageSelected" accept="image/*" class="input" required />
      <input type="file" @change="onPdfSelected" accept="application/pdf" class="input" />

      <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        ➕ Dodaj produkt
      </button>
    </form>

    <p v-if="errorMessage" class="text-red-600 mt-4">❌ {{ errorMessage }}</p>
    <p v-if="successMessage" class="text-green-600 mt-4">✅ {{ successMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      name: '',
      price: '',
      description: '',
      category: '',
      imageFile: null,
      pdfFile: null,
      errorMessage: '',
      successMessage: ''
    };
  },
  methods: {
    onImageSelected(event) {
      this.imageFile = event.target.files[0];
    },
    onPdfSelected(event) {
      this.pdfFile = event.target.files[0];
    },
    async addProduct() {
      this.errorMessage = '';
      this.successMessage = '';

      const formData = new FormData();
      formData.append('name', this.name);
      formData.append('price', this.price);
      formData.append('description', this.description);
      formData.append('category', this.category);
      formData.append('image', this.imageFile);
      if (this.pdfFile) {
        formData.append('pdf', this.pdfFile);
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:5000/api/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });

        this.successMessage = 'Produkt dodany!';
        this.name = '';
        this.price = '';
        this.description = '';
        this.category = '';
        this.imageFile = null;
        this.pdfFile = null;
      } catch (error) {
        console.error('❌ Błąd przy dodawaniu produktu:', error);
        this.errorMessage = error.response?.data?.message || 'Błąd dodawania produktu';
      }
    }
  }
};
</script>

<style scoped>
.input {
  display: block;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>

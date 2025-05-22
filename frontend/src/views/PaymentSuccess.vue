<template>
    <div class="p-6 text-center">
      <h1 class="text-2xl font-bold text-green-700 mb-4">✅ Płatność zakończona</h1>
      <p>Zamówienie zostało opłacone. Dziękujemy!</p>
      <router-link to="/profile" class="text-blue-600 underline">Przejdź do profilu</router-link>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import { getToken } from '../auth'
  
  export default {
    async mounted() {
      const urlParams = new URLSearchParams(window.location.search)
      const orderId = urlParams.get('orderId')
      const orderID = urlParams.get('token') // token to identyfikator zamówienia PayPal
  
      if (orderId && orderID) {
        try {
          await axios.post(
            `http://localhost:5000/api/orders/${orderId}/paypal/capture`,
            { orderID },
            {
              headers: {
                Authorization: `Bearer ${getToken()}`
              }
            }
          )
          console.log('✅ Płatność potwierdzona')
        } catch (err) {
          console.error('❌ Błąd przy zatwierdzaniu płatności:', err)
        }
      }
    }
  }
  </script>
  
<template>
    <div class="p-6 text-center">
      <h1 class="text-2xl font-bold text-green-700 mb-4">✅ Płatność zakończona</h1>
      <p>Zamówienie zostało opłacone. Dziękujemy!</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import { getToken } from '../auth'
  
  export default {
    async mounted() {
      const orderId = new URLSearchParams(window.location.search).get('orderId')
      const orderID = new URLSearchParams(window.location.search).get('token') // token = PayPal orderID
  
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
        } catch (err) {
          console.error('❌ Błąd przy zatwierdzaniu płatności:', err)
        }
      }
    }
  }
  </script>
  
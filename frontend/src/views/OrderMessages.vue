<template>
  <div class="max-w-2xl mx-auto p-4 bg-white rounded shadow">
    <h2 class="text-xl font-bold mb-4 text-green-700">
      💬 Wiadomości do zamówienia #{{ orderId }}
    </h2>

    <div v-if="loading" class="text-gray-500">⏳ Ładowanie wiadomości...</div>

    <div v-else class="space-y-3 mb-4">
      <div
        v-for="msg in messages"
        :key="msg._id"
        :class="msg.sender?._id === userId ? 'text-right' : 'text-left'"
      >
        <div
          :class="[
            'inline-block px-3 py-2 rounded max-w-xs',
            msg.sender?._id === userId ? 'bg-green-100' : 'bg-gray-200'
          ]"
        >
          <p class="text-sm">{{ msg.content  }}</p>
          <p class="text-xs text-gray-500">{{ formatDate(msg.createdAt) }}</p>
        </div>
      </div>
    </div>

    <form @submit.prevent="sendMessage" class="flex gap-2">
      <input
        v-model="newMessage"
        type="text"
        placeholder="Napisz wiadomość..."
        class="flex-1 border px-3 py-2 rounded"
      />
      <button class="bg-green-600 text-white px-4 py-2 rounded">Wyślij</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import { getToken } from '../auth'

export default {
  data() {
    return {
      orderId: this.$route.params.orderId,
      messages: [],
      newMessage: '',
      loading: true,
      userId: null
    }
  },
  async mounted() {
    await this.decodeUserId()
    await this.fetchMessages()
    await this.markAsRead()
  },
  methods: {
    async decodeUserId() {
      const token = getToken()
      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split('.')[1]))
          this.userId = decoded.id
        } catch (e) {
          console.error('❌ Błąd dekodowania tokenu:', e)
        }
      }
    },
    async fetchMessages() {
      try {
        const res = await axios.get(`http://localhost:5000/api/messages/${this.orderId}`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        })
        this.messages = res.data
      } catch (err) {
        console.error('❌ Błąd pobierania wiadomości:', err)
        alert('Nie udało się pobrać wiadomości.')
      } finally {
        this.loading = false
      }
    },
    async sendMessage() {
      if (!this.newMessage.trim()) return

      try {
        const res = await axios.post(
          `http://localhost:5000/api/messages/${this.orderId}`,
          { content: this.newMessage },
          { headers: { Authorization: `Bearer ${getToken()}` } }
        )

        this.messages.push(res.data)
        this.newMessage = ''
      } catch (err) {
        console.error('❌ Błąd wysyłania wiadomości:', err)
        alert('Nie udało się wysłać wiadomości.')
      }
    },
    async markAsRead() {
      try {
        const res = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${getToken()}` }
        })
        const isAdmin = res.data?.isAdmin

        if (isAdmin) {
          await axios.put(`http://localhost:5000/api/messages/admin/mark-read/${this.orderId}`, {}, {
            headers: { Authorization: `Bearer ${getToken()}` }
          })
        }
        // jeśli będzie endpoint mark-read dla usera, tu można dodać analogicznie
      } catch (err) {
        console.error('❌ Błąd oznaczania wiadomości jako przeczytane:', err)
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString('pl-PL')
    }
  }
}
</script>


<style scoped>
/* Opcjonalne: dopasuj wygląd */
</style>

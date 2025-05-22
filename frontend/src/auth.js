// src/auth.js
import { reactive } from 'vue'

export const authState = reactive({
  loggedIn: !!localStorage.getItem('token'),
  isAdmin: false
})

export function getToken() {
  return localStorage.getItem('token')
}

export function isLoggedIn() {
  return authState.loggedIn
}

export function logout() {
  localStorage.removeItem('token')
  authState.loggedIn = false
  authState.isAdmin = false
}

export function updateAuthFromToken() {
  const token = getToken()
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]))
      authState.loggedIn = true
      authState.isAdmin = decoded.isAdmin === true
    } catch (e) {
      console.error('❌ Błąd dekodowania tokenu:', e)
      logout()
    }
  }
}

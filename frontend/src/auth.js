import { reactive } from 'vue';

export const authState = reactive({
  isLoggedIn: false,
  isAdmin: false,
  userId: null,
  token: null,
  unreadCount: 0,         
  adminUnreadCount: 0  
});

export function loadTokenFromStorage() {
  const token = localStorage.getItem('token');
  if (token) {
    setToken(token);
  }
}

export function setToken(token) {
  authState.token = token;
  localStorage.setItem('token', token);
   console.log('✔️ Ustawiam token:', token); // 👈 dodaj to

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    authState.isLoggedIn = true;
    authState.isAdmin = !!payload.isAdmin;
    authState.userId = payload.id;
  } catch (err) {
    console.error('❌ Błąd dekodowania tokenu:', err);
    logout();
  }
}

export function updateAuthFromToken() {
  const token = localStorage.getItem('token');
  if (token) {
    setToken(token);
  } else {
    logout();
  }
}

export function getToken() {
  return localStorage.getItem('token'); // ← bezpośrednio z localStorage, zawsze aktualne
}

export function logout() {
  authState.isLoggedIn = false;
  authState.isAdmin = false;
  authState.userId = null;
  authState.token = null;
  localStorage.removeItem('token');
  
}

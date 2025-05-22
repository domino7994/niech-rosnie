<template>
	<div>
		<nav>
			<router-link to="/">🏠 Strona główna</router-link>
			<router-link to="/shop">🛒 Sklep</router-link>

			<template v-if="loggedIn">
				<router-link to="/cart">🧺 Koszyk</router-link>
				<router-link to="/profile">👤 Profil</router-link>

				<router-link v-if="isAdmin" to="/admin">⚙️ Panel admina</router-link>
				<router-link v-if="isAdmin" to="/admin/edit-products"
					>✏️ Edytuj produkty</router-link
				>
				<router-link
					v-if="isAdmin"
					to="/admin/messages"
					class="mr-4 text-blue-600"
				>
					📨 Wiadomości
				</router-link>
				<button @click="logout">Wyloguj</button>
			</template>

			<template v-else>
				<router-link to="/login">🔐 Logowanie</router-link>
				<router-link to="/register">📝 Rejestracja</router-link>
			</template>
		</nav>

		<router-view />
	</div>
</template>

<script>
import { authState, logout, updateAuthFromToken } from './auth';

export default {
	name: 'App',
	computed: {
		loggedIn() {
			return authState.loggedIn;
		},
		isAdmin() {
			return authState.isAdmin;
		},
	},
	mounted() {
		updateAuthFromToken();
	},
	methods: {
		logout() {
			logout();
			this.$router.push('/login'); // opcjonalnie przekierowanie po wylogowaniu
		},
	},
};
</script>

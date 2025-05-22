<template>
	<div class="max-w-md mx-auto bg-white p-6 rounded shadow">
		<h2 class="text-2xl font-bold mb-4">Logowanie</h2>
		<form @submit.prevent="login">
			<input v-model="email" type="email" placeholder="Email" class="input" />
			<input
				v-model="password"
				type="password"
				placeholder="Hasło"
				class="input"
			/>
			<button
				type="submit"
				class="bg-green-600 text-white px-4 py-2 rounded mt-4"
			>
				Zaloguj się
			</button>
			<p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
		</form>
	</div>
</template>

<script>
import axios from 'axios';
import { updateAuthFromToken } from '../auth';

export default {
	data() {
		return {
			email: '',
			password: '',
			error: '',
		};
	},
	methods: {
		async login() {
			try {
				const res = await axios.post('http://localhost:5000/api/users/login', {
					email: this.email,
					password: this.password,
				});

				localStorage.setItem('token', res.data.token);

				// 🔄 zaktualizuj authState
				updateAuthFromToken();

				// 🧭 przekierowanie w zależności od roli
				const decoded = JSON.parse(atob(res.data.token.split('.')[1]));
				if (decoded.isAdmin) {
					this.$router.push('/admin');
				} else {
					this.$router.push('/profile');
				}
			} catch (err) {
				this.error = err.response?.data?.message || 'Błąd logowania';
			}
		},
	},
};
</script>

<style scoped>
.input {
	display: block;
	width: 100%;
	padding: 0.6rem;
	margin-bottom: 1rem;
	border: 1px solid #ccc;
	border-radius: 6px;
}
</style>

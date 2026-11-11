<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface LoginResponse {
  token: string
  nomeUser?: string
  nome?: string
  nomeAdmin?: string
  error?: string
  message?: string
}

const router = useRouter()

const email = ref('')
const senha = ref('')

const carregando = ref(false)
const erro = ref<string | null>(null)
const sucesso = ref(false)

const fazerLogin = async () => {
  if (!email.value || !senha.value) {
    erro.value = 'Preencha todos os campos.'
    return
  }

  carregando.value = true
  erro.value = null
  sucesso.value = false

  try {
    const resposta = await fetch('http://localhost:5017/api/Login/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        senha: senha.value
      })
    })

    const dados: LoginResponse = await resposta.json().catch(() => ({}) as LoginResponse)

    if (!resposta.ok) {
      throw new Error(dados.error || dados.message || 'Falha ao autenticar. Verifique suas credenciais.')
    }

    if (dados.token) {
      // Salva o token JWT
      localStorage.setItem('token', dados.token)
      
      // Salva a chave 'nomeUser' retornada pelo backend
      const nomeExibicao = dados.nomeUser || dados.nome || dados.nomeAdmin || 'Usuário'
      localStorage.setItem('nomeUser', nomeExibicao)

      sucesso.value = true

      await router.push('/home')
    } else {
      throw new Error('Token não recebido da API.')
    }
  } catch (err: any) {
    erro.value = err.message
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <h2>Login</h2>

    <p v-if="carregando" class="status info">Entrando...</p>
    <p v-if="erro" class="status erro">{{ erro }}</p>
    <p v-if="sucesso" class="status sucesso">Login realizado com sucesso!</p>

    <form @submit.prevent="fazerLogin" novalidate>
      <div class="form-group">
        <label for="email">E-mail:</label>
        <input 
          id="email"
          type="email" 
          v-model="email" 
          placeholder="seu@email.com"
          required 
        />
      </div>

      <div class="form-group">
        <label for="senha">Senha:</label>
        <input 
          id="senha"
          type="password" 
          v-model="senha" 
          placeholder="••••••••"
          required 
        />
      </div>

      <button type="submit" :disabled="carregando">
        {{ carregando ? 'Aguarde...' : 'Entrar' }}
      </button>
    </form>
  </div>
</template>

<style scoped></style>
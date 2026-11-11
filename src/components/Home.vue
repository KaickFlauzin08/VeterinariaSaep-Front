<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const nomeUsuario = ref('')

onMounted(() => {
  // Obtém o nome salvo no login pela chave 'nomeUser'
  const salvos = localStorage.getItem('nomeUser')
  nomeUsuario.value = salvos && salvos !== 'undefined' ? salvos : 'Administrador'
})

const irParaTutor = () => {
  router.push('/tutor')
}

const irParaPet = () => {
  router.push('/pet')
}

const irParaAgendamento = () => {
  router.push('/agendamento')
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('nomeUser')
  localStorage.removeItem('nomeAdmin')
  router.push('/')
}
</script>

<template>
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <h1>Bem-vindo, {{ nomeUsuario }}!</h1>
    <button @click="logout">Sair</button>
  </div>

  <div style="margin-top: 20px;">
    <button @click="irParaTutor">Ir para Tutores</button>
    <button @click="irParaPet" style="margin-left: 10px;">Ir para Pets</button>
    <button @click="irParaAgendamento" style="margin-left: 10px;">Ir para Agendamentos</button>
  </div>
</template>
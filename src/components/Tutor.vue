<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface Tutor {
  id: number
  nomeTutor: string
  cpfTutor: string
}

const router = useRouter()

const voltar = () => {
  router.push('/home')
}

const nomeTutor = ref('')
const cpfTutor = ref('')
const tutores = ref<Tutor[]>([])

const Url = 'http://localhost:5017/api/Tutor'

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
})

// GET
const GetTutores = async () => {
  try {
    const res = await fetch(Url, { 
      method: 'GET', 
      headers: getHeaders() 
    })
    if (!res.ok) throw new Error('Falha ao obter lista')
    tutores.value = await res.json()
  } catch (err: any) {
    console.error(err.message)
  }
}

// POST
const CadastrarTutor = async () => {
  if (!nomeTutor.value || !cpfTutor.value) return

  try {
    const res = await fetch(Url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        id: 0,
        nomeTutor: nomeTutor.value,
        cpfTutor: cpfTutor.value
      })
    })
    if (!res.ok) throw new Error('Falha ao cadastrar')

    LimparCampos()
    await GetTutores()
  } catch (err: any) {
    console.error(err.message)
  }
}

// PUT
const AtualizarTutor = async (item: Tutor) => {
  const novoNome = prompt('Novo nome:', item.nomeTutor)
  const novoCpf = prompt('Novo CPF:', item.cpfTutor)

  if (!novoNome || !novoCpf) return

  try {
    const res = await fetch(Url, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        id: item.id,
        nomeTutor: novoNome,
        cpfTutor: novoCpf
      })
    })
    if (!res.ok) throw new Error('Falha ao atualizar')

    await GetTutores()
  } catch (err: any) {
    console.error(err.message)
  }
}

// DELETE
const DeletarTutor = async (id: number) => {
  if (!confirm('Deseja excluir este tutor?')) return

  try {
    const res = await fetch(`${Url}/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    if (!res.ok) throw new Error('Falha ao excluir')

    await GetTutores()
  } catch (err: any) {
    console.error(err.message)
  }
}

const LimparCampos = () => {
  nomeTutor.value = ''
  cpfTutor.value = ''
}

onMounted(GetTutores)
</script>

<template>
  <button @click="voltar">Voltar para Home</button>
  <div>
    <h2>Cadastro de Tutor</h2>

    <form @submit.prevent="CadastrarTutor" novalidate>
      <div>
        <label for="nomeTutor">Nome:</label>
        <input type="text" id="nomeTutor" v-model="nomeTutor" required />
      </div>

      <div>
        <label for="cpfTutor">CPF:</label>
        <input type="text" id="cpfTutor" v-model="cpfTutor" required />
      </div>

      <button type="submit">Cadastrar</button>
    </form>

    <hr />

    <h2>Lista de Tutores</h2>

    <ul v-if="tutores.length > 0">
      <li v-for="item in tutores" :key="item.id" style="margin-bottom: 8px;">
        <strong>{{ item.nomeTutor }}</strong> | CPF: {{ item.cpfTutor }}
        <button @click="AtualizarTutor(item)" style="margin-left: 10px;">Editar</button>
        <button @click="DeletarTutor(item.id)">Excluir</button>
      </li>
    </ul>

    <p v-else>Nenhum tutor cadastrado.</p>
  </div>
</template>
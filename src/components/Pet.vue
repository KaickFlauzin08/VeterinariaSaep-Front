<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface Pet {
  id: number
  nomePet: string
  especie: string
  raca: string
  tutorId: number
}

interface Tutor {
  id: number
  nomeTutor: string
}

const router = useRouter()

const voltar = () => {
  router.push('/home')
}

const nomePet = ref('')
const especie = ref('')
const raca = ref('')
const tutorId = ref('')
const pets = ref<Pet[]>([])
const tutores = ref<Tutor[]>([])

const Url = 'http://localhost:5017/api/Pets'
const UrlTutor = 'http://localhost:5017/api/Tutor'

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
})

// GET Tutores (para preencher o select)
const GetTutores = async () => {
  try {
    const res = await fetch(UrlTutor, { 
      method: 'GET', 
      headers: getHeaders() 
    })
    if (res.ok) tutores.value = await res.json()
  } catch (err: any) {
    console.error(err.message)
  }
}

// GET Pets
const GetPets = async () => {
  try {
    const res = await fetch(Url, { 
      method: 'GET', 
      headers: getHeaders() 
    })
    if (!res.ok) throw new Error('Falha ao obter lista')
    pets.value = await res.json()
  } catch (err: any) {
    console.error(err.message)
  }
}

// POST
const CadastrarPet = async () => {
  if (!nomePet.value || !especie.value || !raca.value || !tutorId.value) return

  try {
    const res = await fetch(Url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        id: 0,
        nomePet: nomePet.value,
        especie: especie.value,
        raca: raca.value,
        tutorId: Number(tutorId.value)
      })
    })
    if (!res.ok) throw new Error('Falha ao cadastrar')

    LimparCampos()
    await GetPets()
  } catch (err: any) {
    console.error(err.message)
  }
}

// PUT
const AtualizarPet = async (item: Pet) => {
  const novoNome = prompt('Novo nome do Pet:', item.nomePet)
  const novaEspecie = prompt('Nova Espécie:', item.especie)
  const novaRaca = prompt('Nova Raça:', item.raca)
  const novoTutorId = prompt('Novo Tutor ID:', item.tutorId.toString())

  if (!novoNome || !novaEspecie || !novaRaca || !novoTutorId) return

  try {
    const res = await fetch(Url, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        id: item.id,
        nomePet: novoNome,
        especie: novaEspecie,
        raca: novaRaca,
        tutorId: Number(novoTutorId)
      })
    })
    if (!res.ok) throw new Error('Falha ao atualizar')

    await GetPets()
  } catch (err: any) {
    console.error(err.message)
  }
}

// DELETE
const DeletarPet = async (id: number) => {
  if (!confirm('Deseja excluir este pet?')) return

  try {
    const res = await fetch(`${Url}/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    if (!res.ok) throw new Error('Falha ao excluir')

    await GetPets()
  } catch (err: any) {
    console.error(err.message)
  }
}

const LimparCampos = () => {
  nomePet.value = ''
  especie.value = ''
  raca.value = ''
  tutorId.value = ''
}

onMounted(() => {
  GetTutores()
  GetPets()
})
</script>

<template>
  <button @click="voltar">Voltar para Home</button>
  <div>
    <h2>Cadastro de Pet</h2>

    <form @submit.prevent="CadastrarPet" novalidate>
      <div>
        <label for="nomePet">Nome do Pet:</label>
        <input type="text" id="nomePet" v-model="nomePet" required />
      </div>

      <div>
        <label for="especie">Espécie:</label>
        <input type="text" id="especie" v-model="especie" required />
      </div>

      <div>
        <label for="raca">Raça:</label>
        <input type="text" id="raca" v-model="raca" required />
      </div>

      <div>
        <label for="tutorId">Tutor:</label>
        <select v-model="tutorId" required>
          <option value="" disabled>Selecione um Tutor</option>
          <option v-for="t in tutores" :key="t.id" :value="t.id">
            {{ t.nomeTutor }} (ID: {{ t.id }})
          </option>
        </select>
      </div>

      <button type="submit">Cadastrar</button>
    </form>

    <hr />

    <h2>Lista de Pets</h2>

    <ul v-if="pets.length > 0">
      <li v-for="item in pets" :key="item.id" style="margin-bottom: 8px;">
        <strong>{{ item.nomePet }}</strong> | Espécie: {{ item.especie }} | Raça: {{ item.raca }} | Tutor ID: {{ item.tutorId }}
        <button @click="AtualizarPet(item)" style="margin-left: 10px;">Editar</button>
        <button @click="DeletarPet(item.id)">Excluir</button>
      </li>
    </ul>

    <p v-else>Nenhum pet cadastrado.</p>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface Agendamento {
  id: number
  data: string
  servico: string
  petId: number
  nomePet?: string
  tutorId: number
  nomeTutor?: string
}

const router = useRouter()

const voltar = () => {
  router.push('/home')
}

const dataAgendamento = ref('')
const servico = ref('')
const petId = ref('')
const tutorId = ref('')
const agendamentos = ref<Agendamento[]>([])

const Url = 'http://localhost:5017/api/Agendamento'

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
})

// GET
const GetAgendamentos = async () => {
  try {
    const res = await fetch(Url, { 
      method: 'GET', 
      headers: getHeaders() 
    })
    if (!res.ok) throw new Error('Falha ao obter agendamentos')
    agendamentos.value = await res.json()
  } catch (err: any) {
    console.error(err.message)
  }
}

// POST
const CadastrarAgendamento = async () => {
  if (!dataAgendamento.value || !petId.value || !tutorId.value) return

  try {
    const res = await fetch(Url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        id: 0,
        data: dataAgendamento.value, // Envia o valor retornado do datetime-local
        servico: servico.value,
        petId: Number(petId.value),
        tutorId: Number(tutorId.value)
      })
    })
    if (!res.ok) throw new Error('Falha ao cadastrar agendamento')

    LimparCampos()
    await GetAgendamentos()
  } catch (err: any) {
    console.error(err.message)
  }
}

// PUT
const AtualizarAgendamento = async (item: Agendamento) => {
  const novaData = prompt('Nova Data/Hora (AAAA-MM-DDTHH:mm):', item.data.substring(0, 16))
  const novoPetId = prompt('Novo ID do Pet:', item.petId.toString())
  const novoTutorId = prompt('Novo ID do Tutor:', item.tutorId.toString())
  const novoservico = prompt('Novo Serviço:', item.servico)

  if (!novaData || !novoPetId || !novoTutorId || !novoservico) return

  try {
    const res = await fetch(Url, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        id: item.id,
        data: novaData,
        servico: novoservico,
        petId: Number(novoPetId),
        tutorId: Number(novoTutorId)
      })
    })
    if (!res.ok) throw new Error('Falha ao atualizar agendamento')

    await GetAgendamentos()
  } catch (err: any) {
    console.error(err.message)
  }
}

// DELETE
const DeletarAgendamento = async (id: number) => {
  if (!confirm('Deseja excluir este agendamento?')) return

  try {
    const res = await fetch(`${Url}/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    if (!res.ok) throw new Error('Falha ao excluir agendamento')

    await GetAgendamentos()
  } catch (err: any) {
    console.error(err.message)
  }
}

const LimparCampos = () => {
  dataAgendamento.value = ''
  servico.value = ''
  petId.value = ''
  tutorId.value = ''
}

// Formatação simples para exibição da data local na template
const formatarData = (dataIso: string) => {
  if (!dataIso) return ''
  return new Date(dataIso).toLocaleString('pt-BR')
}

onMounted(GetAgendamentos)
</script>

<template>
  <button @click="voltar">Voltar para Home</button>
  <div>
    <h2>Agendamento</h2>

    <form @submit.prevent="CadastrarAgendamento" novalidate>
      <div>
        <label for="data">Data/Hora:</label>
        <input type="datetime-local" id="data" v-model="dataAgendamento" required />
      </div>

      <div>
        <label for="petId">ID do Pet:</label>
        <input type="number" id="petId" v-model="petId" required />
      </div>

      <div>
        <label for="tutorId">ID do Tutor:</label>
        <input type="number" id="tutorId" v-model="tutorId" required />
      </div>

      <div>
        <label for="servico">Serviço:</label>
        <input type="text" id="servico" v-model="servico" required />
      </div>

      <button type="submit">Agendar</button>
    </form>

    <hr />

    <h2>Lista de Agendamentos</h2>

    <ul v-if="agendamentos.length > 0">
      <li v-for="item in agendamentos" :key="item.id" style="margin-bottom: 8px;">
        <strong>Data:</strong> {{ formatarData(item.data) }} | 
        <strong>Pet:</strong> {{ item.nomePet || item.petId }} | 
        <strong>Tutor:</strong> {{ item.nomeTutor || item.tutorId }} | 
        <strong>Serviço:</strong> {{ item.servico }}
        
        <button @click="AtualizarAgendamento(item)" style="margin-left: 10px;">Editar</button>
        <button @click="DeletarAgendamento(item.id)">Excluir</button>
      </li>
    </ul>

    <p v-else>Nenhum agendamento encontrado.</p>
  </div>
</template>
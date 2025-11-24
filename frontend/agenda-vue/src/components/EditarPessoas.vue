<script setup>
import { ref } from 'vue'
import axios from 'axios'
import EditarPessoas from './EditarPessoas.vue'

// Props e emits
const props = defineProps({ compromissos: Array })
const emit = defineEmits(['atualizar'])

// Controle de edição de pessoas
const editarId = ref(null)

// Controle do modal de edição de compromisso
const editandoCompromisso = ref(false)
const compromissoEdit = ref({
  _id: null,
  titulo: "",
  descricao: ""
})

function editarCompromisso(compromisso) {
  editandoCompromisso.value = true
  compromissoEdit.value = {
    _id: compromisso._id,
    titulo: compromisso.titulo,
    descricao: compromisso.descricao
  }
}

function cancelarEdicao() {
  editandoCompromisso.value = false
}

async function salvarEdicao() {
  await axios.put(`http://localhost:3000/compromissos/${compromissoEdit.value._id}`, {
    titulo: compromissoEdit.value.titulo,
    descricao: compromissoEdit.value.descricao
  })

  editandoCompromisso.value = false
  emit('atualizar')
}

async function excluir(id) {
  await axios.delete(`http://localhost:3000/compromissos/${id}`)
  emit('atualizar')
}
</script>

<template>
  <div>
    <div v-for="c in compromissos" :key="c._id" class="card">
      <h3>{{ c.titulo }}</h3>
      <p><b>Data/Hora:</b> {{ new Date(c.dataHora).toLocaleString('pt-BR') }}</p>
      <p>{{ c.descricao }}</p>

      <p><b>Pessoas:</b>
        <span v-for="(p, index) in c.pessoas" :key="p._id">
          {{ p.nome }} ({{ p.funcao }})
          <span v-if="index < c.pessoas.length - 1">, </span>
        </span>
      </p>

      <button @click="editarId = c._id" class="btn btn-primary">Editar Pessoas</button>
      <button @click="editarCompromisso(c)" class="btn btn-warning">Editar Compromisso</button>
      <button @click="excluir(c._id)" class="btn btn-danger">Excluir Compromisso</button>

      <EditarPessoas
        v-if="editarId === c._id"
        :compromisso="c"
        @fechar="editarId = null"
        @atualizar="emit('atualizar')"
      />
    </div>

    <div v-if="editandoCompromisso" class="modal-overlay">
      <div class="modal-content">
        <h2>Editar Compromisso</h2>

        <label>Título:</label>
        <input v-model="compromissoEdit.titulo" type="text" class="form-control" />

        <label>Descrição:</label>
        <textarea v-model="compromissoEdit.descricao" class="form-control"></textarea>

        <div class="modal-actions">
          <button @click="salvarEdicao" class="btn btn-success">Salvar</button>
          <button @click="cancelarEdicao" class="btn btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>
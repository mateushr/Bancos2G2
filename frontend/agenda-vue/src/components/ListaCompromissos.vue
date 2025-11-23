<script setup>
import { ref } from 'vue'
import axios from 'axios'
import EditarPessoas from './EditarPessoas.vue'

const props = defineProps({ compromissos: Array })
const emit = defineEmits(['atualizar'])

const editarId = ref(null)

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
          {{ p.nome }} ({{ p.funcao }})<span v-if="index < c.pessoas.length - 1">, </span>
        </span>
      </p>

      <button @click="editarId = c._id" class="btn btn-primary">Editar Pessoas</button>
      <button @click="excluir(c._id)" class="btn btn-danger">Excluir Compromisso</button>

      <EditarPessoas
        v-if="editarId === c._id"
        :compromisso="c"
        @fechar="editarId = null"
        @atualizar="emit('atualizar')"
      />
    </div>
  </div>
</template>

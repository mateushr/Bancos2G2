<script setup>
import { ref } from 'vue'
import axios from 'axios'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
const props = defineProps({ pessoas: Array })
const emit = defineEmits(['salvar'])

const dataHora = ref('')
const titulo = ref('')
const descricao = ref('')
const pessoasSelecionadas = ref([])

async function cadastrar() {
  if (!titulo.value || !dataHora.value) return alert('Título e data/hora obrigatórios!')

  await axios.post('http://localhost:3000/compromissos', {
    dataHora: dataHora.value,
    titulo: titulo.value,
    descricao: descricao.value,
    pessoas: pessoasSelecionadas.value
  })

  dataHora.value = ''
  titulo.value = ''
  descricao.value = ''
  pessoasSelecionadas.value = []

  emit('salvar')
  alert('Compromisso cadastrado!')
}
</script>

<template>
  <div class="form-compromisso mb-4">
    <h2>Novo Compromisso</h2>

    <label>Data e Hora:</label>
    <input type="datetime-local" v-model="dataHora" />

    <label>Título:</label>
    <input type="text" v-model="titulo" />

    <label>Descrição:</label>
    <textarea v-model="descricao"></textarea>

    <label>Pessoas:</label>
      <multiselect
        v-model="pessoasSelecionadas"
        :options="pessoas"
        :multiple="true"
        :label="'nome'"
        :track-by="'_id'"
        placeholder="Selecione pessoas"
      />

    <button @click="cadastrar" class="btn btn-primary mt-2">Cadastrar</button>
  </div>
</template>

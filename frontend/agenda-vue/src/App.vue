<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import FormPessoa from './components/FormPessoa.vue'
import FormCompromisso from './components/FormCompromisso.vue'
import ListaCompromissos from './components/ListaCompromissos.vue'
import './assets/estilos.css'

const showFormPessoa = ref(false)
const todasPessoas = ref([])
const compromissos = ref([])

function abrirFormPessoa() { showFormPessoa.value = true }
function fecharFormPessoa() { showFormPessoa.value = false }

async function carregarDados() {
  const resPessoas = await axios.get('http://localhost:3000/pessoas')
  todasPessoas.value = resPessoas.data

  const resComp = await axios.get('http://localhost:3000/compromissos')
  compromissos.value = resComp.data.items
}

onMounted(carregarDados)
</script>

<template>
  <div class="container">
    <h1>Sistema de Agenda</h1>

    <button @click="abrirFormPessoa" class="btn btn-primary mb-3">
      Adicionar Pessoa
    </button>

    <div v-if="showFormPessoa" class="modal-backdrop">
      <div class="modal-content">
        <h3>Nova Pessoa</h3>
        <FormPessoa @fechar="fecharFormPessoa" @salvar="carregarDados" />
        <button @click="fecharFormPessoa" class="btn btn-secondary mt-2">Cancelar</button>
      </div>
    </div>

    <FormCompromisso :pessoas="todasPessoas" @salvar="carregarDados"/>

    <h2>Compromissos Cadastrados</h2>
    <ListaCompromissos :compromissos="compromissos" @atualizar="carregarDados" />
  </div>
</template>

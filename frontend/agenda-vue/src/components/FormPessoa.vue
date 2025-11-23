<script setup>
import { ref } from 'vue'

const nome = ref('')
const email = ref('')
const funcao = ref('')

const emit = defineEmits(['fechar'])

function salvarPessoa() {
  // enviar para backend via fetch/axios
  console.log({ nome: nome.value, email: email.value, funcao: funcao.value })

  // fechar o modal após salvar
  emit('fechar')
}
</script>

<template>
  <div>
    <label>Nome:</label>
    <input v-model="nome" type="text" />

    <label>Email:</label>
    <input v-model="email" type="email" />

    <label>Função:</label>
    <input v-model="funcao" type="text" />

    <button @click="salvarPessoa" class="btn btn-success mt-2">Salvar</button>
  </div>
</template>

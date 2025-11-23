<script setup>
import { ref } from 'vue'
const emit = defineEmits(['fechar', 'salvar'])

const nome = ref('')
const email = ref('')
const funcao = ref('')

async function salvarPessoa() {
  await fetch('http://localhost:3000/pessoas', {
    method:'POST',
    headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify({ nome: nome.value, email: email.value, funcao: funcao.value })
  })

  nome.value = ''
  email.value = ''
  funcao.value = ''

  emit('salvar') 
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

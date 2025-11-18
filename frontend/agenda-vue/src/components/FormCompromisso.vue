<script setup>
import axios from "axios";
import { ref } from "vue";

const dataHora = ref("");
const titulo = ref("");
const descricao = ref("");
const pessoasTexto = ref("");

const cadastrar = async () => {
  const pessoas = pessoasTexto.value.split(",").map(p => p.trim());

  await axios.post("http://localhost:3000/compromissos", {
    dataHora: dataHora.value,
    titulo: titulo.value,
    descricao: descricao.value,
    pessoas: pessoas
  });

  alert("Compromisso cadastrado!");
  window.location.reload();
};
</script>

<template>
  <div class="form">
    <h2>Novo Compromisso</h2>
    
    <label>Data e Hora:</label>
    <input type="datetime-local" v-model="dataHora" />

    <label>Título:</label>
    <input type="text" v-model="titulo" />

    <label>Descrição:</label>
    <textarea v-model="descricao"></textarea>

    <label>Pessoas (separe por vírgula):</label>
    <input type="text" v-model="pessoasTexto" />

    <button @click="cadastrar">Cadastrar</button>
  </div>
</template>

<style>
.form {
  background: #333;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

input, textarea {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
}

button {
  padding: 10px;
  cursor: pointer;
}
</style>

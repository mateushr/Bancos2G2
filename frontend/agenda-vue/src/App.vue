<script setup>
import ListaCompromissos from './components/ListaCompromissos.vue'
import FormCompromisso from './components/FormCompromisso.vue'
</script>

<template>
  <div class="container">
    <h1>Sistema de Agenda</h1>

    <FormCompromisso />

    <h2>Compromissos Cadastrados</h2>
    <ListaCompromissos />
  </div>
</template>

<style>
body {
  background: #202020;
  color: #fff;
  font-family: Arial;
}

.container {
  width: 80%;
  margin: auto;
  padding: 20px;
}
</style>

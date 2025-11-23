<script setup>
import { ref } from 'vue'
import ListaCompromissos from './components/ListaCompromissos.vue'
import FormCompromisso from './components/FormCompromisso.vue'
import FormPessoa from './components/FormPessoa.vue' // novo componente de pessoa

const showFormPessoa = ref(false) // controla se o modal está aberto

function abrirFormPessoa() {
  showFormPessoa.value = true
}

function fecharFormPessoa() {
  showFormPessoa.value = false
}
</script>

<template>
  <div class="container">
    <h1>Sistema de Agenda</h1>

    <!-- Botão no topo -->
    <button @click="abrirFormPessoa" class="btn btn-primary mb-3">
      Adicionar Pessoa
    </button>

    <!-- Modal Popup -->
    <div v-if="showFormPessoa" class="modal-backdrop">
      <div class="modal-content">
        <h3>Nova Pessoa</h3>
        <FormPessoa @fechar="fecharFormPessoa" />
        <button @click="fecharFormPessoa" class="btn btn-secondary mt-2">Cancelar</button>
      </div>
    </div>

    <FormCompromisso />

    <h2>Compromissos Cadastrados</h2>
    <ListaCompromissos />
  </div>
</template>

<style scoped>
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

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}
</style>

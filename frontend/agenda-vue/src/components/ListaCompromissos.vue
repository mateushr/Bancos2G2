<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import EditarPessoas from "./EditarPessoas.vue";

const compromissos = ref([]);
const editarId = ref(null);

const carregar = async () => {
  const res = await axios.get("http://localhost:3000/compromissos");
  compromissos.value = res.data;
};

const excluir = async (id) => {
  await axios.delete(`http://localhost:3000/compromissos/${id}`);
  carregar();
};

onMounted(carregar);
</script>

<template>
  <div>
    <div v-for="c in compromissos" :key="c._id" class="card">
      <h3>{{ c.titulo }}</h3>
      <p><b>Data/Hora:</b> {{ c.dataHora }}</p>
      <p>{{ c.descricao }}</p>

      <p><b>Pessoas:</b> {{ c.pessoas.join(", ") }}</p>

      <button @click="editarId = c._id">Editar Pessoas</button>
      <button @click="excluir(c._id)">Excluir Compromisso</button>

      <EditarPessoas
        v-if="editarId === c._id"
        :compromisso="c"
        @fechar="editarId = null"
        @atualizar="carregar"
      />
    </div>
  </div>
</template>

<style>
.card {
  background: #2b2b2b;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
}
button {
  margin-right: 10px;
}
</style>

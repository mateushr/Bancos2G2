<script setup>
import axios from "axios";
import { ref } from "vue";

const props = defineProps(["compromisso"]);
const emit = defineEmits(["fechar", "atualizar"]);

const novasPessoas = ref(props.compromisso.pessoas.join(", "));

const salvar = async () => {
  const lista = novasPessoas.value.split(",").map(p => p.trim());

  await axios.put(`http://localhost:3000/compromissos/${props.compromisso._id}/pessoas`, {
    pessoas: lista
  });

  emit("atualizar");
  emit("fechar");
};
</script>

<template>
  <div class="popup">
    <h3>Editar Pessoas</h3>

    <input type="text" v-model="novasPessoas" />

    <button @click="salvar">Salvar</button>
    <button @click="$emit('fechar')">Fechar</button>
  </div>
</template>


<script setup>
import axios from "axios";
import { ref, onMounted, watch } from "vue";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";

const props = defineProps(["compromisso"]);
const emit = defineEmits(["fechar", "atualizar"]);

const todasPessoas = ref([]);        
const pessoasSelecionadas = ref([]); 
const carregado = ref(false);        // Flag para indicar que os dados foram carregados

const carregarPessoas = async () => {
  try {
    const res = await axios.get("http://localhost:3000/pessoas");
    todasPessoas.value = res.data;
    pessoasSelecionadas.value = props.compromisso.pessoas.map(p => {
      return res.data.find(t => t._id === p._id) || p;
    });

    carregado.value = true;
  } catch (err) {
    console.error("Erro ao carregar pessoas:", err);
  }
};

onMounted(carregarPessoas);

const salvar = async () => {
  try {
    await axios.put(
      `http://localhost:3000/compromissos/${props.compromisso._id}/pessoas`,
      { pessoas: pessoasSelecionadas.value }
    );

    emit("atualizar"); 
    emit("fechar");    
  } catch (err) {
    console.error("Erro ao salvar pessoas:", err);
    alert("Não foi possível salvar as alterações.");
  }
};
</script>

<template>
  <div class="popup">
    <h3>Editar Pessoas</h3>

    <multiselect
      v-if="carregado"
      v-model="pessoasSelecionadas"
      :options="todasPessoas"
      :multiple="true"
      :label="'nome'"
      :track-by="'_id'"
      placeholder="Selecione pessoas"
    />

    <p v-else>Carregando pessoas...</p>

    <div class="botoes">
      <button @click="salvar" class="btn btn-primary">Salvar</button>
      <button @click="$emit('fechar')" class="btn btn-secondary">Fechar</button>
    </div>
  </div>
</template>
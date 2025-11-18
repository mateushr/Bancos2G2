const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(express.json());

// HABILITA CORS
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
}));

// Conexão com MongoDB
mongoose.connect("mongodb://localhost:27017/agenda", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Modelo do compromisso
const Compromisso = mongoose.model("Compromisso", new mongoose.Schema({
    dataHora: String,
    titulo: String,
    descricao: String,
    pessoas: [String]
}));

// LISTAR
app.get("/compromissos", async (req, res) => {
    const lista = await Compromisso.find();
    res.json(lista);
});

// CADASTRAR
app.post("/compromissos", async (req, res) => {
    const novo = await Compromisso.create(req.body);
    res.json(novo);
});

// ALTERAR TÍTULO E DESCRIÇÃO
app.put("/compromissos/:id", async (req, res) => {
    const { titulo, descricao } = req.body;
    const compromisso = await Compromisso.findByIdAndUpdate(
        req.params.id,
        { titulo, descricao },
        { new: true }
    );
    res.json(compromisso);
});

// ALTERAR PESSOAS
app.put("/compromissos/:id/pessoas", async (req, res) => {
    const compromisso = await Compromisso.findByIdAndUpdate(
        req.params.id,
        { pessoas: req.body.pessoas },
        { new: true }
    );
    res.json(compromisso);
});

// REMOVER UMA PESSOA
app.delete("/compromissos/:id/pessoas/:pessoa", async (req, res) => {
    const compromisso = await Compromisso.findById(req.params.id);
    compromisso.pessoas = compromisso.pessoas.filter(p => p !== req.params.pessoa);
    await compromisso.save();
    res.json(compromisso);
});

// EXCLUIR COMPROMISSO
app.delete("/compromissos/:id", async (req, res) => {
    await Compromisso.findByIdAndDelete(req.params.id);
    res.json({ mensagem: "Compromisso removido" });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));

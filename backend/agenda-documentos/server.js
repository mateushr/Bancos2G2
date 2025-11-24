const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const Joi = require('joi');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting 
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// CORS 
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND_ORIGIN }));

//esquema Mongoose para pessoa
const pessoaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String },
  funcao: { type: String }
});

const Pessoa = mongoose.model('Pessoa', pessoaSchema);

// Modelo Mongoose
const compromissoSchema = new mongoose.Schema({
  dataHora: { type: Date, required: true },
  titulo: { type: String, required: true, trim: true },
  descricao: { type: String, default: '', trim: true },
  pessoas: { type: [pessoaSchema], default: [] }
}, { timestamps: true });

const Compromisso = mongoose.model('Compromisso', compromissoSchema);

module.exports = { Compromisso };

// Esquemas Joi para validação
const validatePessoaSchema = Joi.object({
  nome: Joi.string().min(1).required()
});

const compromissoCreateSchema = Joi.object({
  dataHora: Joi.date().required(),
  titulo: Joi.string().min(1).max(200).required(),
  descricao: Joi.string().allow('').max(2000),
  pessoas: Joi.array().items(validatePessoaSchema).default([])
});

const compromissoUpdateSchema = Joi.object({
  titulo: Joi.string().min(1).max(200),
  descricao: Joi.string().allow('').max(2000)
}).or('titulo', 'descricao'); // Pelo menos um dos dois deve estar presente


const pessoasReplaceSchema = Joi.object({
  pessoas: Joi.array().items(validatePessoaSchema).required()
});

// validação
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ error: error.details.map(d => d.message).join(', ') });
    req.body = value;
    next();
  };
}

function validateObjectId(req, res, next) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });
  next();
}

//rotas
app.get('/pessoas', async (req, res) => {
  const pessoas = await Pessoa.find().sort({ nome: 1 });
  res.json(pessoas);
});

app.post('/pessoas', validate(validatePessoaSchema), async (req, res) => {
  const created = await Pessoa.create(req.body);
  res.status(201).json(created);
});


// Listar compromissos
app.get('/compromissos', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.titulo) filter.titulo = new RegExp(req.query.titulo, 'i');

  const [items, total] = await Promise.all([
    Compromisso.find(filter).sort({ dataHora: 1 }).skip(skip).limit(limit),
    Compromisso.countDocuments(filter)
  ]);

  res.json({ page, limit, total, items });
});

// Criar
app.post('/compromissos', validate(compromissoCreateSchema), async (req, res) => {
  const created = await Compromisso.create(req.body);
  res.status(201).json(created);
});

// Atualizar título/descrição
app.put('/compromissos/:id', validateObjectId, validate(compromissoUpdateSchema), async (req, res) => {
  const updated = await Compromisso.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!updated) return res.status(404).json({ error: 'Compromisso não encontrado' });
  res.json(updated);
});

// Substituir lista de pessoas 
app.put('/compromissos/:id/pessoas', validateObjectId, validate(pessoasReplaceSchema), async (req, res) => {
  const updated = await Compromisso.findByIdAndUpdate(
    req.params.id,
    { pessoas: req.body.pessoas },
    { new: true, runValidators: true }
  );
  if (!updated) return res.status(404).json({ error: 'Compromisso não encontrado' });
  res.json(updated);
});

// Remover uma pessoa da lista
app.delete('/compromissos/:id/pessoas/:nome', validateObjectId, async (req, res) => {
  const nomePessoa = decodeURIComponent(req.params.nome);
  const updated = await Compromisso.findByIdAndUpdate(
    req.params.id,
    { $pull: { pessoas: { nome: nomePessoa } } }, // $pull funciona com objetos
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: 'Compromisso não encontrado' });
  res.json(updated);
});

// Remover compromisso
app.delete('/compromissos/:id', validateObjectId, async (req, res) => {
  const removed = await Compromisso.findByIdAndDelete(req.params.id);
  if (!removed) return res.status(404).json({ error: 'Compromisso não encontrado' });
  res.status(204).send(); // No Content
});

//erros 
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// conexão com o mongo
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/agenda';
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Mongo conectado');
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch(err => {
    console.error('Erro ao conectar no Mongo:', err);
    process.exit(1);
  });

const express = require('express');
const crypto = require('crypto'); // Módulo nativo do Node para gerar UUID
const cors = require('cors'); // Middleware para permitir requisições de diferentes origens

const app = express();

// --- CORS---
app.use(cors()); 

app.use(express.json()); // Permite que a API receba JSON no body

// Banco de dados em memória (inicia com os exemplos que você passou)
let jogos = [
  {
    id: 1,
    nome: "The Legend of Zelda",
    tipo: "Aventura",
    nota: 10,
    review: "Um clássico absoluto."
  },
  {
    id: 2,
    nome: "Hollow Nitro",
    tipo: "Esportes Apiários",
    nota: 7,
    review: "Bom para jogar com amigos e insetos."
  }
];

let proximoId = 3;

// --- ENDPOINTS ---

// POST /login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === "usuario@esoft.com" && password === "Abc123") {
    // Retorna 200 OK com um UUID aleatório real
    return res.status(200).json({ token: crypto.randomUUID() });
  }
  
  return res.status(401).json({ erro: "Credenciais inválidas" });
});

// GET /jogos
app.get('/jogos', (req, res) => {
  res.status(200).json(jogos);
});

// GET /jogos/{id}
app.get('/jogos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const jogo = jogos.find(j => j.id === id);
  
  if (!jogo) return res.status(404).json({ erro: "Jogo não encontrado" });
  
  res.status(200).json(jogo);
});

// POST /jogos
app.post('/jogos', (req, res) => {
    const { nome, tipo, nota, review } = req.body;

    if (!nome || !tipo || nota === undefined || !review) {
        return res.status(400).json({ erro: "Todos os campos (nome, tipo, nota, review) são obrigatórios." });
    }

    const novoJogo = {
        id: proximoId++,
        nome,
        tipo,
        nota,
        review
    };
  
  jogos.push(novoJogo);
  res.status(201).json(novoJogo); // 201 Created
});

// PUT /jogos/{id}
app.put('/jogos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = jogos.findIndex(j => j.id === id);
  
  if (index === -1) return res.status(404).json({ erro: "Jogo não encontrado" });
  
  const { nome, tipo, nota, review } = req.body;

  if (!nome || !tipo || nota === undefined || !review) {
    return res.status(400).json({ erro: "Todos os campos (nome, tipo, nota, review) são obrigatórios." });
  }

  // Atualiza o jogo mantendo o ID, mas sobrescrevendo com os campos corretos
  jogos[index] = { id, nome, tipo, nota, review };
  
  res.status(200).json(jogos[index]);
});

// DELETE /jogos/{id}
app.delete('/jogos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  // Filtra o array removendo o jogo com o ID informado
  jogos = jogos.filter(j => j.id !== id);
  
  res.status(204).send(); // 204 No Content (não deve ter corpo na resposta)
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API rodando na porta ${PORT}`);
});
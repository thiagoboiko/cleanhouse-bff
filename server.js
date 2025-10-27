const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// CONFIGURAÇÃO: as URLs dosmicroserviços aqui
const MS1_URL = process.env.MS1_URL || 'http://localhost:3001';
const MS2_URL = process.env.MS2_URL || 'http://localhost:3002';
const FUNCTION_URL = process.env.FUNCTION_URL || 'http://localhost:7071/api';

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'CleanHouse BFF' });
});

// ===== AGREGAÇÃO DE DADOS =====
// Este endpoint busca dados dos 2 microserviços E da function
// e retorna tudo junto em uma resposta só
app.get('/api/dashboard', async (req, res) => {
  try {
    // Busca dados dos 3 lugares ao mesmo tempo
    const [agendamentosData, profissionaisData, functionData] = await Promise.allSettled([
      axios.get(`${MS1_URL}/api/agendamentos`),
      axios.get(`${MS2_URL}/api/profissionais`),
      axios.get(`${FUNCTION_URL}/estatisticas`)
    ]);

    // Junta tudo em uma resposta só
    const resultado = {
      agendamentos: agendamentosData.status === 'fulfilled' ? agendamentosData.value.data : [],
      profissionais: profissionaisData.status === 'fulfilled' ? profissionaisData.value.data : [],
      estatisticas: functionData.status === 'fulfilled' ? functionData.value.data : {},
      timestamp: new Date()
    };

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados', message: error.message });
  }
});

// ===== CRUD AGENDAMENTOS (MICROSERVIÇO 1) =====
app.get('/api/agendamentos', async (req, res) => {
  try {
    const response = await axios.get(`${MS1_URL}/api/agendamentos`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/agendamentos/:id', async (req, res) => {
  try {
    const response = await axios.get(`${MS1_URL}/api/agendamentos/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/agendamentos', async (req, res) => {
  try {
    const response = await axios.post(`${MS1_URL}/api/agendamentos`, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/agendamentos/:id', async (req, res) => {
  try {
    const response = await axios.put(`${MS1_URL}/api/agendamentos/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/agendamentos/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${MS1_URL}/api/agendamentos/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== CRUD PROFISSIONAIS (MICROSERVIÇO 2) =====
app.get('/api/profissionais', async (req, res) => {
  try {
    const response = await axios.get(`${MS2_URL}/api/profissionais`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/profissionais/:id', async (req, res) => {
  try {
    const response = await axios.get(`${MS2_URL}/api/profissionais/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/profissionais', async (req, res) => {
  try {
    const response = await axios.post(`${MS2_URL}/api/profissionais`, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/profissionais/:id', async (req, res) => {
  try {
    const response = await axios.put(`${MS2_URL}/api/profissionais/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/profissionais/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${MS2_URL}/api/profissionais/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== CRIAR AGENDAMENTO VIA EVENTO (FUNCTION) =====
app.post('/api/agendamentos/evento', async (req, res) => {
  try {
    const evento = {
      tipo: 'AGENDAMENTO_CRIADO',
      dados: req.body,
      timestamp: new Date().toISOString()
    };
    
    const response = await axios.post(`${FUNCTION_URL}/agendamento-evento`, evento);
    res.status(202).json({ message: 'Evento de agendamento enviado', data: response.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== BUSCAR ESTATÍSTICAS DA FUNCTION =====
app.get('/api/estatisticas', async (req, res) => {
  try {
    const response = await axios.get(`${FUNCTION_URL}/estatisticas`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 BFF CleanHouse rodando na porta ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/api/dashboard`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
});
# CleanHouse BFF

Backend For Frontend do sistema CleanHouse.

## Como Rodar Local

1. Instalar dependências:
```bash
npm install
```

2. Rodar:
```bash
npm start
```

3. Testar:
```bash
curl http://localhost:3000/health
```

## Docker

***PARA FUNCIONAR OS MICROSERVIÇOS PRECISAM ESTAR RODANDO!!!!!

docker pull thiagoboiko/cleanhouse-bff:1.0

docker run -p 3000:3000 thiagoboiko/cleanhouse-bff:1.0

## Endpoints

### Geral
- **GET /health** - Verifica se está funcionando
- **GET /api/dashboard** - Busca dados agregados (Agendamentos + Profissionais)

### Agendamentos (Microserviço 1)
- **GET /api/agendamentos** - Lista todos os agendamentos
- **GET /api/agendamentos/:id** - Busca agendamento por ID
- **POST /api/agendamentos** - Cria novo agendamento
- **PUT /api/agendamentos/:id** - Atualiza agendamento
- **DELETE /api/agendamentos/:id** - Remove agendamento
- **POST /api/agendamentos/evento** - Cria agendamento via evento (Function)

### Profissionais (Microserviço 2)
- **GET /api/profissionais** - Lista todos os profissionais
- **GET /api/profissionais/:id** - Busca profissional por ID
- **POST /api/profissionais** - Cria novo profissional
- **PUT /api/profissionais/:id** - Atualiza profissional
- **DELETE /api/profissionais/:id** - Remove profissional

### Estatísticas (Function)
- **GET /api/estatisticas** - Busca estatísticas do sistema

## Equipe

- Thiago Boiko


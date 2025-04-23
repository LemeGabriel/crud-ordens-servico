// server.js
const express = require('express');
const sql = require('mssql/msnodesqlv8');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Configuração do SQL Server
const config = {
  server: 'localhost\\MSSQLSERVER777', // <- ajuste conforme seu ambiente
  database: 'OrdensServiço',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true,
  }
};

// Testar conexão
sql.connect(config)
  .then(() => console.log('Conectado ao SQL Server!'))
  .catch(err => console.error('Erro ao conectar:', err));

// Rota para inserir ordem
app.post('/ordens', async (req, res) => {
  try {
    const {
      titulo,
      descricao,
      dataConclusao,
      operador,
      local,
      prioridade,
      status,
      departamento
    } = req.body;

    const pool = await sql.connect(config);
    await pool.request()
      .input('titulo', sql.NVarChar, titulo)
      .input('descricao', sql.NVarChar, descricao)
      .input('dataConclusao', sql.NVarChar, dataConclusao)
      .input('operador', sql.NVarChar, operador)
      .input('local', sql.NVarChar, local)
      .input('prioridade', sql.NVarChar, prioridade)
      .input('status', sql.NVarChar, status)
      .input('departamento', sql.NVarChar, departamento)
      .query(`
        INSERT INTO Ordens (
          titulo, descricao, dataConclusao, operador, local, prioridade, status, departamento
        ) VALUES (
          @titulo, @descricao, @dataConclusao, @operador, @local, @prioridade, @status, @departamento
        )
      `);

    res.status(200).send({ message: 'Ordem adicionada com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Erro ao adicionar ordem' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

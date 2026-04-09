const express = require('express');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// STRING DE CONEXÃO ATUALIZADA
const connectionString = "postgresql://postgres.zsnkisiwrmbjwyqrhzlr:39gBUQy50zGMnGaC@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

app.post('/cadastrar', async (req, res) => {
    const { nome, dataNasc, email } = req.body;
    
    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const sql = "INSERT INTO usuarios (nome, data_nascimento, email) VALUES ($1, $2, $3)";
        await client.query(sql, [nome, dataNasc, email]);
        await client.end();
        res.status(200).send("AGORA FOI! Cadastro salvo com sucesso.");
    } catch (error) {
        console.error("Erro detalhado:", error.message);
        try { await client.end(); } catch (e) {}
        res.status(500).send("Erro: " + error.message);
    }
});

app.get('/', (req, res) => res.send("Backend Online com Senha Nova!"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log(`Rodando na porta ${PORT}`));

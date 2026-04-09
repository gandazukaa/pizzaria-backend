const express = require('express');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// A STRING DE CONEXÃO COMPLETA (Substitua se sua senha for diferente)
// Formato: postgresql://USUARIO:SENHA@HOST:PORTA/DATABASE?pgbouncer=true
const connectionString = "postgresql://postgres.zsnkisiwrmbjwyqrhzlr:Pizza_Master2026@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

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
        res.status(200).send("CONECTADO! Cadastro salvo com sucesso.");
    } catch (error) {
        console.error("Erro detalhado:", error.message);
        try { await client.end(); } catch (e) {}
        res.status(500).send("Erro: " + error.message);
    }
});

app.get('/', (req, res) => res.send("Servidor Online com String de Conexão!"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Rodando na porta ${PORT}`);
});

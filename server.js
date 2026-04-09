const express = require('express');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURAÇÃO DIRETA (A mais estável para iniciantes)
const dbConfig = {
    host: 'db.zsnkisiwrmbjwyqrhzlr.supabase.co', // Use o seu ID aqui no link
    port: 5432, 
    user: 'postgres', // No 5432, use APENAS postgres
    password: 'Pizza_Master2026', // A senha que você resetou
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
};

app.post('/cadastrar', async (req, res) => {
    const { nome, dataNasc, email } = req.body;
    const client = new Client(dbConfig);

    try {
        await client.connect();
        const sql = "INSERT INTO usuarios (nome, data_nascimento, email) VALUES ($1, $2, $3)";
        await client.query(sql, [nome, dataNasc, email]);
        await client.end();
        res.status(200).send("CONECTADO! Cadastro salvo no Supabase.");
    } catch (error) {
        console.error("Erro no banco:", error.message);
        try { await client.end(); } catch (e) {}
        res.status(500).send("Erro: " + error.message);
    }
});

app.get('/', (req, res) => res.send("Servidor na Porta 5432 está ONLINE!"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor voando na porta ${PORT}`);
});

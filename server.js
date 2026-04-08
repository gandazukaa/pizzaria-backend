const express = require('express');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. CONFIGURAÇÃO ATUALIZADA COM A SENHA NOVA
const dbConfig = {
    host: 'aws-0-sa-east-1.pooler.supabase.com', 
    port: 6543, 
    user: 'postgres.zsnkisiwrmbjwyqrhzlr', 
    password: 'Pizza_Master2026', // <--- Senha nova aqui
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
};

// 2. ROTA DE CADASTRO
app.post('/cadastrar', async (req, res) => {
    const { nome, dataNasc, email } = req.body;
    const client = new Client(dbConfig);

    try {
        await client.connect();
        const sql = "INSERT INTO usuarios (nome, data_nascimento, email) VALUES ($1, $2, $3)";
        await client.query(sql, [nome, dataNasc, email]);
        await client.end();
        res.status(200).send("Cadastro salvo no Supabase com sucesso!");
    } catch (error) {
        console.error("Erro:", error.message);
        try { await client.end(); } catch (e) {}
        res.status(500).send("Erro ao salvar: " + error.message);
    }
});

app.get('/', (req, res) => res.send("Servidor Online!"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log(`Rodando na porta ${PORT}`));

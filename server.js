const express = require('express');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURAÇÃO DIRETA (MAIS ESTÁVEL)
const dbConfig = {
    // Note que o host mudou de 'pooler' para 'db'
    host: 'db.zsnkisiwrmbjwyqrhzlr.supabase.co', 
    port: 5432, 
    user: 'postgres', // Na porta 5432, o usuário é APENAS postgres
    password: 'Pizza_Master2026', // Sua senha nova
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
        res.status(200).send("CONECTADO! Cadastro salvo no Supabase com sucesso.");
    } catch (error) {
        console.error("Erro no banco:", error.message);
        try { await client.end(); } catch (e) {}
        
        // Retorna o erro exato para sabermos se a senha está certa
        res.status(500).send("Erro Final: " + error.message);
    }
});

app.get('/', (req, res) => res.send("Servidor na Porta 5432 está ONLINE!"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

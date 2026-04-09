const express = require('express');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURAÇÃO FORÇANDO IPv4
const dbConfig = {
    // Trocamos o nome por este host que o Supabase recomenda para evitar o erro ENETUNREACH
    host: 'db.zsnkisiwrmbjwyqrhzlr.supabase.co', 
    port: 5432, 
    user: 'postgres',
    password: 'Pizza_Master2026', 
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
};

app.post('/cadastrar', async (req, res) => {
    const { nome, dataNasc, email } = req.body;
    const client = new Client(dbConfig);

    try {
        // Força o tempo de espera para não travar
        console.log("Tentando conectar ao banco via IPv4...");
        await client.connect();
        
        const sql = "INSERT INTO usuarios (nome, data_nascimento, email) VALUES ($1, $2, $3)";
        await client.query(sql, [nome, dataNasc, email]);
        
        await client.end();
        res.status(200).send("FINALMENTE! Cadastro salvo com sucesso.");
    } catch (error) {
        console.error("Erro detalhado:", error.message);
        try { await client.end(); } catch (e) {}
        
        // Se der erro de rede, vamos saber aqui
        res.status(500).send("Erro de Conexão: " + error.message);
    }
});

app.get('/', (req, res) => res.send("Servidor Online e tentando IPv4!"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Rodando na porta ${PORT}`);
});

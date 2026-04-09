const express = require('express');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. STRING DE CONEXÃO DIRETA (O jeito mais garantido)
// Ela já contém: usuário, senha, host, porta e o comando pgbouncer=true
const connectionString = "postgresql://postgres.zsnkisiwrmbjwyqrhzlr:Pizza_Master2026@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

// 2. ROTA DE CADASTRO
app.post('/cadastrar', async (req, res) => {
    const { nome, dataNasc, email } = req.body;
    
    // Criamos o cliente usando a string completa
    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        
        const sql = "INSERT INTO usuarios (nome, data_nascimento, email) VALUES ($1, $2, $3)";
        await client.query(sql, [nome, dataNasc, email]);
        
        await client.end();
        res.status(200).send("Cadastro salvo no Supabase com sucesso!");
    } catch (error) {
        console.error("Erro detalhado:", error.message);
        try { await client.end(); } catch (e) {}
        
        // Retorna o erro exato para sabermos o que o Supabase está dizendo
        res.status(500).send("Erro do Supabase: " + error.message);
    }
});

app.get('/', (req, res) => res.send("Servidor da Pizzaria Online!"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

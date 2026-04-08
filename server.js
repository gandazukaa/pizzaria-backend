const express = require('express');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURAÇÃO COM STRING DE CONEXÃO (Mais segura para o Pooler)
const connectionString = "postgresql://postgres.zsnkisiwrmbjwyqrhzlr:Pizza_Master2026@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

app.post('/cadastrar', async (req, res) => {
    const { nome, dataNasc, email } = req.body;
    
    // Conectando usando a String de Conexão
    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const sql = "INSERT INTO usuarios (nome, data_nascimento, email) VALUES ($1, $2, $3)";
        await client.query(sql, [nome, dataNasc, email]);
        await client.end();
        res.status(200).send("Cadastro salvo com sucesso!");
    } catch (error) {
        console.error("Erro:", error.message);
        try { await client.end(); } catch (e) {}
        
        // Se ainda der erro, o problema é a senha que não foi resetada corretamente no painel
        res.status(500).send("Erro do Supabase: " + error.message);
    }
});

app.get('/', (req, res) => res.send("Servidor Online!"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log(`Rodando na porta ${PORT}`));

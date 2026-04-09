const express = require('express');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// SUA CONEXÃO DO NEON (Já configurada)
const connectionString = "postgresql://neondb_owner:npg_yqWfJO1cT3RY@ep-snowy-wildflower-anjywqj0.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require";

app.post('/cadastrar', async (req, res) => {
    const { nome, dataNasc, email } = req.body;
    
    const client = new Client({
        connectionString: connectionString,
    });

    try {
        await client.connect();
        const sql = "INSERT INTO usuarios (nome, data_nascimento, email) VALUES ($1, $2, $3)";
        await client.query(sql, [nome, dataNasc, email]);
        await client.end();
        res.status(200).send("SALVO NO NEON COM SUCESSO!");
    } catch (error) {
        console.error("Erro no Neon:", error.message);
        try { await client.end(); } catch (e) {}
        res.status(500).send("Erro: " + error.message);
    }
});

app.get('/', (req, res) => res.send("Servidor com Neon rodando!"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pizzaria rodando na porta ${PORT}`);
});

    const express = require('express');
    const { Client } = require('pg'); // Usando PG em vez de MySQL
    console.log("Tentando conectar com a senha: " + dbConfig.password);
    const cors = require('cors');

    const app = express();
    app.use(cors());
    app.use(express.json());

    // CONFIGURAÇÃO DO SUPABASE
    const dbConfig = {
    host: 'db.zsnkisiwrmbjwyqrhzlr.supabase.co', 
    port: 5432,
    user: 'postgres',
    password: 'Senhapizza:123', 
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
};

    app.post('/cadastrar', async (req, res) => {
        const { nome, dataNasc, email } = req.body;
        const client = new Client(dbConfig);

        try {
            await client.connect();
            
            // No Postgres, usamos $1, $2, $3 para segurança
            const sql = "INSERT INTO usuarios (nome, data_nascimento, email) VALUES ($1, $2, $3)";
            await client.query(sql, [nome, dataNasc, email]);
            
            await client.end();
            res.status(200).send("Cadastro salvo no Supabase com sucesso!");
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao salvar: " + error.message);
        }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
const express = require('express');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. CONFIGURAÇÃO COM O POOLER (Ajustado para evitar o erro de Tenant)
const dbConfig = {
    host: 'aws-0-sa-east-1.pooler.supabase.com', 
    port: 6543, 
    user: 'postgres.zsnkisiwrmbjwyqrhzlr', 
    password: 'Senhapizza:123', 
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    // Isso aqui ajuda a evitar erros de conexão em instâncias compartilhadas
    connectionTimeoutMillis: 10000, 
};

console.log("Servidor iniciando e aguardando requisições...");

// 2. ROTA PARA CADASTRAR USUÁRIOS
app.post('/cadastrar', async (req, res) => {
    const { nome, dataNasc, email } = req.body;
    
    // Criamos o cliente dentro da rota
    const client = new Client(dbConfig);

    try {
        await client.connect();
        console.log("Conectado ao banco com sucesso!");

        const sql = "INSERT INTO usuarios (nome, data_nascimento, email) VALUES ($1, $2, $3)";
        await client.query(sql, [nome, dataNasc, email]);
        
        await client.end();
        res.status(200).send("Cadastro salvo no Supabase com sucesso!");
    } catch (error) {
        console.error("Erro detalhado:", error.message);
        
        // Tenta fechar a conexão mesmo se der erro
        try { await client.end(); } catch (e) {}

        res.status(500).send("Erro ao salvar: " + error.message);
    }
});

app.get('/', (req, res) => {
    res.send("Servidor da Pizzaria está ONLINE!");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

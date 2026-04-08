const express = require('express');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. CONFIGURAÇÃO DO BANCO DE DADOS (SUPABASE)
const dbConfig = {
    // Usando o host do Pooler para evitar erro de rede (IPv6)
    host: 'aws-0-sa-east-1.pooler.supabase.com', 
    port: 6543, // <--- IMPORTANTE: A porta muda para 6543 no pooler
    user: 'postgres.zsnkisiwrmbjwyqrhzlr', // <--- O usuário precisa do ID do projeto no pooler
    password: 'Senhapizza:123', 
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
};

// Log para confirmar que o script chegou aqui
console.log("Configuração carregada. Tentando iniciar o servidor...");

// 2. ROTA PARA CADASTRAR USUÁRIOS
app.post('/cadastrar', async (req, res) => {
    const { nome, dataNasc, email } = req.body;
    const client = new Client(dbConfig);

    try {
        await client.connect();
        
        // Query para inserir os dados na tabela 'usuarios'
        const sql = "INSERT INTO usuarios (nome, data_nascimento, email) VALUES ($1, $2, $3)";
        await client.query(sql, [nome, dataNasc, email]);
        
        await client.end();
        console.log("Cadastro realizado com sucesso para:", email);
        res.status(200).send("Cadastro salvo no Supabase com sucesso!");
    } catch (error) {
        console.error("Erro no banco de dados:", error.message);
        res.status(500).send("Erro ao salvar: " + error.message);
    }
});

// 3. ROTA DE TESTE (Para ver se o link está funcionando)
app.get('/', (req, res) => {
    res.send("Servidor da Pizzaria está ONLINE!");
});

// 4. CONFIGURAÇÃO DA PORTA PARA O RAILWAY
// O Railway usa a variável process.env.PORT automaticamente
const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});

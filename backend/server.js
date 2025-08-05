const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const port = 5000;

// Configuração do Supabase
const supabaseUrl = 'https://fsffbyrppeckuopvltjs.supabase.co'; // Substitua pelo seu URL do Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzZmZieXJwcGVja3VvcHZsdGpzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQwMzM5NywiZXhwIjoyMDY5OTc5Mzk3fQ._xPebajcEPvPZdflCPry7Wn22fnsElFBG_pF6-HpZZo'; // Substitua pela sua chave de serviço do Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Endpoint para confirmar presença
app.post('/api/confirmar-presenca', async (req, res) => {
  const { nome, rg } = req.body;

  // Validação simples
  if (!nome || !rg) {
    return res.status(400).json({ success: false, message: 'Nome e RG são obrigatórios.' });
  }

  // Verificar se já existe um convidado com o mesmo RG
  const { data: existente } = await supabase
    .from('confirmados')
    .select('id')
    .eq('rg', rg)
    .single();

  if (existente) {
    return res.json({ success: false, message: 'Este RG já foi registrado.' });
  }

  // Adicionar o convidado à lista
  const { error } = await supabase
    .from('confirmados')
    .insert([{ nome, rg }]);

  if (error) {
    return res.status(500).json({ success: false, message: 'Erro ao salvar.' });
  }

  res.json({ success: true });
});

// Endpoint para o administrador pegar a lista de confirmados (protegido por senha)
app.post('/api/admin/confirmados', async (req, res) => {
  const { senha } = req.body;
  if (senha !== 'admin') {
    return res.status(401).json({ success: false, message: 'Acesso negado.' });
  }

  const { data, error } = await supabase
    .from('confirmados')
    .select('nome, rg');

  if (error) {
    return res.status(500).json({ success: false, message: 'Erro ao buscar lista.' });
  }

  res.json({ confirmados: data });
});

// Endpoint para limpar a lista de confirmados (opcional para administração)
app.delete('/api/confirmados', async (req, res) => {
  const { error } = await supabase
    .from('confirmados')
    .delete()
    .neq('id', 0); // deleta todos

  if (error) {
    return res.status(500).json({ success: false, message: 'Erro ao limpar lista.' });
  }

  res.json({ success: true, message: 'Lista de confirmados limpa.' });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
import { createClient } from '@supabase/supabase-js';

// Conexão com o Supabase (pegue as variáveis do Vercel, configuradas no painel)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Método GET: Recuperar todos os convidados confirmados
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('confirmados').select('id, nome, rg');
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  }

  // Método POST: Inserir novo convidado confirmado
  if (req.method === 'POST') {
    const { nome, rg } = req.body;
    const { data, error } = await supabase
      .from('confirmados')
      .insert([{ nome, rg }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ message: 'Presença confirmada!' });
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
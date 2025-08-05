import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabaseUrl = 'https://fsffbyrppeckuopvltjs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzZmZieXJwcGVja3VvcHZsdGpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDMzOTcsImV4cCI6MjA2OTk3OTM5N30.Bw0TKaOFfC_osOY0Fq8HPuXBrFzaYkfPbJx9I9pC9NM';
const supabase = createClient(supabaseUrl, supabaseKey);

const AdminPage = ({ children }) => {
  const [confirmados, setConfirmados] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConfirmados = async () => {
    const { data, error } = await supabase
      .from('confirmados')
      .select('id, nome, rg');
    if (!error) {
      setConfirmados(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchConfirmados();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id) => {
    await supabase.from('confirmados').delete().eq('id', id);
    fetchConfirmados();
  };

  return (
    <div className="admin-bg">
      <div className="invite-header text-center">
        <h2 className="invite-title">Área do Administrador</h2>
        <div className="invite-banner">Lista de Confirmados</div>
      </div>
      <div className="form-style" style={{ margin: '0 auto', maxWidth: 400 }}>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <>
            {confirmados.length === 0 ? (
              <p>Nenhum convidado confirmado ainda.</p>
            ) : (
              <ul style={{ padding: 0 }}>
                {confirmados.map((c) => (
                  <li
                    key={c.id}
                    style={{
                      color: '#748460',
                      fontWeight: 'bold',
                      marginBottom: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                      listStyle: 'none'
                    }}
                  >
                    <span>
                      {c.nome} <span style={{ color: '#8f7055' }}>({c.rg})</span>
                    </span>
                    <Button
                      variant="danger"
                      size="sm"
                      style={{ borderRadius: 12, fontSize: 12, padding: '2px 10px' }}
                      onClick={() => handleDelete(c.id)}
                    >
                      Excluir
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        {children}
      </div>
    </div>
  );
};

export default AdminPage;
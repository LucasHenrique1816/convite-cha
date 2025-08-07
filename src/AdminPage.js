import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';  // Vamos usar axios para fazer as requisições HTTP
import './App.css';

// Defina a URL base da sua API no Vercel
const API_URL = '/api/confirmados';  // O Vercel irá mapear isso para /api/confirmados.js

const AdminPage = ({ children }) => {
  const [confirmados, setConfirmados] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para edição
  const [editModal, setEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editNome, setEditNome] = useState('');
  const [editRg, setEditRg] = useState('');
  const [editError, setEditError] = useState('');

  const printRef = useRef();

  // Função para obter os confirmados da API
  const fetchConfirmados = async () => {
    try {
      const response = await axios.get(API_URL);  // Requisição GET para obter dados
      setConfirmados(response.data);
    } catch (error) {
      console.error("Erro ao buscar os confirmados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfirmados();  // Buscar dados ao carregar o componente
  }, []);

  // Função para excluir um convidado
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);  // Requisição DELETE para excluir um convidado
      fetchConfirmados();  // Recarregar a lista de confirmados
    } catch (error) {
      console.error("Erro ao excluir convidado:", error);
    }
  };

  // Função para editar um convidado
  const handleEditClick = (c) => {
    setEditId(c.id);
    setEditNome(c.nome);
    setEditRg(c.rg);
    setEditError('');
    setEditModal(true);
  };

  // Salvar as edições
  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editNome || !editRg) {
      setEditError('Nome e Documento são obrigatórios.');
      return;
    }

    try {
      await axios.put(`${API_URL}/${editId}`, { nome: editNome, rg: editRg });  // Requisição PUT para atualizar
      setEditModal(false);
      setEditId(null);
      setEditNome('');
      setEditRg('');
      fetchConfirmados();  // Recarregar a lista de confirmados
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
    }
  };

  // Função para imprimir a lista
  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Lista de Convidados</title>');
    printWindow.document.write('<style>body{font-family:Arial;} ul{padding:0;} li{margin-bottom:8px;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="admin-bg">
      <div className="invite-header text-center">
        <h2 className="invite-title">Área do Administrador</h2>
        <div className="invite-banner">Lista de Confirmados</div>
      </div>
      <div className="form-style" style={{ margin: '0 auto', maxWidth: 400 }}>
        <div className="d-flex justify-content-center mb-3" style={{ gap: 10 }}>
          <Button variant="info" className="rounded-btn" onClick={handlePrint}>
            Imprimir Lista
          </Button>
        </div>
        <div ref={printRef}>
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
                        listStyle: 'none',
                      }}
                    >
                      <span>
                        {c.nome} <span style={{ color: '#8f7055' }}>({c.rg})</span>
                      </span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Button
                          variant="warning"
                          size="sm"
                          style={{ borderRadius: 12, fontSize: 12, padding: '2px 10px', color: '#fff' }}
                          onClick={() => handleEditClick(c)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          style={{ borderRadius: 12, fontSize: 12, padding: '2px 10px' }}
                          onClick={() => handleDelete(c.id)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
        {children}
      </div>

      {/* Modal de Edição */}
      <Modal show={editModal} onHide={() => setEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Convidado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSave}>
            <Form.Group controlId="editNome" className="mb-3">
              <Form.Label>Nome Completo</Form.Label>
              <Form.Control
                type="text"
                value={editNome}
                onChange={(e) => setEditNome(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="editRg" className="mb-3">
              <Form.Label>Número do Documento</Form.Label>
              <Form.Control
                type="text"
                value={editRg}
                onChange={(e) => setEditRg(e.target.value)}
                required
              />
            </Form.Group>
            {editError && (
              <div style={{ color: 'red', marginBottom: 8, textAlign: 'center' }}>
                {editError}
              </div>
            )}
            <div className="d-flex justify-content-center">
              <Button variant="success" type="submit" className="rounded-btn">
                Salvar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminPage;
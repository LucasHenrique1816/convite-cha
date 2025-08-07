import React, { useState } from 'react';
import { Button, Form, Modal, Container, Row, Col } from 'react-bootstrap';
import AdminPage from './AdminPage';
import './App.css';

const conviteBg = '/fundo.png';
const conviteLogo = '/logo.png';

const App = () => {
  const [nome, setNome] = useState('');
  const [rg, setRg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Função que será chamada no envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !rg) {
      setMessage('Nome e Documento são obrigatórios.');
      setShowModal(true);
      return;
    }

    try {
      // Enviando dados para a API no Vercel
      const response = await fetch('/api/confirmados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, rg }),
      });

      const data = await response.json();

      if (data.error) {
        setMessage('Erro ao confirmar presença.');
      } else {
        setMessage('Presença confirmada com sucesso! Aguardamos você no chá de bebê!');
      }
    } catch (error) {
      setMessage('Erro ao conectar com o servidor.');
    }
    setShowModal(true);
    setNome('');
    setRg('');
  };

  // Abre modal de senha ao clicar na logo
  const handleLogoClick = () => {
    setShowPasswordModal(true);
    setPassword('');
    setPasswordError('');
  };

  // Verifica senha
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === '2511') {
      setShowAdmin(true);
      setShowPasswordModal(false);
      setPassword('');
      setPasswordError('');
    } else {
      setPasswordError('Senha incorreta!');
    }
  };

  if (showAdmin) {
    return (
      <div
        className="invite-bg"
        style={{
          backgroundImage: `url(${conviteBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
              <div className="logo-container">
                <img
                  src={conviteLogo}
                  alt="Logo Chá do Matteo"
                  className="invite-logo"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowAdmin(false)}
                  title="Voltar para o convite"
                />
              </div>
              <AdminPage />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div
      className="invite-bg"
      style={{
        backgroundImage: `url(${conviteBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <div className="logo-container">
              <img
                src={conviteLogo}
                alt="Logo Chá do Matteo"
                className="invite-logo"
                style={{ cursor: 'pointer' }}
                onClick={handleLogoClick}
                title="Área do Administrador"
              />
            </div>
            <div className="invite-header text-center">
              <h1 className="invite-title">Chá do Matteo</h1>
              <div className="invite-banner">
                <span>DOMINGO • 17 agosto • ÀS 14:00</span>
              </div>
              <div className="invite-address">
                <span>
                  Rua Ana Soares Barcelos, 355 Vila Venditti<br />
                  Condomínio Máximo - Salão de Festa Master
                </span>
              </div>
            </div>
            <div className="form-container">
              <Form onSubmit={handleSubmit} className="form-style">
                <Form.Group controlId="formNome" className="mb-3 text-center">
                  <Form.Label>Nome Completo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formRg" className="mb-3 text-center">
                  <Form.Label>Número do Documento(RG ou CPF)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite seu número de Documento"
                    value={rg}
                    onChange={(e) => setRg(e.target.value)}
                    required
                  />
                </Form.Group>
                <div className="d-flex justify-content-center">
                  <Button variant="success" type="submit" className="rounded-btn">
                    Confirmar Presença
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Digite a senha</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePasswordSubmit}>
            <Form.Group controlId="formSenha">
              <Form.Label>Senha de acesso</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                placeholder="Digite a senha"
              />
              {passwordError && (
                <div style={{ color: 'red', marginTop: 8, textAlign: 'center' }}>
                  {passwordError}
                </div>
              )}
            </Form.Group>
            <div className="d-flex justify-content-center mt-3">
              <Button variant="success" type="submit">
                Entrar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default App;
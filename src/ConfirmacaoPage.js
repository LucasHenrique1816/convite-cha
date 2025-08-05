import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ConfirmacaoPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      <h1>Presença Confirmada!</h1>
      <p>Obrigado por confirmar sua presença no Chá de Bebê. Estamos ansiosos para te ver!</p>
      <Button variant="success" onClick={() => navigate('/')}>
        Voltar para o Convite
      </Button>
    </div>
  );
};

export default ConfirmacaoPage;
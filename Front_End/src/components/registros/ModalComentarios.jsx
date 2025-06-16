import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Alert } from 'react-bootstrap';

function ModalComentarios({ 
    comentarios, 
    usuarioNombre, 
    onClose 
}) {

  return (
    <Modal show={true} onHide={onClose} centered size="lg" id="Modal_Comentarios">
      
      <Modal.Header className="title_modal position-relative">
        <Modal.Title className="mx-auto">
          <b>Comentarios de {usuarioNombre}</b>
        </Modal.Title>
        {/* Botón de cierre automático al extremo derecho */}
        <button
          type="button"
          className="btn-close position-absolute end-0 me-2"
          aria-label="Close"
          onClick={onClose}
        ></button>
      </Modal.Header>

      <Modal.Body>
        {comentarios.length === 0 ? (
          <Alert variant="info" className="text-center">No hay comentarios para este usuario.</Alert>
        ) : (
          <ul className="list-group">
            {comentarios.map((c) => (
              <li key={c.id} className="list-group-item">
                <p><strong>Comentario:</strong> {c.comentario}</p>
                <small className="text-muted">
                  Fecha: {new Date(c.fecha_creacion).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </Modal.Body>

      <div className="text-center mb-3">
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </div>

    </Modal>
  );
}

export default ModalComentarios;

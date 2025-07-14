import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Alert } from 'react-bootstrap';

function Modal_Mostrar_Emprendimiento(
  { emprendimientos,
    usuarioNombre,
    onClose }
) {



  return (
    <Modal show={true} onHide={onClose} centered size="lg" id="Modal_Comentarios">

      <Modal.Header className="title_modal position-relative">
        <Modal.Title className="mx-auto">
          <b>Emprendimientos de {usuarioNombre}</b>
        </Modal.Title>
        <button
          type="button"
          className="btn-close position-absolute end-0 me-2"
          aria-label="Close"
          onClick={onClose}
        ></button>
      </Modal.Header>

      <Modal.Body>
        {emprendimientos.length === 0 ? (
          <Alert variant="info" className="text-center">Este usuario no ha registrado ningun emprendimiento.</Alert>
        ) : (
          <ul className="list-group">
            {emprendimientos.map((e) => (
              <li key={e.id} className="list-group-item" style={{ position: 'relative', paddingRight: '200px' }}>
                <div>
                  <p><strong>Nombre Emprendimientos:</strong> {e.Nombre_Emprendimiento}</p>
                  <p><strong>Propietrario(a):</strong> {e.Propietario}</p>
                  <p><strong>Descripción:</strong> {e.Descripcion}</p>
                  <p>
                    <strong>Contacto:</strong>{" "}
                    <span style={{ textDecoration: "underline", color: '#0d6efd' }}>
                      +506 {e.contacto}
                    </span>
                  </p>
                  <p><strong>Ubicación:</strong> {e.ubicacion_nombre}</p>
                  <small className="text-muted">
                    Fecha: {new Date(e.fecha_creacion).toLocaleString()}
                  </small>
                </div>

                <img
                  src={e.foto_url}
                  alt="foto"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '180px',
                    height: '180px',
                    objectFit: 'cover',
                    borderRadius: '5px'
                  }}
                />
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

export default Modal_Mostrar_Emprendimiento
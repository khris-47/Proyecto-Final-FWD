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
              <li key={e.id} className="list-group-item ">

                <p><strong>Nombre Emprendimientos:</strong> {e.Nombre_Emprendimiento}</p>
                <p><strong>Propietrario(a):</strong> {e.Propietario}</p>
                
                <p>
                  <strong>Contacto:</strong>  {" "}
                  <span style={{ textDecoration: "underline", color: '#0d6efd' }}>
                    +506  {e.contacto}
                  </span>
                </p>

                <p><strong>Ubicacion:</strong> {e.ubicacion_nombre}</p>
                <img className='position-absolute end-0 top-0 m-2' src={e.foto_url} alt="foto" style={{ width: '180px', height: '180px', objectFit: 'cover', borderRadius: '5px' }} />
                <small className="text-muted">
                  Fecha: {new Date(e.fecha_creacion).toLocaleString()}
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

export default Modal_Mostrar_Emprendimiento
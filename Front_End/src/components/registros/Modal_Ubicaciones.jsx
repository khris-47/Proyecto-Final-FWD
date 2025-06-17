import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import Swal from 'sweetalert2';

function Modal_Ubicaciones({
    show,           // controla si el modal se muestra o no
    onHide,         // funciona para cerrar el modal
    onSubmit,       // funcion que se ejecuta al enviar el modal (crear o editar)
    formData,       // objeto que contiene los datos del formulario
    setFormData,    // se utilizara para actualizar los datos del formulario
    isEditing = false // inidca si el modal se esta usando para editar o crear
}) {

    // manejo de errores
    const [error, setError] = useState('');

    // manejador de cambios en el formulario
    // esta funcion se ejecuta cada vez que el usuario modifica un campo del formulario
    const handleChange = (e) => {

        //extraemos el name y value del campo que dispara el evento
        const { name, value, files, type } = e.target;

        // si es un archvo, usamos files [0]
        const fieldValue = type === 'file' ? files[0] : value


        // use el setFormData para actiualizar dinamicamente el valor dprrespndiente dle campo en el objeto formData
        setFormData(prev => ({ ...prev, [name]: fieldValue }));
        // el ...prev es para mantener los otros campos del formulario sin cambios
    };


    // encargado de validar tipo y tamanho de imagen
    const validarArchivos = () => {

        // tamanho maximo permitido (10mb)
        const MAX_SIZE_MB = 10 * 1024 * 1024;

        if (formData.portada) {
            if (!formData.portada.type.startsWith('image/')) {
                Swal.fire({
                    title: 'Archivo no válido',
                    text: 'La portada debe ser una imagen (JPG, PNG, WebP, etc.)',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                return false;
            }
            if (formData.portada.size > MAX_SIZE_MB) {
                Swal.fire({
                    title: 'Archivo demasiado grande',
                    text: 'La portada no debe superar los 10MB',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                return false;
            }
        }

        // Validar nombre del lugar
        if (!formData.nombre.trim() || formData.nombre.length < 5) {
            Swal.fire('Nombre inválido', 'El nombre debe tener al menos 5 caracteres.', 'warning');
            return false;
        }

        // Validar la descripcion
        if (!formData.descripcion?.trim() || formData.descripcion.length < 20) {
            Swal.fire('Descripción muy corta', 'Debe contener al menos 20 caracteres.', 'warning');
            return false;
        }

        return true;

    };

    // manejador del envio del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // valdar archivos correspondientes
        if (!validarArchivos()) return;


        try {
            await onSubmit();
            onHide();
        } catch (err) {
            console.error('error:', err);
            setError('hubo un error al guardar la ubicacion');
        }
    };



    return (


        <Modal show={show} onHide={onHide} centered id='Modal_Ubicacion'>
            <Modal.Header className='title_modal position-relative'>
                <Modal.Title className='mx-auto'><b>{isEditing ? 'Editar Ubicacion' : 'Registro'}</b></Modal.Title>
                {/* <button type='button' className='btn-close position-absolute end-0 me-2' data-bs-dismiss='modal' arial-label='Close'></button> */}
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-2">
                        <Col>
                            <Form.Label>Nombre de la Ubicacion</Form.Label>
                            <Form.Control
                                name="nombre"
                                value={formData.nombre || ''}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                        <Col>
                            <Form.Label>Portada:</Form.Label>
                            <Form.Control
                                name="portada"
                                type='file'
                                onChange={handleChange}
                                required={!isEditing} // obligatorio solo en creacion
                            />
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col>
                            <Form.Label>Descripcion</Form.Label>
                            <Form.Control
                                name="descripcion"
                                value={formData.descripcion || ''}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Row>


                    <div className="text-center mt-3">
                        <Button type="submit" variant="primary" className="w-100">
                            {isEditing ? 'Actualizar' : 'Crear'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>



    )
}

export default Modal_Ubicaciones
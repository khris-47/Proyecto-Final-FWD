import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';



// al modal, directamente de defiinimos sus componentes
function Modal_Entevista({
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
        const { name, value } = e.target;

        // use el setFormData para actiualizar dinamicamente el valor dprrespndiente dle campo en el objeto formData
        setFormData(prev => ({ ...prev, [name]: value }));
        // el ...prev es para mantener los otros campos del formulario sin cambios
    };

    // manejador del envio del formulario
    const handleSubmit = async (e) => {

        e.preventDefault(); // previene el comportamiento por defecto del formulario
        setError('');       // limpia mensajes de error previos, en caso de que los hubo

        try {
            await onSubmit(); // espera a que se complete la funcion
            onHide();         // cierra el modal solo si todo salio bien
        } catch (err) {
            console.error('Error al guardar entrevista:', err);
            setError('Hubo un error al guardar la entrevista');
        }
    };


    return (

 
        <Modal show={show} onHide={onHide} centered id='Modal_Entrevista'>
            <Modal.Header className='title_modal position-relative'>
                <Modal.Title className='mx-auto'><b>{isEditing ? 'Editar Entrevista' : 'Registro'}</b></Modal.Title>
                {/* <button type='button' className='btn-close position-absolute end-0 me-2' data-bs-dismiss='modal' arial-label='Close'></button> */}
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-2">
                        <Col>
                            <Form.Label>Nombre de Persona:</Form.Label>
                            <Form.Control
                                name="nombre_Persona"
                                value={formData.nombre_Persona || ''}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                        <Col>
                            <Form.Label>Link Entrevista:</Form.Label>
                            <Form.Control
                                name="entrevista"
                                value={formData.entrevista || ''}
                                onChange={handleChange}
                                required
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
                            />
                        </Col>
                        <Col>
                            <Form.Label>Ubicacion:</Form.Label>
                            <Form.Control
                                name="ubicacion"
                                value={formData.ubicacion || ''}
                                onChange={handleChange}
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

export default Modal_Entevista
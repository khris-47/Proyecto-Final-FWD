import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';



function Modal_Entevista({
    show,
    onHide,
    onSubmit,
    formData,
    setFormData,
    isEditing = false
}) {

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        onSubmit();
        onHide();
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
                                        type="entrevista"
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
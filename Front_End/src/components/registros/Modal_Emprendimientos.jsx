import React from 'react'
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';

function Modal_Emprendimientos(
    show,           // controla si el modal se muestra o no
    onHide,
) {



  return (

    <div>
        <Modal show={show} onHide={onHide} centered id='Modal_Ubicacion'>
                    <Modal.Header className='title_modal position-relative'>
                        <Modal.Title className='mx-auto'><b>Formulario de Emprendimientos</b></Modal.Title>
                        
                    </Modal.Header>
                    <Modal.Body>
                      
                        <Form >
                            <Row className="mb-2">
                                <Col>
                                    <Form.Label>Nombre del Emprendimiento:</Form.Label>
                                    <Form.Control
                                        name="Nombre_Emprendimiento"
                                        required
                                    />
                                </Col>
                                <Col>
                                    <Form.Label>Propietario:</Form.Label>
                                    <Form.Control
                                        name="Propietario"
                                        required
                                    />
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col>
                                    <Form.Label>Numero de Telefono</Form.Label>
                                    <Form.Control
                                        name="contacto"
                                        type='number'
                                        required
                                    />
                                </Col>
                                <Col>
                                    <Form.Label>Foto</Form.Label>
                                    <Form.Control
                                        name="foto"
                                        type='file'
                                        required
                                    />
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col>
                                    <Form.Label>Ubicacion</Form.Label>
                                    <Form.Control
                                        name="ubicacion"
                                        required
                                    />
                                </Col>
                            </Row>
                            <Row className="mb-2">
                                <Col>
                                    <Form.Label>Descripcion</Form.Label>
                                    <Form.Control
                                        name="Descripcion"
                                        required
                                        type="text"
                                    />
                                </Col>
                            </Row>

        
        
                            <div className="text-center mt-3">
                                <Button type="submit" variant="primary" className="w-100">
                                    Enviar
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>

    </div>


  )
}

export default Modal_Emprendimientos
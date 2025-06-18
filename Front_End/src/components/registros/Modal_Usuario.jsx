import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import Swal from 'sweetalert2';

function Modal_Usuario({
    show,
    onHide,
    onSubmit,
    formData,
    setFormData,
    isEditing = false
}) {
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleConfirmChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const validarArchivos = () => {

        // cosnstante para validar correos
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // constante para validar contras fuertes (minusculas, mayusculas, numeros y al menos 8 digitos)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        // Validar username
        if (!formData.username?.trim() || formData.username.length < 3) {
            Swal.fire('Usuario inválido', 'El nombre de usuario debe tener al menos 3 caracteres.', 'warning');
            return false;
        }

        // Validar nombre
        if (!formData.first_name?.trim() || formData.first_name.length < 3) {
            Swal.fire('Usuario inválido', 'El nombre debe tener al menos 3 caracteres.', 'warning');
            return false;
        }

        // Validar apellido
        if (!formData.last_name?.trim() || formData.last_name.length < 3) {
            Swal.fire('Usuario inválido', 'El apellido debe tener al menos 3 caracteres.', 'warning');
            return false;
        }

        // Validar email básico
        if (!emailRegex.test(formData.email)) {
            Swal.fire('Email inválido', 'Debes ingresar un correo electrónico válido.', 'warning');
            return false;
        }

        // validar contras solo si se esta creando
        if (!isEditing) {

            // Validar contraseña
            if (!passwordRegex.test(formData.password)) {
                Swal.fire(
                    'Contraseña insegura',
                    'Debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula y un número.',
                    'warning'
                );
                return false;
            }

            // Validar coincidencia con la confirmación
            if (formData.password !== confirmPassword) {
                Swal.fire('Contraseñas no coinciden', 'Las contraseñas deben ser iguales.', 'warning');
                return false;
            }


        }

        return true;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // valdar archivos correspondientes
        if (!validarArchivos()) return;

        try {
            setError('');

            // eliminar contrasena si no se esta editando
            if (isEditing) {
                const updatedData = { ...formData };
                delete updatedData.password;
                setFormData(updatedData);
            }

            onSubmit();
            onHide();
            
        } catch (error) {
            console.log('Error al guardar el usuario: ', error)
        }


    };

    return (
        <Modal show={show} onHide={onHide} centered id='Modal_Usuario'>
            <Modal.Header className='title_modal position-relative'>
                <Modal.Title className='mx-auto'><b>{isEditing ? 'Editar Usuario' : 'Registro'}</b></Modal.Title>
                {/* <button type='button' className='btn-close position-absolute end-0 me-2' data-bs-dismiss='modal' arial-label='Close'></button> */}
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-2">
                        <Col>
                            <Form.Label>Nombre de Usuario:</Form.Label>
                            <Form.Control
                                name="username"
                                value={formData.username || ''}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                        <Col>
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col>
                            <Form.Label>Nombre:</Form.Label>
                            <Form.Control
                                name="first_name"
                                value={formData.first_name || ''}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                        <Col>
                            <Form.Label>Apellidos:</Form.Label>
                            <Form.Control
                                name="last_name"
                                value={formData.last_name || ''}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Row>

                    {!isEditing && (
                        <Row className="mb-2">
                            <Col>
                                <Form.Label>Password:</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password || ''}
                                    onChange={handleChange}
                                    required={!isEditing}
                                />
                            </Col>
                            <Col>
                                <Form.Label>Confirmar Password:</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={confirmPassword}
                                    onChange={handleConfirmChange}
                                    required={!isEditing}
                                />
                            </Col>
                        </Row>
                    )}



                    <div className="text-center mt-3">
                        <Button type="submit" variant="primary" className="w-100">
                            {isEditing ? 'Actualizar' : 'Crear'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default Modal_Usuario;

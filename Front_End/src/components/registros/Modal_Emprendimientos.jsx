import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import * as Ubicaciones_services from '../../services/Ubicaciones_services';
import * as Usuarios_services from '../../services/Usuarios_Services';
import Cookies from 'js-cookie';

function Modal_Emprendimientos({ show, onHide }) {

    const [formData, setFormData] = useState({
        Nombre_Emprendimiento: '',
        Propietario: '',
        contacto: '',
        foto: null,
        Descripcion: '',
        ubicacion: ''
    });

    const [ubicaciones, setUbicaciones] = useState([]);
    const [error, setError] = useState(null);
    const [mensaje, setMensaje] = useState('');

    const access = Cookies.get('accessToken');

    useEffect(() => {
        const cargarUbicaciones = async () => {
            try {
                const response = await Ubicaciones_services.getUbicaciones();
                setUbicaciones(response.data);
            } catch (error) {
                console.error("Error al cargar ubicaciones", error);
            }
        };
        cargarUbicaciones();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'foto') {
            setFormData({ ...formData, foto: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };


    const ValidarArchivos = () => {

        // tamano maximo (10mb)
        const MAX_SIZE_MB = 10 * 1024 * 1024;

        // validaciones para las fotos
        if (formData.foto) {

            // verificar el tipo de archivo
            if (!formData.foto.type.startsWith('image/')) {
                Swal.fire({
                    title: 'Archivo no válido',
                    text: 'La foto debe ser una imagen (JPG, PNG, WebP, etc.)',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                return false;
            }

            // verificar el tamanho de la foto
            if (formData.foto.size > MAX_SIZE_MB) {
                Swal.fire({
                    title: 'Archivo demasiado grande',
                    text: 'La foto no debe superar los 10MB',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                return false;
            }
        }

        // recordemos que el .trim() es para limpiar espacios en blanco al inicio y final

        // Validar nombre del emprendimiento
        if (!formData.Nombre_Emprendimiento.trim() || formData.Nombre_Emprendimiento.length < 3) {
            Swal.fire('Nombre inválido', 'El nombre debe tener al menos 3 caracteres.', 'warning');
            return false;
        }

        // Validar nombre del propietario
        if (!formData.Propietario.trim() || formData.Propietario.length < 3) {
            Swal.fire('Propietario inválido', 'Debes ingresar el nombre del propietario.', 'warning');
            return false;
        }

        // Validar teléfono (ej. 8 digitos, solo numeros positivos, formato tipico en CR)
        const regexTelefono = /^[0-9]{8}$/;
        if (!regexTelefono.test(formData.contacto)) {
            Swal.fire('Teléfono inválido', 'Debe tener exactamente 8 dígitos numéricos.', 'warning');
            return false;
        }

        // Validar descripción
        if (!formData.Descripcion.trim() || formData.Descripcion.length < 10) {
            Swal.fire('Descripción muy corta', 'La descripción debe tener al menos 10 caracteres.', 'warning');
            return false;
        }

        return true;

    }


    const handleSubmit = async (e) => {

        e.preventDefault();
        setError(null);
        setMensaje('');

        try {

            //verificar que haya iniciado sesion
            if (!access) {
                Swal.fire('Acceso Denegado', 'Debes iniciar sesión para enviar el formulario.', 'warning');
                return;
            }

            // validar inputs
            if (!ValidarArchivos()) return;

            // preparar los datos del formulario
            const formDataToSend = new FormData();
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }

            // envio del emprendimiento a la api
            await Usuarios_services.crearEmprendimiento(formDataToSend, access);


            // limpiar el formulario
            setFormData({
                Nombre_Emprendimiento: '',
                Propietario: '',
                contacto: '',
                foto: null,
                Descripcion: '',
                ubicacion: ''
            });

            onHide();

            Swal.fire('¡Gracias!', 'Tu formulario fue enviado con éxito.', 'success');

        } catch (err) {
            console.error('Error:', err);
            setError('Hubo un error al enviar el formulario. Intenta más tarde.');
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered id='Modal_Ubicacion'>
            <Modal.Header className='title_modal position-relative'>
                <Modal.Title className='mx-auto'>
                    <b>Formulario de Emprendimientos</b>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {mensaje && <Alert variant="success">{mensaje}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-2">
                        <Col>
                            <Form.Label>Nombre del Emprendimiento:</Form.Label>
                            <Form.Control
                                name="Nombre_Emprendimiento"
                                value={formData.Nombre_Emprendimiento}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                        <Col>
                            <Form.Label>Propietario:</Form.Label>
                            <Form.Control
                                name="Propietario"
                                value={formData.Propietario}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col>
                            <Form.Label>Teléfono:</Form.Label>
                            <Form.Control
                                name="contacto"
                                type="number"
                                value={formData.contacto}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                        <Col>
                            <Form.Label>Foto de tu emprendimiento:</Form.Label>
                            <Form.Control
                                name="foto"
                                type="file"
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col>
                            <Form.Label>Ubicación:</Form.Label>
                            <Form.Select
                                name="ubicacion"
                                value={formData.ubicacion}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione una ubicación</option>
                                {ubicaciones.map((ubi) => (
                                    <option key={ubi.id} value={ubi.id}>{ubi.nombre}</option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col>
                            <Form.Label>Descripción:</Form.Label>
                            <Form.Control
                                name="Descripcion"
                                as="textarea"
                                value={formData.Descripcion}
                                onChange={handleChange}
                                required
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
    );
}

export default Modal_Emprendimientos;

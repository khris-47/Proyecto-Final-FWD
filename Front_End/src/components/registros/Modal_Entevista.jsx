
import React, { useEffect, useState } from 'react'
import { getUbicaciones } from '../../services/Ubicaciones_services';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import Swal from 'sweetalert2';


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

    // cosntante para traer las ubicaciones actuales
    const [ubicaciones, setUbicaciones] = useState([]);

    // cuando inicia, renderizamos la ubicaciones
    useEffect(() => {
        const fetchUbicaciones = async () => {
            try {
                const response = await getUbicaciones();
                setUbicaciones(response.data);
            } catch (err) {
                console.error('Error al cargar ubicaciones:', err);
            }
        };

        fetchUbicaciones();
    }, []);

    // manejador de cambios en el formulario
    // esta funcion se ejecuta cada vez que el usuario modifica un campo del formulario
    const handleChange = (e) => {

        //extraemos el name y value del campo que dispara el evento
        const { name, value } = e.target;

        // usamos el setFormData para actiualizar dinamicamente el valor dprrespndiente dle campo en el objeto formData
        setFormData(prev => ({ ...prev, [name]: value }));
        // el ...prev es para mantener los otros campos del formulario sin cambios
    };

    const ValidarArchivos = () => {

        // variable para validar URLs
        const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-._~:/?#@!$&'()*+,;=]*)?$/i;


        // Validar nombre de persona
        if (!formData.nombre_Persona?.trim() || formData.nombre_Persona.length < 3) {
            Swal.fire('Nombre inválido', 'El nombre debe tener al menos 3 caracteres.', 'warning');
            return false;
        }

        // validar el link de youtube
        if (!formData.entrevista?.trim() || !urlRegex.test(formData.entrevista)) {
            Swal.fire('Link inválido', 'Debes ingresar una URL válida para la entrevista.', 'warning');
            return false;
        }

        // Validar la descripción
        if (!formData.descripcion?.trim() || formData.descripcion.length < 20) {
            Swal.fire('Descripción muy corta', 'Debe contener al menos 20 caracteres.', 'warning');
            return false;
        }

        return true;
    };


    // manejador del envio del formulario
    const handleSubmit = async (e) => {

        e.preventDefault(); // previene el comportamiento por defecto del formulario
        setError('');       // limpia mensajes de error previos, en caso de que los hubo


        if (!ValidarArchivos()) return;

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
                                required={!isEditing} // obligatoriosolo en creacion
                            />
                        </Col>
                        <Col>
                            <Form.Label>Link Entrevista:</Form.Label>
                            <Form.Control
                                name="entrevista"
                                value={formData.entrevista || ''}
                                onChange={handleChange}
                                required={!isEditing} // obligatorio solo en creacion
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Label>Ubicación:</Form.Label>
                            <Form.Select
                                className="form-control"
                                value={formData.ubicacion}
                                onChange={(e) =>
                                    setFormData({ ...formData, ubicacion: e.target.value })
                                }
                                required
                            >
                                <option value="">Seleccione una ubicación</option>
                                {ubicaciones.map((ubi) => (
                                    <option key={ubi.id} value={ubi.id}>
                                        {ubi.nombre}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col>
                            <Form.Label>Descripcion</Form.Label>
                            <Form.Control
                                name="descripcion"
                                as="textarea"
                                value={formData.descripcion || ''}
                                onChange={handleChange}
                                required={!isEditing} // obligatorio solo en creacion
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
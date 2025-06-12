import React, { useEffect, useState } from 'react'
import { getUbicaciones } from '../../services/Ubicaciones_services';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';

function Modal_Cuento({
    show,           // controla si el modal se muestra o no
    onHide,         // funciona para cerrar el modal
    onSubmit,       // funcion que se ejecuta al enviar el modal (crear o editar)
    formData,       // objeto que contiene los datos del formulario
    setFormData,    // se utilizara para actualizar los datos del formulario
    isEditing = false // inidca si el modal se esta usando para editar o crear
}) {

    const [ubicaciones, setUbicaciones] = useState([]);

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

    // manejador del envio del formulario
    const handleSubmit = async (e) => {

        e.preventDefault(); // previene el comportamiento por defecto del formulario
        setError('');       // limpia mensajes de error previos, en caso de que los hubo

        try {
            await onSubmit(); // espera a que se complete la funcion
            onHide();         // cierra el modal solo si todo salio bien
        } catch (err) {
            console.error('Error al guardar el cuento:', err);
            setError('Hubo un error al guardar el cuento');
        }
    };

    return (

        <Modal show={show} onHide={onHide} centered id='Modal_Cuento'>
            <Modal.Header className='title_modal position-relative'>
                <Modal.Title className='mx-auto'><b>{isEditing ? 'Editar Cuento' : 'Registro'}</b></Modal.Title>
                {/* <button type='button' className='btn-close position-absolute end-0 me-2' data-bs-dismiss='modal' arial-label='Close'></button> */}
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-2">
                        <Col>
                            <Form.Label>Nombre del Cuento:</Form.Label>
                            <Form.Control
                                name="nombre_Cuento"
                                value={formData.nombre_Cuento || ''}
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
                            <Form.Label>Cuento</Form.Label>
                            <Form.Control
                                name="cuento"
                                type='file'
                                onChange={handleChange}
                                required={!isEditing} // obligatorio solo en creacion
                            />
                        </Col>
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


                    <div className="text-center mt-3">
                        <Button type="submit" variant="primary" className="w-100" >
                            {isEditing ? 'Actualizar' : 'Crear'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>

    )



}

export default Modal_Cuento
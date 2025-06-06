import React, { useEffect, useState } from 'react';
import '../../styles/forms.css';
import Fondo from '../../assets/img/fondos/fondo_login.jpg';
import NavBar from '../navegacion/navBar';
import Swal from 'sweetalert2';
import * as Entrevistas_Services from '../../services/Entrevistas_Services';

import Modal_Entrevista from '../registros/Modal_Entevista'


function Registro_Entrevistas() {


    const [entrevistas, setEntrevistas] = useState([]); // Lisa de entrevistas obtenidas de la API
    const [loading, setLoading] = useState(true);       // controla si se estan cargando los datos
    const [error, setError] = useState(null);           // manejo de errores
    const [isEditing, setIsEditing] = useState(false);  // determina si el modal se usara para editar 
    const [editId, setEditId] = useState(null);         // guarda el ID de la entrevisa a editar
    const [showModal, setShowModal] = useState(false); //  controla la visibilidad del modal

    const [formData, setFormData] = useState({         //  estado del formulario
        nombre_Persona: '',
        entrevista: '',
        descripcion: '',
        ubicacion: ''
    });


    // obtenemos todas las entrevistas desde el services
    const fetchEntrevistas = async () => {
        try {
            const response = await Entrevistas_Services.getEntrevistas(); // llamamos al servicio para obtener entrevistas
            setEntrevistas(response.data); // almacena las entrevistas en el estado
        } catch (err) {
            console.error(err);
            setError('Error al obtener los datos de las entrevistas'); // muestra mensaje de error en el form

        } finally {
            setLoading(false); // finaliza la carga (exito o no)
        }
    };

    // al ejecutar el componente, montamos la carga de objeto
    useEffect(() => {
        fetchEntrevistas();
    }, []);

    // maneja el registro o edicion de una entrevista
    const handleRegister = async () => {
        try {

            // preparamos ls datos del formulario a enviar
            const dataToSend = {
                ...formData,
                estado: 1, // le damos un estado por defecto
                ubicacion: Number(formData.ubicacion) // nos aseguramos que se envie un int
            };

            // pregunta si se esta editando
            if (isEditing && editId) {

                // enviamos los datos para la edicion
                await Entrevistas_Services.editarEntrevista(editId, dataToSend);

                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Entrevista actualizada correctamente',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });


            } else {

                // caso contrario, enviamos los datos a creacion
                await Entrevistas_Services.crearEntrevista(dataToSend);

                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Entrevista registrada correctamente',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });

                // ocultamos el modal
                setShowModal(false);
            }

            // limpia los datos del modal despues de la accion
            setFormData({
                nombre_Persona: '',
                entrevista: '',
                descripcion: '',
                ubicacion: ''
            });

            // recargamos la lista de entrevistas
            fetchEntrevistas();

        } catch (err) {
            console.error('Error al registrar entrevista:', err);

            Swal.fire({
                title: '¡Error!',
                text: 'Hubo un problema al registrar la entrevista',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });

        }
    };

    // llena los datos del form
    const handleEdit = (entrevista) => {

        // conformea la entrevsta seleccionada, llena los datos del modal
        setFormData({
            nombre_Persona: entrevista.nombre_Persona,
            entrevista: entrevista.entrevista,
            descripcion: entrevista.descripcion,
            ubicacion: entrevista.ubicacion.toString() // convierte numero a string para el input
        });
        setEditId(entrevista.id);   // guarda el id para la edicion
        setIsEditing(true);        //  activa el modo edicion
        setShowModal(true);       //   muestra el modal con  los datos cargados
    };

    // maneja la desactivacion de la entrevista
    const handleDeleteEntrevista = (id) => {


        // confirmacin de desactivacio
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción desactivará la entrevista (no se eliminará).',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, desactivar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            // el admin desea desactivar el objeto
            if (result.isConfirmed) {
                try {

                    // cambia el esatdo de la entrevista a 2 (inactivo)
                    await Entrevistas_Services.cambiarEstadoEntrevista(id, 2);
                    Swal.fire('Entrevista desactivada', 'La entrevista ha sido desactivada correctamente.', 'success');

                    // Recargar la lista de entrevistas
                    fetchEntrevistas();

                } catch (error) {
                    console.error('Error al desactivar la entrevista:', error);
                    Swal.fire('Error', 'No se pudo desactivar la entrevista.', 'error');
                }
            }
        });
    };

    // maneja la reactivacion de las entrevistas
    const handleActiveEntrevista = (id) => {

        // confirmacion
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción volvera a activar la entrevista.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, activar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            // el admin desea reativar
            if (result.isConfirmed) {
                try {

                    // ambia el estado de vuelta a 1 (activo)
                    await Entrevistas_Services.cambiarEstadoEntrevista(id, 1);

                    Swal.fire('Entrevista activada', 'La entrevista ha sido activada correctamente.', 'success');

                    // Recargar la lista de entrevistas
                    fetchEntrevistas();

                } catch (error) {
                    console.error('Error al activar la entrevista:', error);
                    Swal.fire('Error', 'No se pudo activar la entrevista.', 'error');
                }
            }
        });
    }


    return (
        <div className='bodyForm'>

            <div className="background-container-form">
                <img className="background-image-form" src={Fondo} alt=".." />
                <header className="headerAbout">
                    <NavBar />
                </header>
            </div>

            <div className='capa'></div>

            <main className='mainForm'>

                <div className='style-form'>
                    <div className='container'>

                        <div className='row justify-content-center align-items-center g-2'>
                            <div className='col'>
                                <h1>Modulo de Entrevistas</h1>
                            </div>
                        </div>

                        <div className="row justify-content-center align-items-center g-2 " style={{ width: '20%' }}>
                            <div className='row'>
                                <button type='button' className='btn btn-primary bx bxs-message-square-add'
                                    onClick={() => setShowModal(true)}>
                                    Agregar
                                </button>
                            </div>
                        </div>


                        <div className='row justify-content-center align-items-center g-2'>
                            <div className='col'>
                                <div className='table-responsive'>
                                    {loading ? (
                                        <button className="btn btn-primary" disabled>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Loading...
                                        </button>
                                    ) : error ? (
                                        <div className="alert alert-danger">{error}</div>
                                    ) : (
                                        <table className='table'>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Nombre Entrevistado</th>
                                                    <th>Descripción</th>
                                                    <th>Fecha de Subida</th>
                                                    <th>Ubicacion</th>
                                                    <th>Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {entrevistas.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{item.id}</td>
                                                        <td>{item.nombre_Persona}</td>
                                                        <td>{item.descripcion}</td>
                                                        <td>{new Date(item.fecha_creacion).toLocaleString()}</td>
                                                        <td>{item.ubicacion}</td>
                                                        <td>{item.estado}</td>
                                                        <td>
                                                            <a className='btn btn-dark bx bx-edit' onClick={() => handleEdit(item)} > </a>
                                                            ||
                                                            {item.estado === 1 ? (
                                                                <a className='btn btn-danger bx bxs-trash' onClick={() => handleDeleteEntrevista(item.id)} > </a>
                                                            ) : (
                                                                <a className='btn btn-primary bx bx-check-circle' onClick={() => handleActiveEntrevista(item.id)} > </a>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>



            <footer>

            </footer>

            <Modal_Entrevista
                show={showModal} // Muestra u oculta el modal segun el estado 'showModal'

                onHide={() => {
                    setShowModal(false);   // Cierra el modal
                    setIsEditing(false);   // Asegura que no se encuentre en modo edición
                    setEditId(null);       // Limpia el ID de la entrevista que se estaba editando (si habia)
                }}

                onSubmit={handleRegister}     // Funcion que se ejecuta al enviar el formulario (registrar o actualizar entrevista)
                formData={formData}           // Datos actuales del formulario que se están editando o registrando
                setFormData={setFormData}     // Funcion para actualizar los datos del formulario
                isEditing={isEditing}         // Indica si el modal está en modo edición (true) o creacion (false)
            />



        </div>

    )
}

export default Registro_Entrevistas
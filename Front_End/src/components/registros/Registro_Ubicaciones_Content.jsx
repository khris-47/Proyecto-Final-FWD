import React, { useEffect, useState } from 'react';
import '../../styles/forms.css';
import Fondo from '../../assets/img/fondos/fondo_login.jpg';
import NavBar from '../navegacion/navBar';
import * as Ubicaciones_services from '../../services/Ubicaciones_services'
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

import Modal_Ubicaciones from './Modal_Ubicaciones';


function Registro_Ubicaciones_Content() {

    const [ubicaciones, setUbicaciones] = useState([]); // lista de objetos obtenidos delservices - api
    const [loading, setLoading] = useState(true);       // controla si se estan cargando los datos
    const [error, setError] = useState(null);           // manejo de errores
    const [isEditing, setIsEditing] = useState(false);  // determina si el modal se usara para editar 
    const [editId, setEditId] = useState(null);         // guarda el ID del objeto a editar
    const [showModal, setShowModal] = useState(false); //  controla la visibilidad del modal

    const [ordenAscendente, setOrdenAscendente] = useState(true);

    const [busqueda, setBusqueda] = useState('');

    const [formData, setFormData] = useState({         //  estado del formulario
        portada: '',
        nombre: '',
        descripcion: ''
    });

    // se utiliza para obtener los datos de las ubicaiones
    const fetchUbicaciones = async () => {
        try {

            const response = await Ubicaciones_services.getUbicaciones(); // llamamos al services
            setUbicaciones(response.data); // almacena el objeto en el array

        } catch (err) {

            console.error(err);
            setError('Error al obtener los datos de lo cuentos', err); // muestra el error en el form

        } finally {

            setLoading(false); // finaliza la carga de objetos

        }
    }

    // al 'ejecutar' la pantalla, montamos el fetch
    useEffect(() => {
        fetchUbicaciones();
    }, []);

    // manejo del registro o edicion del objeto
    const handleRegister = async () => {
        try {

            //preparamos los datos el formulario a enviar
            const formPayload = new FormData();


            formPayload.append('nombre', formData.nombre);
            formPayload.append('descripcion', formData.descripcion)

            // si al momento de actualizar, este campo vienen vacio, eliminarlo del form data para evitar errores
            // es decir, si el usuario no lo quiere actualizar
            // recordemos que en el modal tenemos un requerid solo para al momento de crear, entonces si o si tendria datos al momento de crear, mas no es necesario para editar
            if (formData.portada) {
                formPayload.append("portada", formData.portada);
            }

            console.log(formData.portada)

            // pregunta si esta editando
            if (isEditing && editId) {

                // enviamos los datos para la edicion
                await Ubicaciones_services.editarUbicacion(editId, formPayload);

                toast.success('Ubicación actualizada correctamente', { autoClose: 4000 });

            } else {


                // ver como se estan enviando los datos
                // console.log("Datos del formulario:");
                // for (let [key, value] of formPayload.entries()) {
                //     console.log(`${key}:`, value);
                // }

                // en caso de un create
                await Ubicaciones_services.crearUbicacion(formPayload);

                toast.success('Ubicación registrada correctamente', { autoClose: 4000 });

                // ocultamos el modal
                setShowModal(false);

            }

            // limpiamos los datos del modal 
            setFormData({
                portada: '',
                nombre: '',
                descripcion: ''
            });

            // recargamos a=la lista
            fetchUbicaciones();

        } catch (err) {
            console.error('Error al registrar:', err);
            console.log("Detalles del error:", err?.response?.data);

            toast.error('Hubo un problema al registrar la ubicación', { autoClose: 4000 });
        }
    };

    // encargado de activar el modal para edicion y llenar datos del mismo
    const handleEdit = (ubicacion) => {

        // llena los datos del modal, con el objeto seleccionado
        setFormData({
            portada: ubicacion.portada,
            nombre: ubicacion.nombre,
            descripcion: ubicacion.descripcion
        });

        setEditId(ubicacion.id) //  guarda el id para la edicion
        setIsEditing(true)     //   activa el modo de edicion
        setShowModal(true)    //    muestra el modal con los datos cargados
    };

    // manejo de la eliminacion de datos
    const handleDelete = async (id) => {

        // ventana de confirmacion
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción lo eliminará permanentemente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {

            //si el usuario confirma la eliminacion
            if (result.isConfirmed) {
                try {
                    // llamamos al servicio para eliminar
                    await Ubicaciones_services.BorrarUbicacion(id)

                    // mostramos un mensaje de exito
                    toast.success('La ubicación ha sido eliminada.', { autoClose: 4000 });

                    // refrescamos la lista
                    fetchUbicaciones();

                } catch (err) {
                    console.error('error al eliminar: ', err);
                    toast.error('No se pudo eliminar la ubicación', { autoClose: 4000 });
                }


            }
        });
    };

    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
    };

    // se crea una copia superficila del array, para no modificar directamente el estado original
    const filtradoUbicaciones = [...ubicaciones]
        // filtramos por los datos que queremos  
        .filter((ubicacion) =>
            ubicacion.nombre.toLowerCase().includes(busqueda.toLowerCase())
        )
        // aplicamos el orden por el id segun el estado booleano
        .sort((a, b) => (ordenAscendente ? a.id - b.id : b.id - a.id));

    // Si ordenAscendente es true → se evalúa a.id - b.id
    // Si es false → se evalúa b.id - a.id;


    // funcion encargada de ordenar la lista
    const toggleOrden = () => {
        // se invierte el valor actual (de true a falso y viceversa)
        const nuevaOrden = !ordenAscendente;
        // se actualiza el orden con el nuevo valor
        setOrdenAscendente(nuevaOrden);

        // se crea una copia del array de usuarios usando [], asi evitamos duplicaciones 
        const listaOrdenada = [...ubicaciones].sort((a, b) => {
            return nuevaOrden ? a.id - b.id : b.id - a.id;
        });

        // actualizamos el estado
        setUbicaciones(listaOrdenada);
    };

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
                                <h1>Modulo de Ubicaciones</h1>

                                <div className="mb-3 input-group">
                                    <span className="input-group-text">
                                        <i className="bx bx-search"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Buscar por nombre"
                                        value={busqueda}
                                        onChange={handleBusquedaChange}
                                    />
                                </div>

                            </div>
                        </div>

                        <div className="row justify-content-center align-items-center">
                            <div className='d-flex align-items-center'>

                                <button type='button' className='btn btn-primary bx bxs-message-square-add mb-1' onClick={() => setShowModal(true)}>
                                    Agregar
                                </button>

                                
                            </div>
                        </div>


                        <div className='row justify-content-center align-items-center g-2 table-dark'>
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
                                        <table className='table table-striped'>
                                            <thead className='table-dark'>
                                                <tr>
                                                    <th scope='col' onClick={toggleOrden} style={{ cursor: 'pointer' }}>
                                                        {' '}
                                                        <i className={`bx ${ordenAscendente ? 'bx-sort-up' : 'bx-sort-down'}`}></i>
                                                    </th>

                                                    <th>Nombre</th>
                                                    <th>Descripción</th>
                                                    <th>Portada</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filtradoUbicaciones.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{item.id}</td>
                                                        <td>{item.nombre}</td>
                                                        <td>{item.descripcion}</td>

                                                        <td>
                                                            <img src={item.portada_url} alt="portada" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px' }} />
                                                        </td>


                                                        <td>
                                                            <a className='btn btn-dark bx bx-edit mt-1' onClick={() => handleEdit(item)} > </a>

                                                            <a className='btn btn-danger bx bxs-trash mt-1' onClick={() => handleDelete(item.id)}> </a>
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


            <Modal_Ubicaciones
                show={showModal} // Muestra u oculta el modal segun el estado 'showModal'

                onHide={() => {
                    setShowModal(false);   // Cierra el modal
                    setIsEditing(false);   // Asegura que no se encuentre en modo edición
                    setEditId(null);       // Limpia el ID del objeto que se estaba editando (si habia)
                }}

                onSubmit={handleRegister}     // Funcion que se ejecuta al enviar el formulario (registrar o actualizar)
                formData={formData}           // Datos actuales del formulario que se están editando o registrando
                setFormData={setFormData}     // Funcion para actualizar los datos del formulario
                isEditing={isEditing}         // Indica si el modal está en modo edición (true) o creacion (false)
            />


        </div>

    )




}

export default Registro_Ubicaciones_Content
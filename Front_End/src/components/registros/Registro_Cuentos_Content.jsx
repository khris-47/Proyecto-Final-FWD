import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import '../../styles/forms.css';
import Fondo from '../../assets/img/fondos/fondo_login.jpg';
import NavBar from '../navegacion/navBar';
import * as Cuentos_Services from '../../services/Cuentos_Services'

import Modal_Cuento from '../registros/Modal_Cuento'


function Registro_Cuentos() {

  const [cuentos, setCuentos] = useState([]);         // lista de objetos obtenidos delservices - api
  const [loading, setLoading] = useState(true);       // controla si se estan cargando los datos
  const [error, setError] = useState(null);           // manejo de errores
  const [isEditing, setIsEditing] = useState(false);  // determina si el modal se usara para editar 
  const [editId, setEditId] = useState(null);         // guarda el ID del objeto a editar
  const [showModal, setShowModal] = useState(false); //  controla la visibilidad del modal

  const [busqueda, setBusqueda] = useState('');

  const [ordenAscendente, setOrdenAscendente] = useState(true);

  const [formData, setFormData] = useState({         //  estado del formulario
    portada: '',
    nombre_Cuento: '',
    cuento: '',
    ubicacion: ''
  });

  const fetchCuentos = async () => {
    try {

      const response = await Cuentos_Services.getCuentos(); // llamamos al servicio para obtener los cuentos
      setCuentos(response.data); // almacena las cuentos en el estado

      console.log(response.data);


    } catch (err) {
      console.error(err);
      setError('Error al obtener los datos de los cuentos'); // muestra mensaje de error en el form

    } finally {
      setLoading(false); // finaliza la carga (exito o no)
    }
  }

  // al ejecutar el componente, montamos la carga de objeto
  useEffect(() => {
    fetchCuentos();
  }, []);

  // maneja el registro o edicion del objeto
  const handleRegister = async () => {
    try {

      // preparamos los datos del formulario a enviar
      const formPayload = new FormData();

      formPayload.append("nombre_Cuento", formData.nombre_Cuento);
      formPayload.append("ubicacion", Number(formData.ubicacion));
      formPayload.append("estado", 1);

      // si al momento de actualizar, estos campos vienen vacios, eliminarlos del form data para evitar errores
      // es decir, si el usuario no los quiere actualizar
      // recordemos que en el modal tenemos un requerid solo para al momento de crear, entonces si o si tendria datos al momento de crear, mas no es necesario para editar
      if (formData.portada) {
        formPayload.append("portada", formData.portada);
      }
      if (formData.cuento) {
        formPayload.append("cuento", formData.cuento);
      }
      
      // pregunta si se esta editando
      if (isEditing && editId) {

        // enviamos los datos para la edicion
        await Cuentos_Services.editarCuentos(editId, formPayload);

        toast.success('Cuento actualizado correctamente', { autoClose: 4000 });

      } else {

        // caso contrario, enviamos los datos a creacion
        await Cuentos_Services.crearCuentos(formPayload);

        toast.success('Cuento registrado correctamente', { autoClose: 4000 });

        // ocultamos el modal
        setShowModal(false);
      }

      // limpia los datos del modal despues de la accion
      setFormData({
        portada: '',
        nombre_Cuento: '',
        cuento: '',
        ubicacion: ''
      });

      // recargamos la lista de cuentos
      fetchCuentos();

    } catch (err) {
      console.error('Error al registrar el cuento:', err);

      console.log("Detalles del error:", err?.response?.data);

      toast.error('Hubo un problema al registrar el cuento', { autoClose: 4000 });

    }
  };

  // llena los datos del form
  const handleEdit = (cuento) => {

    // conformea el cuento seleccionado, llena los datos del modal
    setFormData({

      portada: cuento.portada,
      nombre_Cuento: cuento.nombre_Cuento,
      cuento: cuento.cuento,
      ubicacion: cuento.ubicacion.toString() // convierte numero a string para el input
    });
    setEditId(cuento.id);   // guarda el id para la edicion
    setIsEditing(true);        //  activa el modo edicion
    setShowModal(true);       //   muestra el modal con  los datos cargados
  };

  // maneja la desactivacion del cuento
  const handleDesactivarCuento = (id) => {


    // confirmacion de desactivacion
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción desactivará el cuento (no se eliminará).',
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

          // cambia el esatdo del objeto a 2 (inactivo)
          await Cuentos_Services.cambiarEstadoCuentos(id, 2);
          toast.success('El cuento ha sido desactivado correctamente.', { autoClose: 4000 });

          // Recargar la lista de cuentos
          fetchCuentos();

        } catch (error) {
          console.error('Error al desactivar el cuento:', error);
          toast.error('No se pudo desactivar el cuento.', { autoClose: 4000 });
        }
      }
    });
  };

  // maneja la re-activacion del cuento
  const handleActivarCuentos = (id) => {

    // confirmacion
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción volvera a activar el cuento.',
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
          await Cuentos_Services.cambiarEstadoCuentos(id, 1);

          toast.success('El cuento ha sido activado correctamente.', { autoClose: 4000 });

          // Recargar la lista de cuento
          fetchCuentos();

        } catch (error) {
          console.error('Error al activar el cuento:', error);
          toast.error('No se pudo activar el cuento.', { autoClose: 4000 });
        }
      }
    });
  }

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  // se crea una copia superficila del array, para no modificar directamente el estado original
  const filtradoCuentos = [...cuentos]
    // filtramos por los datos que queremos 
    .filter((cuento) =>
      cuento.nombre_Cuento.toLowerCase().includes(busqueda.toLowerCase()) ||
      cuento.ubicacion_nombre.toLowerCase().includes(busqueda.toLowerCase())
    )
    // aplicamos el orden por el id segun el estado booleano
    .sort((a, b) => (ordenAscendente ? a.id - b.id : b.id - a.id));

  // Si ordenAscendente es true → se evalúa a.id - b.id
  // Si es false → se evalúa b.id - a.id;;

  // funcion encargada de ordenar la lista
  const toggleOrden = () => {
    // se invierte el valor actual (de true a falso y viceversa)
    const nuevaOrden = !ordenAscendente;
    // se actualiza el orden con el nuevo valor
    setOrdenAscendente(nuevaOrden);

    // se crea una copia del array de usuarios usando [], asi evitamos duplicaciones 
    const listaOrdenada = [...cuentos].sort((a, b) => {
      return nuevaOrden ? a.id - b.id : b.id - a.id;
    });

    // actualizamos el estado
    setCuentos(listaOrdenada);
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
                <h1>Modulo de Cuentos</h1>

                <div className="mb-3 input-group">
                  <span className="input-group-text">
                    <i className="bx bx-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por nombre, ubicacion"
                    value={busqueda}
                    onChange={handleBusquedaChange}
                  />
                </div>

              </div>
            </div>

            <div className="row justify-content-center align-items-center">
              <div className='d-flex align-items-center'>

                <button type='button' className='btn btn-primary bx bxs-message-square-add' onClick={() => setShowModal(true)}>
                  Agregar
                </button>

                {/* From Uiverse.io by Cksunandh  */}
                <div className="tooltip-container">
                  <div className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="30"
                      height="30"
                    >
                      <path
                        d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.518 0-10-4.482-10-10s4.482-10 10-10 10 4.482 10 10-4.482 10-10 10zm-1-16h2v6h-2zm0 8h2v2h-2z"
                      ></path>
                    </svg>
                  </div>
                  <div className="tooltip">

                    <p>Sube imágenes con proporción similar a portadas de libro o fondo de teléfono, para que se vean bien en las cards. Evita usar fondos de escritorio completos o con un largo mayor al alto.</p>

                  </div>
                </div>

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
                    <table className='table table-striped'>
                      <thead className='table-dark'>
                        <tr>
                          <th scope='col' onClick={toggleOrden} style={{ cursor: 'pointer' }}>
                            Id{' '}
                            <i className={`bx ${ordenAscendente ? 'bx-sort-up' : 'bx-sort-down'}`}></i>
                          </th>
                          <th>Portada</th>
                          <th>Cuento</th>
                          <th>Nombre Cuento</th>
                          <th>Fecha de Subida</th>
                          <th>Ubicacion</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtradoCuentos.map((item) => (
                          <tr key={item.id}>
                            <td>{item.id}</td>

                            <td>
                              <img src={item.portada_url} alt="portada" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px' }} />
                            </td>

                            <td>
                              <a
                                href={item.cuento_url}
                                className="btn btn-outline-primary btn-sm"
                              >
                                Ver PDF
                              </a>
                            </td>

                            <td>{item.nombre_Cuento}</td>
                            <td>{new Date(item.fecha_creacion).toLocaleString()}</td>
                            <td>{item.ubicacion_nombre}</td>
                            <td>{item.estado === 1 ? 'Activo' : 'Inactivo'}</td>
                            <td>
                              <a className='btn btn-dark bx bx-edit' title="Editar" onClick={() => handleEdit(item)}>
                              </a>
                              ||
                              {item.estado === 1 ? (
                                <a className='btn btn-danger bx bxs-trash' title="Desactivar" onClick={() => handleDesactivarCuento(item.id)} > </a>
                              ) : (
                                <a className='btn btn-primary bx bx-check-circle' title="Re-activar" onClick={() => handleActivarCuentos(item.id)} > </a>
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

      <Modal_Cuento
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

export default Registro_Cuentos
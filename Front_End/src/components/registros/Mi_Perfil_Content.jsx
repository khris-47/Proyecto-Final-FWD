import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import NavBar from '../navegacion/navBar';
import Fondo from '../../assets/img/fondos/fondo_principal.JPG';
import { Link, useNavigate } from 'react-router-dom';
import Modal_Usuario from '../registros/Modal_Usuario';
import Swal from 'sweetalert2';

import * as Usuario_Services from '../../services/Usuarios_Services'

import '../../styles/mi_perfil.css'

function MiPerfilContent() {
  const [userData, setUserData] = useState(null);     // almacena los datos del usuario (usado para mostrar datos en pantalla)
  const [showModal, setShowModal] = useState(false); //  modal de edicion
  const navigate = useNavigate();                   //   variable para redireccion
  const userId = Cookies.get('userId');            //    ID del usuario logueado
  const token = Cookies.get('accessToken');       //     token del usuario logueado 

  const [formData, setFormData] = useState({       //    formulario editable (rellnado con datos del usuario)
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '' // Puede quedar vacío si no se va a cambiar la contraseña
  });

  // cuando se abre el componente, verificamos si hay un usuario logueado
  useEffect(() => {
    const userCookie =  Cookies.get('user'); // traemos la cookie con los datos del usuario

    if (userCookie && token) { // verificamos que las cookies no esten vacias
      
      const user = JSON.parse(userCookie); // convertirmos el string en objeto

      setUserData(user); // dato visibles en pantalla

      setFormData(prev => ({  // 'prev =>' funcion que toma el valor anterior del estado (formData y devuelve un nuevo objeto actualizado) 
        ...prev, // copiamos todo lo que ya habia en el estado formData
        ...user, // sobreescribimos los datos del prev, con los del usuario
        password: '' // dejamos el password vacio por seguridad del usuario
      }))

    }

  }, []);

  // abre el modal cuando al hacer click en e boton de  editar
  const handleEdit = () => {
    setShowModal(true);
  };

  // Manejo de la actualización de datos
  const handleUpdate = async () => {

    try {
      // llamamos al aapi para actualizar los datos del usuario
      await Usuario_Services.actualizarUsuario(userId, formData, token)

      // guardamos los nuevos datos en cookies
      Cookies.set('user', JSON.stringify(formData), { expires: 1 });

      // alerta de exito
      Swal.fire({
        title: '¡Éxito!',
        text: 'Usuario actualizado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });

      // actualizamos en pantalla
      setUserData(formData);

      setShowModal(false); // cerramos el modal

    } catch (error) {

      console.error('Error al actualizar perfil:', error);
      Swal.fire({
        title: '¡Error!',
        text: 'Hubo un problema al actualizar el usuario', error,
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo'
      });

    }
  };


  // Manejo de la eliminacion de datos
  const handleDelete = async () => {

    // ventana de confirmacion
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará tu cuenta permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {

      // si el usuario confirma la eliminacion
      if (result.isConfirmed) {
        try {

          // llamamos al servicio para eliminar al usuario
          await Usuario_Services.eliminarUsuario(userId, token);

          // Eliminar cookies y redirigir al usuario
          Cookies.remove('user');
          Cookies.remove('accessToken');
          Cookies.remove('userId');

          // mostramos un mensaje de exito
          Swal.fire('Cuenta eliminada', 'Tu perfil ha sido eliminado.', 'success');

          // redireccionamos
          navigate('/');

        } catch (error) {

          console.error('Error al eliminar perfil:', error);
          Swal.fire('Error', 'No se pudo eliminar el perfil.', 'error');

        }
      }
    });
  };

  return (
    <div className="mi-perfil-container">

      <div className="background-container">

        <img className="background-image" src={Fondo} alt=".." />

        <header className="headerAbout">
          <NavBar />
        </header>


      </div>
      <div className='capa'></div>

      <div className="formulario-perfil">
        <h1>Detalles del Perfil</h1>
        <div>
          <h4>Usuario</h4>
          <hr />
          <dl className="row">
            <dt className="col-sm-4">Nombre de usuario:</dt>
            <dd className="col-sm-8">{userData?.username || 'Cargando...'}</dd>

            <dt className="col-sm-4">Email:</dt>
            <dd className="col-sm-8">{userData?.email || 'Cargando...'}</dd>

            <dt className="col-sm-4">Nombre:</dt>
            <dd className="col-sm-8">{userData?.first_name || 'Cargando...'}</dd>

            <dt className="col-sm-4">Apellidos:</dt>
            <dd className="col-sm-8">{userData?.last_name || 'Cargando...'}</dd>

            <dt className="col-sm-4">Fecha de Ingreso:</dt>
            <dd className="col-sm-8">{userData?.date_joined || 'Cargando...'}</dd>
          </dl>
        </div>
        <div>
          <button className="btn btn-primary mt-3 m-1" onClick={handleEdit}>Editar</button>
          <Link to='/' className='btn btn-dark mt-3 m-1'>Menú</Link>

          {/* Solo mostrar el boton de eliminación si el usuario NO es el admin */}
          {(userData?.id !== 1 && !userData?.is_superuser) && (
            <button className='btn btn-danger mt-3 m-1' onClick={handleDelete}>Eliminar Perfil</button>
          )}


        </div>
      </div>


      {/* Modal de edición */}
      <Modal_Usuario
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleUpdate}
        formData={formData}
        setFormData={setFormData}
        isEditing={true}
      />


    </div>
  );
}

export default MiPerfilContent;
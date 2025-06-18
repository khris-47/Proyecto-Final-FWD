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
  const userCookie = Cookies.get('user');       // traemos la cookie con los datos del usuario

  const [cambiarPassword, setCambiarPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');


  const [formData, setFormData] = useState({       //    formulario editable (rellnado con datos del usuario)
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '' // Puede quedar vacío si no se va a cambiar la contraseña
  });

  // cuando se abre el componente, verificamos si hay un usuario logueado
  useEffect(() => {

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


  const comprobarContra = async () => {

    const { value: password } = await Swal.fire({
      title: 'Confirmación de contraseña',
      input: 'password',
      inputLabel: 'Introduce tu contraseña actual',
      inputPlaceholder: 'Contraseña',
      inputAttributes: {
        maxlength: 50,
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    });

    if (password) {
      try {

        // Validación opcional: puedes verificarla con la API
        const response = await Usuario_Services.validarPassword(userId, password, token);

        if (response.data.valid) {

          return true

        } else {

          Swal.fire({
            title: 'Contraseña incorrecta',
            text: 'La contraseña ingresada no es válida.',
            icon: 'error'
          });
          return false

        }

      } catch (error) {

        console.error('Error al validar contraseña:', error);
        Swal.fire({
          title: 'Error de validación',
          text: 'No se pudo verificar la contraseña.',
          icon: 'error'
        });

        return false
      }
    }
  }

  // abre el modal cuando al hacer click en e boton de  editar
  const handleEdit = async () => {

    const espera = await comprobarContra()

    console.log(espera)

    if(espera) {
        setShowModal(true); // Mostrar modal solo si es válida
    } else {
      return
    }

      

  };

  // Manejo de la actualización de datos
  const handleUpdate = async () => {

    try {

      // Hacemos una copia limpia de formData
      const datosLimpios = { ...formData };

      // Si el campo password está vacío, lo eliminamos antes de enviar
      if (!datosLimpios.password || datosLimpios.password.trim() === '') {
        delete datosLimpios.password;
      }

      // llamamos al aapi para actualizar los datos del usuario
      await Usuario_Services.actualizarUsuario(userId, datosLimpios, token)

      // guardamos los nuevos datos en cookies
      Cookies.set('user', JSON.stringify(datosLimpios), { expires: 1 });

      // alerta de exito
      Swal.fire({
        title: '¡Éxito!',
        text: 'Usuario actualizado correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });

      // actualizamos en pantalla
      setUserData(datosLimpios);

      setShowModal(false); // cerramos el modal

      // Reset al estado por si se vuelve a abrir el modal
      setCambiarPassword(false);
      setConfirmPassword('');

    } catch (error) {

      console.error('Error al actualizar perfil:', error);
      Swal.fire({
        title: '¡Error!',
        text: 'Hubo un problema al actualizar el usuario',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo'
      });

    }
  };


  // Manejo de la eliminacion de datos
  const handleDelete = async () => {

    const espera = await comprobarContra()

    if(espera) {

      // ventana de confirmacion
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará tu cuenta permanentemente. \nEsto hara que todos tus comentarios y formularios enviados se perderan',
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
    }


  };

  const handleCambiarPassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Cambiar Contraseña',
      html:
        '<input id="actual" type="password" class="swal2-input" placeholder="Contraseña actual">' +
        '<input id="nueva" type="password" class="swal2-input" placeholder="Nueva contraseña">' +
        '<input id="confirmar" type="password" class="swal2-input" placeholder="Confirmar nueva contraseña">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Cambiar',
      preConfirm: () => {
        const actual = document.getElementById('actual').value;
        const nueva = document.getElementById('nueva').value;
        const confirmar = document.getElementById('confirmar').value;

        if (!actual || !nueva || !confirmar) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return false;
        }

        if (nueva !== confirmar) {
          Swal.showValidationMessage('Las contraseñas nuevas no coinciden');
          return false;
        }

        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!regex.test(nueva)) {
          Swal.showValidationMessage('La nueva contraseña es insegura');
          return false;
        }

        return { actual, nueva };
      }
    });

    if (formValues) {
      try {
        await Usuario_Services.cambiarPassword(formValues.actual, formValues.nueva, token);
        Swal.fire('¡Éxito!', 'Tu contraseña ha sido actualizada.', 'success');
      } catch (error) {
        Swal.fire('Error', error.response?.data?.error || 'No se pudo cambiar la contraseña.', 'error');
      }
    }
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

          </dl>
        </div>

        <div>
          <button className="btn btn-primary mt-3 m-1" onClick={handleEdit}>Editar</button>

          <button className="btn btn-warning mt-3 m-1" onClick={handleCambiarPassword}>
            Cambiar Contraseña
          </button>

          {(userData?.id !== 1 && !userData?.is_superuser) && (
            <button className='btn btn-danger mt-3 m-1' onClick={handleDelete}>
              Eliminar Perfil
            </button>
          )}

          <Link to='/' className='btn btn-dark mt-3 m-1'>Menú</Link>


        </div>
      </div>

      <Modal_Usuario
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setCambiarPassword(false);
          setConfirmPassword('');
        }}
        onSubmit={handleUpdate}
        formData={formData}
        setFormData={setFormData}
        isEditing={true}
        mostrarPassword={cambiarPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
      />
    </div>
  );
}

export default MiPerfilContent;
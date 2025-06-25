import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import NavBar from '../navegacion/navBar';
import Fondo from '../../assets/img/fondos/fondo_principal.JPG';
import { Link, useNavigate } from 'react-router-dom';
import Modal_Usuario from '../registros/Modal_Usuario';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

import * as Usuario_Services from '../../services/Usuarios_Services'

import '../../styles/mi_perfil.css'

function MiPerfilContent() {
  const [userData, setUserData] = useState(null);     // almacena los datos del usuario (usado para mostrar datos en pantalla)
  const [showModal, setShowModal] = useState(false); //  modal de edicion

  const navigate = useNavigate();                   //   variable para redireccion
  const token = Cookies.get('accessToken');       //     token del usuario logueado 
  const userCookie = Cookies.get('user');       // traemos la cookie con los datos del usuario

  const [cambiarPassword, setCambiarPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');


  const decoded = jwtDecode(token); // decodificamos el token
  const userId = decoded.user_id // obtenemos el id de ese token

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
  };

  // abre el modal cuando al hacer click en e boton de  editar
  const handleEdit = async () => {

    const espera = await comprobarContra()

    if (espera) {
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
      await Usuario_Services.actualizarUsuario(datosLimpios, token)

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

    if (espera) {

      // ventana de confirmacion
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará tu cuenta permanentemente. Esto hara que todos tus comentarios y formularios enviados se pierdan',
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
            await Usuario_Services.eliminarUsuario(token);

            // Eliminar cookies y redirigir al usuario
            Cookies.remove('user');
            Cookies.remove('accessToken');

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

  // Manejo del cambio de contrasena
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

        <div className="perfil-detalles-y-loader">
          <div className="perfil-detalles">

            <h1>Detalles del Perfil</h1>
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

          <div className='loader-wrapper'>
            <section className="loader">
              <aside className="cap"></aside>
              <aside className="shadow-top"></aside>
              <article className="circle"></article>
              <article className="circle-top"></article>
              <svg
                height="200px"
                width="200px"
                version="1.1"
                className="fish"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 512 512"
                xmlSpace="preserve"
                fill="#000000"
              >
                <g strokeWidth="0"></g>
                <g strokeLinecap="round" strokeLinejoin="round"></g>
                <g>
                  <path
                    style={{ fill: "#3c66b1" }}
                    d="M155.225,223.377c0,0,37.189-90.859,144.589-91.34c100.768-0.451,124.753,59.527,124.753,59.527 L155.225,223.377z"
                  ></path>
                  <path
                    style={{ fill: "#8ec1ed" }}
                    d="M267.842,339.889c-89.137-24.416-179.415-81.052-179.415-81.052s140.421-92.038,253.44-92.038 s162.587,121.482,162.587,121.482s-49.567,62.594-162.587,62.594c-7.464,0-15.002-0.401-22.575-1.151L267.842,339.889z"
                  ></path>
                  <g style={{ opacity: '0.4' }}>
                    <path
                      style={{ fill: '#3c66b1' }}
                      d="M504.454,288.279c0,0-31.461-77.103-101.402-108.457c-16.687,7.061-52.699,48.747-53.584,82.508 c-0.941,35.906,12.738,68.547,41.995,84.212C469.521,332.375,504.454,288.279,504.454,288.279z"
                    ></path>
                  </g>
                  <g>
                    <path
                      style={{ opacity: '0.23', fill: '#315591', enablebackground: 'new' }}
                      d="M341.867,318.829c-7.464,0-15.002-0.401-22.575-1.151 l-51.451-9.835C208.667,291.633,149,261.23,115.566,242.618c-17.003,9.71-27.139,16.352-27.139,16.352 s90.277,56.635,179.415,81.052l51.451,9.836c7.573,0.75,15.111,1.151,22.575,1.151c113.019,0,162.587-62.594,162.587-62.594 s-3.513-8.607-10.796-21.237C473.573,285.121,424.806,318.829,341.867,318.829z"
                    ></path>
                    <path
                      style={{ fill: '#315591' }}
                      d="M504.453,295.827h-51.719c-4.169,0-7.546-3.379-7.546-7.546s3.378-7.546,7.546-7.546h51.719 c4.169,0,7.546,3.379,7.546,7.546S508.622,295.827,504.453,295.827z"
                    ></path>
                    <path
                      style={{ fill: '#315591' }}
                      d="M349.468,268.867c0,0,0.053,91.146-81.623,111.099v-91.062c0-10.128,8.092-18.402,18.217-18.627 L349.468,268.867z"
                    ></path>
                    <circle
                      style={{ fill: '#315591' }}
                      cx="413.916"
                      cy="255.823"
                      r="10.653"
                    ></circle>
                  </g>
                  <path
                    style={{ fill: '#52a2e7' }}
                    d="M98.489,258.837c0,0-0.526-31.012-18.339-44.472c-17.814-13.461-72.604-25.84-72.604-25.84 s26.962,52.578,44.774,66.038c0.024,0.018,0.048,0.036,0.072,0.054c2.843,2.135,2.843,6.303,0,8.438 c-0.024,0.018-0.048,0.036-0.072,0.054c-17.813,13.461-44.774,66.039-44.774,66.039s54.79-12.379,72.604-25.84 C97.963,289.849,98.489,258.837,98.489,258.837h-0.001H98.489z"
                  ></path>
                  <g style={{ opacity: '0.23' }}>
                    <path
                      style={{ fill: '#315591' }}
                      d="M97.786,250.979c-1.385,10.103-5.491,27.435-17.637,36.613c-13.069,9.876-46.044,19.17-62.68,23.419 c-5.928,10.348-9.924,18.139-9.924,18.139s54.79-12.379,72.604-25.84c17.813-13.461,18.339-44.472,18.339-44.472h-0.001h0.001 C98.489,258.837,98.432,255.692,97.786,250.979z"
                    ></path>
                  </g>
                  <path
                    d="M510.988,292.046c0.301-0.521,0.541-1.081,0.711-1.67c0.019-0.065,0.033-0.132,0.051-0.197 c0.058-0.226,0.107-0.456,0.145-0.69c0.014-0.083,0.028-0.167,0.038-0.252c0.03-0.241,0.048-0.484,0.055-0.731 c0.002-0.06,0.009-0.121,0.009-0.181c0-0.015,0.002-0.029,0.002-0.043c0-0.29-0.02-0.575-0.052-0.856 c-0.008-0.066-0.021-0.132-0.03-0.198c-0.034-0.243-0.079-0.483-0.136-0.718c-0.018-0.075-0.037-0.15-0.057-0.225 c-0.073-0.269-0.16-0.531-0.262-0.787c-0.009-0.022-0.013-0.044-0.022-0.066c-0.004-0.009-0.015-0.035-0.02-0.048 c-0.009-0.021-0.017-0.042-0.026-0.064c-0.924-2.239-13.592-32.307-40.167-62.741c-12.591-14.42-26.222-26.467-40.683-36.055 c-2.522-5.093-9.985-18.036-25.84-30.774c-17.789-14.293-50.2-31.26-103.784-31.26c-0.379,0-0.761,0.001-1.141,0.002 c-58.051,0.26-96.145,26.282-117.878,48.067c-20.962,21.011-30.971,41.871-33.186,46.859 c-19.408,10.593-34.727,20.129-44.142,26.254c-2.109-11.484-7.263-27.794-19.874-37.325c-18.895-14.278-73.188-26.66-75.489-27.179 c-2.864-0.646-5.832,0.422-7.627,2.737c-1.795,2.315-2.088,5.461-0.752,8.068c2.733,5.329,26.392,50.872,44.794,66.868 c-18.4,15.996-42.061,61.541-44.794,66.869c-1.336,2.607-1.043,5.752,0.752,8.068c1.447,1.867,3.662,2.923,5.964,2.923 c0.552,0,1.111-0.061,1.663-0.186c2.301-0.52,56.595-12.902,75.489-27.18c12.701-9.598,17.838-25.815,19.918-37.279 c24.086,15.7,86.309,53.477,155.681,73.549v34.365c0,2.316,1.065,4.505,2.886,5.935c1.343,1.055,2.988,1.611,4.661,1.611 c0.598,0,1.198-0.07,1.791-0.215c20.917-5.109,38.644-15.195,52.628-29.738c6.682,0.562,13.265,0.864,19.604,0.864 c19.361,0,36.878-1.833,52.578-4.803c0.529-0.048,1.05-0.143,1.556-0.3c32.253-6.303,56.696-17.399,73.375-27.242 c27.414-16.177,40.451-32.427,40.992-33.112c0.029-0.036,0.05-0.077,0.078-0.115c0.15-0.196,0.29-0.399,0.42-0.61 C510.909,292.176,510.949,292.112,510.988,292.046z M192.587,183.217c28.697-28.763,64.785-43.443,107.261-43.633 c0.355-0.001,0.706-0.002,1.061-0.002c38.529,0,70.871,9.44,93.58,27.326c1.113,0.876,2.175,1.753,3.195,2.628 c-17.812-6.797-36.516-10.282-55.813-10.282c-48.038,0-104.362,15.744-167.407,46.796c-0.387,0.191-0.766,0.381-1.152,0.573 C178.042,199.62,184.394,191.428,192.587,183.217z M75.601,297.288c-9.926,7.501-34.829,15.378-53.242,20.364 c9.843-17.406,24.479-40.927,34.511-48.521c0.019-0.014,0.037-0.027,0.055-0.042c3.271-2.456,5.147-6.194,5.147-10.253 c0-4.06-1.877-7.797-5.202-10.293c-10.014-7.567-24.661-31.105-34.51-48.523c18.408,4.985,43.305,12.858,53.241,20.365 c14.073,10.634,15.264,36.312,15.338,38.452C90.865,260.976,89.674,286.654,75.601,297.288z M275.391,369.907v-99.226 c0-4.168-3.378-7.546-7.546-7.546c-4.169,0-7.546,3.379-7.546,7.546v59.183c-65.852-19.872-125.891-56.494-148.236-71.023 c31.434-20.416,137.475-84.496,229.806-84.496c16.259,0,31.865,2.614,46.77,7.791c-24.476,16.464-46.715,44.053-46.715,80.194 c0,1.823,0.039,3.615,0.096,5.394c-0.057,0.374-0.096,0.755-0.096,1.146c0,0.213-0.099,21.593-9.635,45.24 c-4.72,11.704-10.83,21.765-18.256,30.203c-0.306,0.298-0.584,0.624-0.836,0.971C303.009,356.532,290.384,364.767,275.391,369.907z M333.902,343.157c4.804-7.083,8.948-14.89,12.381-23.4c1.418-3.516,2.643-6.979,3.712-10.349 c5.176,13.014,12.812,23.82,22.786,32.228c-9.704,1.085-19.999,1.693-30.914,1.693C339.258,343.329,336.592,343.259,333.902,343.157 z M394.772,338.203c-25.055-12.771-37.757-38.28-37.757-75.872c0-34.381,24.622-59.85,48.762-72.953 c4.674,2.34,9.273,4.947,13.792,7.831c0.55,0.486,1.164,0.886,1.823,1.192c13.445,8.842,26.188,20.096,38.17,33.762 c16.284,18.573,27.175,37.347,32.955,48.571h-39.782c-4.169,0-7.546,3.379-7.546,7.546s3.378,7.546,7.546,7.546h33.298 C470.691,308.863,440.888,328.871,394.772,338.203z"
                  ></path>
                  <path
                    d="M413.913,237.629c-10.036,0-18.199,8.164-18.199,18.199c0,10.036,8.163,18.199,18.199,18.199s18.199-8.164,18.199-18.199 S423.949,237.629,413.913,237.629z M413.913,258.935c-1.713,0-3.106-1.394-3.106-3.106c0-1.713,1.394-3.106,3.106-3.106 s3.106,1.394,3.106,3.106S415.626,258.935,413.913,258.935z"
                  ></path>
                </g>
              </svg>
            </section>
            <footer className="shadow-bottom"></footer>

          </div>

        </div>


        <div>
          <button className="btn btn-secondary mt-3 m-1" onClick={handleEdit}>Editar</button>

          <button className="btn btn-primary mt-3 m-1" onClick={handleCambiarPassword}>
            Cambiar Contraseña
          </button>

          {(userId !== 1) && (
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
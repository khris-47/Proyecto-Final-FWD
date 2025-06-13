import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import * as Usuarios_Services from '../../services/Usuarios_Services'
import Fondo from '../../assets/img/fondos/fondo_login.jpg'
import Logo from '../../assets/img/logos/logo_blanco.png'
import Modal_Usuario from '../registros/Modal_Usuario'; // Modal de registro de usuario

import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode'; // npm install jwt-decode
import Cookies from 'js-cookie'; // npm install js-cookie

import '../../styles/login.css'



function Login_content() {

    // Estados para controlar el login
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Constante para manejar la navegacion de paginas
    const navigate = useNavigate();

    // Estados para el modal de registro
    const [showModal, setShowModal] = useState(false); // controla la visibilidad del modal
    const [formData, setFormData] = useState({ // datos del nuevo usuario
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: ''
    });

    // Funcion para manejar el incio de sesion
    const handleSubmit = async (e) => {
        e.preventDefault(); // previene la acciones por defecto
        setError(''); // limpia errores anteriores

        try {
            // 1. Obtener token JWT 
            const response = await Usuarios_Services.loginUsuario(username, password);

            const { access } = response.data; // extraemos el token de acceso

            // 2. Decodificar token para obtener user_id
            const decoded = jwtDecode(access);
            const userId = decoded.user_id;

            // 3. Obtener detalles del usuario autenticado
            const userResponse = await Usuarios_Services.obtenerUsuarioPorId(userId, access);

            // guardamos los datos completos del usuario
            const userData = userResponse.data;

            // 4. Guardar los datos obtenidos en cookies
            Cookies.set('user', JSON.stringify(userData), { expires: 1 }); // guardamos el objeto como un string
            Cookies.set('accessToken', access, { expires: 1 }); // token
            Cookies.set('userId', userId, { expires: 1 }); // id de usuario


            // 5. Redirigir a la pagina principal
            navigate('/');

        } catch (err) {
            // Si las credenciales fallan
            if (err.response && err.response.status === 401) {

                try {
                    // Verificamos si el usuario existe pero se encuentra inactivo
                    const usuarioInactivo = await Usuarios_Services.obtenerUsuarioPorUsername(username);

                    if (!usuarioInactivo.data.is_active) {
                        // Si se encuentra inactivo, lo mandamos al flujo de recuperacion
                        const confirmar = await Swal.fire({
                            title: 'Cuenta inactiva',
                            text: 'Tu cuenta está desactivada. ¿Deseas actualizar tu contraseña para activarla?',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Sí, actualizar',
                            cancelButtonText: 'Cancelar'
                        });

                        if (confirmar.isConfirmed) {
                            handleActualizarPasswordPostReset(username);
                            return;
                        }

                    } else {
                        // Si esta activo, entonces son credenciales incorrectas
                        Swal.fire({
                            title: '¡Datos Erróneos!',
                            text: 'Credenciales incorrectas',
                            icon: 'error',
                            confirmButtonText: 'Intentar de nuevo'
                        });
                    }

                } catch {
                    // Si el usuario no existe o hubo otro error
                    Swal.fire({
                        title: 'Error',
                        text: 'Credenciales incorrectas o usuario no encontrado.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }

            } else {
                setError('Error del servidor.');
            }
        }

    };

    // Funcion para manejar el registro de un nuevo usuario desde el modal
    const handleRegister = async () => {
        try {
            // Enviamos los datos del modal a la api
            await Usuarios_Services.registrarUsuario(formData);


            Swal.fire({
                title: '¡Éxito!',
                text: 'Usuario creado correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });

            // Cerramos el modal y limpiamos el formulario
            setShowModal(false);
            setFormData({
                username: '',
                email: '',
                first_name: '',
                last_name: '',
                password: ''
            });
        } catch (error) {
            console.error('Error al registrar usuario:', error);

            Swal.fire({
                title: '¡Datos Erroneos!',
                text: 'Error al registrar el usuario', error,
                icon: 'error',
                confirmButtonText: 'Intentar de nuevo'
            });

        }
    };


    // Manejo del envio de correo para restablecimiento de contra
    const handleForgotPassword = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Recuperar Contraseña',
            html:
                '<input id="swal-username" class="swal2-input" placeholder="Nombre de usuario">' +
                '<input id="swal-email" type="email" class="swal2-input" placeholder="Correo electrónico">',
            focusConfirm: false,
            confirmButtonText: 'Enivar',
            showCancelButton: true,
            preConfirm: () => {
                const username = document.getElementById('swal-username').value;
                const email = document.getElementById('swal-email').value;

                if (!username || !email) {
                    Swal.showValidationMessage('Los campos son obligatorios');
                    return false;
                }
                return { username, email };
            }
        });

        if (formValues) {
            try {
                await Usuarios_Services.resetPassword(formValues.username, formValues.email)

                Swal.fire(
                    '¡Correo enviado!',
                    'Se ha enviado una nueva contraseña a tu correo.',
                    'success'
                );

            } catch (error) {
                Swal.fire(
                    'Error',
                    error.response?.data?.error || 'No se pudo restablecer la contraseña.',
                    'error'
                );
            }
        }
    }

    // funcion para reactivar contrasenha y reactivar 
    const handleActualizarPasswordPostReset = async (prefilledUsername = '') => {
        const { value: formValues } = await Swal.fire({
            title: 'Actualizar contraseña',
            html:
                `<input id="swal-username-reset" class="swal2-input" placeholder="Nombre de usuario" value="${prefilledUsername}" readonly>` +
                '<input id="swal-temp-password" type="password" class="swal2-input" placeholder="Contraseña temporal">' +
                '<input id="swal-new-password" type="password" class="swal2-input" placeholder="Nueva contraseña">',
            focusConfirm: false,
            confirmButtonText: 'Actualizar',
            showCancelButton: true,
            preConfirm: () => {
                const username = document.getElementById('swal-username-reset').value;
                const temp_password = document.getElementById('swal-temp-password').value;
                const nueva_password = document.getElementById('swal-new-password').value;

                if (!username || !temp_password || !nueva_password) {
                    Swal.showValidationMessage('Todos los campos son obligatorios');
                    return false;
                }
                return { username, temp_password, nueva_password };
            }
        });

        if (formValues) {
            try {
                await Usuarios_Services.cambiarPasswordTrasReset(
                    formValues.username,
                    formValues.temp_password,
                    formValues.nueva_password
                );

                Swal.fire(
                    '¡Contraseña actualizada!',
                    'Tu contraseña fue cambiada correctamente. Ya puedes iniciar sesión.',
                    'success'
                );
            } catch (error) {
                Swal.fire(
                    'Error',
                    error.response?.data?.error || 'No se pudo actualizar la contraseña.',
                    'error'
                );
            }
        }
    };


    return (
        <div className='bodyLogin'>
            {/* Fondo con capa oscura */}
            <div className="background-container">
                <div className="capaL"></div>
                <img className="background-image" src={Fondo} alt=".." />
            </div>

            {/* Contenedor principal del login */}
            <div className="login-container">
                <div className="left-panel">
                    <img src={Logo} alt="logo" />
                </div>

                <div className="right-panel">
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <form className="form-control_login" onSubmit={handleSubmit}>
                            <p className="title">Iniciar sesión</p>

                            {/* Mensaje de error */}
                            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                            {/* Campo Usuario */}
                            <div className="input-field">
                                <input
                                    required
                                    className="input_login"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <label className="label_login">Usuario</label>
                            </div>

                            {/* Campo Contrasenha */}
                            <div className="input-field">
                                <input
                                    required
                                    className="input_login"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <label className="label_login">Contraseña</label>
                            </div>

                            {/* Enlace para recuperar contrasenha */}
                            <span onClick={handleForgotPassword} style={{ color: '#0d6efd', display: 'block', marginBottom: '10px', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }}>
                                ¿Olvidaste la contraseña?
                            </span>

                            {/* Boton de login */}
                            <button type="submit" className="submit-btn">Ingresar</button>

                            {/* Link para abrir el modal de registro */}
                            <div style={{ textAlign: 'center', fontSize: '14px', marginTop: '15px' }}>
                                <span style={{ marginRight: '5px' }}>¿No tienes una cuenta?</span>
                                <span
                                    onClick={() => setShowModal(true)}
                                    style={{ color: '#0d6efd', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    Nuevo Usuario
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal para registro de nuevo usuario */}
            <Modal_Usuario
                show={showModal} // mostrar u ocultar el modal
                onHide={() => setShowModal(false)} //cierra el modal
                onSubmit={handleRegister} // enviar los datos al registro
                formData={formData} // registra los datos del modal
                setFormData={setFormData} // actualiza los datos del formulario
            />
        </div>
    );
}

export default Login_content;
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
            if (err.response && err.response.status === 401) {
                Swal.fire({
                    title: '¡Datos Erroneos!',
                    text: 'Credenciales incorrectas',
                    icon: 'error',
                    confirmButtonText: 'Intentar de nuevo'
                });
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
                            <Link to="" style={{ display: 'block', marginBottom: '10px', fontSize: '14px' }}>
                                ¿Olvidaste la contraseña?
                            </Link>

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
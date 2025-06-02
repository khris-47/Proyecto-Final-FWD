import React, { useState } from 'react';
import Fondo from '../../assets/img/fondos/fondo_login.jpg'
import Logo from '../../assets/img/logos/logo_blanco.png'
import { Link, useNavigate } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode'; // npm install jwt-decode
import Cookies from 'js-cookie'; // npm install js-cookie
import axios from 'axios'; // npm install axios

import '../../styles/login.css'

import Modal_Usuario from '../registros/Modal_Usuario'; // Modal de registro de usuario

function Login_content() {

    // Estados para login
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Estados para el modal de registro
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: ''
    });

    // Login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // 1. Obtener token JWT
            const response = await axios.post('http://localhost:8000/api/token/', {
                username,
                password
            });

            const { access } = response.data;

            // 2. Decodificar token para obtener user_id
            const decoded = jwtDecode(access);
            const userId = decoded.user_id;

            // 3. Obtener detalles del usuario
            const userResponse = await axios.get(`http://localhost:8000/api/UserDetails/${userId}`, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            });

            const userData = userResponse.data;

            // 4. Guardar datos en cookies
            Cookies.set('user', JSON.stringify(userData), { expires: 1 });
            Cookies.set('accessToken', access, { expires: 1 });
            Cookies.set('userId', userId, { expires: 1 });

            

            console.log(access);
            console.log(userData);


            // 5. Redirigir a la página principal
            navigate('/');

        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Usuario o contraseña incorrectos.');
            } else {
                setError('Error del servidor.');
            }
        }
    };

    // Registro de nuevo usuario
    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:8000/api/userRegister/', formData);
            alert('Usuario creado correctamente');

            // Cerrar modal y limpiar formulario
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
            alert('Error al registrar usuario');
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

                            {/* Campo Contraseña */}
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

                            {/* Enlace para recuperar contraseña */}
                            <Link to="" style={{ display: 'block', marginBottom: '10px', fontSize: '14px' }}>
                                ¿Olvidaste la contraseña?
                            </Link>

                            {/* Botón de login */}
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
                show={showModal}
                onHide={() => setShowModal(false)}
                onSubmit={handleRegister}
                formData={formData}
                setFormData={setFormData}
            />
        </div>
    );
}

export default Login_content;
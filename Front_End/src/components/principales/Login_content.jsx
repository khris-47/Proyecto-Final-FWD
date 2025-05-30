import React, { useState } from 'react';
import Fondo from '../../assets/img/fondos/fondo_login.jpg'
import Logo from '../../assets/img/logos/logo_blanco.png'
import { Link, useNavigate } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode'; // npm install jwt-decode
import Cookies from 'js-cookie'; // npm install js-cookie
import axios from 'axios'; // npm install axios

import '../../styles/login.css'

function Login_content() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {


            // 1. Obtener tokens
            const response = await axios.post('http://localhost:8000/api/token/', {
                username,
                password
            });

            const { access } = response.data;

            // 2. Decodificar token para obtener user_id
            const decoded = jwtDecode(access);
            const userId = decoded.user_id;

            // 3. Obtener datos del usuario
            const userResponse = await axios.get(`http://localhost:8000/api/UserDetails/${userId}`, {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            });

            const userData = userResponse.data;

            // 4. Guardar usuario en cookie (expira en 1 día)
            Cookies.set('user', JSON.stringify(userData), { expires: 1 });
            Cookies.set('accessToken', access, { expires: 1 });  
            Cookies.set('userId', userId, { expires: 1 });

            

            navigate('/');

        } catch (err) {

            if (err.response && err.response.status === 401) {
                setError('Usuario o contraseña incorrectos.');
            } else {
                setError('Error del servidor.');
            }

        }
    };


    return (
        <div className='bodyLogin'>
            <div className="background-container">
                <div className="capaL"></div>
                <img className="background-image" src={Fondo} alt=".." />
            </div>

            <div className="login-container">
                <div className="left-panel">
                    <img src={Logo} alt=",," />
                </div>

                <div className="right-panel">
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <form className="form-control" onSubmit={handleSubmit}>
                            <p className="title">Iniciar sesión</p>

                            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                            <div className="input-field">
                                <input
                                    required
                                    className="input"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <label className="label">Usuario</label>
                            </div>

                            <div className="input-field">
                                <input
                                    required
                                    className="input"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <label className="label">Contraseña</label>
                            </div>

                            <Link to="" style={{ display: 'block', marginBottom: '10px', fontSize: '14px' }}>
                                ¿Olvidaste la contraseña?
                            </Link>

                            <button type="submit" className="submit-btn">Ingresar</button>

                            <div style={{ textAlign: 'center', fontSize: '14px', marginTop: '15px' }}>
                                <span style={{ marginRight: '5px' }}>¿No tienes una cuenta?</span>
                                <Link to="">Nuevo Usuario</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );


}

export default Login_content
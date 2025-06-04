import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import '../../styles/forms.css';
import Fondo from '../../assets/img/fondos/fondo_login.jpg';
import NavBar from '../navegacion/navBar';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Lista_Usuarios_Content() {

    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const access = Cookies.get('accessToken');

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/listUser/`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${access}`
                    }
                });


                setUsuarios(response.data); 
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsuarios();
    });



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
                            <div>
                                <h1>Lista de Usuarios</h1>
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
                                                    <th scope='col'>Id</th>
                                                    <th scope='col'>Usuario</th>
                                                    <th scope='col'>Email</th>
                                                    <th scope='col'>Nombre</th>
                                                    <th scope='col'>Apellidos</th>
                                                    <th scope='col'>Fecha Registro</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {usuarios.map((usuario) => (
                                                    <tr key={usuario.id}>
                                                        <td>{usuario.id}</td>
                                                        <td>{usuario.username}</td>
                                                        <td>{usuario.email}</td>
                                                        <td>{usuario.first_name}</td>
                                                        <td>{usuario.last_name}</td>
                                                        <td>{usuario.date_joined}</td>
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

        </div>
    )
}

export default Lista_Usuarios_Content
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import '../../styles/forms.css';
import Fondo from '../../assets/img/fondos/fondo_login.jpg';
import NavBar from '../navegacion/navBar';
import * as Usuarios_services from '../../services/Usuarios_Services'
import ModalComentarios from './ModalComentarios';

function Lista_Usuarios_Content() {

    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const access = Cookies.get('accessToken');

    const [comentarios, setComentarios] = useState([]);
    const [mostrarComentarios, setMostrarComentarios] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    const fetchUsuarios = async () => {
        try {

            const response = await Usuarios_services.getUsuarios(access);
            setUsuarios(response.data);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    // funcion para obtener los comentarios de un usuario
    const handleVerComentarios = async (usuario) => {
        try {

            const response = await Usuarios_services.getComentariosPorUsuario(usuario.id, access);

            setComentarios(response.data);
            setUsuarioSeleccionado(usuario);
            setMostrarComentarios(true);

        } catch (error) {
            console.log("Error al cargar comentarios", error);
        }
    }

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
                                                    <th scope='col'>Comentarios</th>
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
                                                        <td>{new Date(usuario.date_joined).toLocaleString()}</td>

                                                        <td>
                                                            <button className='btn btn-info bx bxs-comment-detail' onClick={() => handleVerComentarios(usuario)}></button>
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

            {mostrarComentarios && (
                <ModalComentarios
                    comentarios={comentarios}
                    usuarioNombre={usuarioSeleccionado.first_name || usuarioSeleccionado.username}
                    onClose={() => setMostrarComentarios(false)}
                />
            )}

        </div>
    )
}

export default Lista_Usuarios_Content
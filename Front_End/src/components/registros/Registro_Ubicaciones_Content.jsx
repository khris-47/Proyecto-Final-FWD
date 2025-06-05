import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import '../../styles/forms.css';
import Fondo from '../../assets/img/fondos/fondo_login.jpg';
import NavBar from '../navegacion/navBar';


function Registro_Ubicaciones_Content() {

    const [ubicaciones, setUbicaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const access = Cookies.get('accessToken');

    useEffect(() => {
        const fetchUbicaciones = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/listUbicaciones/', {
                    headers: {
                        Authorization: `Bearer ${access}`,
                    },
                });

                setUbicaciones(response.data);
            } catch (err) {
                console.error(err);
                setError('Error al obtener los datos de las entrevistas');
            } finally {
                setLoading(false);
            }
        };

        fetchUbicaciones();
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
                            <div className='col'>
                                <h1>Modulo de Ubicaciones</h1>
                            </div>
                        </div>

                        <div className="row justify-content-center align-items-center g-2 " style={{width : '20%'}}>
                            <div className='row'>
                                <button type='button' className='btn btn-primary bx bxs-message-square-add'>
                                    Agregar
                                </button>
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
                                                    <th>ID</th>
                                                    <th>Nombre</th>
                                                    <th>Descripción</th>
                                                    <th>Portada</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ubicaciones.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{item.id}</td>
                                                        <td>{item.nombre}</td>
                                                        <td>{item.descripcion}</td>
                                                        <td>{item.portada}</td>
                                                        <td>
                                                            <a className='btn btn-dark bx bx-edit' > </a>
                                                            ||
                                                            <a className='btn btn-danger bx bxs-trash' > </a>
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



        </div>

    )




}

export default Registro_Ubicaciones_Content
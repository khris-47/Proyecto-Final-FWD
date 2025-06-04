import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import '../../styles/forms.css';
import Fondo from '../../assets/img/fondos/fondo_login.jpg';
import NavBar from '../navegacion/navBar';

function Aud_Cuentos_Content() {

    const [auditorias, setAuditorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const access = Cookies.get('accessToken');

    useEffect(() => {
        const fetchAuditorias = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/Auditoria_Cuentos/', {
                    headers: {
                        Authorization: `Bearer ${access}`,
                    },
                });

                setAuditorias(response.data);
            } catch (err) {
                console.error(err);
                setError('Error al obtener los datos de auditoría');
            } finally {
                setLoading(false);
            }
        };

        fetchAuditorias();
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
                                <h1>Auditoria de Cuentos</h1>
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
                                                    <th>Tipo de Movimiento</th>
                                                    <th>Descripción</th>
                                                    <th>Fecha</th>
                                                    <th>Cuento</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {auditorias.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{item.id}</td>
                                                        <td>{item.tipoMovimiento}</td>
                                                        <td dangerouslySetInnerHTML={{ __html: item.descripcion }} />
                                                        <td>{new Date(item.fechaMovimiento).toLocaleString()}</td>
                                                        <td>{item.cuento}</td>
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

export default Aud_Cuentos_Content
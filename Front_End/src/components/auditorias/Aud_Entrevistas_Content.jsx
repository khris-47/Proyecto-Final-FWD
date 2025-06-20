import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import '../../styles/forms.css';
import Fondo from '../../assets/img/fondos/fondo_login.jpg';
import NavBar from '../navegacion/navBar';
import { obtenerAuditoriaEntrevistas } from '../../services/Auditorias_Services';
import HTMLSafeText from './HTMLSafeText';

function Aud_Entrevistas_Content() {


    const [auditorias, setAuditorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const access = Cookies.get('accessToken');

    // El useEffect lo utilizaremos para cargar el form
    useEffect(() => {
        const fetchAuditorias = async () => {
            try {
                // llamada a la api
                const response = await obtenerAuditoriaEntrevistas(access)

                // guardamos los datos que entraron
                setAuditorias(response.data);

            } catch (err) {
                console.error(err);
                setError('Error al obtener los datos de auditoría');
            } finally {
                setLoading(false);
            }
        };
        // llamamos al fetch
        fetchAuditorias();
    }, []); //


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
                                <h1>Auditoria de Entrevistas</h1>
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
                                                    <th>Entrevista</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {auditorias.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{item.id}</td>
                                                        <td>{item.tipoMovimiento}</td>

                                                        {/* Insertamos HTML, dado que, para una mejor lectura, los triggers se hicieron con <br> y <b> */}
                                                        {/* Sanitizamos item.descripcion permitiendo solo <br> y <b> */}
                                                        <td><HTMLSafeText html={item.descripcion} /></td>

                                                        <td>{new Date(item.fechaMovimiento).toLocaleString()}</td>
                                                        <td>{item.entrevista}</td>
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

export default Aud_Entrevistas_Content
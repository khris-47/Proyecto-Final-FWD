import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import '../../styles/forms.css';
import Fondo from '../../assets/img/fondos/fondo_login.jpg';
import NavBar from '../navegacion/navBar';
import { obtenerAuditoriaUsuarios } from '../../services/Auditorias_Services';
import HTMLSafeText from './HTMLSafeText';

function Aud_Usuarios_Content() {
    const [auditorias, setAuditorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const access = Cookies.get('accessToken');
    const [busqueda, setBusqueda] = useState('');

    // carga del form
    useEffect(() => {
        const fetchAuditorias = async () => {
            try {
               
                // llamada a la api
                const response = await obtenerAuditoriaUsuarios(access)

                // llenamos con los datos obtenidos
                setAuditorias(response.data);
            } catch (err) {
                console.error(err);
                setError('Error al obtener los datos de auditoría');
            } finally {
                setLoading(false);
            }
        };

        // llamada al fetch
        fetchAuditorias();
    });

    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
    };

    const Aud_usuariosFiltrados = auditorias.filter((auditoria) => 
        auditoria.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        auditoria.tipoMovimiento.toLowerCase().includes(busqueda.toLowerCase())
    );

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
                                <h1>Auditoria de Usuarios</h1>
                                <div className="mb-3 input-group">
                                    <span className="input-group-text">
                                        <i className="bx bx-search"></i> 
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Buscar por Tipo de Movimiento o Descripcion"
                                        value={busqueda}
                                        onChange={handleBusquedaChange}
                                    />
                                </div>
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
                                        <table className='table table-striped'>
                                            <thead className='table-dark'>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Tipo de Movimiento</th>
                                                    <th>Descripción</th>
                                                    <th>Fecha</th>
                                                    <th>Usuario</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Aud_usuariosFiltrados.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{item.id}</td>
                                                        <td>{item.tipoMovimiento}</td>
                                                        
                                                        {/* Insertamos HTML, dado que, para una mejor lectura, los triggers se hicieron con <br> y <b> */}
                                                        {/* Sanitizamos item.descripcion permitiendo solo <br> y <b> */}
                                                       <td><HTMLSafeText html={item.descripcion} /></td>
                                                        
                                                        <td>{new Date(item.fechaMovimiento).toLocaleString()}</td>
                                                        <td>{item.user}</td>
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



    );
}

export default Aud_Usuarios_Content;

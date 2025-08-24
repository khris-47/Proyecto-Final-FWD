import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import '../../styles/forms.css';
import Fondo from '../../assets/img/fondos/fondo_manglar.png';
import NavBar from '../navegacion/navBar';
import { obtenerAuditoriaUsuarios } from '../../services/Auditorias_Services';
import HTMLSafeText from './HTMLSafeText';

function Aud_Usuarios_Content() {
    const [auditorias, setAuditorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const access = Cookies.get('accessToken');
    const [busqueda, setBusqueda] = useState('');
    const [ordenAscendente, setOrdenAscendente] = useState(true);
    const [overlayColor, setOverlayColor] = useState('black');
    const toggleOverlayColor = () => {
        setOverlayColor(prev => prev === 'black' ? 'white' : 'black');
    };

    // carga del form
    useEffect(() => {
        const fetchAuditorias = async () => {
            try {

                // llamada a la api
                const response = await obtenerAuditoriaUsuarios(access)

                // los ordenamos de forma descendente
                const ordenadas = response.data.sort(
                    (a, b) => new Date(b.fechaMovimiento) - new Date(a.fechaMovimiento)
                );

                // guardamos los datos que entraron
                setAuditorias(ordenadas);

            } catch (err) {
                console.error(err);
                setError('Error al obtener los datos de auditoría');
            } finally {
                setLoading(false);
            }
        };

        // llamada al fetch
        fetchAuditorias();
    },[]);

    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
    };

    // se crea una copia superficila del array, para no modificar directamente el estado original
    const Aud_usuariosFiltrados = [...auditorias].filter((auditoria) =>
        auditoria.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        auditoria.tipoMovimiento.toLowerCase().includes(busqueda.toLowerCase())
    )
        // aplicamos el orden por el id segun el estado booleano
        .sort((a, b) => (ordenAscendente ? a.id - b.id : b.id - a.id));
        // Si ordenAscendente es true → se evalúa a.id - b.id
        // Si es false → se evalúa b.id - a.id;;;

    // funcion encargada de ordenar la lista
    const toggleOrden = () => {
        // se invierte el valor actual (de true a falso y viceversa)
        const nuevaOrden = !ordenAscendente;
        // se actualiza el orden con el nuevo valor
        setOrdenAscendente(nuevaOrden);

        // se crea una copia del array de usuarios usando [], asi evitamos duplicaciones 
        const listaOrdenada = [...auditorias].sort((a, b) => {
            return nuevaOrden ? a.id - b.id : b.id - a.id;
        });

        // actualizamos el estado
        setAuditorias(listaOrdenada);
    };

    return (
        <div className='bodyForm'>
            <div
                className="overlay-bg"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 1,
                    pointerEvents: 'none',
                    background: overlayColor === 'black'
                        ? 'rgba(0,0,0,0.6)'
                        : 'rgba(255,255,255,0.3)',
                    transition: 'background 0.3s'
                }}
            />
            <div className="background-container-form" style={{ position: 'fixed', zIndex: 0, width: '100vw', height: '100vh', top: 0, left: 0 }}>
                <img className="background-image-form" src={Fondo} alt=".." />
            </div>
            <header className="headerAbout" style={{ position: 'relative', zIndex: 2 }}>
                <NavBar onToggleOverlayColor={toggleOverlayColor} overlayColor={overlayColor} />
            </header>

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
                                                    <th scope='col' onClick={toggleOrden} style={{ cursor: 'pointer' }}>
                                                        Id{' '}
                                                        <i className={`bx ${ordenAscendente ? 'bx-sort-up' : 'bx-sort-down'}`}></i>
                                                    </th>
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

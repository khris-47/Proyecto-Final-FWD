import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import '../../styles/forms.css';
import Fondo from '../../assets/img/fondos/fondo_manglar.png';
import NavBar from '../navegacion/navBar';
import { obtenerAuditoriaEntrevistas } from '../../services/Auditorias_Services';
import HTMLSafeText from './HTMLSafeText';

function Aud_Entrevistas_Content() {


    const [auditorias, setAuditorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const access = Cookies.get('accessToken');

    const [ordenAscendente, setOrdenAscendente] = useState(true);

    const [busqueda, setBusqueda] = useState('');

    const [overlayColor, setOverlayColor] = useState('black');
    const toggleOverlayColor = () => {
        setOverlayColor(prev => prev === 'black' ? 'white' : 'black');
    };

    // se crea una copia superficila del array, para no modificar directamente el estado original
    const Aud_Filtrados = [...auditorias].filter((auditoria) =>
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

    // El useEffect lo utilizaremos para cargar el form
    useEffect(() => {
        const fetchAuditorias = async () => {
            try {
                // llamada a la api
                const response = await obtenerAuditoriaEntrevistas(access)

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
        // llamamos al fetch
        fetchAuditorias();
    }, []); //




    // Define la función para manejar el cambio en el input de búsqueda
    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
    };

    return (
        <div className='bodyForm'>
            {/* Capa de color sobre la imagen de fondo */}
            <div
                className="overlay-bg"
                style={{
                    background: overlayColor === 'black'
                        ? 'rgba(0,0,0,0.6)'
                        : 'rgba(255,255,255,0.3)'
                }}
            />
            <div className="background-container-form">
                <img className="background-image-form" src={Fondo} alt=".." />
                <header className="headerAbout">
                    <NavBar onToggleOverlayColor={toggleOverlayColor} overlayColor={overlayColor} />
                </header>
            </div>
            <div className='capa'></div>
            <main className='mainForm'>
                <div className='style-form'>
                    <div className='container'>

                        <div className='row justify-content-center align-items-center g-2'>
                            <div>
                                <h1>Auditoria de Entrevistas</h1>
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
                                                        {' '}
                                                        <i className={`bx ${ordenAscendente ? 'bx-sort-up' : 'bx-sort-down'}`}></i>
                                                    </th>
                                                    <th>Tipo de Movimiento</th>
                                                    <th>Descripción</th>
                                                    <th>Fecha</th>
                                                    <th>Entrevista</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Aud_Filtrados.map((item) => (
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

export default Aud_Entrevistas_Content;
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import '../../styles/forms.css';
import Fondo from '../../assets/img/fondos/fondo_login.jpg';
import NavBar from '../navegacion/navBar';
import { obtenerAuditoriaCuentos } from '../../services/Auditorias_Services';
import HTMLSafeText from './HTMLSafeText';


function Aud_Cuentos_Content() {

    // Manejo de constantes
    const [auditorias, setAuditorias] = useState([]);    // se usara para almacenar las auditorias obtenidas del backend
    const [loading, setLoading] = useState(true);       //  Estado para controlar si esta cargando 
    const [error, setError] = useState(null);          //   Estadao para guardar errores
    const access = Cookies.get('accessToken');        //    Obtenemos el token de la cokie

    const [busqueda, setBusqueda] = useState('');

    // El useEffect lo utilizzaremos para cargar las auditorias
    useEffect(() => {

        // funcion para obtener las auditorias de la api
        const fetchAuditorias = async () => {
            try {
                const response = await obtenerAuditoriaCuentos(access);

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
                // finaliza la funcion, sea exitosa o no
                setLoading(false);
            }
        };

        // ejecutamos la funcion de carga
        fetchAuditorias();

    }, []);


    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
    };

    const Aud_Filtrados = auditorias.filter((auditoria) =>
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
                                <h1>Auditoria de Cuentos</h1>
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
                                        // agregamos un Spinner de cargar, este se mostrara mientras se obtiene los datos
                                        <button className="btn btn-primary" disabled>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Loading...
                                        </button>
                                    ) : error ? (
                                        // en caso de algun error, estese mostrara en pantalla
                                        <div className="alert alert-danger">{error}</div>
                                    ) : (
                                        // si la carga fue exitosa, mostrar los datos
                                        <table className='table table-striped'>
                                            <thead className='table-dark'>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Tipo de Movimiento</th>
                                                    <th>Descripción</th>
                                                    <th>Fecha</th>
                                                    <th>Cuento</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Hacemos un mapeo de cada auditoria, y, creamos una fila */}
                                                {Aud_Filtrados.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{item.id}</td>
                                                        <td>{item.tipoMovimiento}</td>

                                                        {/* Insertamos HTML, dado que, para una mejor lectura, los triggers se hicieron con <br> y <b> */}
                                                        {/* Sanitizamos item.descripcion permitiendo solo <br> y <b> */}
                                                        <td><HTMLSafeText html={item.descripcion} /></td>

                                                        {/* Formatea la fecha a formato legible */}
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
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import '../../styles/forms.css';
import Fondo from '../../assets/img/fondos/fondo_login.jpg';
import NavBar from '../navegacion/navBar';

import Modal_Entrevista from '../registros/Modal_Entevista'


function Registro_Entrevistas() {

    const [entrevistas, setEntrevistas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const access = Cookies.get('accessToken');


    // Estados para el modal
        const [showModal, setShowModal] = useState(false);
        const [formData, setFormData] = useState({
            nombre_Persona: '',
            entrevista: '',
            descripcion: '',
            ubicacion: ''
        });


    useEffect(() => {
        const fetchEntrevistas = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/listEntrevistas/', {
                    headers: {
                        Authorization: `Bearer ${access}`,
                    },
                });

                setEntrevistas(response.data);
            } catch (err) {
                console.error(err);
                setError('Error al obtener los datos de las entrevistas');
            } finally {
                setLoading(false);
            }
        };

        fetchEntrevistas();
    });


    const handleRegister = async () => {
    try {
        // Asegurar estado = 1 por defecto
        const dataToSend = {
            ...formData,
            estado: 1,
            ubicacion: Number(formData.ubicacion)
        };

        await axios.post('http://localhost:8000/api/entrevistas/', dataToSend, {
            headers: {
                Authorization: `Bearer ${access}`,
            },
        });

        alert('Entrevista registrada correctamente');
        setShowModal(false);

        // Limpiar formulario
        setFormData({
            nombre_Persona: '',
            entrevista: '',
            descripcion: '',
            ubicacion: ''
        });

        // Recargar entrevistas
        const response = await axios.get('http://localhost:8000/api/listEntrevistas/', {
            headers: { Authorization: `Bearer ${access}` }
        });
        setEntrevistas(response.data);

    } catch (err) {
        console.error('Error al registrar entrevista:', err);
        alert('Error al registrar entrevista');
    }
};


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
                                <h1>Modulo de Entrevistas</h1>
                            </div>
                        </div>

                        <div className="row justify-content-center align-items-center g-2 " style={{ width: '20%' }}>
                            <div className='row'>
                                <button type='button' className='btn btn-primary bx bxs-message-square-add'
                                onClick={() => setShowModal(true)}>
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
                                                    <th>Nombre Entrevistado</th>
                                                    <th>Descripción</th>
                                                    <th>Fecha de Subida</th>
                                                    <th>Ubicacion</th>
                                                    <th>Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {entrevistas.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{item.id}</td>
                                                        <td>{item.nombre_Persona}</td>
                                                        <td>{item.descripcion}</td>
                                                        <td>{new Date(item.fecha_creacion).toLocaleString()}</td>
                                                        <td>{item.ubicacion}</td>
                                                        <td>{item.estado}</td>
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

            <Modal_Entrevista
                show={showModal}
                onHide={() => setShowModal(false)}
                onSubmit={handleRegister}
                formData={formData}
                setFormData={setFormData}
            />


        </div>

    )
}

export default Registro_Entrevistas
import React, { useEffect, useState } from 'react';
import NavBar from '../navegacion/navBar';
import fondo from '../../assets/img/fondos/fondo_secundario.jpg';
import '../../styles/entrevistas.css';

// Funcion para extraer el ID del video de un enlace de YouTube
const getYouTubeId = (url) => {
    if (!url || typeof url !== 'string') return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^\s&]+)/);
    return match ? match[1] : null;
};


function Entrevistas_content() {
    const [entrevistas, setEntrevistas] = useState([]);


    // Carga las entrevistas al montar el componente
    useEffect(() => {
        fetch('http://localhost:8000/api/listEntrevistas/')
            .then(response => response.json())
            .then(data => setEntrevistas(data))
            .catch(error => console.error('Error al cargar entrevistas:', error));
    }, []);



    return (
        <div className='bodyEntrevistas'>
            {/* Fondo de la pagina */}
            <img alt="" className="background-image-entrevistas" src={fondo} />
            <div className="capaEntrevistas"></div>

            <div className='content-entrevistas'>
                <header>
                    <NavBar className='headerIndex' />
                </header>

                <main className='mainEntrevistas'>
                    <div className='container' style={{ zIndex: 2 }}>
                        <h1 className="display-4 fw-bold text-cyan-400 mb-3" style={{ color: "aqua" }}>
                            Entrevistas
                        </h1>
                        <p className="lead mb-4" style={{ color: "white" }}>
                            En el marco de la vizualicion del patrimonio cultural, esta serie de entrevistas busca dar voz a
                            personas clave dentro de comunidades que han mantenido vivas tradiciones, conocimientos y modos de vida ligados al mar.
                        </p>

                        {/* Contenedor de las tarjetas */}
                        <div className="row row-cols-1 row-cols-md-2 g-4 justify-content-center mt-2" id='cards_cuentos'>
                            {entrevistas.map((item) => {

                                if (item.estado == 1) {

                                    const videoId = getYouTubeId(item.entrevista);
                                    if (!videoId) return null; // Omitimos la card si el enlace no es válido

                                    return (
                                        <div className="col" key={item.id}>
                                            <div className="card h-100 shadow bg-dark text-white">
                                                <div className="ratio ratio-16x9">
                                                    <iframe
                                                        src={`https://www.youtube.com/embed/${videoId}`}
                                                        title={item.nombre_Persona}
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                                <div className="card-body">
                                                    <h5 className="card-title">Entrevista a {item.nombre_Persona} || {item.ubicacion}</h5>
                                                    <p className="card-text text-md-center">{item.descripcion}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );

                                }


                            })}
                        </div>
                    </div>
                </main>
            </div>


        </div>
    );
}

export default Entrevistas_content;

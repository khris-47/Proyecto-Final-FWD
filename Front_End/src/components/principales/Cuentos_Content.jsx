import React, { useEffect, useState } from 'react';
import NavBar from '../navegacion/navBar';
import fondo from '../../assets/img/fondos/fondo nocturno.png';
import '../../styles/cuentos.css';
import { getPublicCuentos } from '../../services/Cuentos_Services';
import Slider from "react-slick"; // carrusel


function Cuentos_Content() {

    const [cuentos, setCuentos] = useState([]);

    // carga lso cuentos al montar el componente
    useEffect(() => {

        const cargarCuentos = async () => {
            try {
                const response = await getPublicCuentos();
                setCuentos(response.data);

            } catch (error) {
                console.error('Error al cargar los cuentos:', error)
            }
        };

        cargarCuentos();

    }, []);

    // Configuración del carrusel
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };


    return (
        <div className='bodyCuentos'>
            <img alt="" className="background-image-entrevistas" src={fondo} />

            <div className='content-cuentos'>
                <header>
                    <NavBar className='headerIndex' />
                </header>

                <main className='mainCuentos'>
                    <div className='container' style={{ zIndex: 2 }}>
                        <h1 className="display-4 fw-bold mb-3" style={{  color: "#60a5fa"  }}>
                            Cuentos
                        </h1>
                        <p className="lead mb-4" style={{ color: "white" }}>
                            Bienvenidos a este rincón de historias creadas entre olas y manglares. Aquí recompilamos historias de
                            vivencias en los pueblos costeros a los que visitamos,
                            y los convertimos a un formato de cuento para que no se pierdan con el tiempo.
                        </p>

                        {/* Carrusel de cuentos */}
                        <div className="slider-container">
                            <Slider {...settings}>
                                {cuentos.filter(item => item.estado === 1).map((item) => (
                                    <div key={item.id}>
                                        <div className="card card-cuento shadow text-white position-relative">
                                            <div className="position-relative">
                                                <img src={item.portada_url} alt="portada" className="img-card-cuento" />
                                                <div className="overlay-cuento">
                                                    <h5>Titulo:</h5>
                                                    <h5 className="card-title-cuento">{item.nombre_Cuento}</h5>
                                                    <a
                                                        href={item.cuento_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-outline-light btn-sm"
                                                    >
                                                        Ver
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Cuentos_Content;
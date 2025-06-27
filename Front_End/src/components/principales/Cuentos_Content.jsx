import React, { useEffect, useState } from 'react';
import NavBar from '../navegacion/navBar';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import fondo from '../../assets/img/fondos/fondo nocturno.png';
import '../../styles/cuentos.css';
import { getPublicCuentos } from '../../services/Cuentos_Services';
import { getRatingsCuentos, createOrUpdateRating } from '../../services/Rating_Services';
import Slider from "react-slick"; // carrusel
import { Rating } from 'react-simple-star-rating';
import withReactContent from 'sweetalert2-react-content';


function Cuentos_Content() {


    const MySwal = withReactContent(Swal);
    const [cuentos, setCuentos] = useState([]);
    const [avgRatings, setAvgRatings] = useState({});

    // carga lso cuentos al montar el componente
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // 1) cuentos públicos
                const cuentosRes = await getPublicCuentos();
                setCuentos(cuentosRes.data);

                // 2) todos los ratings
                const ratingsRes = await getRatingsCuentos();
                const promedios = calcularPromedios(ratingsRes);
                setAvgRatings(promedios);
            } catch (err) {
                console.error('Error al cargar datos:', err);
            }
        };
        cargarDatos();
    }, []);


    // Agrupa y promedia por cuento
    const calcularPromedios = (ratings) => {
        const acc = {}; // { id: { suma, total } }
        ratings.forEach(({ cuento, valor }) => {
            acc[cuento] = acc[cuento]
                ? { suma: acc[cuento].suma + valor, total: acc[cuento].total + 1 }
                : { suma: valor, total: 1 };
        });
        const proms = {};
        Object.keys(acc).forEach((id) => {
            proms[id] = acc[id].suma / acc[id].total;
        });
        return proms; // e.g. { 12: 4.2, 15: 3.6 }
    };

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

    const handleVote = async (cuentoId) => {
        const token = Cookies.get('accessToken');
        if (!token) { /* ...modal login... */ return; }

        let selected = 5; // valor por defecto

        const { isConfirmed } = await MySwal.fire({
            title: 'Califica este cuento',
            html: (
                <Rating
                    initialValue={5}
                    allowHover
                    onClick={(rate) => { selected = rate; }}
                    size={40}
                />
            ),
            confirmButtonText: 'Enviar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            focusConfirm: false
        });

        if (!isConfirmed) return;

        try {
            await createOrUpdateRating(cuentoId, selected, token);
            await Swal.fire('¡Gracias!', 'Tu voto se registró correctamente.', 'success');
            const ratingsArray = await getRatingsCuentos();
            setAvgRatings(calcularPromedios(ratingsArray));
        } catch (err) {
            Swal.fire('Ups…', 'No pudimos registrar tu voto.', 'error');
            console.error(err);
        }
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
                        <h1 className="display-4 fw-bold mb-3" style={{ color: "#60a5fa" }}>
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
                                {cuentos.filter(c => c.estado === 1).map((item) => (
                                    <div key={item.id}>
                                        <div className="card card-cuento shadow text-white position-relative">

                                            {/* ⭐⭐⭐⭐⭐   Promedio de votos */}
                                            <div className="avg-rating-wrapper">
                                                <Rating
                                                    readonly            // solo mostrar
                                                    allowFraction        // medias estrellas (3.5, 4.2…)
                                                    initialValue={avgRatings[item.id] || 0}
                                                    SVGstyle={{ display: 'inline-block' }}
                                                    size={20}
                                                />
                                                <span className="avg-number ms-1">
                                                    {(avgRatings[item.id] ?? 0).toFixed(1)}
                                                </span>
                                            </div>

                                            {/* Imagen + overlay */}
                                            <div className="position-relative">
                                                <img
                                                    src={item.portada_url}
                                                    alt="portada"
                                                    className="img-card-cuento"
                                                />
                                                <div className="overlay-cuento">
                                                    <h5>Título:</h5>
                                                    <h5 className="card-title-cuento">
                                                        {item.nombre_Cuento}
                                                    </h5>
                                                    <a
                                                        href={item.cuento_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-outline-light btn-sm"
                                                    >
                                                        Ver
                                                    </a>

                                                    {/* botón votar */}
                                                    <button
                                                        className="btn btn-outline-warning btn-sm mt-2"
                                                        onClick={() => handleVote(item.id)}
                                                    >
                                                        Votar
                                                    </button>

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
import React, { useEffect, useState } from 'react';
import NavBar from '../navegacion/navBar';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
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
    const [overlayColor, setOverlayColor] = useState('black');

    const toggleOverlayColor = () => {
        setOverlayColor(prev => prev === 'black' ? 'white' : 'black');
    };

    const cargarDatos = async () => {
        try {
            const cuentosRes = await getPublicCuentos();
            setCuentos(cuentosRes.data);

            const ratings = await getRatingsCuentos();
            setAvgRatings(calcularPromedios(ratings));
        } catch (err) {
            console.error('Error al cargar datos:', err);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const calcularPromedios = (ratings) => {
        const acumulador = {};
        ratings.forEach(({ cuento, valor }) => {
            if (acumulador[cuento]) {
                acumulador[cuento].suma += valor;
                acumulador[cuento].total += 1;
            } else {
                acumulador[cuento] = { suma: valor, total: 1 };
            }
        });

        const promedios = {};
        Object.keys(acumulador).forEach((id) => {
            promedios[id] = acumulador[id].suma / acumulador[id].total;
        });

        return promedios;
    };

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
            { breakpoint: 992, settings: { slidesToShow: 2 } },
            { breakpoint: 576, settings: { slidesToShow: 1 } }
        ]
    };

    const handleVote = async (cuentoId) => {
        const token = Cookies.get('accessToken');
        if (!token) {
            toast.info('Necesitas iniciar sesión para poder votar un cuento.', { autoClose: 2000 });
            return;
        }

        let selected = 5; 
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

            toast.success('¡Voto registrado correctamente!', { autoClose: 3000 });
            
            // refrescar los ratings para actualizar el promedio mostrado en pantalla
            const ratingsArray = await getRatingsCuentos();
            setAvgRatings(calcularPromedios(ratingsArray));
        } catch (err) {
            toast.error('Ups… No pudimos registrar tu voto.', { autoClose: 3000 });
            console.error(err);
        }
    };

    return (
        <div className='bodyCuentos'>
            <div
                className="overlay-bg"
                style={{
                    background: overlayColor === 'black'
                        ? 'rgba(0,0,0,0.6)'
                        : 'rgba(255,255,255,0.15)'
                }}
            />
            <img alt="" className="background-image-entrevistas" src={fondo} />

            <div className='content-cuentos'>
                <header>
                    <NavBar
                        className='headerIndex'
                        onToggleOverlayColor={toggleOverlayColor}
                        overlayColor={overlayColor}
                    />
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

                        <div className="slider-container">
                            <Slider {...settings}>
                                {cuentos.filter(c => c.estado === 1).map((item) => (
                                    <div key={item.id}>
                                        <div className="card card-cuento shadow text-white position-relative">
                                            <div className="avg-rating-wrapper">
                                                <Rating
                                                    readonly
                                                    allowFraction
                                                    initialValue={avgRatings[item.id] || 0}
                                                    SVGstyle={{ display: 'inline-block' }}
                                                    size={20}
                                                />
                                                <span className="avg-number ms-1">
                                                    {(avgRatings[item.id] ?? 0).toFixed(1)}
                                                </span>
                                            </div>

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

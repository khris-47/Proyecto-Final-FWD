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

    const MySwal = withReactContent(Swal); // dado que se utilizaran estrellas (rating) en el swal, se usa esta libreria
    const [cuentos, setCuentos] = useState([]);
    const [avgRatings, setAvgRatings] = useState({});

    // funcion para traer datos del cuento y su rating
    const cargarDatos = async () => {
        try {
            // traer los cuentos 
            const cuentosRes = await getPublicCuentos();
            setCuentos(cuentosRes.data);

            // traer los ratings
            const ratings = await getRatingsCuentos();
            setAvgRatings(calcularPromedios(ratings));

        } catch (err) {
            console.error('Error al cargar datos:', err);
        }
    };

    // carga lso cuentos al montar el componente
    useEffect(() => {
        cargarDatos();
    }, []);


    // Agrupa y promedia por cuento
    const calcularPromedios = (ratings) => {

        // aqui se almacebara la suma total y la cantidad de votos por cada cuento
        const acumulador = {}; // { id: { suma, total } }

        // recorremos cada rating recibido
        ratings.forEach(({ cuento, valor }) => {
            // Para cada cuento, verificamos si ya existe una entrada en el acumulador
            if (acumulador[cuento]) {
                // Si ya existe, actualizamos sumando el nuevo valor y aumentando el contador
                acumulador[cuento].suma += valor;
                acumulador[cuento].total += 1;
            } else {
                // Si no existe, creamos una nueva entrada inicializando suma y total
                acumulador[cuento] = { suma: valor, total: 1 };
            }
        });

        // creamos un nuevo objeto para almacenar los promedios
        const promedios = {};
        // recorremos cada cuento en el acumulador para calcular su promedio
        Object.keys(acumulador).forEach((id) => {
            // el promedio es la suma total de los valores dividida por la cantidad de votos
            promedios[id] = acumulador[id].suma / acumulador[id].total;
        });
        // devolvemos el objeto con los promedios or cuento
        return promedios;
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

    // funcion para manejar los votos
    const handleVote = async (cuentoId) => {

        // obtener el token 
        const token = Cookies.get('accessToken');

        // si no hay token significa que el usuario no esta logueado
        if (!token) {
            toast.info('Necesitas iniciar sesión para poder votar un cuento.', { autoClose: 2000 });
            return;
        }


        let selected = 5; // valor por defecto para la calificacion

        // modal personalizado
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

        // si el usuario cancela, salir sin hacer nada
        if (!isConfirmed) return;

        try {
            // enviar la calificacion a la apo
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

                                            {/* Promedio de votos */}
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
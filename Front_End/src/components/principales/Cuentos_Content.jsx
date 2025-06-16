import React, { useEffect, useState } from 'react';
import NavBar from '../navegacion/navBar';
import fondo from '../../assets/img/fondos/fondo_secundario.jpg';
import '../../styles/cuentos.css';
import { getPublicCuentos } from '../../services/Cuentos_Services';


function Cuentos_Content() {

    const [cuentos, setCuentos] = useState([]);

    // carga lso cuentos al montar el componente
    useEffect(() => {
        
            const cargarCuentos = async () => {
                try{
                    const response = await getPublicCuentos();
                    setCuentos(response.data);

                }catch (error){
                    console.error('Error al cargar los cuentos:', error)
                }
            };

            cargarCuentos();

    }, []);


    return (

        <div className='bodyCuentos'>
            {/* Fondo de la pagina */}
            <img alt="" className="background-image-entrevistas" src={fondo} />
            <div className="capaEntrevistas"></div>

            <div className='content-cuentos'>
                <header>
                    <NavBar className='headerIndex' />
                </header>

                <main className='mainCuentos'>
                    <div className='container' style={{ zIndex: 2 }}>
                        <h1 className="display-4 fw-bold text-cyan-400 mb-3" style={{ color: "aqua" }}>
                            Cuentos
                        </h1>
                        <p className="lead mb-4" style={{ color: "white" }}>
                            Bienvenidos a este rincón de historias creadas entre olas y manglares. Aquí recompilamos historias de
                            vivencias en los pueblos costeros a los que visitamos,
                            y los convertimos a un formato de cuento para que no pierdan con el tiempo
                        </p>

                        {/* Contenedor de las tarjetas */}
                        <div className="row row-cols-1 row-cols-md-2 g-4 justify-content-center mt-2" id='cards_cuentos'>
                            {cuentos.map((item) => {

                                if (item.estado == 1) {

                                    return (
                                        <div className="col bb" key={item.id}>
                                            <div className="card card-cuento h-100 shadow text-white position-relative overflow-hidden" style={{backgroundColor: 'black'}}>

                                                {/* Imagen de la tarjeta */}
                                                <div className="position-relative">
                                                    <img src={item.portada_url} alt="portada" className="img-card-cuento" />
                                                    <div className="sombreado-cuento"></div>
                                                </div>


                                                <div className="card-body">
                                                    <h5 className="card-title-cuento"> Titulo: {item.nombre_Cuento}</h5>
                                                    <a
                                                        href={item.cuento_url}
                                                        className="btn btn-outline-primary btn-sm"
                                                    >Ver</a>
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
    )
}

export default Cuentos_Content
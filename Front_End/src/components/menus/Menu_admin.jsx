import React, { useState, useEffect } from 'react'
import '../../styles/admin.css'
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../navegacion/navBar';
import fondo from '../../assets/img/fondos/fondo_manglar.png';
import entrevista from '../../assets/img/cards/entrevistas.png';
import cuentos from '../../assets/img/cards/cuentos.png';
import ubicaciones from '../../assets/img/cards/ubicaciones.png';

function Menu_admin() {
    const navigate = useNavigate();
    const [overlayColor, setOverlayColor] = useState('black');
    const toggleOverlayColor = () => {
        setOverlayColor(prev => prev === 'black' ? 'white' : 'black');
    };

    useEffect(() => {
        document.body.classList.toggle('modo-blanco', overlayColor === 'white');
        document.body.classList.toggle('modo-negro', overlayColor === 'black');
        return () => {
            document.body.classList.remove('modo-blanco');
            document.body.classList.remove('modo-negro');
        };
    }, [overlayColor]);

    return (

        <div className="bodyAdmin">
            {/* Capa de color sobre la imagen de fondo */}
            <div
                className="overlay-bg"
                style={{
                    background: overlayColor === 'black'
                        ? 'rgba(0,0,0,0.6)'
                        : 'rgba(255,255,255,0.15)'
                }}
            />
            <img alt="" className="background-image" src={fondo} />

            <header>
                <NavBar className="headerIndex" onToggleOverlayColor={toggleOverlayColor} overlayColor={overlayColor} />
            </header>

            <main className="mainAdmin mt-5">
                <div className="d-flex flex-column justify-content-center align-items-center text-center text-white">
                    <div style={{ zIndex: 2 }}>
                        <h1
                            className="display-4 fw-bold text-cyan-400 mb-3"
                            style={{ color: "aqua" }}
                        >
                            Administracion
                        </h1>

                        {/* CONTENEDOR FLEX AJUSTADO */}
                        <div className="d-flex justify-content-center flex-row-reverse flex-wrap gap-4 mt-2" style={{ zIndex: 2 }}>
                            {/* CARD 1 */}
                            <div className="flip-card">
                                <div className="flip-card-inner">
                                    <div className="flip-card-front">
                                        <img src={entrevista} alt="Entrevistas" />
                                    </div>
                                    <div className="flip-card-back">
                                        <p className="title-flip">Administracion de entrevistas</p>
                                        <button className="btn-flip" onClick={() => navigate("/reg_entrevistas")}>Ir</button>
                                    </div>
                                </div>
                            </div>

                            {/* CARD 2 */}
                            <div className="flip-card">
                                <div className="flip-card-inner">
                                    <div className="flip-card-front">
                                        <img src={cuentos} alt="Cuentos" />
                                    </div>
                                    <div className="flip-card-back">
                                        <p className="title-flip">Administracion de Cuentos</p>
                                        <button className="btn-flip" onClick={() => navigate("/reg_cuentos")}>Ir</button>
                                    </div>
                                </div>
                            </div>

                            {/* CARD 3 */}
                            <div className="flip-card">
                                <div className="flip-card-inner">
                                    <div className="flip-card-front">
                                        <img src={ubicaciones} alt="Entrevistas" />
                                    </div>
                                    <div className="flip-card-back">
                                        <p className="title-flip">Administracion de Ubicaciones</p>
                                        <button className="btn-flip" onClick={() => navigate("/reg_ubicaciones")}>Ir</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>


    )
}

export default Menu_admin
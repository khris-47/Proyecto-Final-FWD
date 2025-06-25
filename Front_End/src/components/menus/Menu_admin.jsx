import React from 'react'
import '../../styles/admin.css'
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../navegacion/navBar';
import fondo from '../../assets/img/fondos/fondo nocturno.png';
import entrevista from '../../assets/img/cards/entrevistas.png';
import cuentos from '../../assets/img/cards/cuentos.png';
import ubicaciones from '../../assets/img/cards/ubicaciones.png';

function Menu_admin() {

    const navigate = useNavigate();

    return (

        <div className="bodyAdmin">
            <img alt="" className="background-image" src={fondo} />

            <header>
                <NavBar className="headerIndex" />
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
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import fondo from '../../assets/img/fondos/fondo_juegos.jpg';

import '../../styles/memoramas.css'

import { mostrarModalBienvenida } from '../../functions/Function_Primer_Juego';

function Primer_Juego() {


    useEffect(() => {
        mostrarModalBienvenida();
    }, []);


    return (
        <div className='bodyJuego'>


            <main className='mainJuego'>

                <div className="capa"></div>


                <img alt=""
                    className="background-image"
                    src={fondo} />

                <div id="wrapper">
                    <div id="game">

                        <div id="cards-container">

                        </div>

                    </div>
                </div>


                {/* <!-- Modal Felicitaciones --> */}
                <div className="modal fade" id="ModalFelicitaciones" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel"><b>Felicitaciones!!! 🥳🥳</b></h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body" id="ModalBody">


                            </div>
                            <div className="modal-footer">
                                <Link to="/menu_juegos" className="btn btn-dark">Menu</Link>
                                <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>Volver a intentar</button>
                                <Link to="/juego02" className='btn btn-danger' >Dificil</Link>
                            </div>
                        </div>
                    </div>
                </div>



            </main>


        </div>
    )
}

export default Primer_Juego
import React from 'react'

function Segundo_Juego() {
    return (
        <div className='bodyJuego'>

            <main className='mainJuego'>


                <div className="capa"></div>


                <img alt=""
                    className="background-image"
                    src="img/fondo02.jpg" />

                <div id="wrapper" style="z-index: 2;">
                    <div id="game" style="z-index: 2;" >

                        <div id="vidas" className="vidas-container">
                        </div>

                        <div id="cards-container"></div>
                    </div>


                </div>



                {/* <!-- Modal Felicitaciones --> */}
                <div className="modal fade" id="ModalFelicitaciones" tabindex="-1" aria-labelledby="exampleModalLabel"
                    aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel"><b>Felicitaciones!!! 🥳🥳</b></h1>

                            </div>
                            <div className="modal-body" id="ModalBody">


                            </div>
                            <div className="modal-footer">
                                <a href="index.html" className="btn btn-dark">Menu</a>
                                <button type="button" className="btn btn-primary" onclick="location.reload()">Volver a
                                    intentar</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- Modal Derrota --> */}
                <div className="modal fade" id="ModalDerrota" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel"><b>Falto un poquito ;_;</b></h1>
                            </div>
                            <div className="modal-body" id="ModalBodyDerrota">
                                <p>Te has quedado sin intentos 😢</p>
                                <p> Puedes volver a intentarlo y demostrar que de lo que estas hecho 💪😎</p>
                                <p> <b>Muchas gracias por jugar, esperamos que te hayas divertido 🥰</b></p>
                            </div>
                            <div className="modal-footer">
                                <a className="btn btn-dark" href="index.html">Menu</a>
                                <button type="button" className="btn btn-primary" onclick="location.reload()">Volver a
                                    intentar</button>
                            </div>
                        </div>
                    </div>
                </div>


            </main>



        </div>
    )
}

export default Segundo_Juego
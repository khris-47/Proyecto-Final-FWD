import React from 'react'

function Tercer_juego() {
    return (
        <div className='bodyJuego'>

            <div id="pantalla-overlay"></div>

            <main className="d-flex align-items-center justify-content-center">


                <div className="capa"></div>


                <img alt="" className="background-image" src="img/fondo02.jpg" />


                <div className="container zona-juego" style="z-index: 2;">


                    <h2 id="palabraMostrar" className="text-white mb-3"></h2>

                    <div id="dropZone" className="drop-zone"></div>

                    <div className="d-flex justify-content-around mt-4" id="opcionesContainer"></div>
                    <div className="text-white mt-4" id="resultado"></div>

                </div>
            </main>






        </div>
    )
}

export default Tercer_juego
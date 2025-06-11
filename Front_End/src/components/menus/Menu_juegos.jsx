import React from 'react'
import { Link } from 'react-router-dom';


import fondo from '../../assets/img/fondos/fondo_secundario.jpg';
import memo01 from '../../assets/img/cards/memorama01.png';
import memo02 from '../../assets/img/cards/memorama02.png';
import adivi from '../../assets/img/cards/adivinanza.png';
import NavBar from '../navegacion/navBar';


import '../../styles/menu_Juegos.css';


function menu_juegos() {
    return (

        <div className="bodyMenu">

            <img alt="" className="background-image" src={fondo} />

            <div className="capa"></div>
            

            <div className='content'>

                <header>
                    <NavBar className='headerIndex'/>
                </header>

                <main className="mainMenu">
                    

                    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center text-white">
                        

                        <div className="container" style={{ zIndex: 2 }}>
                            <h1 className="display-4 fw-bold text-cyan-400 mb-3" style={{ color: "aqua" }}>
                                Juegos Interactivos
                            </h1>
                            <p className="lead mb-4">
                                Durante nuestras giras, hemos participado e interactuado con los chiquitines del hogar, y, mediante
                                juegos educativos hemos buscado inculcar ese amor que le tenemos a nuestras tradiciones. Esta es una
                                sección dedicada a todos aquellos que deseen revivir o conocer alguno de esos juegos.
                            </p>

                            <div className="row row-cols-1 row-cols-md-3 g-4 justify-content-center mt-2">
                                {/* CARD 1 */}
                                <div className="col">
                                    <div className="card h-100 bg-dark text-light shadow rounded-4 card-small">
                                        <img src={memo01} className="card-img-top" style={{ height: "190px" }} alt="..." />
                                        <div className="card-body">
                                            <h5 className="card-title">🧩 Encuentra la pareja V1</h5>
                                            <p className="card-text">
                                                ¡Vamos a jugar al memorama! Encuentra las parejas de barquitos que navegan en el
                                                Golfo de Nicoya. Aprende cómo son las embarcaciones de nuestra costa mientras te
                                                diviertes.
                                            </p>
                                            <Link to="/juego01" className="btn btn-primary">¡Jugar ahora!</Link>
                                        </div>
                                    </div>
                                </div>

                                {/* CARD 2 */}
                                <div className="col">
                                    <div className="card h-100 bg-dark text-light shadow rounded-4 card-small">
                                        <img src={memo02} className="card-img-top" style={{ height: "190px" }} alt="..." />
                                        <div className="card-body">
                                            <h5 className="card-title">🧠 Encuentra la pareja V2</h5>
                                            <p className="card-text">
                                                ¡Este juego es un poco más difícil! Busca las parejas que muestran trabajos de
                                                personas que viven cerca del mar. ¿Podrás encontrarlas todas? ¡Tú puedes!
                                            </p>
                                            <Link to="/juego02" className="btn btn-primary">¡Jugar ahora!</Link>
                                        </div>
                                    </div>
                                </div>

                                {/* CARD 3 */}
                                <div className="col">
                                    <div className="card h-100 bg-dark text-light shadow rounded-4 card-small">
                                        <img src={adivi} className="card-img-top" style={{ height: "190px" }} alt="..." />
                                        <div className="card-body">
                                            <h5 className="card-title">❓ Adivinanza</h5>
                                            <p className="card-text">
                                                ¡A jugar con las palabras! Lee la pista y arrastra la respuesta correcta. Descubre
                                                los patrimonios de nuestro país usando tu imaginación. ¡Adivina y aprende!
                                            </p>
                                            <Link to="/juego03" className="btn btn-primary">¡Jugar ahora!</Link>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </main>

            </div>

        </div>
    )
}

export default menu_juegos
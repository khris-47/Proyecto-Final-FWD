import React from 'react'

import { Link } from 'react-router-dom';
import NavBar from '../navegacion/navBar';
import fondo from '../../assets/img/fondos/fondo_principal.JPG';
import admin01 from '../../assets/img/cards/admin01.jpg'
import admin02 from '../../assets/img/cards/admin02.jpg'
import admin03 from '../../assets/img/cards/admin03.jpg'

function Menu_admin() {
    return (

        <div className="bodyAdmin">

            <img alt="" className="background-image" src={fondo} />

            <div className="capa"></div>


            <div className='content'>

                <header>
                    <NavBar className='headerIndex' />
                </header>

                <main className="mainAdmin">


                    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center text-white">


                        <div className="" style={{ zIndex: 2 }}>
                            <h1 className="display-4 fw-bold text-cyan-400 mb-3" style={{ color: "aqua" }}>
                                Administracion
                            </h1>

                            <div className="row row-cols-1 row-cols-md-3 g-4 justify-content-center mt-2">

                                {/* CARD 1 */}
                                <div className="col">
                                    <div className="card h-100 bg-dark text-light shadow rounded-4 card-small">
                                        <img src={admin01} className="card-img-top" style={{ height: "190px" }} alt="..." />
                                        <div className="card-body">
                                            <h5 className="card-title">Manejo de Entrevistas</h5>

                                            <Link to="/reg_entrevistas" className="btn btn-primary">¡Entrar!</Link>
                                        </div>
                                    </div>
                                </div>

                                {/* CARD 2 */}
                                <div className="col">
                                    <div className="card h-100 bg-dark text-light shadow rounded-4 card-small">
                                        <img src={admin02} className="card-img-top" style={{ height: "190px" }} alt="..." />
                                        <div className="card-body">
                                            <h5 className="card-title">Manejo de Cuentos</h5>

                                            <Link to="/reg_cuentos" className="btn btn-primary">¡Entrar!</Link>
                                        </div>
                                    </div>
                                </div>

                                {/* CARD 3 */}
                                <div className="col">
                                    <div className="card h-100 bg-dark text-light shadow rounded-4 card-small">
                                        <img src={admin03} className="card-img-top" style={{ height: "190px" }} alt="..." />
                                        <div className="card-body">
                                            <h5 className="card-title">Manejo de Ubicaciones</h5>

                                            <Link to="/reg_ubicaciones" className="btn btn-primary">¡Entrar!</Link>
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

export default Menu_admin
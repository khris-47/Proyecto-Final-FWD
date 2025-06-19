import React from 'react'
import '../../styles/menu_index.css'
import videoFondo from '../../assets/video/presentacion.mp4'
import NavBar from '../navegacion/navBar'
import Footer from '../navegacion/Footer'


import Cookies from 'js-cookie';

function Menu_Index() {
    return (
        <div className='bodyIndex'>

            {/* VIDEO DE FONDO */}
            <div className='video-background-container'>
                <video autoPlay loop muted className="video-background">
                    <source src={videoFondo} />
                </video>
            </div>

            <div className='capaIndex'></div>

            {/* CONTENIDO SOBRE EL VIDEO */}
            <div className="content">

                <header className='headerIndex'>
                    <NavBar />
                </header>

                <main>

                </main>

                <footer className='footerIndex'>
                    <Footer></Footer>
                </footer>

            </div>


        </div>
    )
}

export default Menu_Index
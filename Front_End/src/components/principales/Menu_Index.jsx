import React from 'react'
import '../../styles/menu_index.css'
import videoFondo from '../../assets/video/presentacion.mp4'
import NavBar from '../navegacion/navBar'
import Footer from '../navegacion/Footer'

function Menu_Index() {
    return (
        <div className='bodyIndex'>

            {/* VIDEO DE FONDO */}
            <div className='video-background-container'>
                <video autoPlay loop muted className="video-background">
                    <source src={videoFondo} />
                </video>
            </div>

            <div className='capa'></div>

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
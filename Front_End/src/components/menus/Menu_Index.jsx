import React, { useState, useEffect } from 'react'
import '../../styles/menu_index.css'
import videoFondo from '../../assets/video/presentacion.mp4'
import NavBar from '../navegacion/navBar'
import Footer from '../navegacion/Footer'


import Cookies from 'js-cookie';

function Menu_Index() {
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
        <div className='bodyIndex'>

            {/* Capa de color sobre el video de fondo */}
            <div
                className="overlay-bg"
                style={{
                    background: overlayColor === 'black'
                        ? 'rgba(0,0,0,0.6)'
                        : 'rgba(255,255,255,0.15)'
                }}
            />

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
                    <NavBar onToggleOverlayColor={toggleOverlayColor} overlayColor={overlayColor} />
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
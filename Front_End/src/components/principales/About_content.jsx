import React, { useState, useEffect } from 'react'
import Footer from '../navegacion/Footer'
import NavBar from '../navegacion/navBar'
import Fondo from '../../assets/img/fondos/fondo_manglar.png';
import '../../styles/About.css'
import { useNavigate } from 'react-router-dom'

function About_content() {

    const navigate = useNavigate()
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
        <div className="bodyAbout">
            {/* Capa de color sobre la imagen de fondo */}
            <div
                className="overlay-bg"
                style={{
                    background: overlayColor === 'black'
                        ? 'rgba(0,0,0,0.6)'
                        : 'rgba(255,255,255,0.15)'
                }}
            />
            <div className="background-container">
                <div className="overlay"></div> 
                <img alt="" className="background-image-entrevistas" src={Fondo} />
                <header className="headerAbout">
                    <NavBar onToggleOverlayColor={toggleOverlayColor} overlayColor={overlayColor} />
                </header>
            </div>

            
            <div className="content">

                <main className="main-content">
                    <div className="section izquierda">
                        <h1>Entre Olas y </h1>
                        <h1 style={{ color: '#0094ff'}}>Manglares</h1>
                        <p>
                            El proyecto TC-782 Gestión del patrimonio cultural en comunidades costeras e insulares, dirige su accionar a la protección y visibilización del patrimonio cultural material e inmaterial, esencial para preservar la historia e identidad de los pueblos, y para transmitir este legado a las generaciones futuras.
                        </p>
                        <button onClick={() => navigate('/contact')} className='contacto-btn'>Contáctanos</button>
                    </div>

                    <div className="section derecha-transparente"></div>
                </main>

                <footer className="footerIndex">
                    <Footer />
                </footer>
            </div>
        </div>
    )
    
}

export default About_content
import React from 'react'
import Footer from '../navegacion/Footer'
import NavBar from '../navegacion/navBar'
import Fondo from '../../assets/img/fondos/fondo_AboutUs.png'
import '../../styles/About.css'
import { useNavigate } from 'react-router-dom'

function About_content() {

    const navigate = useNavigate()

    return (
        <div className="bodyAbout">


            <div className="background-container">
                
                <div className="overlay"></div> 
                <img className="background-image" src={Fondo} alt=".." />

                <header className="headerAbout">
                    <NavBar />
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
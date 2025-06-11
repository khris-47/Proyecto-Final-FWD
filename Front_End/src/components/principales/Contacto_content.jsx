import React from 'react'
import { Link } from 'react-router-dom';
import NavBar from '../navegacion/navBar'
import fondo from '../../assets/img/fondos/fondo_principal.JPG'
import Contacto from '../../assets/img/cards/contacto.jpg'

import '../../styles/contacto.css'

function Contacto_content() {
  return (
    <div className='bodyContacto'>

      <img alt="" className="background-image" src={fondo} />

      <div className="capa"></div>

      <div className='contenido'>

        <header className='headerIndex'>
          <NavBar />
        </header>

        <main className='mainContacto'>

          <div className='sectionC izquierdaC'>
            <img src={Contacto} alt="" />
          </div>

          <div className='sectionC derechaC'>
            <h1>Contáctanos</h1>
            <p>Nos encantaría escuchar de ti!, Si tienes alguna pregunta, comentario, consulta, o si vives en alguna de las zonas costeras y quieres comentarnos sobre tu emprendimiento, no dudes en comunicarte con nosotros. Puedes enviarnos un comentario directamente desde aquí o bien hablarnos por medio de nuestras redes sociales, nuestro equipo estará encantado por conocerte o ayudarte!</p>
            <input type="text" placeholder='Ingrese su comentario Aqui' />
            <div className='botones'>
              <button className='btn btn-primary'>Enviar</button>
              <button className='btn btn-dark'>Volver</button>

            </div>

          </div>
        </main>

        <footer>
          
        </footer>

      </div>

    </div>
  )
}

export default Contacto_content
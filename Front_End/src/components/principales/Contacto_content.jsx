import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../navegacion/navBar'
import fondo from '../../assets/img/fondos/fondo_principal.JPG'
import Contacto from '../../assets/img/cards/contacto.jpg'

import '../../styles/contacto.css'

import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import * as Usuarios_Services from '../../services/Usuarios_Services';


function Contacto_content() {

  const navigate = useNavigate();
  const [comentario, setComentario] = useState('');
  const token = Cookies.get('accessToken');

  // Manejo del envio del comentario
  const handleEnviarComentario = async () => {

    //verificar que haya iniciado sesion
    if (!token) {
      Swal.fire('Acceso Denegado', 'Debes iniciar sesión para enviar un comentario.', 'warning');
      return;
    }

    // varificar la longitud del comentario
    if (comentario.trim().length < 5) {
      Swal.fire('Comentario inválido', 'El comentario debe tener al menos 5 caracteres.', 'error');
      return;
    }

    try {

      await Usuarios_Services.enviarComentario({ comentario }, token);

      Swal.fire('¡Gracias!', 'Tu comentario ha sido enviado correctamente.', 'success');
      setComentario('');


    } catch (error) {
      console.error('Error al enviar comentario:', error);
      Swal.fire('Error', 'Ocurrió un error al enviar tu comentario.', 'error');
    }

  }


  return (
    <div className='bodyContacto'>

      <img alt="" className="background-image" src={fondo} />

      <div className="capaContacto"></div>

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
            <input type="text" placeholder='Ingrese su comentario Aqui'  onChange={(e) => setComentario(e.target.value)} />
            <div className='botones'>
              <button className='btn btn-primary' onClick={handleEnviarComentario}>Enviar</button>
              <button className='btn btn-dark' onClick={() => navigate('/')} >Volver</button>

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
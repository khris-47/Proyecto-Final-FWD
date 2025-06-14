import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../navegacion/navBar'
import fondo from '../../assets/img/fondos/fondo_principal.JPG'
import Contacto from '../../assets/img/cards/contacto.jpg'

import '../../styles/contacto.css'

import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import * as Usuarios_Services from '../../services/Usuarios_Services'; // asumimos que aquí está el servicio para enviar el correo


function Contacto_content() {

  const navigate = useNavigate();

  const [comentario, setComentario] = useState('');
  const [usuario] = useState(null);

  // Función para enviar comentario al "admin"
  const enviarComentario = async () => {
    if (!usuario) {
      Swal.fire({
        title: 'Debes iniciar sesión',
        text: 'Por favor, inicia sesión para enviar un comentario.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return;
    }

    if (!comentario.trim()) {
      Swal.fire({
        title: 'Campo vacío',
        text: 'Por favor, escribe tu comentario antes de enviarlo.',
        icon: 'info'
      });
      return;
    }

    try {
      // Construimos el cuerpo del mensaje
      const cuerpoMensaje = `El usuario ${usuario.email} envió el siguiente mensaje:\n\n${comentario}`;

      // Llamada al servicio que maneja el envío (lo vemos abajo)
      await Usuarios_Services.enviarComentarioAdmin(cuerpoMensaje);

      Swal.fire({
        title: '¡Comentario enviado!',
        text: 'Gracias por comunicarte con nosotros.',
        icon: 'success'
      });

      setComentario('');

    } catch (error) {
      console.error('Error al enviar el comentario:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo enviar el comentario. Intenta más tarde.',
        icon: 'error'
      });
    }
  };


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
            <input type="text" placeholder='Ingrese su comentario Aqui' onChange={(e) => setComentario(e.target.value)}/>
            <div className='botones'>
              <button className='btn btn-primary'  onClick={enviarComentario}>Enviar</button>
              <button className='btn btn-dark'onClick={() => navigate('/')} >Volver</button>

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
import React, { useState } from 'react';
import NavBar from '../navegacion/navBar'
import fondo from '../../assets/img/fondos/fondo_principal.JPG'
import Contacto from '../../assets/img/cards/contacto.jpg'

import '../../styles/contacto.css'

import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import * as Usuarios_Services from '../../services/Usuarios_Services';
import Modal_Emprendimientos from '../registros/Modal_Emprendimientos';


function Contacto_content() {

  const [comentario, setComentario] = useState('');
  const token = Cookies.get('accessToken');

  const [showModal, setShowModal] = useState(false);


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

            <p>Nos encantaría escuchar de ti!, Si tienes alguna pregunta, comentario, consulta, o
              si vives en alguna de las zonas costeras y quieres comentarnos sobre tu emprendimiento, no
              dudes en comunicarte con nosotros. Puedes enviarnos un comentario directamente desde aquí o bien hablarnos por
              medio de nuestras redes sociales, nuestro equipo estará encantado por conocerte o ayudarte! </p>

            <p><b>Puedes hacer click al boton de la derecha para enviarnos un formulario con lod datos de tu emprendimiento</b></p>

            <input type="text" placeholder='Ingrese su comentario Aqui' onChange={(e) => setComentario(e.target.value)} />
            <div className='botones'>
              <button className='btn btn-primary' onClick={handleEnviarComentario}>Enviar Comentario</button>
              <button className='btn btn-dark bx bxs-file' onClick={() => setShowModal(true)}></button>

            </div>

          </div>
        </main>

        <footer>

        </footer>

      </div>

      <Modal_Emprendimientos
        show={showModal}
        onHide={() => setShowModal(false)}
      />


    </div>
  );


}

export default Contacto_content
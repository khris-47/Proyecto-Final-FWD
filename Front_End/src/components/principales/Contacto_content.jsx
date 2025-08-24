import React, { useState } from 'react';
import NavBar from '../navegacion/navBar'
import fondo from '../../assets/img/fondos/fondo nocturno.png';
import Contacto from '../../assets/img/fondos/garza2.png'

import '../../styles/contacto.css'

import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import * as Usuarios_Services from '../../services/Usuarios_Services';
import Modal_Emprendimientos from '../registros/Modal_Emprendimientos';


function Contacto_content() {

  const [comentario, setComentario] = useState('');
  const token = Cookies.get('accessToken');

  const [enviando, setEnviando] = useState(false);

  const [showModal, setShowModal] = useState(false);


  // Manejo del envio del comentario
  const handleEnviarComentario = async () => {

    //verificar que haya iniciado sesion
    if (!token) {
      toast.info('Debes iniciar sesión para enviar un comentario.', { autoClose: 3000 });
    }

    // varificar la longitud del comentario
    if (comentario.trim().length < 5) {
      toast.error('El comentario debe tener al menos 5 caracteres.', { autoClose: 3000 });
      return;
    }

    try {

      setEnviando(true);

      await Usuarios_Services.enviarComentario({ comentario }, token);

      toast.success('¡Tu comentario ha sido enviado correctamente!', { autoClose: 3000 });
      setComentario('');

      setEnviando(false);

    } catch (error) {
      console.error('Error al enviar comentario:', error);
      toast.error('Ocurrió un error al enviar tu comentario.', { autoClose: 3000 });
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

            <p><b>Puedes hacer click al boton de la derecha para enviarnos un formulario con los datos de tu emprendimiento</b></p>

            <input type="text" placeholder='Ingrese su comentario Aqui' onChange={(e) => setComentario(e.target.value)} value={comentario} />
            <div className='botones'>
              <button
                className='btn btn-primary'
                onClick={handleEnviarComentario}
                disabled={enviando}
              >
                {enviando ? 'Enviando...' : 'Enviar Comentario'}
              </button>

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
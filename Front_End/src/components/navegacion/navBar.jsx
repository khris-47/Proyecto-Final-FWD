
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/navBar.css'
import logo from '../../assets/img/logos/logo_blanco.png'
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';


function NavBar() {

  // Obtengo los datos de la cokkies
  const navigate = useNavigate();
  const userCookie = Cookies.get('user');


  const token = Cookies.get('accessToken');
  let userId = null;

  // dado que el navbar es de lo que primero se ve
  // el token no va a existir de una sola vez, asi que no podemos darle un valor de una decodificacion al userId si este no existe
  // para evitar esto usamos esa decodificacion solo si existe un token
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.user_id;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
    }
  }


  // constante para cerrar sesion
  const handleLogout = () => {
    
    // preguntamos primero
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      
      // en caso de cerrar sesion, borramos las cookies y enviamos al index
      if (result.isConfirmed) {
        Cookies.remove('user');
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        navigate('/');
      }
    });

    
  };


  // recuperamos el objeto que esta dentro de la cookie, si no hay, queda en nulo
  const user = userCookie ? JSON.parse(userCookie) : null;

  return (
    <div className='bodyNav'>

      <nav className='navbar'>
        <ul className='navbar-items'>

          {/* izquierda */}
          <li><Link to="/index" className='links'>Inicio</Link></li>

          <li><Link to="/about" className='links'>Quienes Somos</Link></li>

          {userId !== 1 ? (
            <li><Link to="/contact" className='links'>Contacto</Link></li>
          ) : (

            <li className="submenu-hover popup">
              <input type="checkbox" id="submenu-toggle" />

              <label htmlFor="submenu-toggle" className="submenu-toggle-label " tabIndex="0">
                <span className='links'>Auditorías</span>
              </label>

              <nav className="popup-window submenu-popup">
                <legend>Auditorías</legend>
                <ul>
                  <li>
                    <button onClick={() => navigate('/aud_user')}>Usuarios</button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/aud_entrevistas')}>Entrevistas</button>
                  </li>
                  <li>
                    <button onClick={() => navigate('/aud_cuentos')}>Cuentos</button>
                  </li>
                </ul>
              </nav>
            </li>



          )}


          <li><Link to="/cuentos" className='links'>Cuentos</Link></li>

          {/* Logo centrado */}
          <li className="logo-container">


            {userId !== 1 ? (
              <img className='logo' src={logo} alt="Logo" />
            ) : (
              <Link to='/admin'><img className='logo' src={logo} alt="Logo" /></Link>
            )}

          </li>

          {/* derecha */}
          <li><Link to="/entrevistas" className='links'>Entrevistas</Link></li>
          <li><Link to="/lugares" className='links'>Lugares</Link></li>
          <li>
            <a href="https://khris-47.github.io/Juegos_Pagina/index.html" className="links" target="_blank" rel="noopener noreferrer">
              Juegos Interactivos
            </a>
          </li>


          <div className="perfil-btn">
            <label className="popup">
              <input type="checkbox" />
              <div tabIndex="0" className="burger">
                <i className="bx bx-user" style={{ fontSize: '24px', color: 'white' }}></i>
              </div>
              <nav className="popup-window">
                <legend>Usuario</legend>
                <ul>
                  {!user ? (
                    <li>
                      <button onClick={() => navigate('/login')}>
                        <i className="bx bx-log-in"></i>
                        <span>Iniciar Sesión</span>
                      </button>
                    </li>
                  ) : (
                    <>
                      <li>
                        <button onClick={() => navigate('/perfil')}>
                          <i className="bx bx-user-circle"></i>
                          <span>Mi Perfil</span>
                        </button>
                      </li>

                      {/* li's propios del admin */}
                      {userId == 1 && (
                        <>
                          <li>
                            <button onClick={() => navigate('/list_user')}>
                              <i className="bx bx-user-circle"></i>
                              <span>Lista de Usuarios</span>
                            </button>
                          </li>

                        </>
                      )}


                      <li>

                        <button onClick={handleLogout}>
                          <i className="bx bx-log-out"></i>
                          <span>Cerrar Sesión</span>
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
            </label>
          </div>

        </ul>



      </nav>



    </div>
  )
}

export default NavBar
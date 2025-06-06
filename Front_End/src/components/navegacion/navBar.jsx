
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/navBar.css'
import logo from '../../assets/img/logos/logo_blanco.png'
import Cookies from 'js-cookie';

function NavBar() {

  // Obtengo los datos de la cokkies
  const navigate = useNavigate();
  const userCookie = Cookies.get('user');
  const userId = Cookies.get('userId');

  // cuando se cierra la sesion, se limpian las cookies y se redirecciona al index
  const handleLogout = () => {
    Cookies.remove('user');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('userId');
    navigate('/');
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

          {userId !== '1' ? (
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


            {userId !== '1' ? (
              <img className='logo' src={logo} alt="Logo" />
            ) : (
              <Link to='/admin'><img className='logo' src={logo} alt="Logo" /></Link>
            )}

          </li>

          {/* derecha */}
          <li><Link to="/entrevistas" className='links'>Entrevistas</Link></li>
          <li><Link to="/lugares" className='links'>Lugares</Link></li>
          <li><Link to="/menu_juegos" className='links'>Juegos Interactivos</Link></li>

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
                      {userId == '1' && (
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
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import NavBar from '../navegacion/navBar'
import Fondo from '../../assets/img/fondos/fondo_principal.JPG'
import { Link } from 'react-router-dom';

import '../../styles/mi_perfil.css'

function MiPerfilContent() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = Cookies.get('userId');
    const token = Cookies.get('accessToken');

    if (userId && token) {
      axios.get(`http://localhost:8000/api/UserDetails/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => setUserData(res.data))
        .catch((err) => console.error(err));
    }
  }, []);

  return (
    <div className="mi-perfil-container">

      <div className="background-container">

        <img className="background-image" src={Fondo} alt=".." />

        <header className="headerAbout">
          <NavBar />
        </header>


      </div>
      <div className='capa'></div>

      <div className="formulario-perfil">
        <h1>Detalles del Perfil</h1>
        <div>
          <h4>Usuario</h4>
          <hr />
          <dl className="row">
            <dt className="col-sm-4">Nombre de usuario:</dt>
            <dd className="col-sm-8">{userData?.username || 'Cargando...'}</dd>

            <dt className="col-sm-4">Email:</dt>
            <dd className="col-sm-8">{userData?.email || 'Cargando...'}</dd>

            <dt className="col-sm-4">Nombre:</dt>
            <dd className="col-sm-8">{userData?.first_name || 'Cargando...'}</dd>

            <dt className="col-sm-4">Apellidos:</dt>
            <dd className="col-sm-8">{userData?.last_name || 'Cargando...'}</dd>

            <dt className="col-sm-4">Fecha de Ingreso:</dt>
            <dd className="col-sm-8">{userData?.date_joined || 'Cargando...'}</dd>
          </dl>
        </div>
        <div>
          <button className="btn btn-primary mt-3 m-1">Editar</button>
          <Link to='/' className='btn btn-dark mt-3 m-1'>Menú</Link>
        </div>
      </div>
    </div>
  );
}

export default MiPerfilContent;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import NavBar from '../navegacion/navBar';
import Fondo from '../../assets/img/fondos/fondo_principal.JPG';
import { Link, useNavigate } from 'react-router-dom';
import Modal_Usuario from '../registros/Modal_Usuario';
import Swal from 'sweetalert2';

import '../../styles/mi_perfil.css'

function MiPerfilContent() {
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '' // Puede quedar vacío si no se va a cambiar la contraseña
  });

  useEffect(() => {
    const userId = Cookies.get('userId');
    const token = Cookies.get('accessToken');

    if (userId && token) {
      axios.get(`http://localhost:8000/api/UserDetails/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          setUserData(res.data);
          setFormData(prev => ({ ...prev, ...res.data }));
        })
        .catch((err) => console.error(err));
    }
  }, []);

  // Manejo del modal de edición
  const handleEdit = () => {
    setShowModal(true);
  };

  // Manejo de la actualización de datos
  const handleUpdate = async () => {
    const userId = Cookies.get('userId');
    const token = Cookies.get('accessToken');

    console.log(formData);

    try {
      await axios.patch(`http://localhost:8000/api/UserDetails/${userId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Cookies.set('user', JSON.stringify(formData), { expires: 1 });
      alert('Perfil actualizado correctamente');
      setUserData(formData);
      setShowModal(false);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      alert('Error al actualizar perfil');
    }
  };


  // Manejo de la eliminacion de datos
  const handleDelete = async () => {
    const userId = Cookies.get('userId');
    const token = Cookies.get('accessToken');

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará tu cuenta permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8000/api/UserDetails/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          // Eliminar cookies y redirigir al usuario
          Cookies.remove('user');
          Cookies.remove('accessToken');
          Cookies.remove('userId');

          Swal.fire('Cuenta eliminada', 'Tu perfil ha sido eliminado.', 'success');
          navigate('/');
        } catch (error) {
          console.error('Error al eliminar perfil:', error);
          Swal.fire('Error', 'No se pudo eliminar el perfil.', 'error');
        }
      }
    });
  };
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
          <button className="btn btn-primary mt-3 m-1" onClick={handleEdit}>Editar</button>
          <Link to='/' className='btn btn-dark mt-3 m-1'>Menú</Link>

          {/* Solo mostrar el botón de eliminación si el usuario NO es el admin */}
          {(userData?.id !== 1 && !userData?.is_superuser) && (
            <button className='btn btn-danger mt-3 m-1' onClick={handleDelete}>Eliminar Perfil</button>
          )}


        </div>
      </div>


      {/* Modal de edición */}
      <Modal_Usuario
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleUpdate}
        formData={formData}
        setFormData={setFormData}
        isEditing={true}
      />


    </div>
  );
}

export default MiPerfilContent;
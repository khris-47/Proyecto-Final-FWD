import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function Mi_Perfil_Content() {
   const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userId = Cookies.get('userId');
    const token = Cookies.get('accessToken');

    if (userId && token) {
      axios.get(`http://localhost:8000/api/UserDetails/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUserData(res.data))
      .catch((err) => console.error(err));
    }
  }, []);

  return (
    <div>
      <h1>Mi Perfil</h1>
      {userData ? (
        <div>

          <p><strong>Nombre de usuario:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Nombre:</strong> {userData.first_name}</p>
          <p><strong>Apellidos:</strong> {userData.last_name}</p>
          <p><strong>Fecha de Ingreso:</strong> {userData.date_joined}</p>

          <button >Editar</button>
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default Mi_Perfil_Content
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
          
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default Mi_Perfil_Content
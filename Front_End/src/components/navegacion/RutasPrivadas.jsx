
import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

function RutasPrivadas({ children, requiereAdmin = false }) {

    const token = Cookies.get('accessToken');         //   traemos el token

    // verifica que haya un token
    if (!token) {
        return <Navigate to="/login" />; // en caso de que no haya un token redirigir al login
    }

    try {

        const decoded = jwtDecode(token); // decodificamos el token
        

        const esAdmin = decoded?.user_id === 1;  // preguntamos si es el admin

        // verifica que si sea el admin
        if (requiereAdmin && !esAdmin) {
            toast.warning('Necesitás permisos de administrador para entrar acá.', { autoClose: 3000 });
            return <Navigate to="/index" />;
        }

        return children;

    } catch (e) {
        console.error('Token inválido', e);
        return <Navigate to="/login" />;
    }
}

export default RutasPrivadas;

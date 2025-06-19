
import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
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
            Swal.fire({
                icon: 'warning',
                title: 'Acceso denegado',
                text: 'Necesitás permisos de administrador para entrar acá.',
                timer: 3000,
                showConfirmButton: false
            });
            return <Navigate to="/index" />;
        }

        return children;

    } catch (e) {
        console.error('Token inválido', e);
        return <Navigate to="/login" />;
    }
}

export default RutasPrivadas;

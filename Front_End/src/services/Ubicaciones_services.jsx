import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE = 'http://localhost:8000/api';
const access = Cookies.get('accessToken');

// Obtener todas las ubicaciones
export const getUbicaciones = async () => {
  return await axios.get(`${API_BASE}/listUbicaciones/`);
};


// Crear nueva ubicacion
export const crearUbicacion = async (data) => {
    return await axios.post(`${API_BASE}/ubicaciones/`, data, {
        headers: {
            Authorization: `Bearer ${access}`,
            'Content-Type': 'multipart/form-data',
        },
    });
};

// Editar ubicacion
export const editarUbicacion = async (id, data) => {
    return await axios.patch(`${API_BASE}/ubicaciones/${id}`, data, {
       headers: {
            Authorization: `Bearer ${access}`,
            'Content-Type': 'multipart/form-data',
        },
    });
};

// Borrar Ubicacion
export const BorrarUbicacion = async (id) => {
    return await axios.delete(`${API_BASE}/ubicaciones/${id}`, {
        headers: { Authorization: `Bearer ${access}` }
    });
};
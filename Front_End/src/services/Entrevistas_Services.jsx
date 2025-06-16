import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE = 'http://localhost:8000/api';
const access = Cookies.get('accessToken');

// Obtener todas las entrevistas sin acceso
export const getPublicEntrevistas = async () => {
    return await axios.get(`${API_BASE}/listEntrevistas/`, {
    });
};


// Obtener todas las entrevistas
export const getEntrevistas = async () => {
    return await axios.get(`${API_BASE}/listEntrevistas/`, {
        headers: { Authorization: `Bearer ${access}` }
    });
};

// Crear nueva entrevista
export const crearEntrevista = async (data) => {
    return await axios.post(`${API_BASE}/entrevistas/`, data, {
        headers: { Authorization: `Bearer ${access}` }
    });
};

// Editar entrevista por ID
export const editarEntrevista = async (id, data) => {
    return await axios.patch(`${API_BASE}/entrevistas/${id}`, data, {
        headers: { Authorization: `Bearer ${access}` }
    });
};

// Cambiar estado (activar/desactivar)
export const cambiarEstadoEntrevista = async (id, estado) => {
    return await axios.patch(`${API_BASE}/entrevistas/${id}`, { estado }, {
        headers: { Authorization: `Bearer ${access}` }
    });
};
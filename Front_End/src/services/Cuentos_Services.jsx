import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE = 'http://localhost:8000/api';
const access = Cookies.get('accessToken');

// Obtener todas los cuentos
export const getCuentos = async () => {
    return await axios.get(`${API_BASE}/listCuentos/`, {
        headers: {
            Authorization: `Bearer ${access}`,
            'Content-Type': 'multipart/form-data',
        }
    });
};

// Crear un nuevo cuento
export const crearCuentos = async (data) => {
    return await axios.post(`${API_BASE}/cuentos/`, data, {
        headers: {
            Authorization: `Bearer ${access}`,
            'Content-Type': 'multipart/form-data',
        },
    });
};


// Editar cuentos por ID
export const editarCuentos = async (id, data) => {
    return await axios.patch(`${API_BASE}/cuentos/${id}`, data, {
        headers: { Authorization: `Bearer ${access}` }
    });
};

// Cambiar estado (activar/desactivar)
export const cambiarEstadoCuentos = async (id, estado) => {
    return await axios.patch(`${API_BASE}/cuentos/${id}`, { estado }, {
        headers: { Authorization: `Bearer ${access}` }
    });
};
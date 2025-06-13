import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Login y obtención del token
export const loginUsuario = (username, password) => {
    return axios.post(`${API_URL}/token/`, { username, password });
};

// Obtener detalles del usuario autenticado
export const obtenerUsuarioPorId = (id, token) => {
    return axios.get(`${API_URL}/UserDetails/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Registro de usuario
export const registrarUsuario = (data) => {
    return axios.post(`${API_URL}/userRegister/`, data);
};

// Actualizar los datos del usuario
export const actualizarUsuario = async (userId, formData, token) => {
    return axios.patch(`${API_URL}/UserDetails/${userId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Eliminar al usuario
export const eliminarUsuario = async (userId, token) => {
    return axios.delete(`${API_URL}/UserDetails/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// cambio de contrasenha y reinicio de estado
export const resetPassword = (username, email) => {
    return axios.post(`${API_URL}/reset-password/`, { username, email });
};

// reactivar al usuario y hacerle el cambio de contrasenha
export const cambiarPasswordTrasReset = (username, temp_password, nueva_password) => {
    return axios.post(`${API_URL}/cambiar-password-reset/`, {
        username,
        temp_password,
        nueva_password
    });
};

// Buscar usuario por username
export const obtenerUsuarioPorUsername = (username) => {
    return axios.get(`${API_URL}/por-username/${username}/`);
};

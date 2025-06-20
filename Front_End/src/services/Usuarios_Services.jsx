import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Login y obtención del token
export const loginUsuario = (username, password) => {
    return axios.post(`${API_URL}/token/`, { username, password });
};

// obtener usuarios
export const getUsuarios = async (token) => {
  return await axios.get(`${API_URL}/listUser/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Obtener detalles del usuario autenticado
export const obtenerUsuarioPorId = (token) => {
    return axios.get(`${API_URL}/UserDetails/`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Registro de usuario
export const registrarUsuario = (data) => {
    return axios.post(`${API_URL}/userRegister/`, data);
};

// Actualizar los datos del usuario
export const actualizarUsuario = async (formData, token) => {
    return axios.patch(`${API_URL}/UserDetails/`, formData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// Eliminar al usuario
export const eliminarUsuario = async (token) => {
    return axios.delete(`${API_URL}/UserDetails/`, {
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

// Envio del comentario del usuario
export const enviarComentario = async (data, token) => {
  return await axios.post(`${API_URL}/comentariosRegister/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Obtener comentarios de un usuario
export const getComentariosPorUsuario = async (userId, token) => {
  return await axios.get(`${API_URL}/comentariosUser/${userId}/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Crear un nuevo emprendimiento
export const crearEmprendimiento = async (formData, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    const response = await axios.post(`${API_URL}/crearEmprendimiento/`, formData, config);
    return response;
  } catch (error) {
    console.error("Error al crear el emprendimiento:", error);
    throw error;
  }
};

// Obtener emprendimientos de un usuario
export const getEmprendimientosPorUsuario = async (userId, token) => {
  return await axios.get(`${API_URL}/emprendimientosUser/${userId}/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Validar el codigo de verificacion
export const validarCodigoVerificacion = async ({ username, codigo }) => {
  return axios.post(`${API_URL}/verificar-codigo/`, { username, codigo });
};

// Obtener el estado de verificacion del usuario
export const verificarEstadoUsuario = async (username) => {
  return axios.post(`${API_URL}/verificarEstadoUsuario/`, { username });
};

// Validar password actual
export const validarPassword = async (userId, password, token) => {
  return await axios.post(`${API_URL}/validar_password/`, {
    user_id: userId,
    password: password
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};


// Cambiar contraseña desde perfil
// Usuarios_Services.jsx
export const cambiarPassword = async (old_password, new_password, token) => {
  return axios.post(`${API_URL}/cambiar_password_perfil/`, {
    old_password,
    new_password
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};


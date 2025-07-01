import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:8000/api';

// Login y obtención del token
export const loginUsuario = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/token/`, { username, password });
    return response.data;
  } catch (error) {
    console.error("Error al obtener el token y el refresh:", error);
    throw error;
  }

};

// obtener usuarios
export const getUsuarios = async (token) => {
  try {
    return await axios.get(`${API_URL}/listUser/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (err) {
    console.error('error al obtener los datos: ', err)
    throw err;
  }

};

// Obtener detalles del usuario autenticado
export const obtenerUsuarioPorId = (token) => {

  try {
    return axios.get(`${API_URL}/UserDetails/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (err) {
    console.error('error al obtener los datos: ', err)
    throw err;
  }


};

// Registro de usuario
export const registrarUsuario = (data) => {
  try {
    return axios.post(`${API_URL}/userRegister/`, data);
  } catch (err) {
    console.error('error al registrar: ', err)
    throw err;
  }

};

// Actualizar los datos del usuario
export const actualizarUsuario = async (formData, token) => {

  try {
    return axios.patch(`${API_URL}/UserDetails/`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (err) {
    console.error('error al aactualizar: ', err)
    throw err;
  }

};

// Eliminar al usuario
export const eliminarUsuario = async (token) => {
  try {
    return axios.delete(`${API_URL}/UserDetails/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (err) {
    console.error('error al eliminar el usuario: ', err)
    throw err;
  }

};

// cambio de contrasenha y reinicio de estado
export const resetPassword = (username, email) => {
  try {
    return axios.post(`${API_URL}/reset-password/`, { username, email });
  } catch (err) {
    console.error('error al hacer el reset: ', err)
    throw err;
  }

};

// reactivar al usuario y hacerle el cambio de contrasenha
export const cambiarPasswordTrasReset = (username, temp_password, nueva_password) => {
  try {
    return axios.post(`${API_URL}/cambiar-password-reset/`, {
      username,
      temp_password,
      nueva_password
    });
  } catch (err) {
    console.error(err)
    throw err;
  }

};

// Buscar usuario por username
export const obtenerUsuarioPorUsername = (username) => {
  try {
    return axios.get(`${API_URL}/por-username/${username}/`);
  } catch (err) {
    console.error('Error al obtener el usuario : ', err);
    throw err
  }

};

// Envio del comentario del usuario
export const enviarComentario = async (data, token) => {
  try {
    return await axios.post(`${API_URL}/comentariosRegister/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    console.error('Error al enviar el comentario: ', err);
    throw err
  }

};

// Obtener comentarios de un usuario
export const getComentariosPorUsuario = async (userId, token) => {
  try {
    return await axios.get(`${API_URL}/comentariosUser/${userId}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (err) {
    console.error('Error al obtener el comentario del usuario: ', err);
    throw err
  }

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
  try {
    return await axios.get(`${API_URL}/emprendimientosUser/${userId}/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (err) {
    console.error('Error al obtener el emprendimiento: ', err);
    throw err
  }

};

// Validar el codigo de verificacion
export const validarCodigoVerificacion = async ({ username, codigo }) => {
  try {
    return axios.post(`${API_URL}/verificar-codigo/`, { username, codigo });
  } catch (err) {
    console.error('Error al verificar el codigo: ', err);
    throw err
  }

};

// Obtener el estado de verificacion del usuario
export const verificarEstadoUsuario = async (username) => {
  try {
    return axios.post(`${API_URL}/verificarEstadoUsuario/`, { username });
  } catch (err) {
    console.error('Error al verificar el estado: ', err);
    throw err
  }

};

// Validar password actual
export const validarPassword = async (userId, password, token) => {
  try {
    return await axios.post(`${API_URL}/validar_password/`, {
      user_id: userId,
      password: password
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (err) {
    console.error('Error al validar la contra: ', err)
    throw err;
  }

};

// Cambiar contraseña desde perfil
// Usuarios_Services.jsx
export const cambiarPassword = async (old_password, new_password, token) => {
  try {
    return axios.post(`${API_URL}/cambiar_password_perfil/`, {
      old_password,
      new_password
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (err) {
    console.error('Error al cambiar la contra:', err)
  }

};

// refrescar el token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = Cookies.get('refreshToken');

    const response = await axios.post(`${API_URL}/token/refresh`, {
      refresh: refreshToken
    });

    const { access } = response.data;
    Cookies.set('accessToken', access);
    return access;

  } catch (err) {
    console.log('error al pasar al refresh: ', err)
    throw err
  }

};


// registrar bloqueo del login
export const registrarLoginFallido = async (visitorId) => {
  try {
    const response = await axios.post(`${API_URL}/bloqueo_login/`, { visitorId });
    return response;
  } catch (err) {
    console.log('error en el bloqueo del login: ', err)
    throw err
  }
};

// verificar el bloqueo del login
export const verificarBloqueoLogin = async (visitorId) => {
  try {
    const response = await axios.get(`${API_URL}/bloqueo_login/`, {
      params: { visitorId }
    });
    return response.data;
  } catch (err) {
    console.error('Error al verificar el bloqueo del login:', err);
    throw err;
  }
};

// services/BloqueoService.js
export const resetearBloqueoLogin = async (visitorId) => {
  try {
    return axios.put(`${API_URL}/bloqueo_login/`, { visitorId });
  } catch (err) {
    console.log('error al resetear el bloqueo: ', err)
    throw err
  }
};


// registrar fallo en la recuperacion de contra
export const registrarRecuperacionFallida = async (visitorId) => {
  try {
    const response = await axios.post(`${API_URL}/bloqueo_recovery/`, { visitorId });
    return response;
  } catch (err) {
    console.log('error en el bloqueo del login: ', err)
    throw err
  }
};

// verificar el bloqueo de la recuperacion de contra
export const verificarBloqueoRecuperacion = async (visitorId) => {
  try {
    const response = await axios.get(`${API_URL}/bloqueo_recovery/`, {
      params: { visitorId }
    });
    return response.data;
  } catch (err) {
    console.error('Error al verificar el bloqueo del login:', err);
    throw err;
  }
};

// reiniciar intentos en recuperacion de contra
export const resetearBloqueoRecuperacion = async (visitorId) => {
  try {
    return axios.put(`${API_URL}/bloqueo_recovery/`, { visitorId });
  } catch (err) {
    console.log('error al resetear el bloqueo: ', err)
    throw err
  }
};




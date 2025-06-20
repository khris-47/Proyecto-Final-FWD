
import axios from 'axios';
const API_BASE = 'http://localhost:8000/api';

// auditoria de Cuentos
export const obtenerAuditoriaCuentos = async (token) => {
  return axios.get(`${API_BASE}/Auditoria_Cuentos/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// auditoria de Entrevistas
export const obtenerAuditoriaEntrevistas = async (token) => {
  return axios.get(`${API_BASE}/Auditoria_Entrevistas/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const obtenerAuditoriaUsuarios = async (token) => {
  return axios.get(`${API_BASE}/Auditoria_Usuarios/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
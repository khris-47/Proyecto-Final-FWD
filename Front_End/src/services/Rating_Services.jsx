import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

// traer todos los ratings
export const getRatingsCuentos = async () => {
  try {
    const resp = await axios.get(`${API_BASE}/rating-cuentos/`);
    return resp.data;               // <-- devuelve los datos
  } catch (error) {
    console.error('Error al traer el rating:', error);
    throw error;
  }
};

// crear o actualizar el rating (gracias al upsert del backend)
export const createOrUpdateRating = async (cuentoId, valor, token) => {
  try {
    const resp = await axios.post(
      `${API_BASE}/rating-cuento/`,
      { cuento: cuentoId, valor },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return resp.data;               // <-- devuelve algo si lo necesitas
  } catch (error) {
    console.error('Error al intentar hacer el voto:', error);
    throw error;
  }
};


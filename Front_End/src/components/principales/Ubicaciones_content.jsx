import { useState, useEffect } from "react";
import '../../styles/ubicaciones.css'

function Ubicaciones_content() {

  const [ubicaciones, setUbicaciones] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);

  useEffect(() => {
    fetch('http://localhost:8000/api/listUbicaciones/')
        .then(response => response.json())
        .then(data => {
            // Ajustamos para asegurarnos de que el fondo se llame correctamente
            const ubicacionesFormateadas = data.map(item => ({
                ...item,
                portada: item.portada_url // Ajustamos la propiedad portada
            }));
            setUbicaciones(ubicacionesFormateadas);
        })
        .catch(error => console.error('Error al cargar las ubicaciones:', error));
}, []);


  const siguienteUbicacion = () => {
    setIndiceActual((prevIndice) => (prevIndice + 1) % ubicaciones.length);
  };

  if (ubicaciones.length === 0) return <p>Cargando ubicaciones...</p>;


  return (


    <div className="carrusel" style={{ backgroundImage: `url(${ubicaciones[indiceActual].portada_url})` }}>
            <h1>{ubicaciones[indiceActual].nombre}</h1>
            <p>{ubicaciones[indiceActual].descripcion}</p>
            <button className="next-btn" onClick={siguienteUbicacion}>Next</button>
            <img className="siguiente-imagen" src={ubicaciones[(indiceActual + 1) % ubicaciones.length].portada} alt="Siguiente ubicación" />
        </div>


  )



}

export default Ubicaciones_content
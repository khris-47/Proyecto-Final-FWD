import { useState, useEffect } from "react";
import '../../styles/ubicaciones.css';
import NavBar from '../navegacion/navBar';
import { getUbicaciones } from "../../services/Ubicaciones_services";

function Ubicaciones_content() {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [animacionFondo, setAnimacionFondo] = useState("");
  const [setAnimacionImagen] = useState("entrando");
  const [datosCargados, setDatosCargados] = useState(false);

  useEffect(() => {
    const cargarUbicaciones = async () => {
      try {
        const response = await getUbicaciones();
        const ubicacionesFormateadas = response.data.map(item => ({
          ...item,
          portada: item.portada_url
        }));

        setUbicaciones(ubicacionesFormateadas);
        setDatosCargados(true);

        if (ubicacionesFormateadas.length > 0) {
          setIndiceActual(0);
          setTimeout(() => setAnimacionFondo("expandida"), 50);
          setAnimacionImagen("entrando");
        }
      } catch (error) {
        console.error('Error al cargar las ubicaciones:', error);
      }
    };

    cargarUbicaciones();
  }, []);

  const siguienteUbicacion = () => {
    setAnimacionFondo("");

    setTimeout(() => {
      const nuevoIndice = (indiceActual + 1) % ubicaciones.length;
      setIndiceActual(nuevoIndice);

      setTimeout(() => {
        setAnimacionFondo("expandida");
      }, 30);
    }, 50);
  };

  if (!datosCargados) return <p>Cargando ubicaciones...</p>;

  return (
    <div className="bodyUbicaciones">
      <div className="capa-lugares" />

      <header className="headerIndex">
        <NavBar />
      </header>

      <div className="carrusel">
        {ubicaciones.length > 0 && (
          <div
            className={`fondo-animado ${animacionFondo}`}
            style={{ backgroundImage: `url(${ubicaciones[indiceActual]?.portada})` }}
          />
        )}

        <main className="mainLugares">
          <div className="seccion izquierda-lugares">
            <div className="texto-ubicacion">
              
              <h1 className={`texto-animado titulo ${indiceActual % 2 === 0 ? 't1' : 't2'}`}>{ubicaciones[indiceActual].nombre}</h1>
              <p className={`texto-animado descripcion ${indiceActual % 2 === 0 ? 't1' : 't2'}`}>{ubicaciones[indiceActual].descripcion}</p>

            </div>
          </div>

          <div className="seccion derecha-lugares">
            <div className="contenedor-imagen-boton">
              {/* <img
                className={`siguiente-imagen ${animacionImagen}`}
                src={ubicaciones[(indiceActual + 1) % ubicaciones.length].portada}
                alt="Siguiente ubicación"
              /> */}
              <button className="next-btn" onClick={siguienteUbicacion}>
                Siguiente
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Ubicaciones_content;

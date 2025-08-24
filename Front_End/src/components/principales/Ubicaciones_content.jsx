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
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  const [inicioScroll, setInicioScroll] = useState(0);
  const thumbnailsVisibles = 3;


  const subir = () => {
    const nuevoInicio = (inicioScroll - 1 + ubicaciones.length) % ubicaciones.length;
    setInicioScroll(nuevoInicio);
  };

  const bajar = () => {
    const nuevoInicio = (inicioScroll + 1) % ubicaciones.length;
    setInicioScroll(nuevoInicio);
  };



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
              {/* Si dejas algo más aquí */}
            </div>
          </div>

          {/* Botón y Sidebar independientes */}
          <button className="toggle-sidebar" onClick={() => setSidebarAbierto(!sidebarAbierto)}>
            ☰
          </button>

          <div className={`sidebar ${sidebarAbierto ? "abierta" : ""}`}>
            <button onClick={subir} className="flecha-scroll">▲</button>

            {ubicaciones
              .slice(inicioScroll, inicioScroll + thumbnailsVisibles)
              .map((ubicacion, index) => (
                <div
                  key={inicioScroll + index}
                  className="thumbnail-wrapper"
                  onClick={() => setIndiceActual(inicioScroll + index)}
                >
                  <div
                    className={`thumbnail ${indiceActual === inicioScroll + index ? "activo" : ""}`}
                    style={{ backgroundImage: `url(${ubicacion.portada})` }}
                  />
                  <span className="thumbnail-label">{ubicacion.nombre}</span>
                </div>
              ))}

            <button onClick={bajar} className="flecha-scroll">▼</button>
          </div>




        </main>
      </div>
    </div>
  );
}

export default Ubicaciones_content;

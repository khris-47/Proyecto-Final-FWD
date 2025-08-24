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
  const [overlayColor, setOverlayColor] = useState('black'); // 'black' o 'white'
  
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


  // Cambia el color de la capa entre negro y blanco
  const toggleOverlayColor = () => {
    setOverlayColor(prev => prev === 'black' ? 'white' : 'black');
  };

  useEffect(() => {
    document.body.classList.toggle('modo-blanco', overlayColor === 'white');
    document.body.classList.toggle('modo-negro', overlayColor === 'black');
    return () => {
      document.body.classList.remove('modo-blanco');
      document.body.classList.remove('modo-negro');
    };
  }, [overlayColor]);

  if (!datosCargados) return <p>Cargando ubicaciones...</p>;


  return (
    <div className="bodyUbicaciones">
      {/* Capa de color sobre la imagen de fondo */}
      <div
        className="overlay-bg"
        style={{
          background: overlayColor === 'black'
            ? 'rgba(0,0,0,0.6)'
            : 'rgba(255,255,255,0.15)'
        }}
      />
      <div className="capa-lugares" />


      <header className="headerIndex">
          <NavBar onToggleOverlayColor={toggleOverlayColor} overlayColor={overlayColor} />
     
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


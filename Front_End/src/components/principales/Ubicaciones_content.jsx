import { useState, useEffect } from "react";
import '../../styles/ubicaciones.css'
import NavBar from '../navegacion/navBar'

function Ubicaciones_content() {

  const [ubicaciones, setUbicaciones] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [animacionFondo, setAnimacionFondo] = useState("fondo-entrando");
  const [animacionImagen, setAnimacionImagen] = useState("entrando");
  const [datosCargados, setDatosCargados] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/listUbicaciones/')
      .then(response => response.json())
      .then(data => {
        // Ajustamos la estructura de los datos para asegurar que la propiedad 'portada' esté correcta
        const ubicacionesFormateadas = data.map(item => ({
          ...item,
          portada: item.portada_url
        }));

        setUbicaciones(ubicacionesFormateadas);
        setDatosCargados(true);

        // Asegurar que la primera ubicación se muestre correctamente al cargar los datos
        if (ubicacionesFormateadas.length > 0) {
          setIndiceActual(0);
          setAnimacionFondo("fondo-entrando");
          setAnimacionImagen("entrando");
        }
      })
      .catch(error => console.error('Error al cargar las ubicaciones:', error));
  }, []);



  const siguienteUbicacion = () => {
    setAnimacionFondo("fondo-saliendo");
    setAnimacionImagen("saliendo");

    setTimeout(() => {
      const nuevoIndice = (indiceActual + 1) % ubicaciones.length;

      setIndiceActual(nuevoIndice);

      // Si volvemos al índice 0, reiniciamos las animaciones de manera manual
      if (nuevoIndice === 0) {
        setTimeout(() => {
          setAnimacionFondo("fondo-entrando");
          setAnimacionImagen("entrando");
        }, 100); // Le damos un pequeño delay para asegurar que las animaciones se reinicien correctamente
      } else {
        setAnimacionFondo("fondo-entrando");
        setAnimacionImagen("entrando");
      }
    }, 700);
  };


  if (!datosCargados) return <p>Cargando ubicaciones...</p>;

  return (

    <div className="bodyUbicaciones">

      <div className="capa-lugares"></div>

      <header className='headerIndex'>
        <NavBar />
      </header>


      <div className="carrusel">

        {ubicaciones.length > 0 && (
          <div className={`fondo-animado ${animacionFondo}`} style={{ backgroundImage: `url(${ubicaciones[indiceActual]?.portada})` }}></div>
        )}

        <main className="mainLugares">

          {/* Sección del texto alineado a la izquierda */}
          <div className="seccion izquierda-lugares">
            <div className="texto-ubicacion">
              <h1>{ubicaciones[indiceActual].nombre}</h1>
              <p>{ubicaciones[indiceActual].descripcion}</p>
            </div>
          </div>

          {/* Botón e imagen del siguiente elemento */}
          <div className="seccion derecha-lugares">
            <div className="contenedor-imagen-boton">
              <img className={`siguiente-imagen ${animacionImagen}`} src={ubicaciones[(indiceActual + 1) % ubicaciones.length].portada} alt="Siguiente ubicación" />
              <button className="next-btn" onClick={siguienteUbicacion}>Siguiente</button>
            </div>
          </div>

        </main>


      </div>
    </div>

  )

}

export default Ubicaciones_content
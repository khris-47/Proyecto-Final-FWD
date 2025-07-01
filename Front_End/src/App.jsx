import Routing from './routes/Routing';
import { useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'boxicons';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'sweetalert2/dist/sweetalert2.min.css';
import { getVisitorId } from './utils/fingerprint';

import { AuthProvider } from './components/navegacion/AuthContext';

function App() {
  const visitorIdRef = useRef(null);

  useEffect(() => {
    const initVisitor = async () => {
      if (!visitorIdRef.current) {
        const id = await getVisitorId();

        // Guardar en memoria
        visitorIdRef.current = id;
      }
    };

    initVisitor();
  }, []);

  return (
    <AuthProvider>
      <Routing ></Routing>
    </AuthProvider>
  )
}

export default App

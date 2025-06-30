import Routing from './routes/Routing';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'boxicons';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'sweetalert2/dist/sweetalert2.min.css'

import { AuthProvider } from './components/navegacion/AuthContext';

function App() {

  return (
    <AuthProvider>
      <Routing ></Routing>
    </AuthProvider>
  )
}

export default App

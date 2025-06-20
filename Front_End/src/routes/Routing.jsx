import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import RutasPrivadas from '../components/navegacion/RutasPrivadas'


import Index from '../pages/principales/index'                          // publica
import Quienes_somos from '../pages/principales/quienes_somos'          // publica
import Contacto from '../pages/principales/Contacto'                    // publica
import Login from '../pages/principales/Login'                        // publica 
import Mi_Perfil from '../pages/registros/Mi_Perfil'                  // usuario logueado
import M_Admin from '../pages/menus/M_Admin'                         // admin
import Lista_Usuarios from '../pages/registros/Lista_Usuarios'      // admin
import Aud_Usuarios from '../pages/auditorias/Aud_Usuarios'          // admin
import Aud_Cuentos from '../pages/auditorias/Aud_Cuentos'           // admin
import Aud_Entrevistas from '../pages/auditorias/Aud_Entrevistas'   // dmin
import Reg_Entrevistas from '../pages/registros/Reg_Entrevistas'  // admin
import Reg_Cuentos from '../pages/registros/Reg_Cuentos'          // admin
import Reg_Ubicaciones from '../pages/registros/Reg_Ubicaciones' // admin
import Entrevistas from '../pages/principales/Entrevistas'      // publica
import Cuentos from '../pages/principales/Cuentos'              // publica
import Lugares from '../pages/principales/Lugares'              // publica


function Routing() {
  return (
    <Router>
      <Routes>

        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/index" />} />

        {/* Rutas públicas */}
        <Route path="/index" element={<Index />} />
        <Route path="/about" element={<Quienes_somos />} />
        <Route path="/contact" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/entrevistas" element={<Entrevistas />} />
        <Route path="/cuentos" element={<Cuentos />} />
        <Route path="/lugares" element={<Lugares />} />

        {/* Usuario logueado */}
        <Route path="/perfil" element={<RutasPrivadas><Mi_Perfil /></RutasPrivadas>} />

        {/* Rutas admin */}
        <Route path="/admin" element={<RutasPrivadas requiereAdmin={true}><M_Admin /></RutasPrivadas>} />
        <Route path="/list_user" element={<RutasPrivadas requiereAdmin={true}><Lista_Usuarios /></RutasPrivadas>} />
        <Route path="/aud_user" element={<RutasPrivadas requiereAdmin={true}><Aud_Usuarios /></RutasPrivadas>} />
        <Route path="/aud_cuentos" element={<RutasPrivadas requiereAdmin={true}><Aud_Cuentos /></RutasPrivadas>} />
        <Route path="/aud_entrevistas" element={<RutasPrivadas requiereAdmin={true}><Aud_Entrevistas /></RutasPrivadas>} />
        <Route path="/reg_entrevistas" element={<RutasPrivadas requiereAdmin={true}><Reg_Entrevistas /></RutasPrivadas>} />
        <Route path="/reg_cuentos" element={<RutasPrivadas requiereAdmin={true}><Reg_Cuentos /></RutasPrivadas>} />
        <Route path="/reg_ubicaciones" element={<RutasPrivadas requiereAdmin={true}><Reg_Ubicaciones /></RutasPrivadas>} />


      </Routes>
    </Router>
  )
}

export default Routing
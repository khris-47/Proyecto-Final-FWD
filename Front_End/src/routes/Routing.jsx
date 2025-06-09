import React from 'react'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'

import Index from '../pages/principales/index'
import M_Juegos from '../pages/menus/M_Juegos'
import Juego01 from '../pages/juegos/Juego01'
import Juego02 from '../pages/juegos/Juego02'
import Juego03 from '../pages/juegos/Juego03'
import Quienes_somos from '../pages/principales/quienes_somos'
import Contacto from '../pages/principales/Contacto'
import Login from '../pages/principales/Login'
import Mi_Perfil from '../pages/registros/Mi_Perfil'
import M_Admin from '../pages/menus/M_Admin'
import Lista_Usuarios from '../pages/registros/Lista_Usuarios'
import Aud_Usuarios from '../pages/registros/Aud_Usuarios'
import Aud_Cuentos from '../pages/registros/Aud_Cuentos'
import Aud_Entrevistas from '../pages/registros/Aud_Entrevistas'
import Reg_Entrevistas from '../pages/registros/Reg_Entrevistas'
import Reg_Cuentos from '../pages/registros/Reg_Cuentos'
import Reg_Ubicaciones from '../pages/registros/Reg_Ubicaciones'
import Entrevistas from '../pages/principales/Entrevistas'
import Cuentos from '../pages/principales/Cuentos'


function Routing() {
  return (
    <Router>
        <Routes>
        <Route path="/" element={<Navigate to="/index" />} />
            <Route path='/index' element={<Index/>}></Route>
            <Route path='/menu_juegos' element={<M_Juegos/>}></Route>
            <Route path='/juego01' element={<Juego01/>}></Route>
            <Route path='/juego02' element={<Juego02/>}></Route>
            <Route path='/juego03' element={<Juego03/>}></Route>
            <Route path='/about' element={<Quienes_somos/>}></Route>
            <Route path='/contact' element={<Contacto/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/perfil' element={<Mi_Perfil/>}></Route>
            <Route path='/admin' element={<M_Admin/>}></Route>
            <Route path='/list_user' element={<Lista_Usuarios/>}></Route>
            <Route path='/aud_user' element={<Aud_Usuarios/>}></Route>
            <Route path='/aud_cuentos' element={<Aud_Cuentos/>}></Route>
            <Route path='/aud_entrevistas' element={<Aud_Entrevistas/>}></Route>
            <Route path='/reg_entrevistas' element={<Reg_Entrevistas/>}></Route>
            <Route path='/reg_cuentos' element={<Reg_Cuentos/>}></Route>
            <Route path='/reg_ubicaciones' element={<Reg_Ubicaciones/>}></Route>
            <Route path='/entrevistas' element={<Entrevistas/>}></Route>
            <Route path='/cuentos' element={<Cuentos/>}></Route>
        </Routes>
    </Router>
  )
}

export default Routing
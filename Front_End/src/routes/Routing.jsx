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
        </Routes>
    </Router>
  )
}

export default Routing
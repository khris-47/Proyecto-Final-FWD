import React from 'react'

import Ucr from '../../assets/img/logos/UCR.png';
import Tcu from '../../assets/img/logos/TC-782.png';
import Srp from '../../assets/img/logos/SRP.png';

import '../../styles/footer.css'

function Footer() {
  return (
    <div>

      <footer className='footer'>
        <div className='left'>

          {/* Logo de youtube */}
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 256 256">
            <g fill="#ffffff">
              <g transform="scale(4,4)">
                <path d="M53.527,17.427c2.187,2.25 2.473,5.825 2.473,14.573c0,8.748 -0.286,12.323 -2.473,14.573c-2.187,2.249 -4.465,2.427 -21.527,2.427c-17.062,0 -19.34,-0.178 -21.527,-2.427c-2.187,-2.25 -2.473,-5.825 -2.473,-14.573c0,-8.748 0.286,-12.323 2.473,-14.573c2.187,-2.25 4.465,-2.427 21.527,-2.427c17.062,0 19.34,0.178 21.527,2.427zM27.95,39.417l12.146,-7.038l-12.146,-6.928z"></path>
              </g>
            </g>
          </svg>

          {/* logo de facebook  */}
          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="40" viewBox="0 0 256 256">
            <g fill="#ffffff">
              <g transform="scale(5.12,5.12)">
                <path d="M25,2c-12.682,0 -23,10.317 -23,23c0,12.683 10.318,23 23,23c12.683,0 23,-10.317 23,-23c0,-12.683 -10.317,-23 -23,-23zM32,16h-3.29c-1.938,0 -2.71,0.455 -2.71,1.806v3.194h6l-1,5h-5v13h-6v-13h-3v-5h3v-2.774c0,-4.225 1.686,-7.226 6.581,-7.226c2.622,0 5.419,1 5.419,1z"></path>
              </g>
            </g>
          </svg>

          {/* logo de instagram  */}
          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="50" viewBox="0 0 256 256">
            <g fill="#ffffff">
              <g transform="scale(5.12,5.12)">
                <path d="M16,3c-7.17,0 -13,5.83 -13,13v18c0,7.17 5.83,13 13,13h18c7.17,0 13,-5.83 13,-13v-18c0,-7.17 -5.83,-13 -13,-13zM37,11c1.1,0 2,0.9 2,2c0,1.1 -0.9,2 -2,2c-1.1,0 -2,-0.9 -2,-2c0,-1.1 0.9,-2 2,-2zM25,14c6.07,0 11,4.93 11,11c0,6.07 -4.93,11 -11,11c-6.07,0 -11,-4.93 -11,-11c0,-6.07 4.93,-11 11,-11zM25,16c-4.96,0 -9,4.04 -9,9c0,4.96 4.04,9 9,9c4.96,0 9,-4.04 9,-9c0,-4.96 -4.04,-9 -9,-9z"></path>
              </g>
            </g>
          </svg>


        </div>

        <div className='right'>

          <a href="https://www.youtube.com/@EntreOlasYManglares"><img src={Ucr} alt="" /></a>
          

          <img src={Srp} alt="" />

          <img src={Tcu} alt="" />

        </div>
      </footer>

    </div>
  )
}

export default Footer
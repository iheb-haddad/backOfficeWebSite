import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRightFromBracket ,faPlay ,faX} from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import {DocFormAjout } from '../index';
import './Navbar.css'
function Navbar(props) {
    const [isClickedDoc, setIsClickedDoc] = useState(false);
    const [isClickedAlert, setIsClickedAlert] = useState(false);

  return (
  <div style={{display:"flex"}}>
    <div className="navbar">
        <div className="head">
        <div className="croix"><FontAwesomeIcon icon={faX} style={{cursor:'pointer'}} onClick={props.showNavbar}/></div>
        </div>
        <div className="navbarBody">
        </div>      
    </div>
    <div className="blur-overlay"></div>
  </div>
  )
}

export default Navbar
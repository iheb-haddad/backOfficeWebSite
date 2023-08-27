import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse ,faX , faTableColumns,faGear ,faUser} from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import {DocFormAjout } from '../index';
import './Navbar.css'
function Navbar(props) {

  return (
  <div style={{display:"flex"}}>
    <div className="navbar">
        <div className="head"> 
          <img src="./logo2.png" alt="" />
          {/* <div className="croix"><FontAwesomeIcon icon={faX} style={{cursor:'pointer'}} onClick={props.showNavbar}/></div> */}
        </div>
        <div className="navbarBody">
        <div className={`navLine ${props.navLineClicked === 'home' ? 'navClicked' : 'notClicked'}`} onClick={props.clickHome}>
            <FontAwesomeIcon icon={faHouse} />
            <div className="title" >Accueil</div>
        </div>
        <div className={`navLine ${props.navLineClicked === 'dashboard' ? 'navClicked' : 'notClicked'}`} onClick={props.clickDashboard}>
            <FontAwesomeIcon icon={faTableColumns} />
            <div className="title" >Dashboard</div>
        </div>
        <div className={`navLine ${props.navLineClicked === 'profile' ? 'navClicked' : 'notClicked'}`} onClick={props.clickProfile}>
            <FontAwesomeIcon icon={faUser} />
            <div className="title" >Gestiond de profil</div>
        </div>
        <div className={`navLine ${props.navLineClicked === 'settings' ? 'navClicked' : 'notClicked'}`} onClick={props.clickSettings}>
            <FontAwesomeIcon icon={faGear} />
            <div className="title" >Configurations</div>
        </div>
        </div>      
    </div>
    <div className="blur-overlay" onClick={props.showNavbar}></div>
  </div>
  )
}

export default Navbar
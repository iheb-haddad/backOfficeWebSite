import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse ,faTableColumns,faGear ,faUser} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import './Navbar.css'
import { Link } from 'react-router-dom';
function Navbar(props) {

  return (
  <div style={{display:"flex"}}>
    <div className="navbar">
        <div className="head"> 
          <img src="./logo2.png" alt="" />
          {/* <div className="croix"><FontAwesomeIcon icon={faX} style={{cursor:'pointer'}} onClick={props.showNavbar}/></div> */}
        </div>
        <div className="navbarBody">
            <Link to="/" className={`navLine ${props.navLineClicked === 'home' ? 'navClicked' : 'notClicked'}`} onClick={props.clickHome}>
                    <FontAwesomeIcon icon={faHouse} />
                    <div className="title" >Tableau de bord</div>
            </Link>
            <Link to="/GestionMapping" className={`navLine ${props.navLineClicked === 'dashboard' ? 'navClicked' : 'notClicked'}`} onClick={props.clickDashboard}>
                    <FontAwesomeIcon icon={faTableColumns} />
                    <div className="title" >Gestion de mapping</div>
            </Link>
            <Link to="/Profile" className={`navLine ${props.navLineClicked === 'profile' ? 'navClicked' : 'notClicked'}`} onClick={props.clickProfile}>
                <FontAwesomeIcon icon={faUser} />
                <div className="title" >Gestion de profil</div>
            </Link>
            <Link to="/Configurations" className={`navLine ${props.navLineClicked === 'settings' ? 'navClicked' : 'notClicked'}`} onClick={props.clickSettings}>
                <FontAwesomeIcon icon={faGear} />
                <div className="title" >Configuration</div>
            </Link>
            <Link to="/GestionSources" className={`navLine ${props.navLineClicked === 'sources' ? 'navClicked' : 'notClicked'}`} onClick={props.clickSources}>
                <FontAwesomeIcon icon={faGear} />
                <div className="title" >Gestion des sources</div>
            </Link>
            <Link to="/GestionDocuments" className={`navLine ${props.navLineClicked === 'documents' ? 'navClicked' : 'notClicked'}`} onClick={props.clickDocuments}>
                <FontAwesomeIcon icon={faGear} />
                <div className="title" >Gestion des documents/Notes</div>
            </Link>
        </div>      
    </div>
    <div className="blur-overlay" onClick={props.showNavbar}></div>
  </div>
  )
}

export default Navbar
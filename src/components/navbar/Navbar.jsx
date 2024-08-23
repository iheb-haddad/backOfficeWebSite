import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse ,faTableColumns,faGear ,faUser} from '@fortawesome/free-solid-svg-icons';
import React, { useEffect } from 'react';
import './Navbar.css'
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useStore from '../../globalState/UseStore';
import { use } from 'i18next';
function Navbar(props) {
  const {navLineClicked , auth} = useAuth();
  const { projects , fetchProjects } = useStore();
  useEffect(() => {
    const user = auth?.user?._id || '';
    fetchProjects(user);
  },[]);

  return (
  <div style={{display:"flex"}}>
    <div className="navbar">
        <div className="head"> 
          <img src="../../../public/logo2.png" alt="" />
          {/* <div className="croix"><FontAwesomeIcon icon={faX} style={{cursor:'pointer'}} onClick={props.showNavbar}/></div> */}
        </div>
        <div className="navbarBody">
            <Link to="/" className={`navLine ${navLineClicked === 'home' ? 'navClicked' : 'notClicked'}`} onClick={props.clickHome}>
                    <FontAwesomeIcon icon={faHouse} />
                    <div className="title" >Tableau de bord</div>
            </Link>
            <Link to="/GestionMapping" className={`navLine ${navLineClicked === 'mappings' ? 'navClicked' : 'notClicked'}`} onClick={props.clickMappings}>
                    <FontAwesomeIcon icon={faTableColumns} />
                    <div className="title" >Gestion de mapping</div>
            </Link>
            {(auth?.user?.role === 'admin' || projects.length > 0 ) &&<Link to="/Configurations" className={`navLine ${navLineClicked === 'settings' ? 'navClicked' : 'notClicked'}`} onClick={props.clickSettings}>
                <FontAwesomeIcon icon={faGear} />
                <div className="title" >Configuration</div>
            </Link>}
            <Link to="/GestionSources" className={`navLine ${navLineClicked === 'sources' ? 'navClicked' : 'notClicked'}`} onClick={props.clickSources}>
                <FontAwesomeIcon icon={faGear} />
                <div className="title" >Gestion des sources</div>
            </Link>
            <Link to="/GestionDocuments" className={`navLine ${navLineClicked === 'documents' ? 'navClicked' : 'notClicked'}`} onClick={props.clickDocuments}>
                <FontAwesomeIcon icon={faGear} />
                <div className="title" >Gestion des documents/Notes</div>
            </Link>
            {(auth?.user?.role === 'admin' || projects.length > 0 ) && <Link to="/GestionProjects" className={`navLine ${navLineClicked === 'projects' ? 'navClicked' : 'notClicked'}`} onClick={props.clickProjects}>
                <FontAwesomeIcon icon={faGear} />
                <div className="title" >Gestion des projets</div>
            </Link>
            }
            {<Link to="/GestionComptes" className={`navLine ${navLineClicked === 'users' ? 'navClicked' : 'notClicked'}`} onClick={props.clickUsers}>
                <FontAwesomeIcon icon={faUser} />
                <div className="title" >{`Gestion ${(auth?.user?.role === 'admin' || projects.length > 0 ) ? "des comptes" : "de compte"}`}</div>
            </Link>
            }
        </div>      
    </div>
    <div className="blur-overlay" onClick={props.showNavbar}></div>
  </div>
  )
}

export default Navbar
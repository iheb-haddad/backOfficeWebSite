import React , {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown,faChevronUp,faBars,faRightFromBracket} from '@fortawesome/free-solid-svg-icons';
import { Outlet} from "react-router-dom";
import './Body.css';

function Body(props) {
  const userConnected = JSON.parse(localStorage.getItem('userConnected'));
  const [isDeconnecting,setIsDeconnecting] = useState(false)
  const handleDeconnect = () => {
    props.setConnectValide(false)
    props.setSessionValide(false)
    localStorage.setItem('connectValide', false);
    sessionStorage.setItem('connectValide', false);
  }
  return (
    <div className="body">
          <div className="headBody">
            {props.screenWidth < 1160 && <FontAwesomeIcon icon={faBars} onClick={props.showNavbar} className='barIcon'/>}
            <div className="user">
              <div className="rounded-image" onClick={props.clickProfile}>
                <img src="./profilAvatar.png"alt="" />
              </div>
              <span className="username" onClick={() => setIsDeconnecting(prev => !prev)}>
                {userConnected.username}
                {isDeconnecting ? <FontAwesomeIcon icon={faChevronUp} style={{marginLeft:'5px'}} /> : <FontAwesomeIcon icon={faChevronDown} style={{marginLeft:'5px'}}/>}</span>
              <div className="deconnectionBox" style={{display: !isDeconnecting && 'none'}} onClick={handleDeconnect}>Deconnection <FontAwesomeIcon className='deconnectIcon' icon={faRightFromBracket} /></div>
            </div>
          </div>               
        <Outlet />
    </div>
  )
}

export default Body
import React , {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown,faChevronUp,faBars,faRightFromBracket} from '@fortawesome/free-solid-svg-icons';
import { Outlet} from "react-router-dom";
import './Body.css';
import { useNavigate } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';
import useAuth from '../../hooks/useAuth';
import useRessources from '../../hooks/useRessources';

function Body(props) {
  const [isDeconnecting,setIsDeconnecting] = useState(false)
  const { auth , liveConfiguration } = useAuth();
  const { confSelected } = useRessources();

  const navigate = useNavigate();
  const logout = useLogout();

  const signOut = async () => {
      navigate('/login');
      await logout(); 
  }
  
  return (
    <div className="body" style={{ marginLeft : liveConfiguration && "0" , marginRight : liveConfiguration && confSelected.panelWidth }}>
          <div className="headBody">
            {props.screenWidth < 1160 && <FontAwesomeIcon icon={faBars} onClick={props.showNavbar} className='barIcon'/>}
            <div className="user">
              <div className="rounded-image" onClick={props.clickProfile}>
                <img src="../../public/profilAvatar.png"alt="" />
              </div>
              <span className="username" onClick={() => setIsDeconnecting(prev => !prev)}>
                {auth?.user?.username}
                {isDeconnecting ? <FontAwesomeIcon icon={faChevronUp} style={{marginLeft:'5px'}} /> : <FontAwesomeIcon icon={faChevronDown} style={{marginLeft:'5px'}}/>}</span>
              <div className="deconnectionBox" style={{display: !isDeconnecting && 'none'}} onClick={signOut}>Deconnection <FontAwesomeIcon className='deconnectIcon' icon={faRightFromBracket} /></div>
            </div>
          </div>               
        <Outlet />
    </div>
  )
}

export default Body
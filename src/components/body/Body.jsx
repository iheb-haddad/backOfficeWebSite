import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight,faBars} from '@fortawesome/free-solid-svg-icons';
import './Body.css';

function Body(props) {
    
  return (
    <div className="body">
          <div className="headBody">
            {props.screenWidth < 850 && <FontAwesomeIcon icon={faBars} onClick={props.showNavbar} style={{fontSize:"1.8rem",color:"black" ,cursor:"pointer"} }/>}
            <div className="user">
              <div className="rounded-image">
                <img src="./profilAvatar.png"alt="" />
              </div>
              <span className="username">{props.username}</span>
            </div>
          </div>               
        {props.componentCharged}
    </div>
  )
}

export default Body
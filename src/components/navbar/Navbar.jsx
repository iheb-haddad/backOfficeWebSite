import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRightFromBracket ,faPlay ,faX} from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import {DocFormAjout } from '../index';
import './Navbar.css'
function Navbar(props) {
    const [isClickedDoc, setIsClickedDoc] = useState(false);
    const [isClickedAlert, setIsClickedAlert] = useState(false);
    const handleClickDoc = (doc) => {
        isClickedDoc? props.setPathname('') : props.setPathname('Documents')
        setIsClickedDoc(prev => !prev)
        setIsClickedAlert(false)
    };
    const handleClickAlert = (doc) => {
        isClickedAlert? props.setPathname('') : props.setPathname('Instructions et Alertes')
        setIsClickedAlert(prev => !prev)
        setIsClickedDoc(false)
    };

    const handleChargeAddDoc = () => {
        props.handleChargeComponent(<DocFormAjout/>)
        props.showNavbar();
    }
    const handleChargeAddAlert = () => {
        props.handleChargeComponent(<AlertFormAjout/>)
        props.showNavbar();
    }
    const handleChargeDelDoc = () => {
        props.handleChargeComponent(<DocFormSupp/>)
        props.showNavbar();
    }
    const handleChargeDelAlert = () => {
        props.handleChargeComponent(<AlertFormSupp/>)
        props.showNavbar();
    }
  return (
  <div style={{display:"flex"}}>
    <div className="navbar">
        <div className="head">
        </div>
        <div className="navbarBody">
        </div>      
    </div>
    <div className="blur-overlay"></div>
  </div>
  )
}

export default Navbar
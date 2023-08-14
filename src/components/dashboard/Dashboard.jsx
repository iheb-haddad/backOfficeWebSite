import React, { useState } from 'react'
import "./Dashboard.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFileCirclePlus, faUpload, faFilter } from '@fortawesome/free-solid-svg-icons';

const Dashboard = (props) => {
    const [motCle ,setMotCle] = useState("")
    const handleInputSearch = (event) => {
        setMotCle(event.target.value);
      };
  return (
    <div>
        <div className="buttonsBox">
            <button className="back" onClick={props.clickBackbtn}  style={{display:!props.displayBackbtn && "none"}}><FontAwesomeIcon icon={faArrowLeft}/></button>
            <button className={props.addbtnIsClicked ? "addbtn clicked" : "addbtn"} onClick={props.clickAddbtn}><FontAwesomeIcon icon={faFileCirclePlus} /><span>Add</span></button>
            <button className="uploadbtn"><FontAwesomeIcon icon={faUpload} /><span>Upload</span></button>
            <button className="filterbtn"><FontAwesomeIcon icon={faFilter} /><span>Filter</span></button>
            <input type='text' placeholder='Chercher avec le titre ...' value={motCle} onChange={handleInputSearch} className={motCle ? 'active-input' : ''}/>
        </div>
        {props.componentCharged}
    </div>
  )
}

export default Dashboard
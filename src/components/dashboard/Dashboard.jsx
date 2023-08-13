import React from 'react'
import "./Dashboard.css"

const Dashboard = (props) => {
  return (
    <div>
        <div className="buttonsBox">
            <button className="back"><FontAwesomeIcon icon={faArrowLeft} /></button>
            <button className="addbtn"><FontAwesomeIcon icon={faFileCirclePlus} />Ajouter</button>
            <button className="uploadbtn"><FontAwesomeIcon icon={faUpload} />Importer</button>
            <button className="filterbtn"><FontAwesomeIcon icon={faFilter} />Filter</button>
        </div>
        {props.componentCharged}
    </div>
  )
}

export default Dashboard
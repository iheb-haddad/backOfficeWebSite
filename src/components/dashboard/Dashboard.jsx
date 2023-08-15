import React, { useState ,useEffect} from 'react'
import "./Dashboard.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFileCirclePlus, faUpload, faFilter } from '@fortawesome/free-solid-svg-icons';

const Dashboard = (props) => {
    const [motCle ,setMotCle] = useState("")
    const handleInputSearch = (event) => {
        setMotCle(event.target.value);
      };

    const handleTypeChange = (event) => {
      props.setFilterParameters((prevData) => ({
          ...prevData,
          selectedType: event.target.value,
        }));
      };
    const handleLanguageChange = (event) => {
      props.setFilterParameters((prevData) => ({
          ...prevData,
          selectedLanguage: event.target.value,
        }));
      };
      const handleAppChange = (event) => {
        props.setFilterParameters((prevData) => ({
            ...prevData,
            selectedApp: event.target.value,
          }));
        };

        const [webApplications ,setWebApplications] = useState([])
        useEffect(() => {
          fetch('https://urlsjsonserver-p2nq.onrender.com/webApplications')
            .then((response) => response.json())
            .then((data) => {
              setWebApplications(data) 
                })
            .catch((error) => {
              console.error('Error fetching documents:', error);
            });
  
        }, []);
  return (
    <div>
        <div className="buttonsBox">
            <button className="back" onClick={props.clickBackbtn}  style={{display:!props.displayBackbtn && "none"}}><FontAwesomeIcon icon={faArrowLeft}/></button>
            <button className={props.addbtnIsClicked ? "addbtn clicked" : "addbtn"} onClick={props.clickAddbtn}><FontAwesomeIcon icon={faFileCirclePlus} /><span>Add</span></button>
            <button className="uploadbtn"><FontAwesomeIcon icon={faUpload} /><span>Upload</span></button>
            <button className={props.filterbtnIsClicked ? "filterbtn clicked" : "filterbtn"} onClick={props.clickFilterbtn}><FontAwesomeIcon icon={faFilter} /><span>Filter</span></button>
            <input type='text' placeholder='Chercher avec le titre ...' value={motCle} onChange={handleInputSearch} className={motCle ? 'active-input' : ''}/>
        </div>
        <div className="filterBox" style={{display:props.filterbtnIsClicked ? "block" : "none"}}>
          <select name="type" id="selectType" value={props.filterParameters.selectedType} onChange={handleTypeChange}>
            <option value="tout" >tout</option>
            <option value="document" >document</option>
            <option value="instruction" >instruction</option>
            <option value="alerte" >alerte</option>
          </select>
          <select name="language" id="selectLanguage" value={props.filterParameters.selectedLanguage} onChange={handleLanguageChange}>
            <option value="tout" >tout</option>
            <option value="francais" >francais</option>
            <option value="anglais" >anglais</option>
          </select>
          <select name="app" id="selectApp" value={props.filterParameters.selectedApp} onChange={handleAppChange}>
              <option value="tout">tout</option>
              {webApplications.map((app) =>(
                  <option key={app.id} value={app.url}>{app.nom}</option>
                 ))}
          </select>
        </div>
        {props.componentCharged}
    </div>
  )
}

export default Dashboard
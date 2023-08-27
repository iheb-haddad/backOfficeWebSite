import React, { useState ,useEffect} from 'react'
import "./Dashboard.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFileCirclePlus, faUpload, faFilter } from '@fortawesome/free-solid-svg-icons';
import {DocFormAjout ,DocsList ,UploadPage} from '../index';

const Dashboard = () => {
    const [motCle ,setMotCle] = useState("")
    const handleInputSearch = (event) => {
      setFilterParameters((prevData) => ({
        ...prevData,
        titleSearched : event.target.value,
      }));
      };

    const handleTypeChange = (event) => {
      setFilterParameters((prevData) => ({
          ...prevData,
          selectedType: event.target.value,
        }));
      };
    const handleLanguageChange = (event) => {
      setFilterParameters((prevData) => ({
          ...prevData,
          selectedLanguage: event.target.value,
        }));
      };
      const handleAppChange = (event) => {
        setFilterParameters((prevData) => ({
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

        const initialFilterParameteres = {
          selectedType : 'tout',
          selectedLanguage : 'tout',
          selectedApp : 'tout',
          titleSearched : ''
        }
        const [filterParameters, setFilterParameters] = useState(initialFilterParameteres);
        const [componentCharged , setComponentCharged] = useState(<DocsList filterParameters={filterParameters} />);
        const [displayBackbtn , setDisplayBackbtn] = useState(false);
        const [addbtnIsClicked , setAddbtnIsClicked] = useState(false);
        const [filterbtnIsClicked , setFilterbtnIsClicked] = useState(false);
        const [uploadbtnIsClicked , setUploadbtnIsClicked] = useState(false);

        const clickAddbtn = () => { 
          setComponentCharged(<DocFormAjout/>)
          setAddbtnIsClicked(true)
          setDisplayBackbtn(true)
          setFilterbtnIsClicked(false)
          setUploadbtnIsClicked(false)
        };
        const clickFilterbtn = () => { 
          setComponentCharged(<DocsList filterParameters={filterParameters} />)
          setAddbtnIsClicked(false)
          setDisplayBackbtn(false)
          filterbtnIsClicked && setFilterParameters(initialFilterParameteres)
          setFilterbtnIsClicked(prev => !prev)
          setUploadbtnIsClicked(false)
        };
        const clickBackbtn = () => { 
          setComponentCharged(<DocsList filterParameters={filterParameters}/>)
          setAddbtnIsClicked(false)
          setDisplayBackbtn(false)
          setFilterbtnIsClicked(false)
          setUploadbtnIsClicked(false)
        };
        const clickUploadbtn = () => { 
          setComponentCharged(<UploadPage />)
          setAddbtnIsClicked(false)
          setDisplayBackbtn(true)
          setFilterbtnIsClicked(false)
          setUploadbtnIsClicked(true)
        };
      
        useEffect(() =>{
          setComponentCharged(<DocsList filterParameters={filterParameters} webApplications={webApplications}/>) 
        },[filterParameters]);
  return (
    <div style={{backgroundColor:'white' , height:'90vh'}}>
        <div className="buttonsBox" >
            <div>
            <button className="back" onClick={clickBackbtn}  style={{display:!displayBackbtn && "none"}}><FontAwesomeIcon icon={faArrowLeft}/></button>
            <button className={addbtnIsClicked ? "addbtn clicked" : "addbtn"} onClick={clickAddbtn}><FontAwesomeIcon icon={faFileCirclePlus} /><span>Ajouter</span></button>
            <button className={uploadbtnIsClicked ? "uploadbtn clicked" : "uploadbtn"} onClick={clickUploadbtn}><FontAwesomeIcon icon={faUpload} /><span>Importer</span></button>
            </div>
            <div>
            <button className={filterbtnIsClicked ? "filterbtn clicked" : "filterbtn"} onClick={clickFilterbtn}><FontAwesomeIcon icon={faFilter} /><span>Filter</span></button>
            <input type='text' placeholder='Chercher avec le titre ...' value={filterParameters.titleSearched} onChange={handleInputSearch}/>
            </div>
        </div>
        <div className="filterBox" style={{display:filterbtnIsClicked ? "block" : "none"}}>
          <select name="type" id="selectType"  value={filterParameters.selectedType} onChange={handleTypeChange}>
            <option value="tout" disabled hidden >Type</option>
            <option value="tout" >tout</option>
            <option value="document" >document</option>
            <option value="instruction" >instruction</option>
            <option value="alerte" >alerte</option>
          </select>
          <select name="language" id="selectLanguage" value={filterParameters.selectedLanguage} onChange={handleLanguageChange}>
            <option value="tout" disabled hidden >Langue</option>
            <option value="tout" >tout</option>
            <option value="francais" >francais</option>
            <option value="anglais" >anglais</option>
          </select>
          <select name="app" id="selectApp" value={filterParameters.selectedApp} onChange={handleAppChange}>
              <option value="tout" disabled hidden>Application web</option>
              <option value="tout">tout</option>
              {webApplications.map((app) =>(
                  <option key={app.id} value={app.url}>{app.nom}</option>
                 ))}
          </select>
        </div>
        {componentCharged}
    </div>
  )
}

export default Dashboard
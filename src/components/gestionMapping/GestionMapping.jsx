import React, { useState ,useEffect} from 'react'
import "./GestionMapping.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFileCirclePlus, faUpload, faFilter } from '@fortawesome/free-solid-svg-icons';
import {MappingAdd ,DocsList ,UploadPage} from '../index';
import useStore from '../../globalState/UseStore';

const GestionMapping = () => {

  const initialFilterParameteres = {
    selectedType : 'tout',
    selectedLanguage : 'tout',
    selectedApp : 'tout',
    titleSearched : ''
  }
  const { documentations, sources, sections,fetchDocumentations, fetchSources, fetchSections} = useStore();

  const [filterParameters, setFilterParameters] = useState(initialFilterParameteres);
  const [componentCharged , setComponentCharged] = useState(<DocsList filterParameters={filterParameters} data = {{sources,sections}} />);
  const [displayBackbtn , setDisplayBackbtn] = useState(false);
  const [addbtnIsClicked , setAddbtnIsClicked] = useState(false);
  const [filterbtnIsClicked , setFilterbtnIsClicked] = useState(false);
  const [uploadbtnIsClicked , setUploadbtnIsClicked] = useState(false);
  const [displaySearchInput , setDisplaySearchInput] = useState(true);


  useEffect(() => {
    fetchDocumentations();
    fetchSources();
    fetchSections();
  }, [fetchDocumentations, fetchSources, fetchSections]);

  // Methods of the filter action
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

      // Methods of the Navbar buttons actions
        const clickAddbtn = () => { 
          setComponentCharged(<MappingAdd data = {{sources,sections,documentations}}/>)
          setAddbtnIsClicked(true)
          setDisplayBackbtn(true)
          setFilterbtnIsClicked(false)
          setUploadbtnIsClicked(false)
          setDisplaySearchInput(false)
        };
        const clickFilterbtn = () => { 
          setComponentCharged(<DocsList filterParameters={filterParameters} data = {{sources,sections}}/>)
          setAddbtnIsClicked(false)
          setDisplayBackbtn(false)
          filterbtnIsClicked && setFilterParameters(initialFilterParameteres)
          setFilterbtnIsClicked(prev => !prev)
          setUploadbtnIsClicked(false)
          setDisplaySearchInput(true)
        };
        const clickBackbtn = () => { 
          setComponentCharged(<DocsList filterParameters={initialFilterParameteres} data = {{sources,sections}}/>)
          setAddbtnIsClicked(false)
          setDisplayBackbtn(false)
          setFilterbtnIsClicked(false)
          setUploadbtnIsClicked(false)
          setDisplaySearchInput(true)
        };
        const clickUploadbtn = () => { 
          setComponentCharged(<UploadPage />)
          setAddbtnIsClicked(false)
          setDisplayBackbtn(true)
          setFilterbtnIsClicked(false)
          setUploadbtnIsClicked(true)
          setDisplaySearchInput(false)
        };
      
        useEffect(() =>{
          setComponentCharged(<DocsList filterParameters={filterParameters} data = {{sources,sections}}/>) 
        },[filterParameters]);
        
  return (
    <div style={{backgroundColor:'white' , minHeight:'90vh', paddingBottom : '40px'}}>
        <div className="buttonsBox" >
            <div>
            <button className="back" onClick={clickBackbtn}  style={{display:!displayBackbtn && "none"}}><FontAwesomeIcon icon={faArrowLeft}/></button>
            <button className={addbtnIsClicked ? "addbtn clicked" : "addbtn"} onClick={clickAddbtn}><FontAwesomeIcon icon={faFileCirclePlus} /><span>Modifier</span></button>
            <button className={uploadbtnIsClicked ? "uploadbtn clicked" : "uploadbtn"} onClick={clickUploadbtn}><FontAwesomeIcon icon={faUpload} /><span>Importer</span></button>
            </div>
            <div>
            <button className={filterbtnIsClicked ? "filterbtn clicked" : "filterbtn"} onClick={clickFilterbtn}><FontAwesomeIcon icon={faFilter} /><span>Filter</span></button>
            { displaySearchInput && <input type='text' placeholder='Chercher avec le titre ...' value={filterParameters.titleSearched} onChange={handleInputSearch}/>}
            </div>
        </div>
        <div className="filterBox" style={{display:filterbtnIsClicked ? "block" : "none"}}>
          <select name="type" id="selectType"  value={filterParameters.selectedType} onChange={handleTypeChange}>
            <option value="tout" disabled hidden >Section</option>
            <option value="tout" >tout</option>
            {sections.map((section) =>(
                        <option key={section._id} value={section._id}>{section.titleFr}</option>
                      ))}
          </select>
          <select name="language" id="selectLanguage" value={filterParameters.selectedLanguage} onChange={handleLanguageChange}>
            <option value="tout" disabled hidden >Langue</option>
            <option value="tout" >tout</option>
            <option value="fr" >francais</option>
            <option value="en" >anglais</option>
          </select>
          <select name="app" id="selectApp" value={filterParameters.selectedApp} onChange={handleAppChange}>
              <option value="tout" disabled hidden>Application web</option>
              <option value="tout">tout</option>
              {sources.map((source) =>(
                      <option key={source._id} value={source._id}>{source.nom}</option>
                        ))}
          </select>
        </div>
        {componentCharged}
    </div>
  )
}

export default GestionMapping
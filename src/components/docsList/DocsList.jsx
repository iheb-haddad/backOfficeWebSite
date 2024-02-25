import React  from 'react'
import ClipLoader from "react-spinners/ClipLoader";
import { useState ,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen , faTrash ,faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import "./DocsList.css"
import Axios from '../../services/Axios';

function DocsList(props) {
    const [mappings , setMappings] = useState([])
    // let [mappingDetails , setMappingDetails] = useState([])
    const [filtredMappings , setFiltredMappings] = useState([])
    const [dataChanged , setDataChanged] = useState(0)
    const [isEditing,setIsEditing] = useState("")
    const [isModified , setIsModified] = useState('')
    const [isDeleting , setIsDeleting]  = useState("")
    const [isLoaded , setIsLoaded] = useState(false)

    useEffect(() => {
      Axios.get('/mappings')
      .then((response) => {
        setMappings(response.data)
            const filteredData = response.data.filter((mapping) => {
              const typeMatch = props.filterParameters.selectedType === 'tout' || mapping.idSection._id === props.filterParameters.selectedType;
              const languageMatch = props.filterParameters.selectedLanguage === 'tout' || mapping.idDocument.langue === props.filterParameters.selectedLanguage;
              const appMatch = props.filterParameters.selectedApp === 'tout' || mapping.idSource._id === props.filterParameters.selectedApp;
              const titleMatch = props.filterParameters.titleSearched === '' || mapping.idDocument.titre.toLowerCase().startsWith(props.filterParameters.titleSearched.toLowerCase());
          
              return typeMatch && languageMatch && appMatch && titleMatch;
            });
                setFiltredMappings(filteredData)
                setIsLoaded(true)
              })  
          .catch((error) => {
            console.error('Error fetching documents:', error);
          });
      }, [dataChanged]);

      const handleDelete = (mappingId) => {
        console.log(mappingId)
        setIsDeleting(mappingId);
        Axios.delete(`/mappings/${mappingId}`)
        .then((data) => {
            setDataChanged(prev => prev +1)
              // You can update your UI or perform other actions here
            })
            .catch((error) => {
              console.error('Error deleting ', error);
            });
            setTimeout(() => {
              setIsDeleting("")
          },1500);
        };

        useEffect(() =>{
          console.log(mappings)
          const filteredData = mappings.filter((mapping) => {
            const typeMatch = props.filterParameters.selectedType === 'tout' || mapping.idSection._id === props.filterParameters.selectedType;
            const languageMatch = props.filterParameters.selectedLanguage === 'tout' || mapping.idDocument.langue === props.filterParameters.selectedLanguage;
            const appMatch = props.filterParameters.selectedApp === 'tout' || mapping.idSource._id === props.filterParameters.selectedApp;
            const titleMatch = props.filterParameters.titleSearched === '' || mapping.idDocument.titre.toLowerCase().startsWith(props.filterParameters.titleSearched.toLowerCase());
        
            return typeMatch && languageMatch && appMatch  && titleMatch;
          });
              setFiltredMappings(filteredData)
              console.log(mappings)
        },[props.filterParameters]);

        // Methofds to handle the form
        const [formData ,setFormData] = useState()
        const onChangeSection = (event) => {  
          setFormData((prevData) => ({
            ...prevData,
            section : event.target.value
          }))
        }
        const onChangeSource = (event) => {
          setFormData((prevData) => ({
            ...prevData,
            source : event.target.value
          }))
        }

        const handleModify = (mapping) => {
          setIsEditing(mapping._id)
          console.log("heere"+JSON.stringify(mapping))
          setFormData({
            source : mapping.idSource,
            section : mapping.idSection
          })
        }
        function areObjectsEqual(objA, objB) {
          // Get the keys of both objects
          return objA.source === objB.idSource && objA.section === objB.idSection
        }
        const handleModifyComplete = (mapping) => {
          setIsEditing("")
          // let type = (formData.typeDoc === 'commun' || formData.typeDoc === 'fiche métier' || formData.typeDoc === 'autre') ? 'document' : formData.typeDoc
          const mappingModified = {
            idDocument : mapping.idDocument,
            idSection : formData.section,
            idSource : formData.source
          }
          console.log("mooooood"+JSON.stringify(mappingModified))
          if (!areObjectsEqual(formData,mapping)){
            Axios.put(`/mappings/${mapping._id}`, mappingModified)
            .then((data) => {
              console.log('Object modified:', data);
              setDataChanged(prev => prev +1)
              // You can update your UI or perform other actions here
            })
            .catch((error) => {
              console.error('Error modifying object:', error);
            });
            setTimeout(() => {
              setIsModified(mapping._id)
          },500);
            setTimeout(() => {
              setIsModified("")
          }, 3000);
          }
        }
  return (
    <div style={{position:"relative"}}>
        <div className="headList">
            <div className="type">Section</div>
            <div className="titre">Titre</div>
            <div className="langue">Langue</div>
            <div className="webApp">Application web</div>
            <div className="affichage">Affichage</div>
            <div className="actions">Actions</div>
        </div>
        <ClipLoader
              className='loading'
              loading={!isLoaded}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
        { isLoaded &&
            filtredMappings.map((mapping)=>(
            <div className={`headList lineList ${isEditing === mapping._id && 'isEditing'}`} key={mapping._id} style={{backgroundColor: isModified === mapping._id && "#50e150"}}>
                <div className={`type ${isDeleting === mapping._id && 'isDeleting'}`}>{isEditing === mapping._id ?
                  <select name="type" id="selectType"  value={formData.section} onChange={onChangeSection}>
                      {props.data.sections.map((section) =>(
                        <option key={section._id} value={section._id}>{section.titleFr}</option>
                      ))}
                  </select>
                :<>{mapping.idSection.titleFr}</>
                }</div>
                <div className={`titre ${isDeleting === mapping._id && 'isDeleting'}`}>{mapping.idDocument.titre}</div>
                <div className={`langue ${isDeleting === mapping._id && 'isDeleting'}`}>{mapping.idDocument.langue}</div>
                <div className={`webApp ${isDeleting === mapping._id && 'isDeleting'}`}>{isEditing === mapping._id ?
                  <select name="app" id="selectApp" value={formData.source} onChange={onChangeSource}>
                    {props.data.sources.map((source) =>(
                      <option key={source._id} value={source._id}>{source.nom}</option>
                        ))}
                  </select> 
                :<>{mapping.idSource.nom}</>
                }</div>
                <div className='affichage'>
                      <input
                      type="checkbox"
                      checked={mapping.idDocument.affichage === 'contenu'}
                        // onChange={(event) => handleChange(event,mapping.id)}
                        readOnly
                      />
                </div>
                <div className="actions">
                  {!(isEditing === mapping._id) ? <FontAwesomeIcon icon={faPen} style={{cursor:'pointer'}}
                  onClick={()=>handleModify(mapping)}/>
                  : <FontAwesomeIcon icon={faCircleCheck} style={{cursor:'pointer'}}
                  onClick={() => handleModifyComplete(mapping)}/>}
                  <FontAwesomeIcon icon={faTrash} style={{cursor:'pointer'}} 
                  onClick={()=>handleDelete(mapping._id)}/>
                  <a href={mapping.idDocument.urlDoc} about='_blank'>Ouvrir</a></div>
            </div>
            ))
        }
    </div>
  )
}

export default DocsList

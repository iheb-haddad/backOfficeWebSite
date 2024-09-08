import React  from 'react'
import ClipLoader from "react-spinners/ClipLoader";
import { useState ,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen , faTrash ,faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import Axios from '../../services/Axios';
import ExportCSV from '../exportCsv/ExportCsv';
import "./DocsList.css"
import useAuth from '../../hooks/useAuth';
import { toast } from 'sonner';

function DocsList(props) {
    const [mappings , setMappings] = useState([])
    const [filtredMappings , setFiltredMappings] = useState([])
    const [dataChanged , setDataChanged] = useState(0)
    const [isEditing,setIsEditing] = useState("")
    const [isModified , setIsModified] = useState('')
    const [isDeleting , setIsDeleting]  = useState("")
    const [isLoaded , setIsLoaded] = useState(false)
    const { auth } = useAuth();


    useEffect(() => {
      const user = auth?.user?._id || '';
      Axios.get(`/mappings/user/${user}`)	
      .then((response) => {
        setMappings(response.data)
            const filteredData = response.data.filter((mapping) => {
              const projectMatch = props.filterParameters.selectedProject === 'tout' || mapping.idProject._id === props.filterParameters.selectedProject;
              const subProjectMatch = props.filterParameters.selectedSubProject === 'tout' || mapping.idSubProject._id === props.filterParameters.selectedSubProject;
              const typeMatch = props.filterParameters.selectedType === 'tout' || mapping.idSection._id === props.filterParameters.selectedType;
              const languageMatch = props.filterParameters.selectedLanguage === 'tout' || mapping.idDocument.language === props.filterParameters.selectedLanguage;
              const appMatch = props.filterParameters.selectedApp === 'tout' || mapping.idSource._id === props.filterParameters.selectedApp;
              const titleMatch = props.filterParameters.titleSearched === '' || mapping.idDocument.title.toLowerCase().startsWith(props.filterParameters.titleSearched.toLowerCase());
          
              return projectMatch && subProjectMatch && typeMatch && languageMatch && appMatch && titleMatch;
            });
                setFiltredMappings(filteredData)
                setIsLoaded(true)
              })  
          .catch((error) => {
            console.error('Error fetching mappings:', error);
            toast.error('Erreur lors du chargement des données')
          });
      }, [dataChanged]);

      const handleDelete = (mappingId) => {
        setIsDeleting(mappingId);
        Axios.delete(`/mappings/${mappingId}`)
        .then((data) => {
            setDataChanged(prev => prev +1)
            toast.success('Mapping supprimé avec succès')
            })
            .catch((error) => {
              console.error('Error deleting ', error);
              toast.error('Erreur lors de la suppression du mapping')
            });
            setTimeout(() => {
              setIsDeleting("")
          },2000);
        };

        useEffect(() =>{
          const filteredData = mappings.filter((mapping) => {
            const projectMatch = props.filterParameters.selectedProject === 'tout' || mapping.idProject._id === props.filterParameters.selectedProject;
            const subProjectMatch = props.filterParameters.selectedSubProject === 'tout' || mapping.idSubProject._id === props.filterParameters.selectedSubProject;
            const typeMatch = props.filterParameters.selectedType === 'tout' || mapping.idSection._id === props.filterParameters.selectedType;
            const languageMatch = props.filterParameters.selectedLanguage === 'tout' || mapping.idDocument.language === props.filterParameters.selectedLanguage;
            const appMatch = props.filterParameters.selectedApp === 'tout' || mapping.idSource._id === props.filterParameters.selectedApp;
            const titleMatch = props.filterParameters.titleSearched === '' || mapping.idDocument.title.toLowerCase().startsWith(props.filterParameters.titleSearched.toLowerCase());
        
            return projectMatch && subProjectMatch && typeMatch && languageMatch && appMatch  && titleMatch;
          });
            setFiltredMappings(filteredData)
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
          setFormData({
            source : mapping.idSource._id,
            section : mapping.idSection._id
          })
        }
        function areObjectsEqual(objA, objB) {
          // Get the keys of both objects
          return objA.source === objB.idSource._id && objA.section === objB.idSection._id
        }
        const handleModifyComplete = (mapping) => {
          setIsEditing("")
          const mappingModified = {
            idDocument : mapping.idDocument,
            idSection : formData.section,
            idSource : formData.source
          }
          
          if (!areObjectsEqual(formData,mapping)){
            Axios.put(`/mappings/${mapping._id}`, mappingModified)
            .then((data) => {
              console.log('Object modified:', data);
              setDataChanged(prev => prev +1)
              toast.success('Mapping modifié avec succès')
              // You can update your UI or perform other actions here
            })
            .catch((error) => {
              console.error('Error modifying object:', error);
              toast.error('Erreur lors de la modification du mapping')
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
      { isLoaded && <ExportCSV data={mappings} fileName={'mappings'}/>} 
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
                <div className={`titre ${isDeleting === mapping._id && 'isDeleting'}`}>{mapping.idDocument.title}</div>
                <div className={`langue ${isDeleting === mapping._id && 'isDeleting'}`}>{mapping.idDocument.language}</div>
                <div className={`webApp ${isDeleting === mapping._id && 'isDeleting'}`}>{isEditing === mapping._id ?
                  <select name="app" id="selectApp" value={formData.source} onChange={onChangeSource}>
                    {props.data.sources.map((source) =>(
                      <option key={source._id} value={source._id}>{source.name}</option>
                        ))}
                  </select> 
                :<>{mapping.idSource.name}</>
                }</div>
                <div className='affichage'>
                      {mapping.idDocument.display}
                </div>
                <div className="actions">
                  {!(isEditing === mapping._id) ? <FontAwesomeIcon icon={faPen} style={{cursor:'pointer'}}
                  onClick={()=>handleModify(mapping)}/>
                  : <FontAwesomeIcon icon={faCircleCheck} style={{cursor:'pointer'}}
                  onClick={() => handleModifyComplete(mapping)}/>}
                  <FontAwesomeIcon icon={faTrash} style={{cursor:'pointer'}} 
                  onClick={()=>handleDelete(mapping._id)}/>
                  <a href={mapping.idDocument.urlDoc} target='_blank'>Ouvrir</a></div>
            </div>
            ))
        }
        { filtredMappings.length === 0 && isLoaded && <div style={{ textAlign : 'center',marginTop :'50px',fontSize :'1.6rem'}} >Aucun mapping trouvé</div>}
    </div>
  )
}

export default DocsList

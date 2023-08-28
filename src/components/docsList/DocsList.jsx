import React from 'react'
import { useState ,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen , faTrash ,faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import "./DocsList.css"

function DocsList(props) {
    const [documents , setDocuments] = useState([])
    const [filtredDocuments , setFiltredDocuments] = useState([])
    const [dataChanged , setDataChanged] = useState(0)
    const [isEditing,setIsEditing] = useState("")
    const [isModified , setIsModified] = useState('')
    const [isDeleting , setIsDeleting]  = useState("")

    useEffect(() => {
        fetch('https://urlsjsonserver-p2nq.onrender.com/documentations')
          .then((response) => response.json())
          .then((data) => {
            setDocuments(data)
            const filteredData = data.filter((document) => {
              const typeMatch = props.filterParameters.selectedType === 'tout' || document.type === props.filterParameters.selectedType;
              const languageMatch = props.filterParameters.selectedLanguage === 'tout' || document.langue === props.filterParameters.selectedLanguage;
              const appMatch = props.filterParameters.selectedApp === 'tout' || document.application === props.filterParameters.selectedApp;
              const titleMatch = props.filterParameters.titleSearched === '' || document.titre === props.filterParameters.titleSearched;
          
              return typeMatch && languageMatch && appMatch && titleMatch;
            });
                setFiltredDocuments(filteredData)
              })
          .catch((error) => {
            console.error('Error fetching documents:', error);
          });

      }, [dataChanged]);

      const handleDelete = (documentId) => {
        console.log(documentId)
        setIsDeleting(documentId);
        fetch(`https://urlsjsonserver-p2nq.onrender.com/documentations/${documentId}`, {
            method: 'DELETE',
          })
            .then((response) => response.json())
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
          console.log(documents)
          const filteredData = documents.filter((document) => {
            const typeMatch = props.filterParameters.selectedType === 'tout' || document.type === props.filterParameters.selectedType;
            const languageMatch = props.filterParameters.selectedLanguage === 'tout' || document.langue === props.filterParameters.selectedLanguage;
            const appMatch = props.filterParameters.selectedApp === 'tout' || document.application === props.filterParameters.selectedApp;
            const titleMatch = props.filterParameters.titleSearched === '' || document.titre.toLowerCase().startsWith(props.filterParameters.titleSearched.toLowerCase());
        
            return typeMatch && languageMatch && appMatch  && titleMatch;
          });
              setFiltredDocuments(filteredData)
              console.log(documents)
        },[props.filterParameters]);

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

        const [formData ,setFormData] = useState()
        const onChangeType = (event) => {
          setFormData((prevData) => ({
            ...prevData,
            type : event.target.value
          }))
        }
        const onChangeTitle = (event) => {
          setFormData((prevData) => ({
            ...prevData,
            titre : event.target.value
          }))
        }
        const onChangeLanguage = (event) => {
          setFormData((prevData) => ({
            ...prevData,
            langue : event.target.value
          }))
        }
        const onChangeApp = (event) => {
          setFormData((prevData) => ({
            ...prevData,
            application : event.target.value
          }))
        }

        const handleModify = (document) => {
          setIsEditing(document.id)
          setFormData(document)
          if(document.type === 'document'){
            setFormData((prevData) => ({
              ...prevData,
              type : document.typeDoc
            }))
          }
        }
        function areObjectsEqual(objA, objB) {
          // Get the keys of both objects
          const keysA = Object.keys(objA);
          const keysB = Object.keys(objB);
        
          // Check if the number of keys is the same
          if (keysA.length !== keysB.length) {
            return false;
          }
        
          // Check if all keys and their values are the same
          for (const key of keysA) {
            if (objA[key] !== objB[key]) {
              return false;
            }
          }
        
          return true;
        }
        const handleModifyComplete = (document) => {
          setIsEditing("")
          let type = ''
          type = (formData.type === 'commun' || formData.type === 'fiche métier' || formData.type === 'autre') ? 'document' : formData.type
          const documentModified = {
            id : document.id,
            type : type,
            langue : formData.langue,
            titre : formData.titre,
            ...(type === 'document' && { typeDoc: formData.type }),
            application : formData.application,
            statut : document.statut,
            urlDoc : document.urlDoc,
          }
          if (!areObjectsEqual(documentModified,document)){
          fetch(`https://urlsjsonserver-p2nq.onrender.com/documentations/${document.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(documentModified),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log('Object modified:', data);
              setDataChanged(prev => prev +1)
              // You can update your UI or perform other actions here
            })
            .catch((error) => {
              console.error('Error modifying object:', error);
            });
            setTimeout(() => {
              setIsModified(document.id)
          },1000);
            setTimeout(() => {
              setIsModified("")
          }, 3000);
          }
        }

  return (
    <div style={{position:"relative"}}>
        <div className="headList">
            <div className="type">Type</div>
            <div className="titre">Titre</div>
            <div className="langue">Langue</div>
            <div className="webApp">Application web</div>
            <div className="actions">Actions</div>
        </div>
        {
            filtredDocuments.map((document)=>(
            <div className={`headList lineList ${isEditing === document.id && 'isEditing'}`} key={document.id} style={{backgroundColor: isModified === document.id && "#50e150"}}>
                <div className={`type ${isDeleting === document.id && 'isDeleting'}`}>{isEditing === document.id ?
                  <select name="type" id="selectType"  value={formData.type} onChange={onChangeType}>
                      <option value="instruction" >instruction</option>
                      <option value="alerte" >alerte</option>
                      <option value="commun" >doc commun</option>
                      <option value="fiche métier" >doc fiche métier</option>
                      <option value="autre" >doc autre</option>
                  </select>
                :<>{document.type}</>
                }</div>
                <div className={`titre ${isDeleting === document.id && 'isDeleting'}`}>{isEditing === document.id ?<input type="text"  value={formData.titre} onChange={onChangeTitle}/> :<>{document.titre}</>}</div>
                <div className={`langue ${isDeleting === document.id && 'isDeleting'}`}>{isEditing === document.id ?
                  <select name="langue" id="selectLanguage"  value={formData.langue} onChange={onChangeLanguage}>
                      <option value="francais" >francais</option>
                      <option value="anglais" >anglais</option>
                  </select>
                :<>{document.langue}</>
                }</div>
                <div className={`webApp ${isDeleting === document.id && 'isDeleting'}`}>{isEditing === document.id ?
                  <select name="app" id="selectApp" value={formData.application} onChange={onChangeApp}>
                    {webApplications.map((app) =>(
                      <option key={app.id} value={app.url}>{app.nom}</option>
                        ))}
                  </select> 
                :<>{document.application}</>
                }</div>
                <div className="actions">
                  {!(isEditing === document.id) ?<FontAwesomeIcon icon={faPen} style={{cursor:'pointer'}}onClick={()=>handleModify(document)}/>:<FontAwesomeIcon icon={faCircleCheck} style={{cursor:'pointer'}}onClick={() => handleModifyComplete(document)}/>}
                  <FontAwesomeIcon icon={faTrash} style={{cursor:'pointer'}} onClick={()=>handleDelete(document.id)}/>
                  <a href={document.urlDoc} about='_blank'>Ouvrir</a></div>
            </div>
            ))
        }
    </div>
  )
}

export default DocsList
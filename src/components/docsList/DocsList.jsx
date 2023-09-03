import React from 'react'
import { useState ,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen , faTrash ,faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import "./DocsList.css"
import Axios from '../../services/Axios';

function DocsList(props) {
    const [documents , setDocuments] = useState([])
    const [filtredDocuments , setFiltredDocuments] = useState([])
    const [dataChanged , setDataChanged] = useState(0)
    const [isEditing,setIsEditing] = useState("")
    const [isModified , setIsModified] = useState('')
    const [isDeleting , setIsDeleting]  = useState("")
    let [isChecked, setChecked] = useState({});

    const handleChange = (event,docId) => {
      if(isEditing === docId){
      isChecked[docId] = event.target.checked
        if(event.target.checked){
          setFormData((prevData) => ({
            ...prevData,
            affichage : 'contenu'
          }))
        }else{
          setFormData((prevData) => ({
            ...prevData,
            affichage : 'titre'
          }))
        }
      }
    };

    useEffect(() => {
      Axios.get('/documentations')
      .then((response) => {
        setDocuments(response.data)
            const filteredData = response.data.filter((document) => {
              const typeMatch = props.filterParameters.selectedType === 'tout' || document.type === props.filterParameters.selectedType;
              const languageMatch = props.filterParameters.selectedLanguage === 'tout' || document.langue === props.filterParameters.selectedLanguage;
              const appMatch = props.filterParameters.selectedApp === 'tout' || document.application === props.filterParameters.selectedApp;
              const titleMatch = props.filterParameters.titleSearched === '' || document.titre === props.filterParameters.titleSearched;
          
              return typeMatch && languageMatch && appMatch && titleMatch;
            });
                setFiltredDocuments(filteredData)
                for (const key in isChecked) {
                  if (isChecked.hasOwnProperty(key)) {
                      delete isChecked[key];
                  }
              }
                filteredData.forEach((document) => {
                  let check = document.affichage === 'contenu' ? true : false;
                  isChecked[document.id] = check
                })
              })
          .catch((error) => {
            console.error('Error fetching documents:', error);
          });

      }, [dataChanged]);

      const handleDelete = (documentId) => {
        console.log(documentId)
        setIsDeleting(documentId);
        Axios.delete(`/documentations/${documentId}`)
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
              for (const key in isChecked) {
                if (isChecked.hasOwnProperty(key)) {
                    delete isChecked[key];
                }
            }
              filteredData.forEach((document) => {
                let check = document.affichage === 'contenu' ? true : false;
                isChecked[document.id] = check
              })
              console.log(documents)
        },[props.filterParameters]);

        const [webApplications ,setWebApplications] = useState([])
        useEffect(() => {
          Axios.get('/webApplications')
          .then((data) => {
            setWebApplications(data.data) 
              })
          .catch((error) => {
            console.error('Error fetching documents:', error);
          });
        }, []);

        const [formData ,setFormData] = useState()
        const onChangeType = (event) => {
          setFormData((prevData) => ({
            ...prevData,
            typeDoc : event.target.value
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
          console.log("heere"+JSON.stringify(document))
          setFormData(document)
        }
        function areObjectsEqual(objA, objB) {
          // Get the keys of both objects
          return objA.type === objB.type && objA.typeDoc === objB.typeDoc && objA.titre === objB.titre && objA.application === objB.application && objA.langue === objB.langue && objA.affichage === objB.affichage 
        }
        const handleModifyComplete = (document) => {
          setIsEditing("")

          let type = (formData.typeDoc === 'commun' || formData.typeDoc === 'fiche métier' || formData.typeDoc === 'autre') ? 'document' : formData.typeDoc
          const documentModified = {
            _id : document._id,
            id : document.id,
            type : type,
            langue : formData.langue,
            titre : formData.titre,
            typeDoc : formData.typeDoc,
            application : formData.application,
            statut : document.statut,
            urlDoc : document.urlDoc,
            affichage : formData.affichage
          }
          console.log("mooooood"+JSON.stringify(documentModified))
          if (!areObjectsEqual(documentModified,document)){
            Axios.put(`/documentations/${document.id}`, documentModified)
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
          },500);
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
            <div className="affichage">Affichage</div>
            <div className="actions">Actions</div>
        </div>
        {
            filtredDocuments.map((document)=>(
            <div className={`headList lineList ${isEditing === document.id && 'isEditing'}`} key={document.id} style={{backgroundColor: isModified === document.id && "#50e150"}}>
                <div className={`type ${isDeleting === document.id && 'isDeleting'}`}>{isEditing === document.id ?
                  <select name="type" id="selectType"  value={formData.typeDoc} onChange={onChangeType}>
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
                <div className='affichage'>
                      <input
                      type="checkbox"
                      checked={isChecked[document.id]}
                      onChange={(event) => handleChange(event,document.id)}
                      />
                </div>
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
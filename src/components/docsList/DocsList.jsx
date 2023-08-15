import React from 'react'
import { useState ,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen , faTrash } from '@fortawesome/free-solid-svg-icons';
import "./DocsList.css"

function DocsList(props) {
    const [documents , setDocuments] = useState([])
    const [filtredDocuments , setFiltredDocuments] = useState([])
    const [dataChanged , setDataChanged] = useState(0)

    useEffect(() => {
        fetch('https://urlsjsonserver-p2nq.onrender.com/documentations')
          .then((response) => response.json())
          .then((data) => {
            setDocuments(data)
            const filteredData = data.filter((document) => {
              const typeMatch = props.filterParameters.selectedType === 'tout' || document.type === props.filterParameters.selectedType;
              const languageMatch = props.filterParameters.selectedLanguage === 'tout' || document.langue === props.filterParameters.selectedLanguage;
              const appMatch = props.filterParameters.selectedApp === 'tout' || document.application === props.filterParameters.selectedApp;
          
              return typeMatch && languageMatch && appMatch;
            });
                setFiltredDocuments(filteredData)

                
              })
          .catch((error) => {
            console.error('Error fetching documents:', error);
          });

      }, [dataChanged]);

      const handleDelete = (documentId,path) => {
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
        };
        useEffect(() =>{
          console.log(documents)
          const filteredData = documents.filter((document) => {
            const typeMatch = props.filterParameters.selectedType === 'tout' || document.type === props.filterParameters.selectedType;
            const languageMatch = props.filterParameters.selectedLanguage === 'tout' || document.langue === props.filterParameters.selectedLanguage;
            const appMatch = props.filterParameters.selectedApp === 'tout' || document.application === props.filterParameters.selectedApp;
        
            return typeMatch && languageMatch && appMatch;
          });
              setFiltredDocuments(filteredData)
              console.log(documents)
        },[props.filterParameters]);
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
            <div className="headList lineList" key={document.id}>
                <div className="type">{document.type}</div>
                <div className="titre">{document.titre}</div>
                <div className="langue">{document.langue}</div>
                <div className="webApp">{document.application}</div>
                <div className="actions">
                  <FontAwesomeIcon icon={faPen} style={{cursor:'pointer'}}/>
                  <FontAwesomeIcon icon={faTrash} style={{cursor:'pointer'}} onClick={()=>handleDelete(document.id,"document")}/>
                  <a href={document.urlDoc} about='_blank'>Ouvrir</a></div>
            </div>
            ))
        }
    </div>
  )
}

export default DocsList
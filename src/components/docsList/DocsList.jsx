import React from 'react'
import { useState ,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen , faTrash } from '@fortawesome/free-solid-svg-icons';
import "./DocsList.css"

function DocsList() {
    const [documents , setDocuments] = useState([])
    const [dataChanged , setDataChanged] = useState(0)
    useEffect(() => {
        // const currentURL = window.location.href;
        // setCurrentApplicationURL(currentURL);
        // Fetch the documents from the server
        fetch('https://urlsjsonserver-p2nq.onrender.com/documents')
          .then((response) => response.json())
          .then((data) => {
            setDocuments(data);
          })
          .catch((error) => {
            console.error('Error fetching documents:', error);
          });
      }, [dataChanged]);

      const handleDelete = (documentId,path) => {
        fetch(`https://urlsjsonserver-p2nq.onrender.com/`+path+`s/${documentId}`, {
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
            documents.map((document)=>(
            <div className="headList lineList">
                <div className="type">document</div>
                <div className="titre">{document.titleFr}</div>
                <div className="langue">{document.langue}</div>
                <div className="webApp">{document.application[0]}</div>
                <div className="actions"><FontAwesomeIcon icon={faPen} style={{cursor:'pointer'}}/><FontAwesomeIcon icon={faTrash} style={{cursor:'pointer'}} onClick={()=>handleDelete(document.id,"document")}/><a href={document.urlDoc}>Ouvrir</a></div>
            </div>
            ))
        }
    </div>
  )
}

export default DocsList
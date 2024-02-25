import React,{useState,useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX} from '@fortawesome/free-solid-svg-icons';
import './DocFormAjout.css'
import Axios from '../../services/Axios';
import { ModifiedDocument } from '../index';

function DocFormAjout(props) {
  const [msgErreur1Color, setMsgErreur1Color] = useState('white');
  const [documentations , setDocumentations] = useState([]);
  const [languages , setLanguages] = useState([]);
  const [dataChanged , setDataChanged] = useState(0)
  const [showListDocuments ,setShowListDocuments] = useState(false)
  const [isModified , setIsModified] = useState("")
  const [modifiedData , setModifiedData] = useState({})
  const [showError2 , setShowError2] = useState(false)
  const [keyWord , setKeyWord] = useState("")

  // Fetching necessary data
  useEffect(() => {
    Axios.get('/documentations')
    .then((response) => {
      setDocumentations(response.data)
            })
        .catch((error) => {
          console.error('Error fetching documents:', error);
        });
  }, [dataChanged])

  useEffect(() => {
    Axios.get('/languages')
    .then((response) => {
      setLanguages(response.data)
    })
    .catch((error) => {
      console.error('Error fetching languages:', error);
    });
  }, [])

  // initial values of the form
    const initialValues = {
        urlType : 'normal',
        selectedLanguage: '',
        title: '',
        selectedStatut: '',
        urlDocument: '',
        affichage : 'titre',
        note : '',
        expiration : '',
        keywords : []
      };
      const [formData, setFormData] = useState(initialValues);
      const [typeDocument ,setTypeDocument] = useState("");

      const handleAnnuler = () => {
        setFormData(initialValues);
        setTypeDocument("");
      };

    // methods to handle the form
    function handleUrlTypeChange(event) {
        if(event.target.value === 'specifique'){
          if(props.generalUrl){
            setFormData((prevData) => ({
              ...prevData,
              urlType : event.target.value,
              urlDocument : props.generalUrl
            }));
          }else{
            setMsgErreur1Color("red")
            setTimeout(() => {
              setMsgErreur1Color("white")
            }, 2000);
          }
        }else{
        setFormData((prevData) => ({
            ...prevData,
            urlType : event.target.value,
            urlDocument : ''
          }));
        }
    }

    const handleLanguageChange = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            selectedLanguage : event.target.value
          }));
    };
    
    const handleTitleChange = (event) => {
        setFormData((prevData) => ({
          ...prevData,
          title: event.target.value,
        }));
      };

    const handleStatutChange = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            selectedStatut: event.target.value,
          }));
    };

    const handleUrlDocumentChange = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            urlDocument: event.target.value,
          }));
    };
    function handleAffichageChange(event) {
      setFormData((prevData) => ({
          ...prevData,
          affichage : event.target.value
        }));
  }

  const handleTextareaChange = (event) => {
    setFormData((prevData) => ({
        ...prevData,
        note : event.target.value
      }));
  }

  const handleExpirationChange = (event) => {
    setFormData((prevData) => ({
        ...prevData,
        expiration: event.target.value,
      }));
};

  const handleKeywordsChange = (event) => {
    if (event.key === "Enter") {
      setFormData((prevData) => ({
        ...prevData,
        keywords : [...prevData.keywords,keyWord]
      }));
      setKeyWord("");
    } else { 
      setKeyWord(event.target.value);
    }
};

const deleteKeyword = (index) => {
  setFormData((prevData) => ({
    ...prevData,
    keywords : prevData.keywords.filter((keyword,i) => i !== index)
  }));
}  

  const [message ,setMessage] = useState("")
  const [messageColor , setMessageColor] = useState("black")
  const [showError,setShowError] = useState(false)

    const handleAddDocument = () => {
      const hasEmptyFields = Object.entries(formData).some(([key, value]) => {
        return (key !== 'title' && key !== 'urlDocument' && key != 'expiration' && key !== 'note') && (value === '' || value.length === 0);
      });
      const titleEmpty = formData.affichage === 'titre' && formData.title === ''
      const noteEmpty = formData.urlType === 'note' && formData.note === ''
      setShowError(hasEmptyFields || titleEmpty || noteEmpty);
      if (hasEmptyFields || titleEmpty || noteEmpty) {
        setMessage("Il faut remplir touts les champs obligatoires *")
        setMessageColor("red")
        setTimeout(() => {
          setMessage("");
        }, 4000);
      }else{
        const newDocument = {
          langue: formData.selectedLanguage,
          titre: formData.title,
          statut: formData.selectedStatut,
          urlDoc: formData.urlDocument,
          affichage: formData.affichage,
          note : formData.note,
          expiration: formData.expiration,
          keywords : formData.keywords,
          consultNumber: 0,
          lastConsultation : ''
        };
    
        Axios.post('/documentations', newDocument )
          .then((response) => {
            console.log('New document added:', response.data);
            setDataChanged(prev => prev +1)
            setFormData(initialValues);
            setTypeDocument("")
            setMessage("La documentation est ajouté avec succés")
            setMessageColor("green")
            setTimeout(() => {
              setMessage("");
            }, 4000);
            // You can update your UI or perform other actions here
          })
          .catch((error) => {
            console.error('Error adding new document:', error);
            setMessage("Un problème effectue lors de l'ajout du documentation")
            setMessageColor("red")
            setTimeout(() => {
              setMessage("");
            }, 4000);
          });
        }
      };

      const handleshowListDocuments = () => {
        setShowListDocuments((prev) => { return !prev })
    }
    const handleDeleteDocument = (_id) => {
      Axios.delete(`/documentations/${_id}`)
      .then((response) => {
        console.log(response)
        setDocumentations(documentations.filter((document) => document._id !== _id))
        setDataChanged( prev => prev + 1)
      })
      .catch((error) => {
        console.log(error)
      })
    }
    const handleModifDocument = (document) => {
      const initialValues = {
        selectedLanguage: document.langue,
        title: document.titre,
        selectedStatut: document.statut,
        urlDocument: document.urlDoc,
        affichage : document.affichage,
        note : document.note,
        expiration : document.expiration,
        keywords : document.keywords
    }
        setModifiedData(initialValues)
        setIsModified(document._id)
    }

    const handleGetModifiedDocument = (document) => {
        const hasEmptyFields = Object.entries(modifiedData).some(([key,value]) => {
            return key !== 'urlDocument' && key !== 'title' && key !== 'note' && (value === '' || value.length === 0)
        })
        const titleEmpty = modifiedData.affichage === 'titre' && modifiedData.title === ''
        setShowError2(hasEmptyFields || titleEmpty)
        if(!hasEmptyFields && !titleEmpty){
                const newDocument = {
                    langue: modifiedData.selectedLanguage,
                    titre: modifiedData.title,
                    statut: modifiedData.selectedStatut,
                    urlDoc: modifiedData.urlDocument,
                    affichage: modifiedData.affichage,
                    note : modifiedData.note,
                    expiration: modifiedData.expiration,
                    keywords : modifiedData.keywords,
                    consultNumber: document.consultNumber,
                    lastConsultation : document.lastConsultation
                  };
                Axios.put(`/documentations/${document._id}` , newDocument)
                .then((response) => {
                    console.log(response)
                    setDataChanged( prev => prev + 1)
                })
                .catch((error) => {
                    console.log(error)
                })
                setIsModified("")
            }
    }

  return (
    <div className='docFormAjout'>
        <div className="entete">
            <h1>Ajouter une documentation</h1>
        </div>
        <div className="configBox">
        <div className="configLine">
                <div className="adminErr" style={{margin:'16px 0 5px 0'}}>
                <p style={{color:msgErreur1Color}}>Ajouter d'abord votre url géneral</p>
                </div> 
                <select value={formData.urlType} onChange={handleUrlTypeChange} >
                    <option value="normal">Documentation normale</option>
                    <option value="specifique">Documentation avec url spécifique</option>
                    <option value="note">Notes/Messages</option>
                </select>
            </div>
        <div className="configLine">
                <h3>Langue *</h3>
                <select value={formData.selectedLanguage} onChange={handleLanguageChange}
                style={{border: (showError && !formData.selectedLanguage) && "1px solid red"}}>
                    <option value="" disabled hidden>----</option>
                    {
                      languages.map((language) => (
                        <option key={language._id} value={language.code}>{language.name}</option>
                      ))
                    }
                </select>
            </div> 
            <div className="configLine">
                 <h3>Titre</h3>
                <input
                    type="text"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Saisir titre "
                    style={{border: (showError && !formData.title && formData.affichage === 'titre') && "1px solid red"}}
                    />
            </div>
            <div className="configLine">
                <h3>Statut *</h3>
                <select value={formData.selectedStatut} onChange={handleStatutChange}
                style={{border: (showError && !formData.selectedStatut) && "1px solid red"}}>
                    <option value="" disabled hidden>----</option>
                    <option value="public">Public</option>
                    <option value="brouillon">Brouillon</option>
                </select>
            </div>
            {formData.urlType !== 'note' &&
            <div className="configLine">
                 <h3>Url Document *</h3>
                <input
                    type="text"
                    value={formData.urlDocument}
                    onChange={handleUrlDocumentChange}
                    placeholder="Saisir Url du document"
                    // style={{border: (showError && !formData.urlDocument) && "1px solid red"}}
                    // style={{border: (showError && !formData.urlDocument) && "1px solid red"}}
                    />
            </div>}
            {formData.urlType !== 'note' &&
             <div className="configLine">
              <h3>Affichage *</h3>
                <select value={formData.affichage} onChange={handleAffichageChange} >
                 {formData.urlDocument &&<option value="contenu">Contenu affiché</option>}
                 {formData.urlDocument &&<option value="contenu">Contenu affiché</option>}
                    <option value="titre">Seulement titre affiché</option>
                </select>
            </div>}
            {formData.urlType === 'note' &&
            <div className="configLine">
              <h3>Note / message</h3>
                <textarea
                  id="myTextarea"
                  value={modifiedData.note}
                  onChange={handleTextareaChange}
                  style={{height:"100%",width:"89%"}}
                />
            </div>
            } 
            <div className="configLine">
              <h3>Date d'expiration</h3>
                <input
                    type="date"
                    id="dateInput"
                    value={formData.expiration}
                    onChange={handleExpirationChange}
                  />
            </div>
            {formData.urlType !== 'note' && <div className="configLine" >
              <h3>Mots-clés de recherche</h3>
              <input
                  type="text"
                  value={keyWord}
                  onChange={handleKeywordsChange}
                  onKeyDown={handleKeywordsChange}
                  placeholder="Saisir titre "
                  style={{border: (showError && formData.keywords.length === 0) && "1px solid red"}}
                  />
                <div className='indication'>Cliquer Entrée pour ajouter encore</div>  
                <div className="urlBlock">
                  {
                    formData.keywords.map((keyword,index) => (
                      <div key={index} className = 'urlColumn'>
                        <FontAwesomeIcon icon={faX} onClick={() => deleteKeyword(index)}
                        style={{cursor:'pointer',fontSize : '7px',position : 'absolute', top : '5px',right : '5px'}}/>
                        {keyword}
                      </div>
                    ))
                  }
                </div>   
            </div>    }                                 
        </div>
        <div className="buttons">
            <div className="message" style={{color:messageColor}}>{message}</div>
           <div>
              <button onClick={handleAnnuler}>Annuler</button>
              <button onClick={handleAddDocument} className='appliquer'>Envoyer</button>
            </div>
        </div>
        <div className="applicationsList" style={{width:"90%",marginTop:'30px'}}>
            <div className="document">
              <div className="documentName">Titre</div>
              <div className="documentKeyword">Langue</div>
              <button></button>
              { showListDocuments ? <button onClick={handleshowListDocuments}>Cacher Liste</button>:<button onClick={handleshowListDocuments}>Afficher Liste</button>}
            </div>
        { showListDocuments &&
          documentations.map((document) => (
            <div key={document._id}>
                <div className="document documentLine" style= {{fontSize:'14px',color:'black'}} >
                <div className="documentName">{document.titre}</div>
                <div className="documentKeyword">{document.langue}</div>
                { isModified === document._id ? <button onClick={() => handleGetModifiedDocument(document)}>appliquer</button> :<button onClick={() => handleModifDocument(document)}>modifier</button>}
                <button onClick={()=>handleDeleteDocument(document._id)}>Supprimer</button>
                </div>
                { isModified === document._id &&
                 <ModifiedDocument document={document} 
                 modifiedData = {modifiedData} 
                 setModifiedData={setModifiedData} 
                 showError={showError2} />}
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default DocFormAjout
import React,{useState,useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX ,faUpload} from '@fortawesome/free-solid-svg-icons';
import './DocFormAjout.css'
import Axios from '../../services/Axios';
import { ModifiedDocument } from '../index';
import useStore from '../../globalState/UseStore';
import UploadPage from '../uploadPage/UploadPage';
import ExportCSV from '../exportCsv/ExportCsv';
import useAuth from '../../hooks/useAuth';
import { toast } from "sonner";

function DocFormAjout() {
  const [msgErreur1Color, setMsgErreur1Color] = useState('white');
  const { documentations , languages , fetchDocumentations , fetchLanguages , subProjects , fetchSubProjects , userProjects , fetchUserProjects} = useStore();
  const { auth } = useAuth();
  const { configurations , fetchConfigurations} = useStore();
  const [dataChanged , setDataChanged] = useState(0)
  const [showListDocuments ,setShowListDocuments] = useState(false)
  const [isModified , setIsModified] = useState("")
  const [modifiedData , setModifiedData] = useState({})
  const [showError2 , setShowError2] = useState(false)
  const [keyWord , setKeyWord] = useState("")
  const [generalUrl , setGeneralUrl] = useState("")

  const [showUploadPage , setShowUploadPage] = useState(false)
  const clickUploadbtn = () => {
      setShowUploadPage(prev => !prev)
  }

  // Fetching necessary data
  useEffect(() => {
    const user = auth?.user?._id || '';
    fetchDocumentations(user);
    fetchLanguages();
    fetchSubProjects(user);
    fetchConfigurations();
    fetchUserProjects(user);
  }, [dataChanged])

  // initial values of the form
    const initialValues = {
        project : '',
        urlType : 'normal',
        selectedLanguage: 'fr',
        title: '',
        selectedStatut: 'public',
        urlDocument: '',
        affichage : 'titre',
        note : '',
        expiration : '',
        keywords : []
      };
      const [formData, setFormData] = useState(initialValues);
      const [projectSelected , setProjectSelected] = useState("");

      const handleAnnuler = () => {
        setFormData(initialValues);
        setProjectSelected("")
      };

    // methods to handle the form
    const handleProjectChange = (event) => {
        setProjectSelected(event.target.value)
        const url = configurations.find(conf => conf.idProject === event.target.value)?.generalUrl
        setGeneralUrl(url) 
        if(formData.urlType === 'specifique'){
          if(url){
            setFormData((prevData) => ({
              ...prevData,
              urlDocument : url
            }));
          }else{
            setMsgErreur1Color("red")
            setTimeout(() => {
              setMsgErreur1Color("white")
            }, 2000);
          }
        }
    }

    const handleSubProjectChange = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            project: event.target.value,
          })); 
    };

    function handleUrlTypeChange(event) {
        if(event.target.value === 'specifique'){
          if(generalUrl){
            setFormData((prevData) => ({
              ...prevData,
              urlType : event.target.value,
              urlDocument : generalUrl
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

  const [showError,setShowError] = useState(false)

    const handleAddDocument = () => {
      const hasEmptyFields = Object.entries(formData).some(([key, value]) => {
        return (key !== 'title' && key !== 'urlDocument' && key != 'expiration' && key !== 'note') && (value === '');
      });
      const titleEmpty = formData.affichage === 'titre' && formData.title === ''
      const noteEmpty = formData.urlType === 'note' && formData.note === ''
      setShowError(hasEmptyFields || titleEmpty || noteEmpty);
      if (hasEmptyFields || titleEmpty || noteEmpty) {
        toast.error("Il faut remplir touts les champs obligatoires 55*");
      }else{
        const newDocument = {
          idProject : projectSelected,
          idSubProject : formData.project,
          language: formData.selectedLanguage,
          title: formData.title,
          status: formData.selectedStatut,
          urlDoc: formData.urlDocument,
          display: formData.affichage,
          note : formData.note,
          expiration: formData.expiration,
          keywords : formData.keywords,
          consultationNumber: 0,
          lastConsultation : ''
        };
    
        Axios.post('/documentations', newDocument )
          .then((response) => {
            console.log('New document added:', response.data);
            setDataChanged(prev => prev +1)
            setFormData(initialValues);
            toast.success("La documentation est ajouté avec succés");
          })
          .catch((error) => {
            console.error('Error adding new document:', error);
            toast.error(error.response.data.message)
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
        setDataChanged( prev => prev + 1)
      })
      .catch((error) => {
        console.log(error)
      })
    }
    const handleModifDocument = (document) => {
      const initialValues = {
        project : document.idProject._id,
        subProject : document.idSubProject._id,
        selectedLanguage: document.language,
        title: document.title,
        selectedStatut: document.status,
        urlDocument: document.urlDoc,
        affichage : document.display,
        note : document.note,
        expiration : document.expiration,
        keywords : document.keywords
    }
        setModifiedData(initialValues)
        setIsModified(document._id)
    }

    const handleGetModifiedDocument = (document) => {
      console.log(modifiedData)
        const hasEmptyFields = Object.entries(modifiedData).some(([key,value]) => {
            return key !== 'urlDocument' && key !== 'title' && key !== 'note' && (value === '')
        })
        const titleEmpty = modifiedData.affichage === 'titre' && modifiedData.title === ''
        setShowError2(hasEmptyFields || titleEmpty)
        if(!hasEmptyFields && !titleEmpty){
                const newDocument = {
                    _id : document._id,
                    idProject : modifiedData.project,
                    idSubProject : modifiedData.subProject,
                    language: modifiedData.selectedLanguage,
                    title: modifiedData.title,
                    status: modifiedData.selectedStatut,
                    urlDoc: modifiedData.urlDocument,
                    display: modifiedData.affichage,
                    note : modifiedData.note,
                    expiration: modifiedData.expiration,
                    keywords : modifiedData.keywords,
                    consultationNumber: document.consultNumber,
                    lastConsultation : document.lastConsultation
                  };
                Axios.put(`/documentations/${document._id}` , newDocument)
                .then((response) => {
                    console.log(response)
                    setDataChanged( prev => prev + 1)
                    toast.success("La documentation est modifié avec succés")
                })
                .catch((error) => {
                    console.log(error)
                    toast.error(error.response.data.message || "Erreur lors de la modification")
                })
                setIsModified("")
            }
    }

    const [projectFilter, setProjectFilter] = useState('')
    const [subProjectFilter, setSubProjectFilter] = useState('')

    const handleProjectFilterChange = (event) => {
        setProjectFilter(event.target.value)
        setSubProjectFilter('')
    }
    const handleSubProjectFilterChange = (event) => {
        setSubProjectFilter(event.target.value)
    }

  return (
    <>
    <div className="buttonsBox" style={{marginBottom : '40px',paddingRight:'40px', display :'flex', justifyContent:'space-between',alignItems:'center'}}>
            { !showUploadPage ? <button className="uploadbtn" onClick={clickUploadbtn}><FontAwesomeIcon icon={faUpload} /><span>Importer des documentations utilisant des fichiers csv</span></button>
            : <button className="uploadbtn" onClick={clickUploadbtn}><FontAwesomeIcon icon={faUpload} /><span>Cacher la page d'importation</span></button>}
            {showUploadPage && <a className='uploadbtn' href='DocumentsModel.csv' download='DocumentsModel.csv'>Télécharger un modèle</a>}
    </div>
    {showUploadPage && <UploadPage filesType={'documents'} setDataChanged={setDataChanged}/>}
    <div className='docFormAjout'>
        <div className="entete">
            <h2>Ajouter une documentation</h2>
        </div>
        <div className="configBox">
            <div className="configLine">
              <h3>Projet correspondant</h3>
              <select value={projectSelected} onChange={handleProjectChange}
              style={{border: (showError && !projectSelected) && "1px solid red"}}>
                  <option value="" disabled hidden>----</option>
                  {
                    userProjects.map((project) => (
                      <option key={project._id} value={project._id}>{project.name}</option>
                    ))
                  }
              </select>
            </div>  
            <div className="configLine">
              <h3>Sous-projet correspondant</h3>
              <select value={formData.project} onChange={handleSubProjectChange}
              style={{border: (showError && !formData.project) && "1px solid red"}}>
                  <option value="" disabled hidden>----</option>
                  {
                    subProjects.filter((subProject) => subProject.idProject._id === projectSelected).map((project) => (
                      <option key={project._id} value={project._id}>{project.name}</option>
                    ))
                  }
              </select>
            </div>  
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
                    />
            </div>}
            {formData.urlType !== 'note' &&
             <div className="configLine">
              <h3>Affichage *</h3>
                <select value={formData.affichage} onChange={handleAffichageChange} >
                    {formData.urlDocument &&<option value="contenu">Contenu affiché</option>}
                    <option value="titre">Seulement titre affiché</option>
                </select>
            </div>}
            {formData.urlType === 'note' &&
            <div className="configLine">
              <h3>Note / message</h3>
                <textarea
                  id="myTextarea"
                  value={formData.note}
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
                  placeholder="Saisir Mots-clés de recherche"
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
            </div>}                                
        </div>
        <div className="buttons">
              <button onClick={handleAnnuler}>Annuler</button>
              <button onClick={handleAddDocument} className='appliquer'>Envoyer</button>
          </div> 
          <div className='configBox' style={{padding : '20px'}}>
                <div className="configLine" style={{padding : '20px'}}>
                        <h3>Projet correspondant</h3>
                        <select value={projectFilter} onChange={handleProjectFilterChange}>
                            <option value="" disabled hidden>----</option>
                            {
                            userProjects.map((project) => (
                                <option key={project._id} value={project._id}>{project.name}</option>
                            ))
                            }
                        </select>
                </div>  
                <div className="configLine" style={{padding : '20px'}}>
                    <h3>Sous-projet correspondant</h3>
                        <select value={subProjectFilter} onChange={handleSubProjectFilterChange}>
                            <option value="" disabled hidden>----</option>
                            {
                            subProjects.filter((subProject) => subProject.idProject._id === projectFilter).map((project) => (
                                <option key={project._id} value={project._id}>{project.name}</option>
                            ))
                            }
                        </select>
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
            (projectFilter === '' || document.idProject._id === projectFilter) && (subProjectFilter === '' || document.idSubProject._id === subProjectFilter) &&
            <div key={document._id}>
                <div className="document documentLine" style= {{fontSize:'14px',color:'black'}} >
                <div className="documentName">{document.title}</div>
                <div className="documentKeyword">{document.language}</div>
                { isModified === document._id ? <button onClick={() => handleGetModifiedDocument(document)}>appliquer</button> :<button onClick={() => handleModifDocument(document)}>modifier</button>}
                <button onClick={()=>handleDeleteDocument(document._id)}>Supprimer</button>
                </div>
                { isModified === document._id &&
                 <ModifiedDocument document={document} 
                 modifiedData = {modifiedData} 
                 setModifiedData={setModifiedData} 
                 showError={showError2}
                 projects={userProjects} 
                 subProjects={subProjects}/>}
            </div>
          ))
        }
        { documentations.length === 0 && <div style={{ textAlign : 'center',marginTop :'50px',fontSize :'1.2rem'}} >Aucun document trouvé</div>}
        <ExportCSV data={documentations} fileName={'documents'}/>
      </div>
    </div>
    </>
  )
}

export default DocFormAjout
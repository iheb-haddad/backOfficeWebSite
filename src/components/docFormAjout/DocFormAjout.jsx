import React,{useState,useEffect} from 'react'
import './DocFormAjout.css'

function DocFormAjout() {
    const initialValues = {
        selectedApp: "",
        selectedLanguage: '',
        title: '',
        selectedType: '',
        selectedStatut: '',
        urlDocument: '',
      };
      const [formData, setFormData] = useState(initialValues);
      const [typeDocument ,setTypeDocument] = useState("");

      const handleAnnuler = () => {
        setFormData(initialValues);
        setTypeDocument("");
      };

    function handleAppChange(event) {
        setFormData((prevData) => ({
            ...prevData,
            selectedApp : event.target.value
          }));
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
      
    const handleTypeChange = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            selectedType: event.target.value,
          }));
    };

    const handleTypeDocChange = (event) => {
      setTypeDocument(event.target.value);
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
  const [message ,setMessage] = useState("")
  const [messageColor , setMessageColor] = useState("black")
  const [showError,setShowError] = useState(false)

    const handleAddDocument = () => {
      const hasEmptyFields = Object.entries(formData).some(([key, value]) => {
        return key !== 'title' && value === '';
      });
      const typeDocEmpty = formData.selectedType === 'document' && typeDocument === ''
      setShowError(hasEmptyFields || typeDocEmpty);
      if (hasEmptyFields || typeDocEmpty){
        setMessage("Il faut remplir tout les champs obligatoires *")
        setMessageColor("red")
        setTimeout(() => {
          setMessage("");
        }, 4000);
      }else{
        const newDocument = {
          id: Math.random().toString(36).substring(7),
          type: formData.selectedType,
          langue: formData.selectedLanguage,
          titre: formData.title,
          ...(formData.selectedType === 'document' && { typeDoc: typeDocument }),
          application: formData.selectedApp,
          statut: formData.selectedStatut,
          urlDoc: formData.urlDocument,
        };
    
        fetch('https://urlsjsonserver-p2nq.onrender.com/documentations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newDocument),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('New document added:', data);
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////
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
  return (
    <div className='docFormAjout'>
        <div className="entete">
            <h1>Ajouter une documentation</h1>
        </div>
        <div className="configBox">
        <div className="configLine">
                <h3>Type *</h3>
                <select value={formData.selectedType} onChange={handleTypeChange} 
                style={{border: (showError && !formData.selectedType) && "1px solid red"}}>
                    <option value="">----</option>
                    <option value="document">Document</option>
                    <option value="instruction">Instruction</option>
                    <option value="alerte">Alerte</option>
                </select>
            </div>
            <div className="configLine" style={{display: formData.selectedType === 'document'? "block" : "none"}}>
                <h3>Type Document*</h3>
                <select value={typeDocument} onChange={handleTypeDocChange}
                style={{border: (showError && !typeDocument) && "1px solid red"}}>
                    <option value="">----</option>
                    <option value="commun">Commun</option>
                    <option value="fiche métier">Fiche métier</option>
                    <option value="autre">Autre</option>
                </select>
            </div>      
        <div className="configLine">
                <h3>Langue *</h3>
                <select value={formData.selectedLanguage} onChange={handleLanguageChange}
                style={{border: (showError && !formData.selectedLanguage) && "1px solid red"}}>
                    <option value="">----</option>
                    <option value="francais">Francais</option>
                    <option value="anglais">Anglais</option>
                </select>
            </div> 
            <div className="configLine">
                 <h3>Titre</h3>
                <input
                    type="text"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Saisir titre "
                    style={{border: (showError && !formData.title) && "1px solid red"}}
                    />
            </div>
            <div className="configLine">
                <h3>Application Web *</h3>
                <select value={formData.selectedApp} onChange={handleAppChange}
                style={{border: (showError && !formData.selectedApp) && "1px solid red"}}>
                    <option value="">----</option>
                    {webApplications.map((app) =>(
                      <option key={app.id} value={app.url}>{app.nom}</option>
                    ))}
                </select>
            </div>   

            <div className="configLine">
                <h3>Statut *</h3>
                <select value={formData.selectedStatut} onChange={handleStatutChange}
                style={{border: (showError && !formData.selectedStatut) && "1px solid red"}}>
                    <option value="">----</option>
                    <option value="public">Public</option>
                    <option value="brouillon">Brouillon</option>
                </select>
            </div>
            <div className="configLine">
                 <h3>Url Document *</h3>
                <input
                    type="text"
                    value={formData.urlDocument}
                    onChange={handleUrlDocumentChange}
                    placeholder="Saisir Url du document"
                    style={{border: (showError && !formData.urlDocument) && "1px solid red"}}
                    />
            </div>                                   
        </div>
        <div className="buttons">
            <div className="message" style={{color:messageColor}}>{message}</div>
           <div>
              <button onClick={handleAnnuler}>Annuler</button>
              <button onClick={handleAddDocument} className='appliquer'>Envoyer</button>
            </div>
        </div>
    </div>
  )
}

export default DocFormAjout
import React , {useState , useEffect} from 'react'
import Axios from '../../services/Axios'
import { ModifiedSection , ConfLine} from '../index'
import './GestionSections.css'
import useRessources from '../../hooks/useRessources'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import UploadPage from '../uploadPage/UploadPage';
import ExportCSV from '../exportCsv/ExportCsv';
import { toast } from 'sonner';
import { t } from 'i18next'

function GestionSections() {
    const [showUploadPage , setShowUploadPage] = useState(false)
    const clickUploadbtn = () => {
        setShowUploadPage(prev => !prev)
    }

    const defaultTitles = [
        {id:1 , titleFr : 'Alertes' , titleEn : 'Alerts'},
        {id:2 , titleFr : 'Communs' , titleEn : 'Commons'},
        {id:3 , titleFr : 'Fiches métier' , titleEn : 'Job sheets'},
        {id:4 , titleFr : 'Instructions' , titleEn : 'Instructions'},
        {id:5 , titleFr : 'Notes' , titleEn : 'Notes'},
        {id:6 , titleFr : 'Formations' , titleEn : 'Trainings'},
        {id:7 , titleFr : 'Autres' , titleEn : 'Others'},
    ]

    const [sectionsTitles , setSectionsTitles ] = useState ([])

    const initialValues = {
        titleFr : '',
        titleEn : '',
        titlePolice : 'Montserrat',
        textPolice : 'Montserrat',
        titleColor : 'white',
        textColor : 'black',
        backgroundColor : 'red',
        fontSizeTitle : '14px',
        fontSizeText : '14px',
        paddingUnderTitle : '2px'
    }

    const [formData , setFormData] = useState(initialValues)
    const [modifiedData , setModifiedData] = useState(initialValues)
    const { sections ,setSections } = useRessources();
    const [showError , setShowError] = useState(false)
    const [showError2 , setShowError2] = useState(false)
    const [msgErreurColor2 , setMsgErreurColor2] = useState('#EEEEEE')
    const [showListSections , setShowListSections] = useState(false)
    const [dataChanged , setDataChanged] = useState(0)
    const [isModified , setIsModified] = useState("")

    useEffect(() => {
        Axios.get('/sections')
        .then((response) => {
            setSections(response.data)
            setSectionsTitles(defaultTitles.filter((section) => !response.data.some((section2) => section.titleFr === section2.titleFr)))
        })
        .catch((error) => {
            console.log(error)
            toast.error('Erreur lors du chargement des données')
        })
    }, [dataChanged])

    const handleTitleChange = (event) => {
        setFormData((prevData) => ({
            ...prevData ,
            titleFr : event.target.value ,
            titleEn : sectionsTitles.filter((section) => section.titleFr === event.target.value)[0].titleEn
        }))
    }
    const handleTitlePoliceChange = (event) => {
        setFormData((prevData) => ({
            ...prevData ,
            titlePolice : event.target.value
        }))
    }
    const handleTextPoliceChange = (event) => {
        setFormData((prevData) => ({
            ...prevData ,
            textPolice : event.target.value
        }))
    }
    const handleTitleColorChange = (event) => {
        setFormData((prevData) => ({
            ...prevData ,
            titleColor : event.target.value
        }))
    }
    const handleTextColorChange = (event) => {
        setFormData((prevData) => ({
            ...prevData ,
            textColor : event.target.value
        }))
    }
    const handleBackgroundColorChange = (event) => {
        setFormData((prevData) => ({
            ...prevData ,
            backgroundColor : event.target.value
        }))
    }

    const handleFontSizeTitleChange = (event) => {
        setFormData((prevData) => ({
            ...prevData ,
            fontSizeTitle : event.target.value
        }))
    }

    const handleFontSizeTextChange = (event) => {
        setFormData((prevData) => ({
            ...prevData ,
            fontSizeText : event.target.value
        }))
    }

    const handlePaddingUnderTitleChange = (event) => {
        setFormData((prevData) => ({
            ...prevData ,
            paddingUnderTitle : event.target.value
        }))
    }

    const handleAnnuler1 = () => {
        setFormData(initialValues)
    }

    const handleEnregistrer1 = () => {
        const hasEmptyFields = Object.entries(formData).some(([key,value]) => {
            return value === ''
        })
        setShowError(hasEmptyFields)
        if(!hasEmptyFields){
                const newSection = {
                    ...formData
                  };
                Axios.post('/sections' , newSection)
                  .then((response) => {
                      console.log(response)
                      setSections( prev => [...prev , newSection])
                      setDataChanged( prev => prev + 1)
                      toast.success('Section ajoutée avec succès')
                  })
                  .catch((error) => {
                        console.log(error)
                        toast.error('Erreur lors de l\'ajout de la section')
                  })  
                setFormData(initialValues)    
    }
}
    const handleshowListSections = () => {
        setShowListSections((prev) => { return !prev })
    }
    const handleDeleteSection = (_id) => {
        Axios.delete(`/sections/${_id}`)
        .then((response) => {
            console.log(response)
            toast.success('Section supprimée avec succès')
            setSections(sections.filter((section) => section._id !== _id))
            setDataChanged( prev => prev + 1)
        })
        .catch((error) => {
            console.log(error)
        })
    }
    const handleModifSection = (section) => {
        setMsgErreurColor2('#EEEEEE')
        setShowError2(false)
        const initialValues = {
            titleFr : section.titleFr,
            titleEn : section.titleEn,
            titlePolice : section.titlePolice,
            textPolice : section.textPolice,
            titleColor : section.titleColor,
            textColor : section.textColor,
            backgroundColor : section.backgroundColor,
            fontSizeTitle : section.fontSizeTitle,
            fontSizeText : section.fontSizeText,
            paddingUnderTitle : section.paddingUnderTitle
        }
        setModifiedData(initialValues)
        setIsModified(section._id)
    }

    const handleGetModifiedSection = (_id) => {
        const hasEmptyFields = Object.entries(modifiedData).some(([key,value]) => {
            return value === ''
        })
        setShowError2(hasEmptyFields)
        if(!hasEmptyFields){
                setMsgErreurColor2('#EEEEEE')
                const newSection = {
                    ...modifiedData
                  };
                Axios.put(`/sections/${_id}` , newSection)
                .then((response) => {
                    console.log(response)
                    setDataChanged( prev => prev + 1)
                    toast.success('Section modifiée avec succès')
                })
                .catch((error) => {
                    console.log(error)
                })
                setIsModified("")
        }
    }

    const confLines = [
        {   
            type : 'input',
            label : 'Police du titre',
            value : formData.titlePolice,
            handle : handleTitlePoliceChange,
            holder : 'Saisir Police ',
            style : {border: (showError && !formData.titlePolice) && "1px solid red"},
            options : []

        },
        {
            type : 'input',
            label : 'Police du texte',
            value : formData.textPolice,
            handle : handleTextPoliceChange,
            holder : 'Saisir Police',
            style : {border: (showError && !formData.textPolice) && "1px solid red"},
            options : []
        },
        {
            type : 'input',
            label : 'Couleur du titre',
            value : formData.titleColor,
            handle : handleTitleColorChange,
            holder : 'Saisir couleur',
            style : {border: (showError && !formData.titleColor) && "1px solid red"},
            options : []

        },
        {
            type : 'input',
            label : 'Couleur du texte',
            value : formData.textColor,
            handle : handleTextColorChange,
            holder : 'Saisir couleur',
            style : {border: (showError && !formData.textColor) && "1px solid red"},
            options : []
        },
        {
            type : 'input',
            label : 'Couleur du background',
            value : formData.backgroundColor,
            handle : handleBackgroundColorChange,
            holder : 'Saisir couleur ',
            style : {border: (showError && !formData.backgroundColor) && "1px solid red"},
            options : []

        },
        {
            type : 'input',
            label : 'Taille du titre',
            value : formData.fontSizeTitle,
            handle : handleFontSizeTitleChange,
            holder : 'Saisir taille',
            style : {border: (showError && !formData.fontSizeTitle) && "1px solid red"},
            options : []
        },
        {
            type : 'input',
            label : 'Taille du texte',
            value : formData.fontSizeText,
            handle : handleFontSizeTextChange,
            holder : 'Saisir taille',
            style : {border: (showError && !formData.fontSizeText) && "1px solid red"},
            options : []
        },
        {
            type : 'input',
            label : 'Padding sous le titre',
            value : formData.paddingUnderTitle,
            handle : handlePaddingUnderTitleChange,
            holder : 'Saisir padding',
            style : {border: (showError && !formData.paddingUnderTitle) && "1px solid red"},
            options : []
        }
    ]
    
  return (
    <div className='configurations' style={{marginBottom : '40px'}}>
        <div className="buttonsBox" style={{marginBottom : '40px',paddingRight:'40px', display :'flex', justifyContent:'space-between',alignItems:'center'}}>
            { !showUploadPage ? <button className="uploadbtn" onClick={clickUploadbtn}><FontAwesomeIcon icon={faUpload} /><span>Importer des sections utilisant des fichiers csv</span></button>
            : <button className="uploadbtn" onClick={clickUploadbtn}><FontAwesomeIcon icon={faUpload} /><span>Cacher la page d'importation</span></button>}
            {showUploadPage && <a className='uploadbtn' href='SectionsModel.csv' download='SectionsModel.csv'>Télécharger un modèle</a>}
      </div> 
      {showUploadPage && <UploadPage filesType={'sections'} setDataChanged={setDataChanged}/>}     
    <div className="colorsForm">
      <h4>Gestion des sections</h4>
      <div className="colorsLine">
            <div className="colorsLine">
                <h3>Titre *</h3>
                <select value={formData.titleFr} onChange={handleTitleChange}
                style={{border: (showError && !formData.titleFr) && "1px solid red"}}>
                    <option  value="" disabled hidden>----</option>
                    {sectionsTitles.map((section,index) =>(
                      <option key={index} value={section.titleFr}>{section.titleFr}</option>
                    ))}
                </select>
            </div> 
      </div>
      {
        confLines.map((line,index) => {
          return <ConfLine
          key = {index}
          type = {line.type}
          label = {line.label}
          value = {line.value}
          handle = {line.handle}
          holder = {line.holder}
          style = {line.style}
          options = {line.options}/>
    })
      }
      <div className="confButtons">
            <div>
              <button onClick={handleAnnuler1}>Annuler</button>
              <button className='appliquer' onClick={handleEnregistrer1}>Ajouter</button>
            </div>
      </div>
      <div></div>
      <ExportCSV data={sections} fileName={'sections'}/>
      <div className="applicationsList" style={{gridColumn : "span 2"}}>
            <div className="document">
              <div className="documentName">Titre</div>
              <button></button>
              { showListSections ? <button onClick={handleshowListSections}>Cacher Liste</button>:<button onClick={handleshowListSections}>Afficher Liste</button>}
            </div>
        { showListSections &&
          sections.map((section) => (
            <div key={section._id}>
                <div className="document documentLine" style= {{fontSize:'14px',color:'black'}} >
                <div className="documentName">{section.titleFr}</div>
                { isModified === section._id ? <button onClick={() => handleGetModifiedSection(section._id)}>appliquer</button> :<button onClick={() => handleModifSection(section)}>modifier</button>}
                <button onClick={()=>handleDeleteSection(section._id)} >Supprimer</button>
                </div>
                { isModified === section._id &&
                 <ModifiedSection 
                 section={section}
                 sectionsTitles = {sectionsTitles} 
                 modifiedData = {modifiedData} 
                 setModifiedData={setModifiedData} 
                 showError={showError2} 
                 msgErreurColor={msgErreurColor2}/>}
            </div>
          ))
        }
        { sections.length === 0 && <div style={{ textAlign : 'center',marginTop :'50px',fontSize :'1.2rem'}} >Aucune section trouvée</div>}
      </div>
      </div>
    </div>  
  )
}


export default GestionSections
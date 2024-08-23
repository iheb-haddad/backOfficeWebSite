import React , {useState ,useEffect} from 'react'
import './Configurations.css'
import Axios from '../../services/Axios';
import GestionSections from '../gestionSections/GestionSections';
import ConfLine from '../confLine/ConfLine';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus ,faEllipsis , faUpload} from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@iconify/react';
import useAuth from '../../hooks/useAuth';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import useRessources from '../../hooks/useRessources';
import ExportCSV from '../exportCsv/ExportCsv';
import UploadPage from '../uploadPage/UploadPage';
import useStore from '../../globalState/UseStore';
import { toast } from 'sonner';

function Configurations() {
  const [initialValues , setInitialValues] = useState({})
  const [dataChanged , setDataChanged] = useState(0)
  const [languagesChanged , setLanguagesChanged] = useState(0)
  const [ notAllowedLanguages , setNotAllowedLanguages] = useState([])
  const[ isAddingLanguage , setIsAddingLanguage] = useState(false)
  const { setNavLineClicked , setLiveConfiguration ,auth} = useAuth();
  const [showUploadPage , setShowUploadPage] = useState(false)

  const clickUploadbtn = () => {
    setShowUploadPage(prev => !prev)
  }

  const [configurations , setConfigurations] = useState([])
  const { languages ,setLanguages , confSelected , setConfSelected } = useRessources();
  const { projects , fetchProjects } = useStore();

  const langs = [
    {
      name: 'Français',
      code: 'fr',
    },
    {
      name: 'English',
      code: 'en',
    },
    {
      name: 'Español',
      code: 'es',
    },
    {
      name: 'Deutsch',
      code: 'de',
    },
    {
      name: 'Italiano',
      code: 'it',
    },
    {
      name: 'Português',
      code: 'pt',
    },
    {
      name: 'العربية',
      code: 'ar',
    },
    {
      name: '中文',
      code: 'zh',
    },
    {
      name: 'Türkçe',
      code: 'tr',
    },
    {
      name: 'Nederlands',
      code: 'nl',
    },
    {
      name: 'Polski',
      code: 'pl',
    }
  ]

  useEffect(() => {
    setNavLineClicked("settings")
    Axios.get('/languages')
      .then((response) => {
        setLanguages(response.data)
        setNotAllowedLanguages(langs.filter(lng => !response.data.map(l => l.code).includes(lng.code)))
      })
      .catch((error) => {
        console.error('Error fetching documents:', error);
      });
    },[languagesChanged]);

    useEffect(() => {
      const user = auth?.user?._id || '';
      fetchProjects(user)
    },[dataChanged]);

    const [projet , setProjet] = useState(confSelected.idProject)

  useEffect(() => {
      Axios.get('/configurations')
      .then((response) => {
        setConfigurations(response.data)
        const conf = response.data.find((conf) => conf.idProject === projet)
        conf && setConfSelected(conf)
        setInitialValues(conf)
      })
      .catch((error) => {
        console.error('Error fetching documents:', error);
        toast.error('Erreur lors du chargement des données')
      });
    },[dataChanged,projet]);
    
    const handlePanelColorChange = (event) => {
      setConfSelected((prevData) => ({
          ...prevData,
          panelColor : event.target.value,
      }
      ))
    };

    const handlePanelTextColorChange = (event) => {
      setConfSelected((prevData) => ({
          ...prevData,
          panelTextColor : event.target.value,
      }))
    };

      const handleMemoSectionChange = (event) => {
        setConfSelected((prevData) => ({
          ...prevData,
          memoSection : event.target.value,
      }
      ))
      };

      const handleMemoBackColorChange = (event) => {
        setConfSelected((prevData) => ({
            ...prevData,
            memoBackgroundColor : event.target.value,
        }
        ))
      };

      const handleMemoFontColorChange = (event) => {
        setConfSelected((prevData) => ({
            ...prevData,
            memoFontColor : event.target.value,
        }
        ))
      };

      const handlePanelWidthChange = (event) => {
        setConfSelected((prevData) => ({
          ...prevData,
          panelWidth : event.target.value,
      }
      ))
      };

      const handleTimerChange = (event) => {
        setConfSelected((prevData) => ({
          ...prevData,
          timer : parseInt(event.target.value),
      }
      ))
    };

    const handleResizeBarWidthChange = (event) => {
      setConfSelected((prevData) => ({
        ...prevData,
        resizeBarWidth : event.target.value,
    }
    ))
  };

      const initialInputColors ={
        panelFieldColor : 'white',
        panelTextColorFieldColor : 'white',
        memoFieldColor : 'white',
        memoBackColorFieldColor : 'white',
        memoFontColorFieldColor : 'white',
        widthPanelFieldColor : 'white',
        timerFieldColor : 'white',
        resizeBarWidthFieldColor : 'white'
      }
      const [inputColor, setInputColor] = useState(initialInputColors)

      const changeInputColors = () =>{
        if(confSelected.panelColor != initialValues.panelColor)
        {
          setInputColor((prevData) => ({
            ...prevData,
            panelFieldColor : "#50e150"
          }));
        }

        if(confSelected.panelTextColor != initialValues.panelTextColor)
        {
          setInputColor((prevData) => ({
            ...prevData,
            panelTextColorFieldColor : "#50e150"
          }));
        }

        if(confSelected.memoBackColor != initialValues.memoBackColor)
        {
          setInputColor((prevData) => ({
            ...prevData,
            memoBackColorFieldColor : "#50e150"
          }));
        }

        if(confSelected.memoFontColor != initialValues.memoFontColor)
        {
          setInputColor((prevData) => ({
            ...prevData,
            memoFontColorFieldColor : "#50e150"
          }));
        }

        if(confSelected.memoSection != initialValues.memoSection)
        {
          setInputColor((prevColor) => ({
            ...prevColor,
            memoFieldColor : "#50e150"
          }));
        }
        if(confSelected.panelWidth != initialValues.panelWidth)
        {
          setInputColor((prevColor) => ({
            ...prevColor,
            widthPanelFieldColor : "#50e150"
          }));
        }
        if(confSelected.timer != initialValues.timer)
        {
          setInputColor((prevColor) => ({
            ...prevColor,
            timerFieldColor : "#50e150"
          }));
        }
        if(confSelected.resizeBarWidth != initialValues.resizeBarWidth)
        {
          setInputColor((prevColor) => ({
            ...prevColor,
            resizeBarWidthFieldColor : "#50e150"
          }));
        }

        setTimeout(() => {
          setInputColor(initialInputColors)
      }, 2000);
      };

      const handleEnregistrer1 = () =>{
            changeInputColors();
            Axios.put(`/configurations/${confSelected._id}`, confSelected)
            .then((data) => {
              setInitialValues(confSelected)
              setDataChanged(prev => prev + 1)
              console.log('Object modified:', data);
              toast.success('Configuration modifiée avec succès')
            })
            .catch((error) => {
              console.error('Error modifying object:', error);
              toast.error('Erreur lors de la modification')
            });
      };
      const handleAnnuler1 = () => {
        setConfSelected(initialValues)
      };

      const reinitialisedData = {
        idProject : confSelected.idProject,
        panelColor : 'white',
        panelTextColor : 'black',
        panelWidth : "300px",
        memoSection : "display",
        memoBackgroundColor : '#ffc000',
        memoFontColor : 'white',
        generalUrl : confSelected.generalUrl,
        timer : 10 ,
        resizeBarWidth : '5px'
      }

      const handleAReinitialiser = () => {
        setConfSelected(reinitialisedData)
            Axios.put(`/configurations/${confSelected._id}`, reinitialisedData)
            .then((data) => {
              console.log('Object modified:', data);
              setInitialValues(reinitialisedData)
              setDataChanged(prev => prev + 1)
              // You can update your UI or perform other actions here
            })
            .catch((error) => {
              console.error('Error modifying object:', error);
            });
      };

      const addLanguage = (lng) => {
        Axios.post('/languages', lng)
        .then((response) => {
          console.log('New language added:', response.data);
          setLanguagesChanged(prev => prev + 1)
          setNotAllowedLanguages(prev => prev.filter(l => l.code != lng.code))
        })
        .catch((error) => {console.log('Error:', error)
        });
      }

      const deleteLanguage = (lng) => {
        Axios.delete(`/languages/${lng._id}`)
        .then((response) => {
          console.log('Language deleted:', response.data);
          setLanguages(prev => prev.filter(l => l.code != lng.code))
          setNotAllowedLanguages(prev => [...prev,lng])
        })
        .catch((error) => {console.log('Error:', error)
        });
      }

      const confLines = [
        {
          type : 'input',
          label : 'Couleur du panneau',
          value : confSelected.panelColor,
          handle : handlePanelColorChange,
          holder : 'Saisir couleur',
          style : {backgroundColor:inputColor.panelFieldColor},
          options : []
        },
        {
          type : 'input',
          label : 'Couleur du texte du panneau',
          value : confSelected.panelTextColor,
          handle : handlePanelTextColorChange,
          holder : 'Saisir couleur',
          style : {backgroundColor:inputColor.panelTextColorFieldColor},
          options : []
        },
        {
          type : 'select',
          label : 'Affichage de la section Mémo',
          value : confSelected.memoSection,
          handle : handleMemoSectionChange,
          holder : '',
          style : {backgroundColor:inputColor.memoFieldColor} ,
          options : [
              { title : 'Afficher Mémo',
              value : 'display' },
            { title : 'Cacher Mémo',
              value : 'hide' }
          ]
        },
        {
          type : 'input',
          label : 'Couleur de section Mémo',
          value : confSelected.memoBackgroundColor,
          handle : handleMemoBackColorChange,
          holder : 'Saisir couleur',
          style : {backgroundColor:inputColor.memoBackColorFieldColor},
          options : []
        },
        {
          type : 'input',
          label : 'Couleur du texte Mémo',
          value : confSelected.memoFontColor,
          handle : handleMemoFontColorChange,
          holder : 'Saisir couleur',
          style : {backgroundColor:inputColor.memoFontColorFieldColor},
          options : []
        },
        {
          type : 'input',
          label : 'Largeur initial du panneau',
          value : confSelected.panelWidth,
          handle : handlePanelWidthChange,
          holder : 'Saisir couleur',
          style : {backgroundColor:inputColor.widthPanelFieldColor},
          options : []
        },
        {
          type : 'input',
          label : 'Durée du Timer (en minutes)',
          value : confSelected.timer,
          handle : handleTimerChange,
          holder : 'Saisir durée',
          style : {backgroundColor:inputColor.timerFieldColor},
          options : []
        },
        {
          type : 'input',
          label : 'Largeur de la barre de redimensionnement',
          value : confSelected.resizeBarWidth,
          handle : handleResizeBarWidthChange,
          holder : 'Saisir largeur',
          style : {backgroundColor:inputColor.resizeBarWidthFieldColor},
          options : []
        }
      ]

      const [open, setOpen] = useState(false);

      const onOpenModal = () => setOpen(true);
      const onCloseModal = () => setOpen(false);

      const handleLiveConfiguration = () => {
        setLiveConfiguration( prev => !prev)
      }


      const handleProjectChange = (event) => {
        setProjet(event.target.value)
        const conf = configurations.find(c => c.idProject === event.target.value)
        setConfSelected(conf)
        setInitialValues(conf)
      }

  return (
    <div className='configurations' style={{paddingTop : '40px' , position : 'relative'}}>
      <div className="buttonsBox" style={{marginBottom : '40px',paddingRight:'40px', display :'flex', justifyContent:'space-between',alignItems:'center'}}>
            { !showUploadPage ? <button className="uploadbtn" onClick={clickUploadbtn}><FontAwesomeIcon icon={faUpload} /><span>Importer configuration utilisant des fichiers csv</span></button>
            : <button className="uploadbtn" onClick={clickUploadbtn}><FontAwesomeIcon icon={faUpload} /><span>Cacher la page d'importation</span></button>}
            {showUploadPage && <a className='uploadbtn' href='ConfigurationsModel.csv' download='ConfigurationsModel.csv'>Télécharger un modèle</a>}
      </div> 
      {showUploadPage && <UploadPage filesType={'configurations'} setDataChanged={setDataChanged}/>}     
      <div className="colorsForm">
        <h4>Configuration du panneau latéral</h4>
        <div className="configLine">
        <h3>Projet correspondant</h3>
              <select value={projet} onChange={handleProjectChange}>
                  <option value="" disabled hidden>----</option>
                  {
                    projects.map((project) => (
                      <option key={project._id} value={project._id}>{project.name}</option>
                    ))
                  }
              </select>
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
        })}
        <div className="confButtons">
              <div>
                <button onClick={handleAReinitialiser}>Réinitialiser</button>
                <button onClick={handleAnnuler1}>Annuler</button>
                <button className='appliquer' onClick={handleEnregistrer1}>Appliquer</button>
              </div>
        </div>
        <div></div>
        <ExportCSV data={configurations} fileName={'configurations'}/>
      </div> 
      <div className="colorsForm" style={{gridTemplateColumns : "auto", gap : "0", paddingTop : "40px", paddingBottom : "40px"}}>
        <h4>Configuration des langues</h4>
        {
          languages.map((language,index) => (
            <div key={index} className='languageLine' style={{color : "black"}}>
              {language.name}
              <FontAwesomeIcon icon={faMinus} style={{cursor : "pointer"}} onClick={() => deleteLanguage(language)}/>
              </div>
          ))
        }
        {
          notAllowedLanguages.length > 0 &&
          <div className="languageLine addLine" style={{color : "#8d7878"}} onClick={() => setIsAddingLanguage(!isAddingLanguage)}>
            Ajouter une langue
            <FontAwesomeIcon icon={faEllipsis} style={{cursor : "pointer"}}/>
          </div>
        }
        {
            isAddingLanguage && notAllowedLanguages.map((language,index) => (
                <div key={index} className='languageLine addLine' style={{color : "#8d7878"}}>
                   {language.name}
                    <FontAwesomeIcon icon={faPlus} style={{cursor : "pointer"}} onClick={() => addLanguage(language)}/>
                </div>
              ))
        }
      </div>
      <GestionSections />
      <div className="infoContainer">
        <div className="buttonsInfo">
            <button onClick={handleLiveConfiguration}>Configurer en direct</button>
            <Icon className='infoIcon' icon="mdi:information-variant-circle-outline" onClick={onOpenModal}/>
        </div>
          <Modal open={open} onClose={onCloseModal} center>
            <img src="./fleche1.png" alt="" className='fleche1'/>
            <img src="./modeNormal.png" alt="" className='demo'/>
            <h4 className="panelColor">Couleur <br/>du panneau</h4>
            <img src="./fleche2.png" alt="" className='fleche2'/>
            <h4 className="memoSection">Section <br/>mémo</h4>
            <img src="./fleche2.png" alt="" className='fleche3'/>
            <h4 className="barreRed">Barre de <br/>redimensionnement</h4>
            <img src="./fleche3.png" alt="" className='fleche4'/>
            <h4 className="sectionText">Texte de section</h4>
            <img src="./fleche4.png" alt="" className="fleche5" />
            <h4 className="sectionTitle">Titre de section</h4>
          </Modal>
      </div>
    </div>
  )
}

export default Configurations


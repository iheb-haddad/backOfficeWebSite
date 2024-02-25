import React , {useState ,useEffect} from 'react'
import './Configurations.css'
import Axios from '../../services/Axios';
import GestionSections from '../gestionSections/GestionSections';
import ConfLine from '../confLine/ConfLine';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus ,faEllipsis} from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@iconify/react';

function Configurations() {
  const [initialValues , setInitialValues] = useState({})
  const [dataChanged , setDataChanged] = useState(0)
  const [ languages , setLanguages] = useState([])
  const [ notAllowedLanguages , setNotAllowedLanguages] = useState([])
  const[ isAddingLanguage , setIsAddingLanguage] = useState(false)

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
    }
  ]

  const defaultData = {
    panelColor: "white",
    panelWidth : "300px",
    memoSection : "display",
    memoBackColor : "#ffc000",
    memoFontColor : 'white',
    generalUrl : "",
    timer : 10 ,
    resizeBarWidth : '5px'
  }
  const [configurations , setConfigurations] = useState(defaultData)

  useEffect(() => {
    Axios.get('/languages')
      .then((response) => {
        setLanguages(response.data)
        setNotAllowedLanguages(langs.filter(lng => !response.data.map(l => l.code).includes(lng.code)))
      })
      .catch((error) => {
        console.error('Error fetching documents:', error);
      });
    },[]);

  useEffect(() => {
    Axios.get('/configurations')
      .then((data) => {
        if(data.data.length > 0){
        setConfigurations(data.data[0])
        setInitialValues(data.data[0])
        }else{
          Axios.post('/configurations',defaultData)
          .then((response) => {
            console.log('New conf added:', response.data);
            setConfigurations(defaultData)
            setInitialValues(defaultData)
          })
          .catch((error) => {
            console.error('Error adding new conf:', error);
          });
        }
          })
      .catch((error) => {
        console.error('Error fetching documents:', error);
      });
    },[dataChanged]);
    
    const handlePanelColorChange = (event) => {
      setConfigurations((prevData) => ({
          ...prevData,
          panelColor : event.target.value,
      }
      ))
    };

      const handleMemoSectionChange = (event) => {
        setConfigurations((prevData) => ({
          ...prevData,
          memoSection : event.target.value,
      }
      ))
      };

      const handleMemoBackColorChange = (event) => {
        setConfigurations((prevData) => ({
            ...prevData,
            memoBackColor : event.target.value,
        }
        ))
      };

      const handleMemoFontColorChange = (event) => {
        setConfigurations((prevData) => ({
            ...prevData,
            memoFontColor : event.target.value,
        }
        ))
      };

      const handlePanelWidthChange = (event) => {
        setConfigurations((prevData) => ({
          ...prevData,
          panelWidth : event.target.value,
      }
      ))
      };

      const handleTimerChange = (event) => {
        setConfigurations((prevData) => ({
          ...prevData,
          timer : parseInt(event.target.value),
      }
      ))
    };

    const handleResizeBarWidthChange = (event) => {
      setConfigurations((prevData) => ({
        ...prevData,
        resizeBarWidth : event.target.value,
    }
    ))
  };

      const initialInputColors ={
        panelFieldColor : 'white',
        memoFieldColor : 'white',
        memoBackColorFieldColor : 'white',
        memoFontColorFieldColor : 'white',
        widthPanelFieldColor : 'white',
        timerFieldColor : 'white',
        resizeBarWidthFieldColor : 'white'
      }
      const [inputColor, setInputColor] = useState(initialInputColors)

      const changeInputColors = () =>{
        if(configurations.panelColor != initialValues.panelColor)
        {
          setInputColor((prevData) => ({
            ...prevData,
            panelFieldColor : "#50e150"
          }));
        }

        if(configurations.memoBackColor != initialValues.memoBackColor)
        {
          setInputColor((prevData) => ({
            ...prevData,
            memoBackColorFieldColor : "#50e150"
          }));
        }

        if(configurations.memoFontColor != initialValues.memoFontColor)
        {
          setInputColor((prevData) => ({
            ...prevData,
            memoFontColorFieldColor : "#50e150"
          }));
        }

        if(configurations.memoSection != initialValues.memoSection)
        {
          setInputColor((prevColor) => ({
            ...prevColor,
            memoFieldColor : "#50e150"
          }));
        }
        if(configurations.panelWidth != initialValues.panelWidth)
        {
          setInputColor((prevColor) => ({
            ...prevColor,
            widthPanelFieldColor : "#50e150"
          }));
        }
        if(configurations.timer != initialValues.timer)
        {
          setInputColor((prevColor) => ({
            ...prevColor,
            timerFieldColor : "#50e150"
          }));
        }
        if(configurations.resizeBarWidth != initialValues.resizeBarWidth)
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
        console.log("updating", configurations.id)
            changeInputColors();
            Axios.put(`/configurations`, configurations)
            .then((data) => {
              setInitialValues(configurations)
              setDataChanged(prev => prev + 1)
              console.log('Object modified:', data);
              // You can update your UI or perform other actions here
            })
            .catch((error) => {
              console.error('Error modifying object:', error);
            });
      };
      const handleAnnuler1 = () => {
        setConfigurations(initialValues)
      };

      const reinitialisedData = {
        panelColor : 'white',
        panelWidth : "300px",
        memoSection : "display",
        memoBackColor : '#ffc000',
        memoFontColor : 'white',
        generalUrl : configurations.generalUrl,
        timer : 10 ,
        resizeBarWidth : '5px'
      }

      const handleAReinitialiser = () => {
        setConfigurations(reinitialisedData)
            Axios.put(`/configurations`, reinitialisedData)
            .then((data) => {
              console.log('Object modified:', data);
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
          setLanguages(prev => [...prev,lng])
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
          value : configurations.panelColor,
          handle : handlePanelColorChange,
          holder : 'Saisir couleur',
          style : {backgroundColor:inputColor.panelFieldColor},
          options : []
        },
        {
          type : 'select',
          label : 'Affichage de la section Mémo',
          value : configurations.memoSection,
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
          value : configurations.memoBackColor,
          handle : handleMemoBackColorChange,
          holder : 'Saisir couleur',
          style : {backgroundColor:inputColor.memoBackColorFieldColor},
          options : []
        },
        {
          type : 'input',
          label : 'Couleur du texte Mémo',
          value : configurations.memoFontColor,
          handle : handleMemoFontColorChange,
          holder : 'Saisir couleur',
          style : {backgroundColor:inputColor.memoFontColorFieldColor},
          options : []
        },
        {
          type : 'input',
          label : 'Largeur initial du panneau',
          value : configurations.panelWidth,
          handle : handlePanelWidthChange,
          holder : 'Saisir couleur',
          style : {backgroundColor:inputColor.widthPanelFieldColor},
          options : []
        },
        {
          type : 'input',
          label : 'Durée du Timer (en minutes)',
          value : configurations.timer,
          handle : handleTimerChange,
          holder : 'Saisir durée',
          style : {backgroundColor:inputColor.timerFieldColor},
          options : []
        },
        {
          type : 'input',
          label : 'Largeur de la barre de redimensionnement',
          value : configurations.resizeBarWidth,
          handle : handleResizeBarWidthChange,
          holder : 'Saisir largeur',
          style : {backgroundColor:inputColor.resizeBarWidthFieldColor},
          options : []
        }
      ]

  return (
    <div className='configurations' style={{paddingTop : '40px' , position : 'relative'}}>
      <div className="colorsForm">
        <h4>Configuration du panneau latéral</h4>
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
          <Icon className='infoIcon' icon="mdi:information-variant-circle-outline" />
      </div>
    </div>
  )
}

export default Configurations


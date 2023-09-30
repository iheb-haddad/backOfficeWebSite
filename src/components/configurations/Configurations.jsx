import React , {useState ,useEffect} from 'react'
import './Configurations.css'
import Axios from '../../services/Axios';
function Configurations() {
  const [configurations , setConfigurations] = useState({})
  const [documentations , setDocumentations] = useState([])
  const [initialValues , setInitialValues] = useState({})
  const [msgErreur1Color, setMsgErreur1Color] = useState('white');
  const [msgErreur2Color, setMsgErreur2Color] = useState('white');
  const [dataChanged , setDataChanged] = useState(0)
  const [showListApp ,setShowListApp] = useState(false)

  const handleShowListApp = () => {
    setShowListApp(prev => !prev)
  }

  const handleDeleteApp = (urlApp,appId) => {
    if(!documentations.some((doc)=> doc.application === urlApp)){
    Axios.delete(`/webapplications/${appId}`)
    .then((data) => {
        setDataChanged(prev => prev +1)
          // You can update your UI or perform other actions here
        })
        .catch((error) => {
          console.error('Error deleting ', error);
        });
  }}
  const defaultData = {
    panelColor: "white",
    panelWidth : "300px",
    alertColor : "red",
    docColor : "#d0cece",
    instColor : "#4472c4",
    memoColor : "#ffc000",
    docGeneralUrl :''
  }

  useEffect(() => {
    fetch('https://urlsjsonserver-p2nq.onrender.com/configurations')
    .then((response) => response.json())
    .then((data) => {
        if(data.length > 0){
        setConfigurations(data[0])
        setInitialValues(data[0])
        }else{
          fetch('https://urlsjsonserver-p2nq.onrender.com/configurations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(defaultData),
          })
            .then((response) => response.json())
            .then((data) => {
            console.log('New conf added:', data); // Use response.data to access the server response
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

    useEffect(() => {
      fetch('https://urlsjsonserver-p2nq.onrender.com/documentations')
        .then((response) => response.json())
        .then((data) => {
        setDocumentations(data)
              })
          .catch((error) => {
            console.error('Error fetching documents:', error);
          });

      }, [dataChanged]);

    useEffect(() => {
      fetch('https://urlsjsonserver-p2nq.onrender.com/webApplications')
        .then((response) => response.json())
        .then((data) => {
        setWebApplications(data) 
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

      const handleAlertBoxColorChange = (event) => {
        setConfigurations((prevData) => ({
            ...prevData,
            alertColor : event.target.value,
        }
        ))
      };
      const handleDocsBoxColorChange = (event) => {
        setConfigurations((prevData) => ({
          ...prevData,
          docColor : event.target.value,
      }
      ))
      };
      const handleInstructionsBoxColorChange = (event) => {
        setConfigurations((prevData) => ({
          ...prevData,
          instColor : event.target.value,
      }
      ))
      };
      const handleMemoBoxColorChange = (event) => {
        setConfigurations((prevData) => ({
          ...prevData,
          memoColor : event.target.value,
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
      const handleDocGeneralUrlChange = (event) => {
        setConfigurations((prevData) => ({
          ...prevData,
          docGeneralUrl : event.target.value,
      }
      ))
      };


      const initialInputColors ={
        panelFieldColor : 'white',
        alertFieldColor : 'white',
        docFieldColor : 'white',
        instFieldColor:'white',
        memoFieldColor : 'white',
        widthPanelFieldColor : 'white',
        docGeneralUrlFieldColor : 'white',
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
        if(configurations.alertColor != initialValues.alertColor)
        {
          setInputColor((prevData) => ({
            ...prevData,
            alertFieldColor : "#50e150"
          }));
        }
        if(configurations.docColor != initialValues.docColor)
        {
          setInputColor((prevColor) => ({
            ...prevColor,
            docFieldColor : "#50e150"
          }));
        }
        if(configurations.instColor != initialValues.instColor)
        {
          setInputColor((prevColor) => ({
            ...prevColor,
            instFieldColor : "#50e150"
          }));
        }
        if(configurations.memoColor != initialValues.memoColor)
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

        setTimeout(() => {
          setInputColor(initialInputColors)
      }, 2000);
      };

      const changeDocGeneralUrlInputColor = () => {
        if(configurations.docGeneralUrl != initialValues.docGeneralUrl)
        {
          setInputColor((prevColor) => ({
            ...prevColor,
            docGeneralUrlFieldColor : "#50e150"
          }));
        }
        setTimeout(() => {
          setInputColor((prevColor) => ({
            ...prevColor,
            docGeneralUrlFieldColor : "white"
          }));
      }, 2000);
      };

      const handleEnregistrer1 = () =>{
        console.log("updating", configurations._id)
            changeInputColors();
            configurations.docGeneralUrl = initialValues.docGeneralUrl
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
        const url = configurations.docGeneralUrl
        setConfigurations(initialValues)
        setConfigurations((prevData)=>({
          ...prevData,
          docGeneralUrl: url
        }))
      };

      const reinitialisedData = {
        panelColor : 'white',
        panelWidth : "300px",
        alertColor : "red",
        docColor : "#d0cece",
        instColor : "#4472c4",
        memoColor : "#ffc000",
        docGeneralUrl : configurations.docGeneralUrl
      }

      const handleAReinitialiser = () => {
        const url = configurations.docGeneralUrl
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

      const handleEnregistrer2 = () => {
        changeDocGeneralUrlInputColor();
        initialValues.docGeneralUrl = configurations.docGeneralUrl
        console.log(initialValues.docGeneralUrl);
        Axios.put(`/configurations`, initialValues)
        .then((data) => {
          // setInitialValues(configurations)
          console.log('Object modified:', data);
          // You can update your UI or perform other actions here
        })
        .catch((error) => {
          console.error('Error modifying object:', error);
        });
      };

      const handleAnnuler2 = () => {
        setConfigurations((prevData)=>({
          ...prevData,
          docGeneralUrl: initialValues.docGeneralUrl
        }))
      };

      const initialApp = {
        nom :'',
        url:''
      }
      const [webApplications , setWebApplications] = useState()
      const [webApplicationForm , setWebApplicationForm] = useState(initialApp)

      const handleNameAppChange = (event) => {
        setMsgErreur1Color("white")
        setWebApplicationForm((prevData) => ({
          ...prevData,
          nom : event.target.value,
      }
      ))
      };
      const handleUrlAppChange = (event) => {
        setMsgErreur2Color("white")
        setWebApplicationForm((prevData) => ({
          ...prevData,
          url : event.target.value,
      }
      ))
      };

      const handleEnregistrerWebApp = () => {
      if(!webApplications.some(app => app.nom === webApplicationForm.nom)){
        if(!webApplications.some(app => app.url === webApplicationForm.url)){
        const newApp = {
            id: Math.random().toString(36).substring(7),
            nom : webApplicationForm.nom,
            url : webApplicationForm.url
          };
          Axios.post("/webapplications",newApp)
            .then((data) => {
              console.log('New app added:', data);
              setWebApplicationForm(initialApp);
              setDataChanged(prev => prev + 1)
              // You can update your UI or perform other actions here
            })
            .catch((error) => {
              console.error('Error adding new admin:', error);
            });
          }else{
            setMsgErreur2Color("red")
          }
          }else{
            setMsgErreur1Color("red")
          }  
        };  
        const handleAnnulerWebApp = () => {
          setWebApplicationForm(initialApp)
        };
  return (
    <div className='configurations'>
    <div className="colorsForm">
      <h4>Configuration du panneau latéral</h4>
      <div className="colorsLine">
           <h3>Couleur du panneau</h3>
          <input
              type="text"
              value={configurations.panelColor}
              onChange={handlePanelColorChange}
              placeholder="Saisir titre "
              style={{backgroundColor:inputColor.panelColor}}
              />
      </div>
    <div className="colorsLine">
           <h3>Couleur du bloc d'alertes</h3>
          <input
              type="text"
              value={configurations.alertColor}
              onChange={handleAlertBoxColorChange}
              placeholder="Saisir titre "
              style={{backgroundColor:inputColor.alertColor}}
              />
      </div>
      <div className="colorsLine">
           <h3>Couleur du bloc des documents</h3>
          <input
              type="text"
              value={configurations.docColor}
              onChange={handleDocsBoxColorChange}
              placeholder="Saisir titre "
              style={{backgroundColor:inputColor.docColor}}
              />
      </div>
      <div className="colorsLine">
           <h3>Couleur du bloc d'instructions</h3>
          <input
              type="text"
              value={configurations.instColor}
              onChange={handleInstructionsBoxColorChange}
              placeholder="Saisir titre "
              style={{backgroundColor:inputColor.instColor}}
              />
      </div>
      <div className="colorsLine">
           <h3>Couleur du bloc des mémo</h3>
          <input
              type="text"
              value={configurations.memoColor}
              onChange={handleMemoBoxColorChange}
              placeholder="Saisir titre "
              style={{backgroundColor:inputColor.memoColor}}
              />
      </div>
      <div className="colorsLine">
           <h3>Largeur initial du panneau</h3>
          <input
              type="text"
              value={configurations.panelWidth}
              onChange={handlePanelWidthChange}
              placeholder="Saisir titre "
              style={{backgroundColor:inputColor.widthPanelFieldColor}}
              />
      </div>
      <div className="colorsLine">
      </div>
      <div className="confButtons">
            <div>
              <button onClick={handleAReinitialiser}>Réinitialiser</button>
              <button onClick={handleAnnuler1}>Annuler</button>
              <button className='appliquer' onClick={handleEnregistrer1}>Appliquer</button>
            </div>
      </div>
      </div>
      <div className="urlBox">
        <h5>Applications Web</h5>   
        <h4>Ajouter une nouvelle application web qui correspond à votre documentation.</h4>
        <div className='urlForm'>
        <div className="urlLine">
           <h3>Nom de l'application</h3>
          <input
              type="text"
              value={webApplicationForm.nom}
              onChange={handleNameAppChange}
              placeholder="Saisir titre "
              />
            <div className="adminErr">
                <p style={{color:msgErreur1Color}}>Nom app déjà existe</p>
            </div> 
        </div>
        <div className="urlLine" >
           <h3>URL / Mots-clés</h3>
          <input
              type="text"
              value={webApplicationForm.url}
              onChange={handleUrlAppChange}
              placeholder="Saisir titre "
              />
            <div className="adminErr">
                <p style={{color:msgErreur2Color}}>Url app déjà existe</p>
            </div>   
        </div>
      </div>
      <div className="applicationsList">
            <div className="application">
              <div className="applicationName">Nom</div>
              <div className="applicationKeyword">Url / Mots Clés</div>
              { showListApp ? <button onClick={handleShowListApp}>Cacher Liste</button>:<button onClick={handleShowListApp}>Afficher Liste</button>}
            </div>
        { showListApp &&
          webApplications.map((app) => (
            <div className="application" style= {{fontSize:'14px',color:'black'}} key={app.id}>
              <div className="applicationName">{app.nom}</div>
              <div className="applicationKeyword">{app.url}</div>
              <button onClick={()=>handleDeleteApp(app.url,app.id)} style={{color: documentations.some((doc)=> doc.application === app.url) && '#d4d9dd'}}>Supprimer</button>
            </div>
          ))
        }
      </div>
      <div className="confButtons">
              <button onClick={handleAnnulerWebApp}>Annuler</button>
              <button className='appliquer' onClick={handleEnregistrerWebApp}>Appliquer</button>
      </div>
      </div>    
      <div className="urlBox" style={{marginBottom:'40px'}}>
        <h4>Si vous possedez un url général pour stocker les documentations , vous pouvez l'ajouter ici.</h4>
        <div className='urlForm'>
        <div className="urlLine">
           <h3>Url général de documentation</h3>
          <input
              type="text"
              value={configurations.docGeneralUrl}
              onChange={handleDocGeneralUrlChange}
              placeholder="Saisir titre "
              style={{backgroundColor:inputColor.docGeneralUrlColor}}
              />
        </div>
      </div>
      <div className="confButtons">
              <button onClick={handleAnnuler2}>Annuler</button>
              <button className='appliquer' onClick={handleEnregistrer2}>Appliquer</button>
      </div>
      </div> 
    </div>
  )
}

export default Configurations

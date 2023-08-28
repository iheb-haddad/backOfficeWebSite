import React , {useState ,useEffect} from 'react'
import './Configurations.css'
function Configurations() {
  const [configurations , setConfigurations] = useState([])
  const [initialValues , setInitialValues] = useState([])
  const [msgErreur1Color, setMsgErreur1Color] = useState('white');
  const [msgErreur2Color, setMsgErreur2Color] = useState('white');
  const [dataChanged , setDataChanged] = useState(0)

  useEffect(() => {
    fetch('https://urlsjsonserver-p2nq.onrender.com/configurations')
      .then((response) => response.json())
      .then((data) => {
        setConfigurations(data)
        setInitialValues(data)
          })
      .catch((error) => {
        console.error('Error fetching documents:', error);
      });
    },[]);

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
      const handleUrlGeneralChange = (event) => {
        setConfigurations((prevData) => ({
          ...prevData,
          generalUrl : event.target.value,
      }
      ))
      };

      const initialInputColors ={
        alertColor : 'white',
        docColor : 'white',
        instColor:'white',
        memoColor : 'white',
        widthPanelColor : 'white',
        generalUrlColor : 'white',
      }
      const [inputColor, setInputColor] = useState(initialInputColors)

      const changeInputColors = () =>{
        if(configurations.alertColor != initialValues.alertColor)
        {
          setInputColor((prevData) => ({
            ...prevData,
            alertColor : "#50e150"
          }));
        }
        if(configurations.docColor != initialValues.docColor)
        {
          setInputColor((prevColor) => ({
            ...prevColor,
            docColor : "#50e150"
          }));
        }
        if(configurations.instColor != initialValues.instColor)
        {
          setInputColor((prevColor) => ({
            ...prevColor,
            instColor : "#50e150"
          }));
        }
        if(configurations.memoColor != initialValues.memoColor)
        {
          setInputColor((prevColor) => ({
            ...prevColor,
            memoColor : "#50e150"
          }));
        }
        if(configurations.widthPanel != initialValues.widthPanel)
        {
          setInputColor((prevColor) => ({
            ...prevColor,
            widthPanelColor : "#50e150"
          }));
        }

        setTimeout(() => {
          setInputColor(initialInputColors)
      }, 2000);
      };

      const changeGeneralUrlInputColor = () => {
        if(configurations.generalUrl != initialValues.generalUrl)
        {
          setInputColor((prevColor) => ({
            ...prevColor,
            generalUrlColor : "#50e150"
          }));
        }
        setTimeout(() => {
          setInputColor((prevColor) => ({
            ...prevColor,
            generalUrlColor : "white"
          }));
      }, 2000);
      };
      const handleEnregistrer1 = () =>{
            changeInputColors();
            configurations.generalUrl = initialValues.generalUrl
        fetch(`https://urlsjsonserver-p2nq.onrender.com/configurations`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(configurations),
          })
            .then((response) => response.json())
            .then((data) => {
              setInitialValues(configurations)
              console.log('Object modified:', data);
              // You can update your UI or perform other actions here
            })
            .catch((error) => {
              console.error('Error modifying object:', error);
            });
      };
      const handleAnnuler1 = () => {
        const url = configurations.generalUrl
        setConfigurations(initialValues)
        setConfigurations((prevData)=>({
          ...prevData,
          generalUrl: url
        }))
      };

      const reinitialisedData = {
        panelWidth : "300px",
        alertColor : "red",
        docColor : "#d0cece",
        instColor : "#4472c4",
        memoColor : "#ffc000"
      }

      const handleAReinitialiser = () => {
        const url = configurations.generalUrl
        setConfigurations(reinitialisedData)
        setConfigurations((prevData)=>({
          ...prevData,
          generalUrl: url
        }))
      };

      const handleEnregistrer2 = () => {
        changeGeneralUrlInputColor();
        initialValues.generalUrl = configurations.generalUrl
    fetch(`https://urlsjsonserver-p2nq.onrender.com/configurations`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(initialValues),
      })
        .then((response) => response.json())
        .then((data) => {
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
          generalUrl: initialValues.generalUrl
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
          fetch('https://urlsjsonserver-p2nq.onrender.com/webApplications', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newApp),
          })
            .then((response) => response.json())
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
      <h4>Configurations du panneau latéral</h4>
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
              style={{backgroundColor:inputColor.widthPanelColor}}
              />
      </div>
      <div className="confButtons">
            <div>
              <button >Réinitialiser</button>
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
              style={{backgroundColor:inputColor.generalUrlColor}}
              />
            <div className="adminErr">
                <p style={{color:msgErreur1Color}}>Nom app déjà existe</p>
            </div> 
        </div>
        <div className="urlLine" >
           <h3>Url de l'application</h3>
          <input
              type="text"
              value={webApplicationForm.url}
              onChange={handleUrlAppChange}
              placeholder="Saisir titre "
              style={{backgroundColor:inputColor.generalUrlColor}}
              />
            <div className="adminErr">
                <p style={{color:msgErreur2Color}}>Url app déjà existe</p>
            </div>   
        </div>
      <div className="confUrlButtons" style={{gridColumn:"span 2"}}>
            <div>
              <button onClick={handleAnnulerWebApp}>Annuler</button>
              <button className='appliquer' onClick={handleEnregistrerWebApp}>Appliquer</button>
            </div>
      </div>
      </div>
      </div>    
      <div className="urlBox" style={{marginBottom:'40px'}}>
        <h4>Si vous possedez un url général pour stocker les documentations , vous pouvez l'ajouter ici.</h4>
        <div className='urlForm'>
        <div className="urlLine">
           <h3>Url général de documentation</h3>
          <input
              type="text"
              value={configurations.generalUrl}
              onChange={handleUrlGeneralChange}
              placeholder="Saisir titre "
              style={{backgroundColor:inputColor.generalUrlColor}}
              />
        </div>
      <div className="confUrlButtons">
            <div>
              <button onClick={handleAnnuler2}>Annuler</button>
              <button className='appliquer' onClick={handleEnregistrer2}>Appliquer</button>
            </div>
      </div>
      </div>
      </div> 
    </div>
  )
}

export default Configurations
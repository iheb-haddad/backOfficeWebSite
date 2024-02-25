import React , {useState , useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX} from '@fortawesome/free-solid-svg-icons';
import Axios from '../../services/Axios';
import './GestionSources.css'
import ModifiedSource from '../modifiedSource/ModifiedSource';

function GestionSources() {
    const initialApp = {
        nom :'',
        url:''
      }
      const [sources , setsources] = useState([])
      const [urls , setUrls] = useState([])
      const [webApplicationForm , setWebApplicationForm] = useState(initialApp)
      const [dataChanged , setDataChanged] = useState(0)
      const [msgErreur1Color, setMsgErreur1Color] = useState('white');
      const [msgErreur2Color, setMsgErreur2Color] = useState('#EEEEEE');
      const [showListApp ,setShowListApp] = useState(false)
      const [documentations , setDocumentations] = useState({})
      const [showError , setShowError] = useState(false)
      const [showError2 , setShowError2] = useState(false)
      const [isModified , setIsModified] = useState('')
      const [modifiedName , setModifiedName] = useState()
      const [modifiedUrls , setModifiedUrls] = useState([])

      useEffect(() => {
        Axios.get('/sources')
        .then((data) => {
          setsources(data.data) 
            })
        .catch((error) => {
          console.error('Error fetching documents:', error);
        });
      },[dataChanged]);

      useEffect(() => {
        Axios.get('/documentations')
        .then((response) => {
          setDocumentations(response.data)
                })
            .catch((error) => {
              console.error('Error fetching documents:', error);
            });
  
        }, []);

      const handleNameAppChange = (event) => {
            setMsgErreur1Color("white")
            setWebApplicationForm((prevData) => ({
            ...prevData,
            nom : event.target.value,
        }
        ))
      };
      const handleUrlAppChange = (event) => {
        setMsgErreur2Color("white");
        if (event.key === "Enter") {
          console.log("Enter key pressed");
          setUrls((prevData) => [...prevData, webApplicationForm.url]);
          setWebApplicationForm((prevData) => ({
            ...prevData,
            url: '',
          }));
        } else { 
          setWebApplicationForm((prevData) => ({
            ...prevData,
            url: event.target.value,
          }));
        }
      };

      const handleEnregistrerWebApp = () => {
        setShowError(false)
        const hasEmptyFields = webApplicationForm.nom === '' || urls.length === 0;
        setShowError(hasEmptyFields)
        if(!hasEmptyFields){
            if(!sources.some(app => app.nom === webApplicationForm.nom)){
                const newApp = {
                    nom : webApplicationForm.nom,
                    url : urls
                };
                Axios.post("/sources",newApp)
                    .then((data) => {
                    console.log('New app added:', data);
                    setWebApplicationForm(initialApp);
                    setUrls([]);
                    setDataChanged(prev => prev + 1)
                    // You can update your UI or perform other actions here
                    })
                    .catch((error) => {
                    console.error('Error adding new admin:', error);
                    });
                }else{
                    setMsgErreur1Color("red")
                }
        }      
        };  

        const handleAnnulerWebApp = () => {
          setWebApplicationForm(initialApp)
          setUrls([])
        };

        const handleShowListApp = () => {
            setShowListApp(prev => !prev)
          }

        const deleteUrl = (index) => {
            setUrls((prevData) => prevData.filter((url, i) => i !== index));
        }  

        const handleDeleteApp = (appId) => {
            Axios.delete(`/sources/${appId}`)
            .then((data) => {
                setDataChanged(prev => prev +1)
                console.log("app deleted")
                  // You can update your UI or perform other actions here
                })
                .catch((error) => {
                  console.error('Error deleting ', error);
                });
          }

          const handleModifSource = (source) => {
            // setMsgErreurColor2('#EEEEEE')
            // setShowError2(false)
            setModifiedName(source.nom)
            setModifiedUrls(source.url)
            setIsModified(source._id)
        }

        const handleGetModifiedSource = (sourceId) => {
            const hasEmptyFields = modifiedName === '' || modifiedUrls.length === 0;
            setShowError2(hasEmptyFields)
            if(!hasEmptyFields){
                if(!sources.some(app => app.nom === modifiedName && app._id !== sourceId)){
                    const modifiedApp = {
                        nom : modifiedName,
                        url : modifiedUrls
                    };
                    Axios.put(`/sources/${sourceId}`,modifiedApp)
                        .then((data) => {
                        console.log('app modified:', data);
                        setModifiedName('')
                        setModifiedUrls([])
                        setIsModified('')
                        setDataChanged(prev => prev + 1)
                        // You can update your UI or perform other actions here
                        })
                        .catch((error) => {
                        console.error('Error modifing app:', error);
                        });
                    }else{
                        setMsgErreur2Color("red")
                    }
                }      
            }

  return (
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
          style={{border: (showError && !webApplicationForm.nom) && "1px solid red"}}
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
          onKeyDown={handleUrlAppChange}
          placeholder="Saisir titre "
          style={{border: (showError && urls.length === 0) && "1px solid red"}}
          />
        <div className='indication'>Cliquer Entrée pour ajouter encore</div>  
        <div className="urlBlock">
          {
            urls.map((url,index) => (
              <div key={index} className = 'urlColumn'>
                <FontAwesomeIcon icon={faX} onClick={() => deleteUrl(index)}
                style={{cursor:'pointer',fontSize : '7px',position : 'absolute', top : '5px',right : '5px'}}/>
                {url}
              </div>
            ))
          }
        </div>   
    </div>
  </div>
  <div className="confButtons" style={{marginBottom : '30px'}}>
          <button onClick={handleAnnulerWebApp}>Annuler</button>
          <button className='appliquer' onClick={handleEnregistrerWebApp}>Appliquer</button>
  </div>
  <div className="applicationsList">
        <div className="document">
          <div className="documentName">Nom</div>
          <div className="documentKeyword">Url / Mots Clés</div>
          { showListApp ? <button onClick={handleShowListApp}>Cacher Liste</button>:<button onClick={handleShowListApp}>Afficher Liste</button>}
        </div>
    { showListApp &&
      sources.map((app) => (
      <div key={app._id}>
        <div className="document documentLine" style= {{fontSize:'14px',color:'black'}} key={app._id}>
          <div className="documentName">{app.nom}</div>
          <div className="documentKeyword">{
          app.url.map((url,index) => (
            url + (index !== app.url.length -1 ? ' / ' : '')
          ))
          }</div>
          { isModified === app._id ? <button onClick={() => handleGetModifiedSource(app._id)}>appliquer</button> :<button onClick={() => handleModifSource(app)}>modifier</button>}
          <button onClick={()=>handleDeleteApp(app._id)} style={{color: documentations.some((doc)=> doc.application === app.url) && '#d4d9dd'}}>Supprimer</button>
        </div>
        {
          isModified === app._id && <ModifiedSource source = {app}
          modifiedName={modifiedName}
          modifiedUrls={modifiedUrls}
          setModifiedName={setModifiedName}
          setModifiedUrls={setModifiedUrls}
          msgErreurColor={msgErreur2Color}
          showError={showError2}/>
        }
      </div>  
      ))
    }
  </div>
  </div>    
  )
}

export default GestionSources
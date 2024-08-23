import React , {useState , useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX ,faUpload} from '@fortawesome/free-solid-svg-icons';
import './GestionSources.css'
import ModifiedSource from '../modifiedSource/ModifiedSource';
import Axios from '../../services/Axios';
import useStore from '../../globalState/UseStore';
import useAuth from '../../hooks/useAuth';
import UploadPage from '../uploadPage/UploadPage';
import ExportCSV from '../exportCsv/ExportCsv';
import { toast } from 'sonner';

function GestionSources() {
    const { setNavLineClicked , auth } = useAuth();
    const [showUploadPage , setShowUploadPage] = useState(false)
    const clickUploadbtn = () => {
        setShowUploadPage(prev => !prev)
    }

    const initialApp = {
        projet : '',
        nom :'',
        url:''
      }
      const { sources , subProjects , fetchSources , fetchSubProjects , userProjects , fetchUserProjects} = useStore();
      const [urls , setUrls] = useState([])
      const [webApplicationForm , setWebApplicationForm] = useState(initialApp)
      const [dataChanged , setDataChanged] = useState(0)
      const [msgErreur1Color, setMsgErreur1Color] = useState('white');
      const [msgErreur2Color, setMsgErreur2Color] = useState('#EEEEEE');
      const [showListApp ,setShowListApp] = useState(false)
      const [showError , setShowError] = useState(false)
      const [showError2 , setShowError2] = useState(false)
      const [isModified , setIsModified] = useState('')
      const [modifiedName , setModifiedName] = useState()
      const [modifiedUrls , setModifiedUrls] = useState([])
      const [modifiedProject , setModifiedProject] = useState()
      const [modifiedSubProject , setModifiedSubProject] = useState()

      useEffect(() => {
        const user = auth?.user?._id || '';
        setNavLineClicked("sources")
        fetchSources(user);
        fetchSubProjects(user);
        fetchUserProjects(user);
      },[dataChanged]);

      const [projectSelected , setProjectSelected] = useState('')

      const handleProjectChange = (event) => {
        setProjectSelected(event.target.value)
      }

      const handleSubProjectChange = (event) => {
        setWebApplicationForm((prevData) => ({
            ...prevData,
            projet : event.target.value,
        }))
      }

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
        const hasEmptyFields = webApplicationForm.nom === '' || urls.length === 0 || webApplicationForm.projet === '';
        setShowError(hasEmptyFields)
        if(!hasEmptyFields){
                const newApp = {
                    idProject : projectSelected,
                    idSubProject : webApplicationForm.projet,
                    name : webApplicationForm.nom,
                    keywords : urls
                };
                Axios.post("/sources",newApp)
                    .then((data) => {
                    console.log('New app added:', data);
                    setWebApplicationForm(initialApp);
                    setUrls([]);
                    setDataChanged(prev => prev + 1)
                    toast.success('Nouvelle application ajoutée') 
                    })
                    .catch((error) => {
                    console.error('Error adding new admin:', error);
                    toast.error(error.response.data.message || 'Erreur lors de l\'ajout de l\'application')
                    });
        }      
        };  

        const handleAnnulerWebApp = () => {
          setProjectSelected('')
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
                toast.success('Application supprimée avec succès')
                })
                .catch((error) => {
                  console.error('Error deleting ', error);
                });
          }

          const handleModifSource = (source) => {
            setModifiedProject(source.idProject._id)
            setModifiedSubProject(source.idSubProject._id)
            setModifiedName(source.name)
            setModifiedUrls(source.keywords)
            setIsModified(source._id)
        }

        const handleGetModifiedSource = (sourceId) => {
            const hasEmptyFields = modifiedName === '' || modifiedUrls.length === 0 || modifiedSubProject === '' || modifiedProject === '';
            setShowError2(hasEmptyFields)
            if(!hasEmptyFields){
                    const modifiedApp = {
                        idProject : modifiedProject,
                        idSubProject : modifiedSubProject,
                        name : modifiedName,
                        keywords : modifiedUrls
                    };
                    Axios.put(`/sources/${sourceId}`,modifiedApp)
                        .then((data) => {
                        console.log('app modified:', data);
                        setModifiedSubProject('')
                        setModifiedProject('')
                        setModifiedName('')
                        setModifiedUrls([])
                        setIsModified('')
                        setDataChanged(prev => prev + 1)
                        toast.success('Application modifiée')
                        })
                        .catch((error) => {
                        console.error('Error modifing app:', error);
                        toast.error(error.response.data.message || 'Erreur lors de la modification de l\'application')
                        });
              }    
            }

  return (
    <div style={{paddingBottom : '50px'}}>
    <div className="buttonsBox" style={{marginBottom : '40px',paddingRight:'40px', display :'flex', justifyContent:'space-between',alignItems:'center'}}>
            { !showUploadPage ? <button className="uploadbtn" onClick={clickUploadbtn}><FontAwesomeIcon icon={faUpload} /><span>Importer des sources utilisant des fichiers csv</span></button>
            : <button className="uploadbtn" onClick={clickUploadbtn}><FontAwesomeIcon icon={faUpload} /><span>Cacher la page d'importation</span></button>}
            {showUploadPage && <a className='uploadbtn' href='SourcesModel.csv' download='SourcesModel.csv'>Télécharger un modèle</a>}
    </div>
    {showUploadPage && <UploadPage filesType={'sources'} setDataChanged={setDataChanged}/>}
    <div className="urlBox">
    <h5>Applications Web</h5>   
    <h4>Ajouter une nouvelle application web qui correspond à votre documentation.</h4>
    <div className='configBox'>
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
              <select value={webApplicationForm.projet} onChange={handleSubProjectChange}
              style={{border: (showError && !webApplicationForm.projet) && "1px solid red"}}>
                  <option value="" disabled hidden>----</option>
                  {
                    subProjects.filter((subProject) => subProject.idProject._id === projectSelected).map((project) => (
                      <option key={project._id} value={project._id}>{project.name}</option>
                    ))
                  }
              </select>
      </div>
        <div className="configLine">
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
        <div className="configLine" >
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
          <button></button>
          { showListApp ? <button onClick={handleShowListApp}>Cacher Liste</button>:<button onClick={handleShowListApp}>Afficher Liste</button>}
        </div>
    { showListApp &&
      sources.map((app) => (
      <div key={app._id}>
        <div className="document documentLine" style= {{fontSize:'14px',color:'black'}} key={app._id}>
          <div className="documentName">{app.name}</div>
          <div className="documentKeyword">{
          app.keywords.map((url,index) => (
            url + (index !== app.keywords.length -1 ? ' / ' : '')
          ))
          }</div>
          { isModified === app._id ? <button onClick={() => handleGetModifiedSource(app._id)}>appliquer</button> :<button onClick={() => handleModifSource(app)}>modifier</button>}
          <button onClick={()=>handleDeleteApp(app._id)} >Supprimer</button>
        </div>
        {
          isModified === app._id && <ModifiedSource source = {app}
          modifiedName={modifiedName}
          modifiedUrls={modifiedUrls}
          modifiedProject={modifiedProject}
          modifiedSubProject={modifiedSubProject}
          setModifiedProject={setModifiedProject}
          setModifiedSubProject={setModifiedSubProject}
          setModifiedName={setModifiedName}
          setModifiedUrls={setModifiedUrls}
          msgErreurColor={msgErreur2Color}
          showError={showError2}
          projects={userProjects}
          subProjects={subProjects}/>
        }
      </div>  
      ))
    }
    { sources.length === 0 && <div style={{ textAlign : 'center',marginTop :'50px',fontSize :'1.2rem'}} >Aucune source trouvée</div>}
    <ExportCSV data={sources} fileName={'sources'}/>
  </div>
  </div>
  </div>    
  )
}

export default GestionSources
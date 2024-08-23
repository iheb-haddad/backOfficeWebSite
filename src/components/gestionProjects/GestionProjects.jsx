import React , {useState , useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload} from '@fortawesome/free-solid-svg-icons';
import Axios from '../../services/Axios';
import useStore from '../../globalState/UseStore';
import useAuth from '../../hooks/useAuth';
import ModifiedProject from '../modifiedProject/ModifiedProject';
import UploadPage from '../uploadPage/UploadPage';
import ExportCSV from '../exportCsv/ExportCsv';
import ModalBox from '../modalBox/ModalBox';
import GestionSubProjects from '../gestionSubProjects/GestionSubProjects';
import { toast } from 'sonner';

function GestionProjects() {
    const { setNavLineClicked , auth} = useAuth();
    const [showUploadPage , setShowUploadPage] = useState(false)

    const [showModal , setShowModal] = useState(false)
    const [message , setMessage] = useState('')
    const [projectSelected , setProjectSelected] = useState('')

    const tryToDelete = (project) => {
      setProjectSelected(project._id)
      setMessage(`Attention vous êtes sur le point de supprimer le projet ${project.name} et tout ce qui lui est associé (documents,sources,users...).`)
      setShowModal(true)
    }

    const handleAnnuler = () => {
      setShowModal(false)
    }
    const handleContinuer = () => {
      setShowModal(false)
      handleDeleteProject(projectSelected)
    }

    const clickUploadbtn = () => {
      setShowUploadPage(prev => !prev)
  }

    const initialApp = {
        name :'',
        description:''
      }
      const { projects ,fetchProjects } = useStore();
      const [projectForm , setprojectForm] = useState(initialApp)
      const [dataChanged , setDataChanged] = useState(0)
      const [msgError1, setMsgError1] = useState('')
      const [msgError2, setMsgError2] = useState('')
      const [showListProjects ,setShowListProjects] = useState(false)
      const [showError , setShowError] = useState(false)
      const [showError2 , setShowError2] = useState(false)
      const [isModified , setIsModified] = useState('')
      const [modifiedName , setModifiedName] = useState('')
      const [modifiedDescription , setModifiedDescription] = useState('')

      useEffect(() => {
        setNavLineClicked("projects")
        const user = auth?.user?._id || '';
        fetchProjects(user);
      },[dataChanged]);

      const handleProjectNameChange = (event) => {
        setMsgError1('')
            setprojectForm((prevData) => ({
            ...prevData,
            name : event.target.value,
        }
        ))
      };
      
      const handleProjectDescriptionChange = (event) => {
        setprojectForm((prevData) => ({
        ...prevData,
        description : event.target.value,
    }
    ))};

      const handleEnregistrerProject = () => {
        setShowError(false)
        const hasEmptyFields = projectForm.name === '' || projectForm.description === '';
        setShowError(hasEmptyFields)
        if(!hasEmptyFields){
            const newProject = {
                name : projectForm.name,
                description : projectForm.description
            };
            Axios.post('/projects',newProject)
                .then((data) => {
                console.log('app added:', data);
                toast.success('Projet ajouté avec succès')
                setprojectForm(initialApp)
                setDataChanged(prev => prev + 1)
                })
                .catch((error) => {
                    error.response.status === 400 && setMsgError1('Nom de projet déjà existe') 
                    error.response.status === 400 && toast.error('Nom de projet déjà existe')
                    console.error('Error adding app:', error);
                }
                );
        }      
        };  

        const handleAnnulerWebApp = () => {
          setprojectForm(initialApp)
        };

        const handleShowListProjects = () => {
            setShowListProjects(prev => !prev)
        } 

        const handleDeleteProject = (projectId) => {
            Axios.delete(`/projects/${projectId}`)
            .then((data) => {
                setDataChanged(prev => prev +1)
                console.log("project deleted")
                toast.success('Projet supprimé avec succès')
                  // You can update your UI or perform other actions here
                })
                .catch((error) => {
                  console.error('Error deleting ', error);
                });
          }

          const handleModifProject = (project) => {
            setMsgError2('')
            setModifiedName(project.name)
            setModifiedDescription(project.description)
            setIsModified(project._id)
        }

        const handleGetModifiedProject = (projectId) => {
            const hasEmptyFields = modifiedName === '' || modifiedDescription === '';
            setShowError2(hasEmptyFields)
            if(!hasEmptyFields){
                const modifiedProject = {
                    name : modifiedName,
                    description : modifiedDescription
                };
                Axios.put(`/projects/${projectId}`,modifiedProject)
                    .then((data) => {
                    console.log('app modified:', data);
                    toast.success('Projet modifié avec succès')
                    setModifiedName('')
                    setModifiedDescription('')
                    setIsModified('')
                    setDataChanged(prev => prev + 1)
                    })
                    .catch((error) => {
                        error.response.status === 400 && setMsgError2('Nom de projet déjà existe')
                        error.response.status === 400 && toast.error('Nom de projet déjà existe')
                        console.error('Error modifying app:', error);
                    }
                    );
                }      
            }

  return (
  <div style={{paddingBottom : '50px'}}>
    { auth?.user?.role === 'admin' &&
    <>
      <div className="buttonsBox" style={{marginBottom : '40px',paddingRight:'40px', display :'flex', justifyContent:'space-between',alignItems:'center'}}>
          { !showUploadPage ? <button className="uploadbtn" onClick={clickUploadbtn}><FontAwesomeIcon icon={faUpload} /><span>Importer des projets utilisant des fichiers csv</span></button>
            : <button className="uploadbtn" onClick={clickUploadbtn}><FontAwesomeIcon icon={faUpload} /><span>Cacher la page d'importation</span></button>}
          {showUploadPage && <a className='uploadbtn' href='ProjectsModel.csv' download='ProjectsModel.csv'>Télécharger un modèle</a>}
      </div>
      {showUploadPage && <UploadPage filesType={'projects'} setDataChanged={setDataChanged}/>}
      <div className="urlBox">
        <h5>Projets</h5>   
        <h4>Ajouter un nouveau projet.</h4>
        <div className='urlForm'>
          <div className="urlLine">
            <h3>Nom du projet</h3>
            <input
                type="text"
                value={projectForm.name}
                onChange={handleProjectNameChange}
                placeholder="Saisir titre "
                style={{border: (showError && !projectForm.name) && "1px solid red"}}
                />
            <div className="adminErr">
                <p style={{color:"red"}}>{msgError1}</p>
            </div> 
          </div>
          <div className="urlLine">
            <h3>Description</h3>
            <input
                type="text"
                value={projectForm.description}
                onChange={handleProjectDescriptionChange}
                placeholder="Saisir titre "
                style={{border: (showError && !projectForm.description) && "1px solid red"}}
                />
          </div>
        </div>
        <div className="confButtons" style={{marginBottom : '30px'}}>
                <button onClick={handleAnnulerWebApp}>Annuler</button>
                <button className='appliquer' onClick={handleEnregistrerProject}>Appliquer</button>
        </div>
        <div className="applicationsList">
          <div className="document">
            <div className="documentName">Nom</div>
            <div className="documentName">Description</div>
            <button></button>
            { showListProjects ? <button onClick={handleShowListProjects}>Cacher Liste</button>:<button onClick={handleShowListProjects}>Afficher Liste</button>}
          </div>
        { showListProjects &&
        projects.map((project) => (
          <div key={project._id}>
            <div className="document documentLine" style= {{fontSize:'14px',color:'black'}} key={project._id}>
              <div className="documentName">{project.name}</div>
              <div className="documentName">{project.description}</div>
              { isModified === project._id ? <button onClick={() => handleGetModifiedProject(project._id)}>appliquer</button> :<button onClick={() => handleModifProject(project)}>modifier</button>}
              <button onClick={()=>tryToDelete(project)}>Supprimer</button>
            </div>
            {
              isModified === project._id && <ModifiedProject project = {project}
              modifiedName={modifiedName}
              modifiedDescription={modifiedDescription}
              setModifiedName={setModifiedName}
              setModifiedDescription={setModifiedDescription}
              msgError={msgError2}
              setMsgError={setMsgError2}
              showError={showError2}/>
            }
          </div>  
          ))
        }
        <ExportCSV data={projects} fileName={'projects'}/>
      </div>
    </div>
      {showModal && <ModalBox type='delete' message={message} onCancel={handleAnnuler} onContinue={handleContinuer}/>}
    </>} 
    <GestionSubProjects/>
  </div>    
  )
}

export default GestionProjects
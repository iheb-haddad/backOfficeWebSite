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
import { toast } from 'sonner';

function GestionSubProjects() {
    const { setNavLineClicked , auth } = useAuth();
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
        description:'',
        project:''
      }
      const { projects ,fetchProjects , subProjects ,fetchSubProjects} = useStore();
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
        fetchSubProjects(user);
      },[dataChanged]);

      const handleProjectChange = (event) => {
        setprojectForm((prevData) => ({
            ...prevData,
            project : event.target.value,
            }));
        };

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
                idProject : projectForm.project,
                name : projectForm.name,
                description : projectForm.description
            };
            Axios.post('/subProjects',newProject)
                .then((data) => {
                console.log('app added:', data);
                setprojectForm(initialApp)
                setDataChanged(prev => prev + 1)
                toast.success('Sous-projet ajouté avec succès')
                })
                .catch((error) => {
                    toast.error(error.response.data.message);
                    console.error('Error adding app:', error);
                }
                );
        }else{
          toast.error('Veuillez remplir tous les champs')
        }      
        };  

        const handleAnnulerWebApp = () => {
          setprojectForm(initialApp)
        };

        const handleShowListProjects = () => {
            setShowListProjects(prev => !prev)
        } 

        const handleDeleteProject = (projectId) => {
            Axios.delete(`/subProjects/${projectId}`)
            .then((data) => {
                setDataChanged(prev => prev +1)
                console.log("project deleted")
                toast.success('Sous-projet supprimé avec succès')
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
                Axios.put(`/subProjects/${projectId}`,modifiedProject)
                    .then((data) => {
                    console.log('app modified:', data);
                    setModifiedName('')
                    setModifiedDescription('')
                    setIsModified('')
                    setDataChanged(prev => prev + 1)
                    toast.success('Sous-projet modifié avec succès')
                    })
                    .catch((error) => {
                        error.response.status === 400 && setMsgError2('Nom de projet déjà existe')
                        console.error('Error modifying app:', error);
                    }
                    );
                }      
            }

  return (
    <>
      <div className="buttonsBox" style={{marginBottom : '40px',paddingRight:'40px', display :'flex', justifyContent:'space-between',alignItems:'center',marginTop:'30px'}}>
        { !showUploadPage ? <button className="uploadbtn" onClick={clickUploadbtn}><FontAwesomeIcon icon={faUpload} /><span>Importer des sous-projets utilisant des fichiers csv</span></button>
          : <button className="uploadbtn" onClick={clickUploadbtn}><FontAwesomeIcon icon={faUpload} /><span>Cacher la page d'importation</span></button>}
        {showUploadPage && <a className='uploadbtn' href='subProjectsModel.csv' download='subProjectsModel.csv'>Télécharger un modèle</a>}
      </div>
      {showUploadPage && <UploadPage filesType={'subProjects'} setDataChanged={setDataChanged}/>}
      <div className="urlBox">
      <h5>Sous-Projets</h5>   
      <h4>Ajouter un nouveau sous-projet.</h4>
      <div className='configBox'>
      <div className="configLine">
          <h3>Projet correspondant</h3>
              <select value={projectForm.project} onChange={handleProjectChange}
                style={{border: (showError && !projectForm.project) && "1px solid red"}}>
                    <option value="" disabled hidden>----</option>
                    {
                      projects.map((project) => (
                        <option key={project._id} value={project._id}>{project.name}</option>
                      ))
                    }
              </select>
      </div>
      <div className="configLine">
        <h3>Nom du sous-projet</h3>
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
      <div className="configLine">
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
            {!showListProjects && <div className="documentName">Nom</div>}
            {!showListProjects && <div className="documentName">Description</div>}
            { showListProjects ? <button style={{position :'absolute', right :'50px'}} onClick={handleShowListProjects}>Cacher Liste</button>:<button onClick={handleShowListProjects}>Afficher Liste</button>}
          </div>
      { showListProjects &&
        projects.map((project) => (
          <div key={project._id}>
              <h4 style={{padding : '0',margin :'20px 0 0 0', fontSize :'1.1rem',fontWeight:'bold'}}>{project.name}</h4>
              <div className="document">
              {<div className="documentName">Nom</div>}
              {<div className="documentName">Description</div>}
              <button></button>
              <button></button>
          </div>
            { subProjects.filter(subProject => subProject.idProject._id === project._id).length === 0 ?
            <h4 style={{textAlign : 'center'}}>Aucun sous-projets</h4> :
              subProjects.filter(subProject => subProject.idProject._id === project._id).map((subProject) => (
              <div key={subProject._id}>
                  <div className="document documentLine" style= {{fontSize:'14px',color:'black'}} key={subProject._id}>
                  <div className="documentName">{subProject.name}</div>
                  <div className="documentName">{subProject.description}</div>
                  { isModified === subProject._id ? <button onClick={() => handleGetModifiedProject(subProject._id)}>appliquer</button> :<button onClick={() => handleModifProject(subProject)}>modifier</button>}
                  <button onClick={()=>tryToDelete(subProject)}>Supprimer</button>
                  </div>
                  {
                  isModified === subProject._id && <ModifiedProject project = {subProject}
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
          </div>
        ))
      }
      <ExportCSV data={subProjects} fileName={'subProjects'}/>
    </div>
    </div>
    {showModal && <ModalBox type='delete' message={message} onCancel={handleAnnuler} onContinue={handleContinuer}/>}
  </>    
  )
}

export default GestionSubProjects
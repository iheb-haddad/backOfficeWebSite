import React , {useEffect, useState} from 'react'
import './AddAdminForm.css'
import Axios from '../../services/Axios';
import useStore from '../../globalState/UseStore';
import useRessources from '../../hooks/useRessources';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import useAuth from '../../hooks/useAuth';
import { toast } from 'sonner'

function AddAdminForm() { 
  const { projects , fetchProjects , subProjects ,fetchSubProjects , users , fetchUsers } = useStore(); 
  const {setBtnClicked} = useRessources();
  const [projectsSelected, setProjectsSelected] = useState([]);
  const [subProjectsSelected, setSubProjectsSelected] = useState([]);
  const [dataChanged , setDataChanged] = useState(0);

  const { auth } = useAuth();
  useEffect(() => {
    const user = auth?.user?._id || '';
    fetchProjects(user);
    fetchSubProjects(user);
    fetchUsers(user);
    setBtnClicked("ajouter");
  }, [dataChanged]);

    const initialValues = {
        project :'',
        subProject : '',
        lastName : "",
        firstName : "",
        email : "",
        password : "",
        confPassword : ""
      };
    const [formData, setFormData] = useState(initialValues);  
    const [msgErreur1Color, setMsgErreur1Color] = useState('white');
    const [msgErreur2Color, setMsgErreur2Color] = useState('white');
    const [ emptyFields , setEmptyFields] = useState(false)

    const handleProjectChange = (event) => {
      const selectedOption = projects.find((project) => project._id === event.target.value);
      if (selectedOption) {
        setProjectsSelected([...projectsSelected, selectedOption]);
      }
    };

    const handleSubProjectChange = (event) => {
      const selectedOption = subProjects.find((subProject) => subProject._id === event.target.value);
      if (selectedOption) {
        setSubProjectsSelected([...subProjectsSelected, selectedOption]);
      }
    };

    const handleLastNameChange = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            lastName : event.target.value, 
          }));
      };
      const handlefirstNameChange = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            firstName : event.target.value,
          }));
      };
      const handleemailChange = (event) => {
        setMsgErreur1Color("white")
        setFormData((prevData) => ({
            ...prevData,
            email : event.target.value,
          }));
      };
      const handlePasswordChange = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            password : event.target.value,
          }));
      };
      const handleConfPasswordChange = (event) => {
        setMsgErreur2Color("white")
        setFormData((prevData) => ({
            ...prevData,
            confPassword : event.target.value,
          }));
      };

      const deleteProject = (index) => {
        const projectToDelete = projectsSelected[index];
        const newProjectsSelected = projectsSelected.filter((project, i) => i !== index);
        setProjectsSelected(newProjectsSelected);
        const newSubProjectsSelected = subProjectsSelected.filter((project) => project.idProject._id !== projectToDelete._id);
        setSubProjectsSelected(newSubProjectsSelected);
      };

      const deleteSubProject = (index) => {
        const newSubProjectsSelected = subProjectsSelected.filter((project, i) => i !== index);
        setSubProjectsSelected(newSubProjectsSelected);
      };

      const handleEnregistrer = () => {
        const hasEmptyFields = Object.entries(formData).some(([key, value]) => {
          return (value === "" || value === null) && key !== "project" && key !== "subProject";
        }) || (projectsSelected.length === 0 || (subProjectsSelected.length === 0 && auth?.user?.role === 'user'));
        setEmptyFields(hasEmptyFields);
      if (!hasEmptyFields) {
        const newAdmin = {
          projects : projectsSelected,
          subProjects : subProjectsSelected,
          role : 'user',
          username: '',
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          numTel: '',
          country: '',
          region: '',
        };

        Axios.post('/auth/register', {newAdmin , confirmation : formData.confPassword})
          .then((data) => {
            console.log('New admin added');
            setDataChanged( prev => prev + 1) // Use response.data to access the server response
            setFormData(initialValues);
            setProjectsSelected([]);
            setSubProjectsSelected([]);
            toast.success("L'admin est ajouté avec succès");
          })
          .catch((error) => {
            console.error('Error adding new admin:', error);
            error.response.status === 400 ? setMsgErreur1Color("red")
            : error.response.status === 401 ? setMsgErreur2Color("red")
            : toast.error("Erreur lors de l'ajout de l'admin")
          });
      }else{
        toast.error("Veuillez remplir tous les champs obligatoires")
      }  
      };  
      
      const handleAnnuler = () => {
        setFormData(initialValues)
      };  

  return (
    <div className='addAdmin' style={{padding : '80px'}}>
      <div className="settingsBody">
        <div className="addAdminForm">
          <div className="addAdminLine">
            <h3>Projets</h3>
              <select value={formData.project} onChange={handleProjectChange}
              style={{border: (emptyFields && projectsSelected.length === 0) && "1px solid red"}}>
                  <option value="" disabled hidden>----</option>
                  { projects.filter((prj)=>(!projectsSelected.some((prjSelec) => prjSelec._id === prj._id))).length > 0 ?
                    projects.filter((prj)=>(!projectsSelected.some((prjSelec) => prjSelec._id === prj._id))).map((project) => (
                      <option key={project._id} value={project._id}>{project.name}</option>
                    )) : <option value="" disabled >aucun restant</option>
                  }
              </select>
              <div className="urlBlock">
                {
                  projectsSelected.map((project,index) => (
                    <div key={index} className = 'urlColumn'>
                      <FontAwesomeIcon icon={faX} onClick={() => deleteProject(index)}
                      style={{cursor:'pointer',fontSize : '7px',position : 'absolute', top : '5px',right : '5px'}}/>
                      {project.name}
                    </div>
                  ))
                }
              </div>  
          </div>
          <div className="addAdminLine">
            <h3>Sous-Projets</h3>
              <select value={formData.subProject} onChange={handleSubProjectChange}
              style={{border: (emptyFields && subProjectsSelected.length === 0 && auth?.user?.role === 'user') && "1px solid red"}}>
                  <option value="" disabled hidden>----</option>
                  { subProjects.filter((subPrj) => (projectsSelected.some((projet) => projet._id === subPrj.idProject._id)
                   && !subProjectsSelected.some((projet) => projet._id === subPrj.idProject._id))).length > 0 ?
                    subProjects.filter((subPrj) => (projectsSelected.some((projet) => projet._id === subPrj.idProject._id)
                    && !subProjectsSelected.some((projet) => projet._id === subPrj._id))).map((project) => (
                      <option key={project._id} value={project._id}>{project.name+' ('+project.idProject.name+')'}</option>
                    )) : <option value="" disabled >aucun restant</option>
                  }
              </select>
              <div className="urlBlock">
                {
                  subProjectsSelected.map((prj,index) => (
                    <div key={index} className = 'urlColumn'>
                      <FontAwesomeIcon icon={faX} onClick={() => deleteSubProject(index)}
                      style={{cursor:'pointer',fontSize : '7px',position : 'absolute', top : '5px',right : '5px'}}/>
                      {prj.name}
                    </div>
                  ))
                }
              </div>  
          </div>
          <div className="addAdminLine">
            <h3>Nom</h3>
            <input
                type="text"
                value={formData.lastName}
                onChange={handleLastNameChange}
                placeholder="Saisir titre "
                style={{border: (emptyFields && !formData.lastName) && "1px solid red"}}
                />
          </div>
          <div className="addAdminLine">
            <h3>Prénom</h3>
            <input
                type="text"
                value={formData.firstName}
                onChange={handlefirstNameChange}
                placeholder="Saisir titre "
                style={{border: (emptyFields && !formData.firstName) && "1px solid red"}}
                />
          </div>
          <div className="addAdminLine">
              <h3>Adresse Email</h3>
              <input
                  type="text"
                  value={formData.email}
                  onChange={handleemailChange}
                  placeholder="Saisir titre "
                  style={{border: (emptyFields && !formData.email) && "1px solid red"}}
                  />
              <div className="adminErr">
                  <p style={{color:msgErreur1Color}}>adresse déjà utilisé</p>
              </div>     
          </div>
          <div className="addAdminLine">
              <h3>Mot de passe</h3>
              <input
                  type="text"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  placeholder="Saisir titre "
                  style={{border: (emptyFields && !formData.password) && "1px solid red"}}
                  />
          </div>
          <div className="addAdminLine">
              <h3>Confirmer mot de passe</h3>
              <input
                  type="text"
                  value={formData.confPassword}
                  onChange={handleConfPasswordChange}
                  placeholder="Saisir titre "
                  style={{border: (emptyFields && !formData.confPassword) && "1px solid red"}}
                  />
              <div className="adminErr">
                  <p style={{color:msgErreur2Color}}>Mot de passe ne correspond pas</p>
              </div> 
          </div>
        </div>
      <div className="settingsButton">
          <button onClick={handleAnnuler}>Annuler</button>
          <button className='enregistrer' onClick={handleEnregistrer}>Enregistrer</button>
      </div>
    </div>
  </div>
  )
}

export default AddAdminForm
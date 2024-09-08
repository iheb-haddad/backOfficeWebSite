import React, { useState , useEffect} from 'react'
import {DocFormAjout} from '../index';
import Axios from '../../services/Axios';
import useAuth from '../../hooks/useAuth';
import useRessources from '../../hooks/useRessources';
import useStore from '../../globalState/UseStore';
import { toast } from 'sonner';
import { GestionErrors } from '../index'

function GestionDocuments() {
  const {confSelected , setConfSelected} = useRessources();
  const [initialDocGeneralUrl , setInitialDocGeneralUrl] = useState('')
  const [docGeneralUrlFieldColor , setDocGeneralUrlFieldColor ] = useState('white')
  const [dataChanged , setDataChanged] = useState(0)
  const { setNavLineClicked , auth } = useAuth();

  const { projects , fetchProjects } = useStore();
  const [project, setProject] = useState();
  const [configurations, setConfigurations] = useState([]);

  const handleProjectChange = (event) => {
    setProject(event.target.value);
    const conf = configurations.find(c => c.idProject === event.target.value);
    setConfSelected(conf);
    console.log(conf);
    setInitialDocGeneralUrl(conf.generalUrl);
  };

  useEffect(() => {
    setNavLineClicked("documents")
    Axios.get('/configurations')
      .then((response) => {
        if(response.data.length > 0){
        setConfigurations(response.data)
        setConfSelected(response.data.find((conf) => conf.idProject === project ) || response.data[0])
        setInitialDocGeneralUrl(response.data[0].generalUrl)
        }
          })
      .catch((error) => {
        console.error('Error fetching documents:', error);
        toast.error('Erreur lors du chargement des données')
      });
      const user = auth?.user?._id || '';
      fetchProjects(user);
    },[dataChanged]);

  const handleDocGeneralUrlChange = (event) => {
    setConfSelected((prevData) => ({
        ...prevData,
        generalUrl : event.target.value,
    }))
  }

  const changeDocGeneralUrlInputColor = () => {
    if(confSelected.generalUrl != initialDocGeneralUrl)
    {
      setDocGeneralUrlFieldColor("#50e150");
    }
    setTimeout(() => {
      setDocGeneralUrlFieldColor("white");
  }, 2000);
  };

  const handleEnregistrer = () => {
    changeDocGeneralUrlInputColor();
    Axios.put(`/configurations/${confSelected._id}`, confSelected)
    .then((data) => {
      setInitialDocGeneralUrl(confSelected.generalUrl)
      console.log('Object modified:', data);
      setDataChanged(prev => prev +1)
      toast.success('General URL modifié avec succès')
    })
    .catch((error) => {
      console.error('Error modifying object:', error);
    });
  };

  const handleAnnuler = () => {
    setConfSelected((prevData) => ({
      ...prevData,
      generalUrl : initialDocGeneralUrl,
    }))
  };

  return (
      <div>
          <DocFormAjout />
          {(auth?.user?.role === 'admin' || projects.length > 0 ) && <div className="urlBox" style={{marginBottom:'40px'}}>
              <h4>Si vous possedez un url général pour stocker les documentations , vous pouvez l'ajouter ici.</h4>
              <div className='urlForm'>
              <div className="urlLine configLine">
                <h3>Projet correspondant</h3>
                    <select value={project} onChange={handleProjectChange}>
                        <option value="" disabled hidden>----</option>
                        {
                          projects.map((project) => (
                            <option key={project._id} value={project._id}>{project.name}</option>
                          ))
                        }
                    </select>
              </div>
                <div className="urlLine">
                  <h3>Url général de documentation</h3>
                  <input
                      type="text"
                      value={confSelected.generalUrl}
                      onChange={handleDocGeneralUrlChange}
                      placeholder={initialDocGeneralUrl}
                      style={{backgroundColor : docGeneralUrlFieldColor}}
                      />
                </div>
              </div>
              <div className="confButtons">
                      <button onClick={handleAnnuler}>Annuler</button>
                      <button className='appliquer' onClick={handleEnregistrer}>Appliquer</button>
              </div>
        </div> }
        <GestionErrors  />
      </div>
  )
}

export default GestionDocuments
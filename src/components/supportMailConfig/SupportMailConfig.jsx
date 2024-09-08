import { useState , useEffect} from 'react'
import useStore from '../../globalState/UseStore'
import useAuth from '../../hooks/useAuth'
import ConfLine from '../confLine/ConfLine'
import Axios from '../../services/Axios'
import { toast } from 'sonner'
import { use } from 'i18next'

export default function SupportMailConfig() {
    const { auth } = useAuth()
    const { userProjects , fetchUserProjects , subProjects , fetchSubProjects } = useStore()

    const [showError, setShowError] = useState(false)

    useEffect(() => {
        const user = auth?.user?._id || '';
        fetchUserProjects(user)
        fetchSubProjects(user)
    }, [])

    const emptyForm = {
        id : '',
        project : '',
        subProject : '',
        email : ''
    }
    const [formData, setFormData] = useState(emptyForm)
    const [oldSupportMailConfig, setOldSupportMailConfig] = useState({})

    useEffect(() => {
        if(!formData.subProject){
            return
        }
        Axios.get('supportEmail/'+formData.subProject)
        .then((res) => {
            const data = res.data
            if(!data){
                setFormData({
                    id : '',
                    project : formData.project,
                    subProject : formData.subProject,
                    email : ''
                })
                return
            }
            setFormData({
                id : data._id,
                project : data.idProject,
                subProject : data.idSubProject,
                email : data.email
            })
            setOldSupportMailConfig({
                id : data._id,
                project : data.idProject,
                subProject : data.idSubProject,
                email : data.email
            })
        })
    }, [formData.subProject])

    const handleEnregistrer = () => {
        const emptyFields = formData.email === '' || formData.subProject === '' || formData.project === ''
        setShowError(emptyFields)

        if(emptyFields){
            return
        }
        if(oldSupportMailConfig.email === formData.email){
            toast.info('Aucune modification n\'a été effectuée')
            return
        }
        if(formData.id){
            Axios.put('supportEmail/'+oldSupportMailConfig.id, {
                idProject : formData.project,
                idSubProject : formData.subProject,
                email : formData.email
            })
            .then((res) => {
                toast.success('Configuration modifiée avec succès')
                setFormData(emptyForm)
            })
            .catch((err) => {
                toast.error('Erreur lors de l\'enregistrement')
            })
        }
        else{
            Axios.post('supportEmail', {
                idProject : formData.project,
                idSubProject : formData.subProject,
                email : formData.email
            })
            .then((res) => {
                toast.success('Configuration enregistrée avec succès')
                setFormData(emptyForm)
            })
            .catch((err) => {
                toast.error('Erreur lors de l\'enregistrement')
            })
        }
    }

    const handleAnnuler = () => {
        if(oldSupportMailConfig.id){
            setFormData(oldSupportMailConfig)
        }
        else{
            setFormData(emptyForm)
        }
    }


  return (
    <div className="colorsForm">
        <h4>Configuration Email du service support</h4>
        <div className="configLine">
            <h3>Projet correspondant</h3>
            <select value={formData.project} onChange={(e) => {setFormData({...formData, project: e.target.value , subProject: '',email : ''})}}
              style={{border: (showError && !formData.project) && "1px solid red"}}>
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
            <select value={formData.subProject} onChange={(e) => setFormData({...formData, subProject: e.target.value})}
              style={{border: (showError && !formData.subProject) && "1px solid red"}}>
                  <option value="" disabled hidden>----</option>
                  {
                    subProjects.filter((subProject) => subProject.idProject._id === formData.project).map((project) => (
                      <option key={project._id} value={project._id}>{project.name}</option>
                    ))
                  }
            </select>
        </div>  
        <ConfLine
            key = {1}
            type = {'input'}
            label = {'Email'}
            value = {formData.email}
            handle = {(e) => setFormData({...formData, email: e.target.value})}
            holder = {"email service support"}
            style = {{borderColor: showError && !formData.email ? 'red' : ''}}
            options = {[]}
        />
        <div className="confButtons">
              <div>
                <button onClick={handleAnnuler}>Annuler</button>
                <button className='appliquer' onClick={handleEnregistrer}>Appliquer</button>
              </div>
        </div>
    </div>    
  )
}

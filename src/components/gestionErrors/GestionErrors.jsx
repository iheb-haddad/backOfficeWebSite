import { useEffect , useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import UploadPage from '../uploadPage/UploadPage'
import useStore from '../../globalState/UseStore'
import useAuth from '../../hooks/useAuth'
import Axios from '../../services/Axios';
import { toast } from "sonner"
import ExportCSV from '../exportCSV/ExportCSV'

const GestionErrors = () => {
    const { auth } = useAuth();
    const { documentations , fetchDocumentations , errors , fetchErrors , userProjects , fetchUserProjects , subProjects , fetchSubProjects } = useStore();
    const [allDocumentations, setAllDocumentations] = useState([])
    const [allErrors, setAllErrors] = useState([])
    const [showUploadPage, setShowUploadPage] = useState(false)
    const [dataChanged, setDataChanged] = useState(0)
    const [docsListInc, setDocsListInc] = useState([])
    const [checkedAdd, setCheckedAdd] = useState(true)
    const [checkedDelete, setCheckedDelete] = useState(false)
    const [docsListExc, setDocsListExc] = useState([])
    const [projectSelected, setProjectSelected] = useState('')
    const [subProjectSelected, setSubProjectSelected] = useState('')

    const handleProjectChange = (event) => {
        setProjectSelected(event.target.value)
        setSubProjectSelected('')
    }

    const handleSubProjectChange = (event) => {
        setSubProjectSelected(event.target.value)
    }

    const handleChangeToAdd = () => {
        setCheckedAdd(true)
        setCheckedDelete(false)
    }
    const handleChangeToDelete = () => {
        setCheckedAdd(false)
        setCheckedDelete(true)
    }

    const clickUploadbtn = () => {
        setShowUploadPage(!showUploadPage)
    }

    useEffect(() => {
        const user = auth?.user?._id || '';
        fetchDocumentations(user)
        fetchErrors(user)
        fetchUserProjects(user)
        fetchSubProjects(user)
    },[dataChanged])

    useEffect(() => {
        setAllDocumentations(documentations.filter((doc) => !errors.some((error) => error.idDocumentation._id === doc._id)))
        setAllErrors([...errors])
    },[documentations,errors])

    const clickDocInc = (doc) => {
        if(docsListInc.some((docc) => docc._id === doc._id)){
            setDocsListInc(docsListInc.filter((doc) => doc._id !== doc._id))
        }else{
            setDocsListInc([...docsListInc,doc])
        }
    }

    const clickDocExc = (id) => {
        if(docsListExc.some((docc) => docc === id)){
            setDocsListExc(docsListExc.filter((doc) => doc !== id))
        }else{
            setDocsListExc([...docsListExc,id])
        }
    }

    const [documentationsSearching, setDocumentationsSearching] = useState('')

    const handleInput3Search = (e) => {
        setDocumentationsSearching(e.target.value)
        setAllDocumentations(documentations.filter((doc) => doc.title.toLowerCase().startsWith(e.target.value.toLowerCase()) &&
        !errors.some((error) => error.idDocumentation._id === doc._id)))
        setAllErrors(errors.filter((doc) => doc.idDocumentation.title.toLowerCase().startsWith(e.target.value.toLowerCase())))
    }

    const submitErrorsAdd = () => {
        const data = dataChanged;
        docsListInc.map((doc) => {
            const newError = {
                idProject : doc.idProject,
                idSubProject : doc.idSubProject,
                idDocumentation : doc._id
            }
            Axios.post("/errors",newError)
            .then((res) => {
                setAllDocumentations(allDocumentations.filter((docc) => docc._id !== doc._id))
                setDataChanged(prev => prev + 1)
                console.log("error added")
            })
            .catch((err) => {
                toast.error("Erreur lors de l'ajout de l'erreur")
                console.log(err)
            })
        })
        data !== dataChanged && toast.success("Erreurs ajoutées avec succès")
        setDocsListInc([])
        setDocumentationsSearching('')
    }

    const submitDeleteErrors = () => {
        const data = dataChanged;
        docsListExc.map((error) => {
            Axios.delete(`/errors/${error}`)
            .then((res) => {
                setDataChanged(prev => prev + 1)
                console.log(res)
            })
            .catch((err) => {
                toast.error("Erreur lors de la suppression de l'erreur")
                console.log(err)
            })
        })
        data !== dataChanged && toast.success("Erreurs supprimées avec succès")
        setDocsListExc([])
        setDocumentationsSearching('')
    }

    const cancel = () => {
        setDocsListInc([])
        setDocsListExc([])
        setDocumentationsSearching('')
        setAllDocumentations(documentations.filter((doc) => !errors.some((error) => error.idDocumentation._id === doc._id)))
        setAllErrors([...errors])
    }


  return (
    <div className='configurations' style={{marginBottom : '40px'}}>
        <div className="buttonsBox" style={{marginBottom : '40px',paddingRight:'40px', display :'flex', justifyContent:'space-between',alignItems:'center'}}>
            { !showUploadPage ? <button className="uploadbtn" onClick={clickUploadbtn}><FontAwesomeIcon icon={faUpload} /><span>Importer des erreurs utilisant des fichiers csv</span></button>
            : <button className="uploadbtn" onClick={clickUploadbtn}><FontAwesomeIcon icon={faUpload} /><span>Cacher la page d'importation</span></button>}
            {showUploadPage && <a className='uploadbtn' href='ErrorsModel.csv' download='ErrorsModel.csv'>Télécharger un modèle</a>}
        </div> 
        {showUploadPage && <UploadPage filesType={'erreurs'} setDataChanged={setDataChanged}/>}     
        <div className="colorsForm" style={{display : 'block'}}>
            <h4>Gestion des erreurs</h4>
            <div className='configBox' style={{padding : '20px'}}>
                <div className="configLine" style={{padding : '20px'}}>
                        <h3>Projet correspondant</h3>
                        <select value={projectSelected} onChange={handleProjectChange}>
                            <option value="" disabled hidden>----</option>
                            {
                            userProjects.map((project) => (
                                <option key={project._id} value={project._id}>{project.name}</option>
                            ))
                            }
                        </select>
                </div>  
                <div className="configLine" style={{padding : '20px'}}>
                    <h3>Sous-projet correspondant</h3>
                        <select value={subProjectSelected} onChange={handleSubProjectChange}>
                            <option value="" disabled hidden>----</option>
                            {
                            subProjects.filter((subProject) => subProject.idProject._id === projectSelected).map((project) => (
                                <option key={project._id} value={project._id}>{project.name}</option>
                            ))
                            }
                        </select>
                </div>
            </div>
            <div>
                <input type="radio" name='add' value='add' checked = {checkedAdd} onChange={handleChangeToAdd}/>
                <span style={{marginRight : '30px'}}>Ajouter Erreurs</span>
                <input type="radio" name='delete' value='delete' checked = {checkedDelete} onChange={handleChangeToDelete}/>
                <span>Supprimer Erreurs</span>
            </div>  
            <div className="mapContainer" >
                {checkedAdd ? 
                <div >
                    <div className="headerEmptyCol">Documentations/Notes</div>
                    <input type='text' className='cell' placeholder='Chercher avec le titre ...' value={documentationsSearching} onChange={handleInput3Search}/>
                    <div style={{ display : 'flex' , flexWrap : 'wrap', gap :'8px'}}>
                    {
                        allDocumentations.map((doc) => {
                            return doc.idSubProject._id === subProjectSelected && 
                            <div key={doc._id} className={`cell ${docsListInc.some((docc) => docc._id === doc._id) && 'activeCell'}`} onClick={() => clickDocInc(doc)}>{doc.title}</div>
                        })
                    }
                    </div>
                </div>
                : checkedDelete && 
                <div >
                    <div className="headerEmptyCol">Erreurs</div>
                    <input type='text' className='cell' placeholder='Chercher avec le titre ...' value={documentationsSearching} onChange={handleInput3Search}/>
                    <div style={{ display : 'flex' , flexWrap : 'wrap', gap :'8px'}}>
                    {
                        allErrors.map((error) => {
                            return error.idSubProject._id === subProjectSelected &&
                            <div key={error._id} className={`cell ${docsListExc.some((docc) => docc === error._id) && 'activeCell'}`} onClick={() => clickDocExc(error._id)}>{error.idDocumentation.title}</div>
                        })
                    }
                    </div>
                </div>
                }
            </div>
            <div className="confButtons" >
                <button style={{ fontSize : '1rem'}} onClick={cancel}>annuler</button>
                <button className='appliquer' style={{ fontSize : '1rem'}} onClick={checkedAdd ? submitErrorsAdd : submitDeleteErrors}>valider</button>
            </div>
            <ExportCSV data={errors} fileName={'erreurs'}/>
        </div> 
    </div>    
  )
}

export default GestionErrors
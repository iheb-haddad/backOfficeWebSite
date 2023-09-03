import React , {useState , useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight ,faCircleArrowLeft} from '@fortawesome/free-solid-svg-icons';
import Axios from '../../services/Axios';
import './Accueil.css'
function Accueil() {
    const [documents , setDocuments] = useState([])
    const [alertes , setAlertes] = useState([])
    const [instructions , setInstructions] = useState([])
    const [docs , setDocs] = useState([])
    const [page ,setPage ] = useState(0)
    const [isLeaving , setIsLeaving] = useState(false)
    const [isEntering , setIsEntering] = useState(false)
    const [isLeaving2 , setIsLeaving2] = useState(false)
    const [isEntering2 , setIsEntering2] = useState(false)

    useEffect(() => {
        Axios.get('/documentations')
          .then((response) => {
            setDocuments(response.data) 
            setAlertes(response.data.filter((alerte) => {
                return alerte.type === 'alerte'}))
              setDocs(response.data.filter((document) => {
                  return document.type === 'document'}))
              setInstructions(response.data.filter((instruction) => {
                    return instruction.type === 'instruction'}))
            })
          .catch((error) => {
            console.error('Error fetching documents:', error);
          });
      }, []);

      const handleClickRights = () => {
        setIsEntering2(false)
        setIsLeaving2(false);
        setIsEntering(false)
        setIsLeaving(true);
        setTimeout(() => {
            setIsLeaving(false);
            setPage(prev => prev + 1) // Update the startIndex after the animation duration
            setIsEntering(true); // Turn off animation
        }, 300);
      };
      const handleClickleft = () => {
        setIsEntering2(false)
        setIsLeaving2(true);
        setIsEntering(false)
        setIsLeaving(false);
        setTimeout(() => {
            setIsLeaving2(false);
            setPage(prev => prev - 1) // Update the startIndex after the animation duration
            setIsEntering2(true); // Turn off animation
        }, 300);
      };

  return (
    <div className="accueil">
        <div className="accueilBoxes">
            <div className="accueilBox bigBox modifications">
                <div className="modificationsHead">                
                    <div className="modificationsTitle"><div className="precedentIcon" style={{display:page===0 && "none"}} onClick={handleClickleft}><FontAwesomeIcon icon={faCircleArrowLeft} /></div>Dernières modifications</div>
                    <div className="suivantIcon" style={{display:documents.length - 2*page < 3 && "none"}} onClick={handleClickRights}><FontAwesomeIcon icon={faCircleArrowRight} /></div>
                </div>
                <div className="modificationsList">
                    <div className="modificationsHeadList">
                        <div className="type">Type</div>
                        <div className="titre">Titre</div>
                        <div className="langue">Langue</div>
                        <div className="webApp">Application web</div>
                    </div>
                    {
                        documents.slice(documents.length - page * 2 -2, documents.length - (page * 2)).reverse().map((document)=>(
                        <div className={`modificationsHeadList modificationsLine ${isLeaving && 'isLeaving'} ${isEntering && 'isEntering'} ${isLeaving2 && 'isLeaving2'} ${isEntering2 && 'isEntering2'}`} 
                        key={document.id} >
                            <div className="type">{document.type}</div>
                            <div className="titre">{document.titre}</div>
                            <div className="langue">{document.langue}</div>
                            <div className="webApp">{document.application}</div>
                        </div>
                        ))
                    }

                </div>
            </div>
            <div className="accueilBox bigBox citation" style={{backgroundImage:'url(./citationBack.png)'}}>
                <div className="title">Votre documentation, votre manière</div>
                <div className="subtitle">"FlexiDoc : Votre documentation personnalisé pour une efficacité maximale et pour une productivité optimale.."</div>
            </div>
            <div className="accueilBox smallBox">
                <div className="stat">
                    <div className="chiffres">{docs.length}</div>
                    <div className="type">Documents</div>
                </div>
                <div className="statIcon"><img src="./documentIcon.png" alt="" /></div>
            </div>
            <div className="accueilBox smallBox">
            <div className="stat">
                    <div className="chiffres">{alertes.length}</div>
                    <div className="type">Alertes</div>
                </div>
                <div className="statIcon"><img src="./alerteIcon.png" alt="" /></div>
            </div>
            <div className="accueilBox smallBox">
                <div className="stat">
                    <div className="chiffres">{instructions.length}</div>
                    <div className="type">Instructions</div>
                </div>
                <div className="statIcon"><img src="./instructionIcon.png" alt="" /></div>
            </div>
        </div>
    </div>
  )
}

export default Accueil
import React , {useState , useEffect} from 'react'
import { ClipLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight ,faCircleArrowLeft} from '@fortawesome/free-solid-svg-icons';
import useStore from '../../globalState/UseStore';
import Axios from '../../services/Axios';
import './Dashboard.css'
function Dashboard() {
    const { documentations, mappings , mappingIsLoaded , documentIsLoaded ,fetchDocumentations , fetchMappings} = useStore();
    const [page ,setPage ] = useState(0)
    const [isLeaving , setIsLeaving] = useState(false)
    const [isEntering , setIsEntering] = useState(false)
    const [isLeaving2 , setIsLeaving2] = useState(false)
    const [isEntering2 , setIsEntering2] = useState(false)

    useEffect(() => {
        fetchDocumentations();
        fetchMappings();
      }, []);

      const handleClickRights = () => {
        setIsEntering2(false)
        setIsLeaving2(false);
        setIsEntering(false)
        setIsLeaving(true);
        setTimeout(() => {
            setIsLeaving(false);
            setPage(prev => prev + 1)
            setIsEntering(true);
        }, 300);
      };
      const handleClickleft = () => {
        setIsEntering2(false)
        setIsLeaving2(true);
        setIsEntering(false)
        setIsLeaving(false);
        setTimeout(() => {
            setIsLeaving2(false);
            setPage(prev => prev - 1) 
            setIsEntering2(true);
        }, 300);
      };

      const reformDate = (date) => {
        return date.split("T")[0] + " " + date.split("T")[1].split(".")[0]
      }

    //   const modifyAllDocuments = () => {
    //     const lngs = [
    //         {
    //           name: 'français',
    //           code: 'fr',
    //         },
    //         {
    //           name: 'anglais',
    //           code: 'en',
    //         },
    //       ];
    //       lngs.map((lng) => {
    //         Axios.post('/languages', lng)
    //         .then((response) => {
    //           console.log('New language added:', response.data);
    //         })
    //         .catch((error) => {console.log('Error:', error)
    //         });
    //       });
    //   }

  return (
    <div className="accueil">
        <div className="accueilBoxes">
            <div className="accueilBox bigBox modifications">
                <div className="modificationsHead">                
                    <div className="modificationsTitle"><div className="precedentIcon" style={{display:page===0 && "none"}} onClick={handleClickleft}><FontAwesomeIcon icon={faCircleArrowLeft} /></div>Dernières modifications</div>
                    <div className="suivantIcon" style={{display:mappings.length - 2*page < 3 && "none"}} onClick={handleClickRights}><FontAwesomeIcon icon={faCircleArrowRight} /></div>
                </div>
                <div className="modificationsList">
                    <div className="modificationsHeadList">
                        <div className="type">Section</div>
                        <div className="titre">Titre</div>
                        <div className="langue">Langue</div>
                        <div className="webApp">Application web</div>
                    </div>
                    <ClipLoader
                        className='loader'
                        loading={!mappingIsLoaded}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        />
                    { mappingIsLoaded &&
                        mappings.slice(mappings.length - page * 2 -2 > 0 ? mappings.length - page * 2 -2 : 0, mappings.length - (page * 2)).reverse().map((mapping)=>(
                        <div className={`modificationsHeadList modificationsLine ${isLeaving && 'isLeaving'} ${isEntering && 'isEntering'} ${isLeaving2 && 'isLeaving2'} ${isEntering2 && 'isEntering2'}`} 
                        key={mapping._id} >
                            <div className="type">{mapping.idSection.titleFr}</div>
                            <div className="titre">{mapping.idDocument.titre}</div>
                            <div className="langue">{mapping.idDocument.langue}</div>
                            <div className="webApp">{mapping.idSource.nom}</div>
                        </div>
                        ))
                    }

                </div>
            </div>
            <div className="accueilBox bigBox citation" style={{backgroundImage:'url(./citationBack.png)'}}>
                <div className="title">Votre documentation, votre manière</div>
                <div className="subtitle">"FlexiDoc : Votre documentation personnalisé pour une efficacité maximale et pour une productivité optimale.."</div>
            </div>
            <div className="accueilBox smallBox" style={{gridColumn : 'span 3'}}>
                <div className="docsList">
                    <div className="docsHead">
                        <div className="docsTitle">Document</div>
                        <div className="creationDate">Date de création</div>
                        <div className="consultNumber">Nbr consultation</div>
                        <div className="lastConsult">Dernière consultation</div>
                    </div>
                    <ClipLoader
                        className='loader'
                        loading={!documentIsLoaded}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        />
                    <div className="docsListContent">
                        {documentIsLoaded && documentations.map((doc) => (
                            <div className="docsLine" key={doc._id}>
                                <div className="docsLineTitle">{doc.titre}</div>
                                <div className="creationDateLine">{reformDate(doc.createdAt)}</div>
                                <div className="consultNumberLine">{doc.consultNumber}</div>
                                <div className="lastConsultLine">{doc.lastConsultation}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="statIcon"><img src="./documentIcon.png" alt="" /*onClick={modifyAllDocuments}*//></div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard
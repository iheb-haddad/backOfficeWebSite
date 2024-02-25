import React , {useState , useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight ,faArrowLeft}  from '@fortawesome/free-solid-svg-icons';
import './MappingAdd.css'
import Axios from '../../services/Axios';
import useStore from '../../globalState/UseStore';

function MappingAdd(props) {
  const {mappings , fetchMappings} = useStore();
  const [mappingDirection, setMappingDirection] = useState('')
  const [checkedSource, setCheckedSource] = useState(false)
  const [checkedDoc, setCheckedDoc] = useState(false)
  const [sourceClicked, setSourceClicked] = useState('')
  const [docClicked, setDocClicked] = useState('')
  const [sectionClicked, setSectionClicked] = useState(props.data.sections[0]._id)
  const [sourcesListInc, setSourcesListInc] = useState([])
  const [sourcesListExc, setSourcesListExc] = useState([])
  const [docsListInc, setDocsListInc] = useState([])
  const [docsListExc, setDocsListExc] = useState([])
  const [docsDansMapping, setDocsDansMapping] = useState([])
  const [docsHorsMapping, setDocsHorsMapping] = useState([])
  const [sourcesDansMapping, setSourcesDansMapping] = useState([])
  const [sourcesHorsMapping, setSourcesHorsMapping] = useState([])
  const [dataChanged , setDataChanged] = useState(0)
  const [dansMappingSearching , setDansMappingSearching] = useState('')
  const [horsMappingSearching , setHorsMappingSearching] = useState('')
  const [documentationsSearching , setDocumentationsSearching] = useState('');
  const [allDansMapping , setAllDansMapping] = useState([])
  const [allHorsMapping , setAllHorsMapping] = useState([])
  const [allDocumentations , setAllDocumentations] = useState(props.data.documentations)

  useEffect(() => {
    fetchMappings();
  }, [dataChanged]);

  function categorizeDocuments(sourceId) {
    const mappedDocs = mappings.filter(mapping => mapping.idSource._id === sourceId).map(mapping => mapping.idDocument);
    const idMappedDocs = mappedDocs.map(doc => doc._id);
    const unmappedDocs = props.data.documentations.filter(doc => !idMappedDocs.includes(doc._id));
    setDocsDansMapping(mappedDocs);
    setAllDansMapping(mappedDocs);
    setDocsHorsMapping(unmappedDocs);
    setAllHorsMapping(unmappedDocs);
  }
  function categorizeSources(docId) {
    const mappedSources = mappings.filter(mapping => mapping.idDocument._id === docId).map(mapping => mapping.idSource);
    const idMappedSources = mappedSources.map(source => source._id);
    const unmappedSources = props.data.sources.filter(source => !idMappedSources.includes(source._id));
    setSourcesDansMapping(mappedSources);
    setSourcesHorsMapping(unmappedSources);
  }

  const handleChangeToSource = () => {
      handleAnnuler()
      setMappingDirection('sourceToDoc')
      setCheckedSource( prev => !prev)
  }

  const handleChangeToDoc = () => {
      handleAnnuler()
      setMappingDirection('docToSource')
      setCheckedDoc( prev => !prev)
  }

  const clickSource = (event) => {
    if (mappingDirection === 'sourceToDoc') {
      if (sourceClicked === event.target.value) {
        setSourceClicked('') ; 
        setDocsDansMapping([])
        setDocsHorsMapping([])
      }else{
        setSourceClicked(event.target.value) ;
        categorizeDocuments(event.target.value);
      }
      setDocsListInc([]);
      setDocsListExc([]);
      setSectionClicked(props.data.sections[0]._id)
    }
  }

  const clickDocInc = (docId) => { 
    if (sourceClicked) {
      docsListExc.length > 0 && setDocsListExc([]);
      docsListInc.some((doc) => doc === docId) ? setDocsListInc(docsListInc.filter((doc) => doc !== docId)) : setDocsListInc([...docsListInc , docId])
    }
  }

  const clickDocExc = (docId) => { 
    if (sourceClicked) {
      docsListInc.length > 0 && setDocsListInc([]);
      docsListExc.some((doc) => doc === docId) ? setDocsListExc(docsListExc.filter((doc) => doc !== docId)) : setDocsListExc([...docsListExc , docId])
    }
  }

  const clickDoc2 = (docId) => {
    if (mappingDirection === 'docToSource') {
      if (docClicked === docId) {
        setDocClicked('') ; 
        setSourcesDansMapping([])
        setSourcesHorsMapping([])
      }else{
        setDocClicked(docId) ;
        categorizeSources(docId);
      }
      setSourcesListInc([]);
      setSourcesListExc([]);
      setSectionClicked(props.data.sections[0]._id)
    }
  }

  const clickSourceInc = (sourceId) => {
    if (docClicked) {
      sourcesListExc.length > 0 && setSourcesListExc([]);
      sourcesListInc.some((source) => source === sourceId) ? setSourcesListInc(sourcesListInc.filter((source) => source !== sourceId)) : setSourcesListInc([...sourcesListInc , sourceId])
    }
  }

  const clickSourceExc = (sourceId) => {
    if (docClicked) {
      sourcesListInc.length > 0 && setSourcesListInc([]);
      sourcesListExc.some((source) => source === sourceId) ? setSourcesListExc(sourcesListExc.filter((source) => source !== sourceId)) : setSourcesListExc([...sourcesListExc , sourceId])
    }
  }

  const clickSection = (event) => {
    if (docsListInc.length !== 0 || sourcesListInc.length !== 0) {
      sectionClicked === event.target.value ? setSectionClicked('') : setSectionClicked(event.target.value)
    }
  }

  const handleInput1Search = (event) => {
    setHorsMappingSearching(event.target.value)
    setDocsHorsMapping(allHorsMapping.filter((doc) => doc.titre.toLowerCase().startsWith(event.target.value.toLowerCase())))
  }
  const handleInput2Search = (event) => {
    setDansMappingSearching(event.target.value)
    setDocsDansMapping(allDansMapping.filter((doc) => doc.titre.toLowerCase().startsWith(event.target.value.toLowerCase())))
  }
  const handleInput3Search = (event) => {
    setDocumentationsSearching(event.target.value)
    setAllDocumentations(props.data.documentations.filter((doc) => doc.titre.toLowerCase().startsWith(event.target.value.toLowerCase())))
  }

  const handleAnnuler = () => {
    setCheckedSource(false)
    setCheckedDoc(false)
    setSourceClicked('')
    setDocsListInc([])
    setDocsListExc([])
    setDocsDansMapping([])
    setDocsHorsMapping([])
    setSourcesDansMapping([])
    setSourcesHorsMapping([])
    setSourcesListInc([])
    setSourcesListExc([])
    setDocClicked('')
    setSectionClicked(props.data.sections[0]._id)
    setMappingDirection('')
  }

  const addDocumentsToMapping = () => {
    if(docsListInc.length > 0 && sectionClicked){
      let docsToADD = props.data.documentations.filter(docs => docsListInc.includes(docs._id));
      docsListInc.map((doc) => {
        const newMapping = {
          idDocument : doc,
          idSection : sectionClicked,
          idSource : sourceClicked
        }
        Axios.post(`/mappings/`, newMapping)
        .then((data) => {
          console.log('Object modified:', data);
          setDataChanged(prev => prev + 1)
        })
        .catch((error) => {
          console.error('Error modifying object:', error);
        });
     })
      setDocsHorsMapping(docsHorsMapping.filter((docs) => !docsListInc.includes(docs._id))) 
      setDocsDansMapping([...docsDansMapping , ...docsToADD])
      setDocsListInc([])
    }
  }

  const deleteDocumentsFromToMapping = () => {
    if(docsListExc.length > 0){
      let docsToDelete = props.data.documentations.filter((docs) => docsListExc.includes(docs._id));
      docsListExc.map((doc) => {
        const idmapping = mappings.filter((mapping) => mapping.idDocument._id === doc && mapping.idSource._id === sourceClicked)[0]._id
        Axios.delete(`/mappings/${idmapping}`)
        .then((data) => {
          console.log('Object deleted:', data);
          setDataChanged(prev => prev + 1)
        })
        .catch((error) => {
          console.error('Error deleting object:', error);
        });
      })
      setDocsDansMapping(docsDansMapping.filter((docs) => !docsListExc.includes(docs._id))) 
      setDocsHorsMapping([...docsHorsMapping , ...docsToDelete])
      setDocsListExc([])
    }
  }

  const addSourcesToMapping = () => {
    if(sourcesListInc.length > 0 && sectionClicked){
      let sourcesToADD = props.data.sources.filter(source => sourcesListInc.includes(source._id));
      sourcesListInc.map((source) => {
        const newMapping = {
          idDocument : docClicked,
          idSection : sectionClicked,
          idSource : source
        }
        Axios.post(`/mappings/`, newMapping)
        .then((data) => {
          console.log('Object modified:', data);
          setDataChanged(prev => prev + 1)
        })
        .catch((error) => {
          console.error('Error modifying object:', error);
        });
     })
      setSourcesHorsMapping(sourcesHorsMapping.filter((source) => !sourcesListInc.includes(source._id))) 
      setSourcesDansMapping([...sourcesDansMapping , ...sourcesToADD])
      setSourcesListInc([])
    }
  }

  const deleteSourcesFromMapping = () => {
    if(sourcesListExc.length > 0){
      let sourcesToDelete = props.data.sources.filter((source) => sourcesListExc.includes(source._id));
      sourcesListExc.map((source) => {
        const idmapping = mappings.filter((mapping) => mapping.idDocument._id === docClicked && mapping.idSource._id === source)[0]._id
        Axios.delete(`/mappings/${idmapping}`)
        .then((data) => {
          console.log('Object deleted:', data);
          setDataChanged(prev => prev + 1)
        })
        .catch((error) => {
          console.error('Error deleting object:', error);
        });
      })
      setSourcesDansMapping(sourcesDansMapping.filter((source) => !sourcesListExc.includes(source._id))) 
      setSourcesHorsMapping([...sourcesHorsMapping , ...sourcesToDelete])
      setSourcesListExc([])
    }
  }

  return (
    <div className="mappingAddBox">
        <div className="mappingAddEntete">
          <div className="enteteTitle">Configurations basées sur :</div>
            <input type="radio" name='source' value='sourceToDoc' checked = {checkedSource} onChange={handleChangeToSource}/>
            <span style={{marginRight : '30px'}}>Sources</span>
            <input type="radio" name='document' value='docToSource' checked = {checkedDoc} onChange={handleChangeToDoc}/>
            <span>Documentations / Notes</span>
        </div>  
        { mappingDirection === 'sourceToDoc' &&
        <div className="mapContainer">
            <div className="emptyColumn" >
            <div className="headerEmptyCol">Sources</div>
                <select name="app" id="selectApp" value={sourceClicked} onChange={clickSource}>
                  <option value="" disabled>- - - - - - -</option>
                  {props.data.sources.map((source) =>(
                      <option key={source._id} value={source._id}>{source.nom}</option>
                            ))}
                </select>
            </div>
                  <div className="column">
                      {sourceClicked && <div className="headerCol">Documentations/Notes<br/>  (hors mapping )</div>}
                      {sourceClicked && <input type='text' className='cell' placeholder='Chercher avec le titre ...' value={horsMappingSearching} onChange={handleInput1Search}/>}
                        {docsHorsMapping.map((doc) => (
                          <div key={doc._id} className={`cell ${docsListInc.some((docc) => docc === doc._id) && 'activeCell'}`} onClick={() => clickDocInc(doc._id)}>{doc.titre}</div>
                        ))}
                  </div>
                  { sourceClicked && <div className="column" style={{flex : '2'}}>
                      <div className="headerCol">Inclure/Exclure<br/><span style={{color:'white'}}>s</span></div>
                        <div className={`cell switch ${ docsListInc.length > 0 && 'activeButton'}`} style={{textAlign : 'center'}} onClick={addDocumentsToMapping}><FontAwesomeIcon icon={faArrowRight} /></div>
                        <div className={`cell switch ${ docsListExc.length > 0 && 'activeButton'}`} style={{textAlign : 'center'}} onClick={deleteDocumentsFromToMapping}><FontAwesomeIcon icon={faArrowLeft} /></div>
                  </div>}
                  <div className="column">
                      {sourceClicked && <div className="headerCol">Documentations/Notes<br/>  (dans le mapping )</div>}
                      {sourceClicked && <input type='text' className='cell' placeholder='Chercher avec le titre ...' value={dansMappingSearching} onChange={handleInput2Search}/>}
                        {docsDansMapping.map((doc) => (
                          <div key={doc._id} className={`cell ${docsListExc.some((docc) => docc === doc._id) && 'activeCell'}`} onClick={() => clickDocExc(doc._id)}>{doc.titre}</div>
                        ))}
                          </div>
                  { sourceClicked &&<div className="emptyColumn">
                    <div className="headerEmptyCol">Sections</div>
                      <select name="app" id="selectApp" value={sectionClicked} onChange={clickSection}>
                          <option value="" disabled>- - - - - - -</option>
                          { docsListInc.length > 0 && props.data.sections.map((section) =>(
                                  <option key={section._id} value={section._id}>{section.titleFr}</option>
                                    ))}
                      </select>
                  </div>
                  }
            </div>}

        { mappingDirection === 'docToSource' &&
        <div className="mapContainer">
                  <div className="emptyColumn" style={{flex : '5'}}>
                      <div className="headerEmptyCol">Documentations/Notes</div>
                      <input type='text' className='cell' placeholder='Chercher avec le titre ...' value={documentationsSearching} onChange={handleInput3Search}/>
                        {allDocumentations.map((doc) => (
                          <div key={doc._id} className={`cell ${docClicked === doc._id && 'activeCell'}`} onClick={() => clickDoc2(doc._id)}>{doc.titre}</div>
                        ))}
                  </div>
                  { docClicked && <div className="column" style={{flex : '4'}}>
                      <div className="headerCol">Sources<br/>(hors mapping)</div>
                      {sourcesHorsMapping.map((app) => (
                        <div key={app._id} className={`cell ${sourcesListInc.some((source) => source === app._id) && 'activeCell'}`} onClick={() => clickSourceInc(app._id)}>{app.nom}</div>
                      ))}
                  </div>}
                  { docClicked && <div className="column" style={{flex : '2'}}>
                      <div className="headerCol">Inclure/Exclure<br/><span style={{color:'white'}}>s</span></div>
                        <div className={`cell switch ${ sourcesListInc.length > 0 && 'activeButton'}`} style={{textAlign : 'center'}} onClick={addSourcesToMapping}><FontAwesomeIcon icon={faArrowRight} /></div>
                        <div className={`cell switch ${ sourcesListExc.length > 0 && 'activeButton'}`} style={{textAlign : 'center'}} onClick={deleteSourcesFromMapping}><FontAwesomeIcon icon={faArrowLeft} /></div>
                  </div>}
                  { docClicked && <div className="column" style={{flex : '4'}}>
                      <div className="headerCol">Sources<br/>(dans le mapping)</div>
                        {sourcesDansMapping.map((app) => (
                          <div key={app._id} className={`cell ${sourcesListExc.some((source) => source === app._id) && 'activeCell'}`} onClick={() => clickSourceExc(app._id)}>{app.nom}</div>
                        ))}
                  </div>}
                  {/* <div className="column">
                      <div className="headerCol">Sections<br/><span style={{color:'white'}}>s</span></div>
                        { sourcesListInc.length > 0 && props.data.sections.map((section) => (
                          <div key={section._id} className='cell' style={{backgroundColor : sectionClicked === section._id && "#d7d7d7"}} onClick={(event) => clickSection(section._id)}>{section.titleFr}</div>
                        ))}
                        {Array.from({ length: sourcesListInc.length > 0 ? maxRows2 - props.data.sections.length : maxRows2}, (v, i) => (
                          <div key={i} className='cell' style={{color : 'white'}}>cellule</div>
                        ))}
                  </div> */}
                  { docClicked &&<div className="emptyColumn">
                    <div className="headerEmptyCol">Sections</div>
                      <select name="app" id="selectApp" value={sectionClicked} onChange={clickSection}>
                          <option value="" disabled>- - - - - - -</option>
                          { sourcesListInc.length > 0 && props.data.sections.map((section) =>(
                                  <option key={section._id} value={section._id}>{section.titleFr}</option>
                                    ))}
                      </select>
                  </div>
                  }
        </div>}        
        {/* <div className="buttons">
            <div></div>
           <div>
              <button onClick={handleAnnuler}>Annuler</button>
              <button onClick={handleAddMapping} className='appliquer' 
              style={{backgroundColor :  !(sectionClicked || docsListExc.length > 0 || sourcesListExc.length > 0) && '#d7d7d7',
              borderColor :  !(sectionClicked || docsListExc.length > 0 || sourcesListExc.length > 0) && '#d7d7d7'
              }}>Envoyer</button>
            </div>
        </div> */}
    </div>
  )
}

export default MappingAdd
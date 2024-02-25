import React , {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX} from '@fortawesome/free-solid-svg-icons'

function ModifiedSource(props) {
    const [motCle , setMotCle] = useState('')
    const initialValues = {
        nom : props.source.nom,
        url : props.source.url
    }

    const handleNameAppChange = (event) => {
        props.setModifiedName(event.target.value)
    }

    const handleMotCleChange = (event) => {
        if (event.key === "Enter") {
          console.log("Enter key pressed");
          props.setModifiedUrls((prevData) => [...prevData, motCle]);
          setMotCle('')
        } else { 
          setMotCle(event.target.value)
        }
    }

    const deleteUrl = (index) => {
        props.setModifiedUrls((prevData) => prevData.filter((url, i) => i !== index));
    }  

  return (
        <div className="modifiedForm">
            <div className="urlLine">
            <h3>Nom de l'application</h3>
            <input
                type="text"
                value={props.modifiedName}
                onChange={handleNameAppChange}
                placeholder="Saisir titre "
                style={{border: (props.showError && !props.modifiedName) && "1px solid red"}}
                />
                <div className="adminErr">
                    <p style={{color:props.msgErreurColor}}>Nom app déjà existe</p>
                </div> 
            </div>
            <div className="urlLine" >
            <h3>URL / Mots-clés</h3>
            <input
                type="text"
                value={motCle}
                onChange={handleMotCleChange}
                onKeyDown={handleMotCleChange}
                placeholder="Saisir titre "
                style={{border: (props.showError && props.modifiedUrls.length === 0) && "1px solid red"}}
                />
                <div className='indication'>Cliquer Entrée pour ajouter encore</div>  
                <div className="urlBlock">
                {
                    props.modifiedUrls.map((url,index) => (
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
  )
}

export default ModifiedSource
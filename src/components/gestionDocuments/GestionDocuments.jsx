import React, { useState , useEffect} from 'react'
import {DocFormAjout} from '../index';
import Axios from '../../services/Axios';
function GestionDocuments() {
  const [configurations , setConfigurations] = useState({generalUrl : ''})
  const [initialDocGeneralUrl , setInitialDocGeneralUrl] = useState('')
  const [docGeneralUrlFieldColor , setDocGeneralUrlFieldColor ] = useState('white')
  const [dataChanged , setDataChanged] = useState(0)

  useEffect(() => {
    Axios.get('/configurations')
      .then((response) => {
        if(response.data.length > 0){
        setConfigurations(response.data[0])
        setInitialDocGeneralUrl(response.data[0].generalUrl)
        }
          })
      .catch((error) => {
        console.error('Error fetching documents:', error);
      });
    },[dataChanged]);

  const handleDocGeneralUrlChange = (event) => {
    setConfigurations((prevData) => ({
        ...prevData,
        generalUrl : event.target.value,
    }))
  }

  const changeDocGeneralUrlInputColor = () => {
    if(configurations.generalUrl != initialDocGeneralUrl)
    {
      setDocGeneralUrlFieldColor("#50e150");
    }
    setTimeout(() => {
      setDocGeneralUrlFieldColor("white");
  }, 2000);
  };

  const handleEnregistrer = () => {
    changeDocGeneralUrlInputColor();
    console.log(initialDocGeneralUrl);
    Axios.put(`/configurations`, configurations)
    .then((data) => {
      setInitialDocGeneralUrl(configurations.generalUrl)
      console.log('Object modified:', data);
      setDataChanged(prev => prev +1)
      // You can update your UI or perform other actions here
    })
    .catch((error) => {
      console.error('Error modifying object:', error);
    });
  };

  const handleAnnuler = () => {
    setDocGeneralUrl(initialDocGeneralUrl)
  };

  return (
      <div>
          <DocFormAjout generalUrl={initialDocGeneralUrl}/>
          <div className="urlBox" style={{marginBottom:'40px'}}>
              <h4>Si vous possedez un url général pour stocker les documentations , vous pouvez l'ajouter ici.</h4>
              <div className='urlForm'>
                <div className="urlLine">
                  <h3>Url général de documentation</h3>
                  <input
                      type="text"
                      value={configurations.generalUrl}
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
        </div> 
      </div>
  )
}

export default GestionDocuments
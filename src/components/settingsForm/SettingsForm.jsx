import React , {useState} from 'react'
import './SettingsForm.css'
import Axios from '../../services/Axios';

function SettingsForm() {
    const userConnected = JSON.parse(localStorage.getItem('userConnected'));
    const initialValues = {
        lastName : userConnected.lastName,
        firstName : userConnected.firstName,
        numTel : userConnected.numTel,
        email : userConnected.email,
        country : userConnected.country,
        region : userConnected.region,
      };
      const [formData, setFormData] = useState(initialValues);
    const [message , setMessage] = useState("")
    const [messageColor , setMessageColor] = useState("")
    const [admins , setAdmins] = useState([])
    const [msgErreur1Color, setMsgErreur1Color] = useState('white');

    const initialInputColors ={
      lastNameColor : 'white',
      firstNameColor : 'white',
      emailColor:'white',
      numTelColor : 'white',
      countryColor : 'white',
      regionColor : 'white',
    }
    const [inputColor, setInputColor] = useState(initialInputColors)

    const changeInputColors = () =>{
      if(formData.lastName != initialValues.lastName)
      {
        setInputColor((prevData) => ({
          ...prevData,
          lastNameColor : "#50e150"
        }));
      }
      if(formData.firstName != initialValues.firstName)
      {
        setInputColor((prevColor) => ({
          ...prevColor,
          firstNameColor : "#50e150"
        }));
      }
      if(formData.email != initialValues.email)
      {
        setInputColor((prevColor) => ({
          ...prevColor,
          emailColor : "#50e150"
        }));
      }
      if(formData.numTel != initialValues.numTel)
      {
        setInputColor((prevColor) => ({
          ...prevColor,
          numTelColor : "#50e150"
        }));
      }
      if(formData.country != initialValues.country)
      {
        setInputColor((prevColor) => ({
          ...prevColor,
          countryColor : "#50e150"
        }));
      }
      if(formData.region != initialValues.region)
      {
        setInputColor((prevColor) => ({
          ...prevColor,
          regionColor : "#50e150"
        }));
      }
      setTimeout(() => {
        setInputColor(initialInputColors)
    }, 3000);
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
      const handlenumTelChange = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            numTel : event.target.value,
          }));
      };
      const handleemailChange = (event) => {
        setMsgErreur1Color('white')
        setFormData((prevData) => ({
            ...prevData,
            email : event.target.value,
          }));
      };
      const handlecountryChange = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            country : event.target.value,
          }));
      };
      const handleregionChange = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            region : event.target.value,
          }));
      };

      const handleEnregistrer = () =>{
        Axios.get('/users')
        .then((response) => {
          setAdmins(response.data);
            })
        .catch((error) => {
          console.error('Error fetching documents:', error);
        });
      if(!admins.some(admin => (admin.email === formData.email) && (admin.id != userConnected.id ))){
            userConnected.firstName = formData.firstName
            userConnected.lastName = formData.lastName
            userConnected.email = formData.email
            userConnected.numTel = formData.numTel
            userConnected.country = formData.country
            userConnected.region = formData.region
            localStorage.setItem('userConnected', JSON.stringify(userConnected))
            changeInputColors();
            Axios.put(`/users/${userConnected.id}`, userConnected)
            .then((data) => {
              console.log('Object modified:', data);
              // You can update your UI or perform other actions here
            })
            .catch((error) => {
              console.error('Error modifying object:', error);
            });
          }else{
            setMsgErreur1Color('red')
          }
      };
      const handleAnnuler = () => {
        setFormData(initialValues)
      };
  return (
    <>
    <div className='settingsBody'>
    <div className="settingsForm">
    <div className="settingsLine">
           <h3>Nom</h3>
          <input
              type="text"
              value={formData.lastName}
              onChange={handleLastNameChange}
              placeholder="Saisir titre "
              style={{backgroundColor:inputColor.lastNameColor}}
              />
      </div>
      <div className="settingsLine">
           <h3>Prénom</h3>
          <input
              type="text"
              value={formData.firstName}
              onChange={handlefirstNameChange}
              placeholder="Saisir titre "
              style={{backgroundColor:inputColor.firstNameColor}}
              />
      </div>
      <div className="settingsLine">
           <h3>Num de téléphone</h3>
          <input
              type="text"
              value={formData.numTel}
              onChange={handlenumTelChange}
              placeholder="Saisir titre "
              style={{backgroundColor:inputColor.numTelColor}}
              />
      </div>
      <div className="settingsLine">
           <h3>Adresse Email</h3>
          <input
              type="text"
              value={formData.email}
              onChange={handleemailChange}
              placeholder="Saisir titre "
              style={{backgroundColor:inputColor.emailColor}}
              />
            <div className="adminErr">
                <p style={{color:msgErreur1Color}}>adresse déjà utilisé</p>
            </div> 
      </div>
      <div className="settingsLine">
           <h3>Pays</h3>
          <input
              type="text"
              value={formData.country}
              onChange={handlecountryChange}
              placeholder="Saisir titre "
              style={{backgroundColor:inputColor.countryColor}}
              />
      </div>
      <div className="settingsLine">
           <h3>Région</h3>
          <input
              type="text"
              value={formData.region}
              onChange={handleregionChange}
              placeholder="Saisir titre "
              style={{backgroundColor:inputColor.regionColor}}
              />
      </div>
      </div>
      </div>
        <div className="settingsButton">
                <div>
                    <button onClick={handleAnnuler}>Annuler</button>
                    <button onClick={handleEnregistrer} className='enregistrer'>Enregistrer</button>
                  </div>
        </div>
    </>
  )
}

export default SettingsForm
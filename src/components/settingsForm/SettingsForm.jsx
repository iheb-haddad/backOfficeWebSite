import React , {useState,useEffect} from 'react'
import './SettingsForm.css'
import Axios from '../../services/Axios';
import useAuth from '../../hooks/useAuth';
import useRessources from '../../hooks/useRessources';
import { toast } from 'sonner';

function SettingsForm() {
  const { auth , setAuth } = useAuth();
  const {setBtnClicked} = useRessources();
  useEffect(() => {
    setBtnClicked("parametres");
  }, []);
  let userConnected = {
    lastName : auth.user.lastName,
    firstName : auth.user.firstName,
    numTel : auth.user.numTel,
    email : auth.user.email,
    country : auth.user.country,
    region : auth.user.region
  }
    const initialValues = {
        lastName : userConnected.lastName,
        firstName : userConnected.firstName,
        numTel : userConnected.numTel,
        email : userConnected.email,
        country : userConnected.country,
        region : userConnected.region,
      };
      const [formData, setFormData] = useState(initialValues);
      useEffect(() => {
        setBtnClicked("parametres");
        console.log('userConnected:', auth.user);
      }, []);
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
        .then((response) => response.data)
        .then((data) => {
          setAdmins(data);
            })
        .catch((error) => {
          console.error('Error fetching documents:', error);
        });
      if(!admins.some(admin => (admin.email === formData.email) && (admin._id != auth.user._id ))){
        if(userConnected.username === ''){
          const randomChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
          let name ;
          const randomDigitsOrLetters = Array.from({ length: 2 }, () =>
            randomChars[Math.floor(Math.random() * randomChars.length)]
          ).join('');
        
           name =`${formData.firstName}_${formData.lastName}${randomDigitsOrLetters}`;
           userConnected.username = name
        }
            userConnected.firstName = formData.firstName
            userConnected.lastName = formData.lastName
            userConnected.email = formData.email
            userConnected.numTel = formData.numTel
            userConnected.country = formData.country
            userConnected.region = formData.region
            changeInputColors();
            Axios.put(`/users/${auth.user._id}`, userConnected)
            .then((data) => {
              console.log('Object modified:', data);
              const {firstName , lastName , email , numTel , country , region , ...rest} = auth.user
              const user = {...rest,
                firstName : userConnected.firstName,
                lastName : userConnected.lastName,
                email : userConnected.email,
                numTel : userConnected.numTel,
                country : userConnected.country,
                region : userConnected.region
              }
              setAuth({user})
              toast.success('Informations modifiés avec succès')
            })
            .catch((error) => {
              console.error('Error modifying object:', error);
              toast.error('Erreur lors de la modification des informations')
            });
          }else{
            setMsgErreur1Color('red')
            toast.error('Adresse email déjà utilisée')
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
            <button onClick={handleAnnuler}>Annuler</button>
            <button onClick={handleEnregistrer} className='enregistrer'>Enregistrer</button>
        </div>
    </>
  )
}

export default SettingsForm
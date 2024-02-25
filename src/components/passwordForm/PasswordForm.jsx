import React ,{useState}from 'react'
import './PasswordForm.css'
import Axios from '../../services/Axios';

function PasswordForm() {
  const userConnected = JSON.parse(localStorage.getItem('userConnected'));
  const initialValues = {
    actuelPassword : "",
    newPassword : "",
    confPassword : "",
  };
  const [formData, setFormData] = useState(initialValues);
  const [message , setMessage] = useState("")
  const [messageColor , setMessageColor] = useState("")
  const [msgErreur1Color, setMsgErreur1Color] = useState('white');
  const [msgErreur2Color, setMsgErreur2Color] = useState('white');

  const handleActuelPasswordChange = (event) => {
    setMsgErreur1Color("white")
    setFormData((prevData) => ({
        ...prevData,
        actuelPassword : event.target.value,
      }));
  };
  const handleNewPasswordChange = (event) => {
    setFormData((prevData) => ({
        ...prevData,
        newPassword : event.target.value,
      }));
  };
  const handleConfPasswordChange = (event) => {
    setMsgErreur2Color("white");
    setFormData((prevData) => ({
        ...prevData,
        confPassword : event.target.value,
      }));
  };

  const handleEnregistrer = () =>{
    if(formData.actuelPassword === userConnected.pass){
      if(formData.newPassword === formData.confPassword){
        userConnected.pass = formData.newPassword
        localStorage.setItem('userConnected', JSON.stringify(userConnected))
        setFormData(initialValues)
        Axios.put(`/users/${userConnected._id}`, userConnected)
        .then((data) => {
              console.log('Object modified:', data);
              // You can update your UI or perform other actions here
            })
            .catch((error) => {
              console.error('Error modifying object:', error);
        });
      }else{
        setMsgErreur2Color("red");
      }
    }else{
        setMsgErreur1Color("red")
    }
};

const handleAnnuler = () => {
  setFormData(initialValues)
};

  return (
    <>
    <div className="settingsBody">
    <div className="passwordForm">
        <div className="passwordLine"></div>
        <div className="passwordLine"></div>
    <div className="passwordLine">
           <h3>Mot de passe actuel</h3>
          <input
              type="text"
              value={formData.actuelPassword}
              onChange={handleActuelPasswordChange}
              placeholder="Saisir titre "
              />
             <div className="messageErr">
                  <p style={{color:msgErreur1Color}}>Mot de passe incorrect</p>
              </div>   
      </div>
      <div className="passwordLine">
           <h3>Nouveau mot de passe</h3>
          <input
              type="text"
              value={formData.newPassword}
              onChange={handleNewPasswordChange}
              placeholder="Saisir titre "
              />
      </div>
      <div className="passwordLine">
           <h3>Confirmer mot de passe</h3>
          <input
              type="text"
              value={formData.confPassword}
              onChange={handleConfPasswordChange}
              placeholder="Saisir titre "
              />
            <div className="messageErr">
                  <p style={{color:msgErreur2Color}}>mot ne correspond pas</p>
            </div> 
      </div>
      </div>
      </div>
      <div className="settingsButton">
        <div className="message" style={{color:messageColor}}>{message}</div>
            <div>
              <button onClick={handleAnnuler}>Annuler</button>
              <button onClick={handleEnregistrer} className='enregistrer'>Enregistrer</button>
            </div>
      </div>
    </>

  )
}

export default PasswordForm
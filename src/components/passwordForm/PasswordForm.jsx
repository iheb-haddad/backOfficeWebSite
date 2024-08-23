import React ,{useState}from 'react'
import './PasswordForm.css'
import Axios from '../../services/Axios';
import useAuth from '../../hooks/useAuth';
import { toast } from 'sonner';

function PasswordForm() {
  const { auth } = useAuth();
  const initialValues = {
    actualPassword : "",
    newPassword : "",
    confirmationPassword : "",
  };
  const [formData, setFormData] = useState(initialValues);
  const [msgErreur1, setMsgErreur1] = useState('');
  const [msgErreur2, setMsgErreur2] = useState('');
  const [emptyFileds , setEmptyFileds] = useState(false)

  const handleActuelPasswordChange = (event) => {
    setMsgErreur1("")
    setMsgErreur2("");
    setEmptyFileds(false)
    setFormData((prevData) => ({
        ...prevData,
        actualPassword : event.target.value,
      }));
  };
  const handleNewPasswordChange = (event) => {
    setMsgErreur1("")
    setMsgErreur2("");
    setEmptyFileds(false)
    setFormData((prevData) => ({
        ...prevData,
        newPassword : event.target.value,
      }));
  };
  const handleConfPasswordChange = (event) => {
    setMsgErreur1("")
    setMsgErreur2("");
    setEmptyFileds(false)
    setFormData((prevData) => ({
        ...prevData,
        confirmationPassword : event.target.value,
      }));
  };

  const handleEnregistrer = () =>{
    if(formData.actualPassword === "" || formData.newPassword === "" || formData.confirmationPassword === ""){
      setEmptyFileds(true)
      toast.error('Veuillez remplir tous les champs')
      return
    }
        Axios.put(`/users/password/${auth.user._id}`, {
          actualPassword: formData.actualPassword,
          newPassword: formData.newPassword,
          confirmationPassword: formData.confirmationPassword,
        })
        .then((data) => {
              console.log('Object modified:');
              setFormData(initialValues)
              toast.success('Mot de passe modifié avec succès')
              setEmptyFileds(false)
              setMsgErreur1("")
              setMsgErreur2("")
            })
            .catch((error) => {
              console.error('Error modifying object:', error);
              error.response.status === 401 && setMsgErreur1("Mot de passe incorrect") 
              error.response.status === 403 && setMsgErreur2("vérifier la confirmation")
        });
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
              value={formData.actualPassword}
              onChange={handleActuelPasswordChange}
              placeholder="Saisir titre "
              style={{ border : emptyFileds && formData.actualPassword === '' && '2px solid red'}}
              />
             <div className="messageErr">
                  <p style={{color:"red"}}>{msgErreur1}</p>
              </div>   
      </div>
      <div className="passwordLine">
           <h3>Nouveau mot de passe</h3>
          <input
              type="text"
              value={formData.newPassword}
              onChange={handleNewPasswordChange}
              placeholder="Saisir titre "
              style={{ border : emptyFileds && formData.newPassword === '' && '2px solid red'}}
              />
      </div>
      <div className="passwordLine">
           <h3>Confirmer mot de passe</h3>
          <input
              type="text"
              value={formData.confirmationPassword}
              onChange={handleConfPasswordChange}
              placeholder="Saisir titre "
              style={{ border : emptyFileds && formData.confirmationPassword === '' && '2px solid red'}}  
              />
            <div className="messageErr">
                  <p style={{color:"red"}}>{msgErreur2}</p>
            </div> 
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

export default PasswordForm
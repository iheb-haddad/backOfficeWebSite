import React , {useState} from 'react'
import './AddAdminForm.css'
import Axios from '../../services/Axios';

function AddAdminForm() { 
    const initialValues = {
        lastName : "",
        firstName : "",
        email : "",
        password : "",
        confPassword : ""
      };
    const [formData, setFormData] = useState(initialValues);  
    const [message , setMessage] = useState("")
    const [messageColor , setMessageColor] = useState("")
    const [admins , setAdmins] = useState([])
    const [msgErreur1Color, setMsgErreur1Color] = useState('white');
    const [msgErreur2Color, setMsgErreur2Color] = useState('white');

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
      const handleemailChange = (event) => {
        setMsgErreur1Color("white")
        setFormData((prevData) => ({
            ...prevData,
            email : event.target.value,
          }));
      };
      const handlePasswordChange = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            password : event.target.value,
          }));
      };
      const handleConfPasswordChange = (event) => {
        setMsgErreur2Color("white")
        setFormData((prevData) => ({
            ...prevData,
            confPassword : event.target.value,
          }));
      };

      const handleEnregistrer = () => {
        Axios.get('/users')
        .then((response) => {
          setAdmins(response.data);
        })
        .catch((error) => {
          console.error('Error fetching items:', error);
        });
      if(!admins.some(admin => admin.email === formData.email)){
        if(formData.password === formData.confPassword){
        const randomChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let name ;
        do {
        const randomDigitsOrLetters = Array.from({ length: 2 }, () =>
          randomChars[Math.floor(Math.random() * randomChars.length)]
        ).join('');
      
         name =`${formData.firstName}_${formData.lastName}${randomDigitsOrLetters}`;
        }while(admins.some(admin => admin.username === name))

        const newAdmin = {
          username: name,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          pass: formData.password,
          numTel: '',
          country: '',
          region: '',
          github: '',
          linkedin: '',
          cin: ''
        };

        Axios.post('/users', newAdmin)
          .then((data) => {
            console.log('New admin added:', data); // Use response.data to access the server response
            setFormData(initialValues);
            setMessage("L'admin est ajouté avec succès");
            setMessageColor("green");
            setTimeout(() => {
              setMessage("");
            }, 4000);
          })
          .catch((error) => {
            console.error('Error adding new admin:', error);
            setMessage("Un problème s'est produit lors de l'ajout de l'admin");
            setMessageColor("red");
            setTimeout(() => {
              setMessage("");
            }, 4000);
          });
          }else{
            setMsgErreur2Color("red")
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
        <div className="addAdminForm">
          <div className="addAdminLine">
            <h3>Nom</h3>
            <input
                type="text"
                value={formData.lastName}
                onChange={handleLastNameChange}
                placeholder="Saisir titre "
                />
          </div>
          <div className="addAdminLine">
            <h3>Prénom</h3>
            <input
                type="text"
                value={formData.firstName}
                onChange={handlefirstNameChange}
                placeholder="Saisir titre "
                />
          </div>
          <div className="addAdminLine">
              <h3>Adresse Email</h3>
              <input
                  type="text"
                  value={formData.email}
                  onChange={handleemailChange}
                  placeholder="Saisir titre "
                  />
              <div className="adminErr">
                  <p style={{color:msgErreur1Color}}>adresse déjà utilisé</p>
              </div>     
          </div>
          <div className="addAdminLine">
              <h3>Mot de passe</h3>
              <input
                  type="text"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  placeholder="Saisir titre "
                  />
          </div>
          <div className="addAdminLine">
              <h3>Confirmer mot de passe</h3>
              <input
                  type="text"
                  value={formData.confPassword}
                  onChange={handleConfPasswordChange}
                  placeholder="Saisir titre "
                  />
              <div className="adminErr">
                  <p style={{color:msgErreur2Color}}>Mot de passe ne correspond pas</p>
              </div> 
          </div>
        </div>
      </div>
      <div className="settingsButton">
          <div className="message" style={{color:messageColor}}>{message}</div>
          <div>
             <button onClick={handleAnnuler}>Annuler</button>
             <button className='enregistrer' onClick={handleEnregistrer}>Enregistrer</button>
          </div>
      </div>
    </>
  )
}

export default AddAdminForm
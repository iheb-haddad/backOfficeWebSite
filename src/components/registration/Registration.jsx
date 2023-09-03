import React from 'react'
import {useState ,useEffect} from 'react'
import Axios from '../../services/Axios';
import './Registration.css';

function Registration(props) {
    const [isChecked, setChecked] = useState(false);
    const [admins , setAdmins ] = useState([])

    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [msgErreur1Color, setMsgErreur1Color] = useState('white');
    const [msgErreur2Color, setMsgErreur2Color] = useState('white');
  
  useEffect(() => {
    Axios.get('/users')
      .then((response) => {
        setAdmins(response.data);
      })
      .catch((error) => {
        console.error('Error fetching items:', error);
      });
  }, []);

    const handleChange = (event) => {
      setChecked(event.target.checked);
    };
    const handleEmailChange = (event) => {
      setEmail(event.target.value);
      setMsgErreur1Color('white');
      setMsgErreur2Color('white');
    };
  
    const handleMotDePasseChange = (event) => {
      setMotDePasse(event.target.value);
      setMsgErreur2Color('white');
    };
    const handleConnect = () => {
      console.log(admins)
      const user = admins.find((admin) => admin.email === email);
      if (!user) {
        setMsgErreur1Color('red');
      } else {
        if (user.pass !== motDePasse) {
          setMsgErreur2Color('red');
        } else {
          props.setConnectValide(true);
          props.setSessionValide(true)
          props.setUserConnected(user);
          localStorage.setItem('userConnected', JSON.stringify(user))
          sessionStorage.setItem('connectValide',true)
          isChecked && localStorage.setItem('connectValide', true);
          // You can perform further actions after successful login here
        }
      }
    };
//     const nodemailer = require('nodemailer');
//     const transporter = nodemailer.createTransport({
//       service: 'your-email-service-provider', // e.g., 'Gmail'
//       auth: {
//         user: 'hadediheb5@gmail.com',
//         pass: 'Ihebhaded123',
//       },
//     });
    
//     // Function to send the email
//     const sendPasswordEmail = (toEmail, password) => {
//       // Email content
//       const mailOptions = {
//         from: 'hadediheb5@gmail.com',
//         to: toEmail,
//         subject: 'Password Reset',
//         text: `Your new password is: ${password}`,
//       };
    
//       // Send the email
//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           console.error('Error sending email:', error);
//         } else {
//           console.log('Email sent:', info.response);
//         }
//       });
//     };
//     const forgetPassword = () => {
     
// const email = 'hadediheb9@gmail.com'; // Replace with the recipient's email address
// const password = 'uhgyuihgbiujkh'; // Replace with the password

// sendPasswordEmail(email, password);
//     }
  
  return (
    <div className='registration'>
        <div className="backgroundBox" style={{backgroundImage:'url(./loginBack.png)'}}>
          <div className="subtitle">DE RETOUR,</div>
          <div className="title">BIENVENUE !</div>
        </div>
        <div className="registrationBox">
            <div className="bodyContainer">
              <div className="logo">
                  <img src="./logo2.png" alt="" />
              </div>
              <div className="inputBox">
                    <div className="loginInput">
                            <input
                            type="text"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Taper votre adresse email"                  
                            />
                    </div>
                    <div className="messageBox">
                            <p style={{color:msgErreur1Color}}>Email invalide</p>
                    </div>     
                    <div className="loginInput">
                            <input
                            type="password"
                            value={motDePasse}
                            onChange={handleMotDePasseChange}
                            placeholder="Taper votre mot de passe"
                            />
                    </div>
                    <div className="messageBox">
                            <p style={{color:msgErreur2Color}}>Mot de passe incorrect</p>
                    </div>
              </div>
              <div className="connectionButton">
                      <button onClick={handleConnect}>Se connecter</button>
              </div>
              <div className="optionsBox">
                  <div className="options">
                            <label>
                                <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={handleChange}
                                />
                                Rester connecté
                            </label>
                            <h4>MOT DE PASSE OUBLIE</h4>
                    </div>
              </div>  
            </div>
        </div>
    </div>
  )
}

export default Registration

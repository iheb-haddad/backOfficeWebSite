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
    fetch('https://urlsjsonserver-p2nq.onrender.com/admins')
    .then((response) => response.json())
    .then((data) => {
        if(data.length !== 0){
          setAdmins(data)
          console.log(data)
        }else{
          console.log(2)
          const newAdmin = {
            username: '',
            firstName: '',
            lastName: '',
            email: 'flexiDoc@admin.com',
            pass: 'flexiDocadmin123',
            numTel: '',
            country: '',
            region: '',
            github: '',
            linkedin: '',
          };
          fetch('https://urlsjsonserver-p2nq.onrender.com/admins', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAdmin),
          })
            .then((response) => response.json())
            .then((data) => {
            console.log('New admin added:', data);
            setAdmins([newAdmin]) // Use response.data to access the server response
          })
          .catch((error) => {console.log('Error:', error)
          });

          const lngs = [
            {
              name: 'Français',
              code: 'fr',
            },
            {
              name: 'English',
              code: 'en',
            },
          ];
          lngs.map((lng) => {
            Axios.post('/languages', lng)
            .then((response) => {
              console.log('New language added:', response.data);
            })
            .catch((error) => {console.log('Error:', error)
            });
          });
        }
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
        }
      }
    };
  
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

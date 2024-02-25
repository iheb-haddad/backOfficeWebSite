import React ,{isValidElement, useState} from 'react'
import {SettingsForm , AddAdminForm , PasswordForm } from '../index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck ,  faPen } from '@fortawesome/free-solid-svg-icons';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import './ProfilePage.css'
import Axios from '../../services/Axios';

function ProfilePage(props) {
  const userConnected = JSON.parse(localStorage.getItem('userConnected'));
  const [componentCharged , setComponentCharged] = useState(<SettingsForm />)
  const [selectedTab, setSelectedTab] = useState('settings');
  const [githubIsEdited, setGithubIsEdited] = useState(false)
  const [linkedinIsEdited, setLinkedinIsEdited] = useState(false)
  const [github, setGithub] = useState(userConnected.github)
  const [linkedin, setLinkedin] = useState(userConnected.linkedin)

  const handleSettings = () =>{
    setComponentCharged(<SettingsForm />)
    setSelectedTab('settings');
  }
  const handlePassword = () =>{
    setComponentCharged(<PasswordForm />)
    setSelectedTab('password');
  }
  const handleAddAdmin = () =>{
    setComponentCharged(<AddAdminForm />)
    setSelectedTab('newAdmin');
  }
  const addGithub = () =>{
    setGithubIsEdited(true)
  }
  const confirmGithub = () =>{
    setGithubIsEdited(false)
    userConnected.github = github
    localStorage.setItem('userConnected', JSON.stringify(userConnected))
    Axios.put(`/users/${userConnected._id}`, userConnected)
    .then((data) => {
        console.log('Object modified:', data);
        // You can update your UI or perform other actions here
      })
      .catch((error) => {
        console.error('Error modifying object:', error);
      });
  }
  const addLinkedin = () =>{
    setLinkedinIsEdited(true)
  }
  const confirmLinkedin = () =>{
    setLinkedinIsEdited(false)
    userConnected.linkedin = linkedin
    localStorage.setItem('userConnected', JSON.stringify(userConnected))
    Axios.put(`/users/${userConnected._id}`, userConnected)
    .then((data) => {
        console.log('Object modified:', data);
        // You can update your UI or perform other actions here
      })
      .catch((error) => {
        console.error('Error modifying object:', error);
      });
  }
  const onChangeGithub = (event) =>{
    setGithub(event.target.value)
  }
  const onChangeLinkedin = (event) =>{
    setLinkedin(event.target.value)
  }

  return (
    <div className="profilePage">
      <div className="profileCover" style={{backgroundImage:'url(./couverture.jpg)'}}></div>
      <div className="profileBody">
        <div className="boxes">
        <div className="sideBox">
          <div className="profilePhoto">
            <img src="./profilAvatar.png"alt="" />
          </div>
          <div className="profileInfo">
            <div className='infoBox'>
            <div className="infoLine">{`ID :${userConnected.cin}`}</div>
            <div className="infoLine">{`Username :${userConnected.username}`}</div>
            </div>
            <div className="socialMedia">
              <div className="socialLine"><FaGithub className="social-icon" />{!githubIsEdited ? userConnected.github : <input type="text"  value={github} onChange={onChangeGithub}/>}{!githubIsEdited ? <FontAwesomeIcon icon={faPen} style={{cursor:'pointer',marginLeft:'3px',fontSize:'0.8rem'}} onClick={addGithub}/> : <FontAwesomeIcon icon={faCircleCheck} style={{cursor:'pointer',marginLeft:'3px',fontSize:'0.8rem'}}onClick={confirmGithub}/>}</div>
              <div className="socialLine"><FaLinkedin className="social-icon" />{!linkedinIsEdited ? userConnected.linkedin : <input type="text"  value={linkedin} onChange={onChangeLinkedin}/>}{!linkedinIsEdited ? <FontAwesomeIcon icon={faPen} style={{cursor:'pointer',marginLeft:'3px',fontSize:'0.8rem'}} onClick={addLinkedin}/> : <FontAwesomeIcon icon={faCircleCheck} style={{cursor:'pointer',marginLeft:'3px',fontSize:'0.8rem'}}onClick={confirmLinkedin}/>}</div>
            </div>
          </div>
        </div>
        <div className="gap"></div>
        <div className="settingsBox">
          <div className="settingsHead">
            <h4 className={`settings ${selectedTab === 'settings' ? 'clicked' : ''}`} onClick={handleSettings}>Paramètres du compte</h4>
            <h4 className={`password ${selectedTab === 'password' ? 'clicked' : ''}`} onClick={handlePassword}>Changer mot de passe</h4>
            <h4 className={`newAdmin ${selectedTab === 'newAdmin' ? 'clicked' : ''}`} onClick={handleAddAdmin}>Ajouter administrateur</h4>
          </div>
            {componentCharged}
        </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
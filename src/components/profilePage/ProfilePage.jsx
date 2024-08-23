import React ,{isValidElement, useEffect, useState} from 'react'
import {SettingsForm , AddAdminForm , PasswordForm } from '../index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck ,  faPen } from '@fortawesome/free-solid-svg-icons';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import './ProfilePage.css'
import Axios from '../../services/Axios';
import useAuth from '../../hooks/useAuth';

function ProfilePage() {
  const { auth } = useAuth();
  const [componentCharged , setComponentCharged] = useState(<SettingsForm />)
  const [selectedTab, setSelectedTab] = useState('settings');

  const handleSettings = () =>{
    setComponentCharged(<SettingsForm />)
    setSelectedTab('settings');
  }
  const handlePassword = () =>{
    setComponentCharged(<PasswordForm />)
    setSelectedTab('password');
  }

  return (
    <div className="profilePage">
        <div className="profileUsername">Bonjour , {auth.user.username}</div>
        <div className="settingsBox">
          <div className="settingsHead">
            <h4 className={`settings ${selectedTab === 'settings' ? 'clicked' : ''}`} onClick={handleSettings}>Informations Personnelles</h4>
            <h4 className={`password ${selectedTab === 'password' ? 'clicked' : ''}`} onClick={handlePassword}>Changer mot de passe</h4>
          </div>
            {componentCharged}
        </div>
    </div>
  )
}

export default ProfilePage
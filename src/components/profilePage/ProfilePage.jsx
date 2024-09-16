import React, { useState } from "react";
import { SettingsForm, PasswordForm } from "../index";
import "./ProfilePage.css";
import useAuth from "../../hooks/useAuth";

function ProfilePage() {
  const { auth } = useAuth();
  const [componentCharged, setComponentCharged] = useState(<SettingsForm />);
  const [selectedTab, setSelectedTab] = useState("settings");

  const handleSettings = () => {
    setComponentCharged(<SettingsForm />);
    setSelectedTab("settings");
  };
  const handlePassword = () => {
    setComponentCharged(<PasswordForm />);
    setSelectedTab("password");
  };

  return (
    <div className="profilePage">
      <div className="profileUsername">Bonjour , {auth.user.username}</div>
      <div className="settingsBox">
        <div className="settingsHead">
          <h4
            className={`settings ${
              selectedTab === "settings" ? "clicked" : ""
            }`}
            onClick={handleSettings}
          >
            Informations Personnelles
          </h4>
          <h4
            className={`password ${
              selectedTab === "password" ? "clicked" : ""
            }`}
            onClick={handlePassword}
          >
            Changer mot de passe
          </h4>
        </div>
        {componentCharged}
      </div>
    </div>
  );
}

export default ProfilePage;

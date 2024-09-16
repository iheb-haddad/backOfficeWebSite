import { useState, useEffect, useRef } from "react";
import Axios from "../../services/Axios";
import "./Registration.css";
import useAuth from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import CryptoJS from "crypto-js";
import { toast } from "sonner";

function Registration() {
  const [isChecked, setChecked] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msgErreur1Color, setMsgErreur1Color] = useState("white");
  const [msgErreur2Color, setMsgErreur2Color] = useState("white");
  const [emptyFileds, setEmptyFileds] = useState(false);
  const inputRef = useRef();

  const { setAuth, setConnectValide, setSessionValide } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    Axios.get("/users")
      .then((response) => response.data)
      .then((data) => {
        if (data.length !== 0) {
          setAdmins(data);
        } else {
          const newAdmin = {
            role: "admin",
            username: "Admin_flexidoc",
            firstName: "",
            lastName: "",
            email: "flexiDoc@admin.com",
            password: "flexiDocadmin123",
            numTel: "",
            country: "",
            region: "",
          };
          Axios.post("/auth/register", {
            newAdmin,
            confirmation: "flexiDocadmin123",
          })
            .then((data) => {
              console.log("New admin added:");
              setAdmins([newAdmin]); // Use response.data to access the server response
            })
            .catch((error) => {
              console.log("Error adding admin:", error);
            });

          const lngs = [
            {
              name: "Français",
              code: "fr",
            },
            {
              name: "English",
              code: "en",
            },
          ];
          lngs.map((lng) => {
            Axios.post("/languages", lng)
              .then((response) => {
                console.log("New language added:", response.data);
              })
              .catch((error) => {
                console.log("Error:", error);
              });
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        toast.error("Erreur lors du chargement des données");
      });
  }, []);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setMsgErreur1Color("white");
    setMsgErreur2Color("white");
  };

  const handleMotDePasseChange = (event) => {
    setPassword(event.target.value);
    setMsgErreur2Color("white");
  };

  const handleEnterPressed = (event) => {
    if (event.key === "Enter") {
      handleConnect();
    }
  };

  const handleJumpToPassword = (event) => {
    if (event.key === "Enter") {
      inputRef.current.focus();
      console.log("jumped to password");
    }
  };

  const handleConnect = () => {
    if (email === "" || password === "") {
      setEmptyFileds(true);
      return;
    }
    Axios.post("/auth/login", { email, password })
      .then((response) => {
        const user = response.data.user;
        setAuth({ user });
        navigate(from, { replace: true });
        setConnectValide(true);
        setSessionValide(true);
        const attribute = "465gh4n65dthyty56try";
        const stockedData = {
          userId: user._id,
          expiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        };
        const sekret_key = "a3f8e99794a94e7bafc067a8f9d61fe3";
        const encrypted_data = CryptoJS.AES.encrypt(
          JSON.stringify(stockedData),
          sekret_key
        ).toString();
        localStorage.setItem(attribute, encrypted_data);
        sessionStorage.setItem("connectValide", true);
        isChecked && localStorage.setItem("connectValide", true);
        toast.success("Connexion réussie");
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        error.response.status === 401 && setMsgErreur1Color("red");
        error.response.status === 403 && setMsgErreur2Color("red");
      });
  };

  return (
    <div className="registration">
      <div
        className="backgroundBox"
        style={{ backgroundImage: "url(./loginBack.png)" }}
      >
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
                onKeyDown={handleJumpToPassword}
                placeholder="Taper votre adresse email"
                style={{
                  border: emptyFileds && email === "" && "2px solid red",
                }}
              />
            </div>
            <div className="messageBox">
              <p style={{ color: msgErreur1Color }}>Email invalide</p>
            </div>
            <div className="loginInput">
              <input
                type="password"
                ref={inputRef}
                value={password}
                onChange={handleMotDePasseChange}
                onKeyDown={handleEnterPressed}
                placeholder="Taper votre mot de passe"
                style={{
                  border: emptyFileds && password === "" && "2px solid red",
                }}
              />
            </div>
            <div className="messageBox">
              <p style={{ color: msgErreur2Color }}>Mot de passe incorrect</p>
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
  );
}

export default Registration;

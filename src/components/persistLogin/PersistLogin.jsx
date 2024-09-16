import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { ClipLoader } from "react-spinners";
import "./PersistLogin.css";
import { useNavigate, useLocation } from "react-router-dom";
import Axios from "../../services/Axios";
import CryptoJS from "crypto-js";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { auth, connectValide, sessionValide, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      const attribute = "465gh4n65dthyty56try";
      const sekret_key = "a3f8e99794a94e7bafc067a8f9d61fe3";
      const encryptedObject = localStorage.getItem(attribute);
      if (!encryptedObject)
        return navigate("/login", { state: { from: location }, replace: true });
      const decrypted = CryptoJS.AES.decrypt(
        encryptedObject,
        sekret_key
      ).toString(CryptoJS.enc.Utf8);
      const stockedData = JSON.parse(decrypted);
      if (stockedData.expiration < Date.now()) {
        localStorage.removeItem(attribute);
        return navigate("/login", { state: { from: location }, replace: true });
      }
      const userId = stockedData.userId;
      Axios.get(`refresh/${userId}`)
        .then((response) => {
          const user = response.data.user;
          setAuth({ user });
          setIsLoading(false);
        })
        .catch((error) => {
          navigate("/login", { state: { from: location }, replace: true });
          setIsLoading(false);
          console.log("Error:", error);
          console.log("No username found in auth");
        });
    };

    if (connectValide || sessionValide) {
      verifyRefreshToken();
      setIsLoading(false);
    } else {
      setIsLoading(false);
      navigate("/login", { state: { from: location }, replace: true });
    }
  }, []);

  return (
    <>
      {!(connectValide || sessionValide) ? (
        <Outlet />
      ) : isLoading ? (
        <ClipLoader
          className="pageLoader"
          loading={isLoading}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;

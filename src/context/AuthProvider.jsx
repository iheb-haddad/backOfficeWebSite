import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [sessionValide ,setSessionValide] = useState(()=>{
        const storedConnectValide = sessionStorage.getItem('connectValide') === 'true'
        return storedConnectValide ? storedConnectValide : false;
      });
      const [connectValide, setConnectValide] = useState(()=>{
        const storedConnectValide = localStorage.getItem('connectValide') === 'true'
        return storedConnectValide ? storedConnectValide : false;
      });
    const [auth, setAuth] = useState({});
    const [navLineClicked,setNavLineClicked] = useState("home");

    const [liveConfiguration, setLiveConfiguration] = useState(false);

    return (
        <AuthContext.Provider value={{ auth, setAuth, connectValide , setConnectValide ,
         sessionValide , setSessionValide , navLineClicked , setNavLineClicked,
         liveConfiguration , setLiveConfiguration }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
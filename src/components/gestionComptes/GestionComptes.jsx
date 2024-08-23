import React from 'react'
import { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { Outlet } from "react-router-dom";
import { Link } from 'react-router-dom';
import useRessources from '../../hooks/useRessources';
import useStore from '../../globalState/UseStore';
import { useNavigate, useLocation } from 'react-router-dom';

const GestionComptes = () => {
    const {btnClicked, setBtnClicked} = useRessources();
    const { setNavLineClicked , auth } = useAuth();
    const { projects , fetchProjects } = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        setNavLineClicked("users")
        const user = auth?.user?._id || '';
        fetchProjects(user);
        console.log(projects);
    }, []);

    useEffect(() => {
        if(!(auth?.user?.role === 'admin' || projects.length > 0 )){
            navigate('/GestionComptes/parametresCompte', { state: { from: location }, replace: true });
        }
    }, [projects]);

    const clickUsers = () => {
        setBtnClicked("users");
    }
    const clickParametres = () => {
        setBtnClicked("parametres");
    }
    const clickAjouter = () => {
        setBtnClicked("ajouter");
    }

  return (
    <div style={{backgroundColor:'white' , minHeight:'90vh', paddingBottom : '40px'}}>
        <div className="buttonsBox" >
            {(auth?.user?.role === 'admin' || projects.length > 0 ) &&<Link to="/GestionComptes" onClick={clickUsers}>
                <button className={`back ${btnClicked === "users" && 'clicked'}`} >Gestion users</button>
            </Link> }
            {(auth?.user?.role === 'admin' || projects.length > 0 ) &&<Link to="/GestionComptes/ajouterUser" onClick={clickAjouter}> 
                <button className={`back ${btnClicked === "ajouter" && 'clicked'}`}>Ajouter user</button>
            </Link>}
            <Link to="/GestionComptes/parametresCompte" onClick={clickParametres}>
                <button className={`back ${btnClicked === "parametres" && 'clicked'}`}>Paramètres du compte</button>
            </Link>
        </div>
        <Outlet />
    </div>
  )
}

export default GestionComptes
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu'
import { Settings, LogOut } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';
import useAuth from '../../hooks/useAuth';
import { toast } from 'sonner'

export default function DropDownDisconnect() {
    const { auth } = useAuth();
    const [isDeconnecting, setIsDeconnecting] = React.useState(false);
    const navigate = useNavigate();
    const logout = useLogout();

    const handleVisitProfile = () => {
        navigate('/GestionComptes/parametresCompte');
    }
  
    const handleLogout = async () => {
        navigate('/login');
        await logout(); 
        toast.success('Déconnecté avec succès');
    }
  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
        <div className="user">
            <div className="rounded-image">
                <img src="../../public/profilAvatar.png"alt="" />
            </div>
            <span className="username" onClick={() => setIsDeconnecting(prev => !prev)}>
                {auth?.user?.username}
                {isDeconnecting ? <FontAwesomeIcon icon={faChevronUp} style={{marginLeft:'5px'}} /> : <FontAwesomeIcon icon={faChevronDown} style={{marginLeft:'5px'}}/>}
            </span>
        </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent side="bottom" align="end" className="w-44">
        <DropdownMenuItem onClick={handleVisitProfile} className='cursor-pointer'>
          <div className="flex justify-center items-center p-1 rounded-sm bg-custom-gray-5 border border-custom-gray-7 mr-4">
            <Settings />
          </div>
          <span className="text-md font-semibold">Mon Profil</span>
        </DropdownMenuItem>
      <DropdownMenuItem onClick={handleLogout} className='cursor-pointer'>
        <div className="flex justify-center items-center p-1 rounded-sm bg-custom-gray-5 border border-custom-gray-7 mr-4">
          <LogOut />
        </div>
        <span className="text-md font-semibold">Se Déconnecter</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  )
}

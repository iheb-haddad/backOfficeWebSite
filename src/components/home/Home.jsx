import './Home.css'
import React, { useEffect,useState } from 'react';
import { Navbar ,Body} from '../index'
import {Dashboard ,ProfilePage ,Configurations , Accueil} from '../index';
function Home(props) {
  const userConnected = JSON.parse(localStorage.getItem('userConnected'));
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [modBackground, setModBackground] = useState(true)


  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      // screenWidth > 700 && setnormalPanelExp(false);
    };

    // Attach the handleResize function to the 'resize' event
    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [showNavbar , setShowNavbar] = useState(false);
  const handleShowNavbar = () => {
    setShowNavbar((prev) => { return !prev })
  };




  const [navComponent, setNavComponent] = useState(<Accueil />)

  const [navLineClicked,setNavLineClicked] = useState("home")

    const handleClickDashboard = () => {
      setModBackground(false)
      setNavComponent(<Dashboard />)
        setNavLineClicked("dashboard")
        screenWidth < 1160 && setShowNavbar(false)
    };
    const handleClickHome = () => {
      setModBackground(true)
      setNavLineClicked("home")
      setNavComponent(<Accueil />)
      screenWidth < 1160 && setShowNavbar(false)
    };
    const handleClickProfile = () => {
      setModBackground(false)
      setNavComponent(<ProfilePage />)
      setNavLineClicked("profile")
      screenWidth < 1160 && setShowNavbar(false)
    };
    const handleClickSettings = () => {
      setModBackground(true)
      setNavComponent(<Configurations/>)
      setNavLineClicked("settings")
      screenWidth < 1160 && setShowNavbar(false)
    };

  return (
    <>
      <div className="container" style={{backgroundImage:modBackground && 'url(./backFilter.png)'}}>        
            {(screenWidth > 1160 || showNavbar) &&
            <Navbar 
            showNavbar={handleShowNavbar}
            clickDashboard={handleClickDashboard}
            clickHome={handleClickHome}
            clickProfile={handleClickProfile}
            clickSettings={handleClickSettings}
            navLineClicked={navLineClicked}/>}
            {(!showNavbar || screenWidth > 450) 
           && <Body 
            showNavbar={handleShowNavbar}
            screenWidth={screenWidth}
            clickProfile={handleClickProfile}
            setConnectValide={props.setConnectValide}
            componentCharged={navComponent}/>}
      </div>
    </>
  )
}

export default Home
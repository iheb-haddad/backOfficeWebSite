import './Home.css'
import React, { useEffect,useState } from 'react';
import { Navbar ,Body} from '../index'

function Home(props) {
  const userConnected = JSON.parse(localStorage.getItem('userConnected'));
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [modBackground, setModBackground] = useState(true)
  const [navLineClicked,setNavLineClicked] = useState(() => {
    const saved = sessionStorage.getItem('navLineClicked');
    return saved ? saved : 'home';
  })

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    // Attach the handleResize function to the 'resize' event
    window.addEventListener('resize', handleResize);
    console.log(screenWidth)

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    sessionStorage.setItem('navLineClicked', navLineClicked);
  }, [navLineClicked]);

  const [showNavbar , setShowNavbar] = useState(false);
  const handleShowNavbar = () => {
    setShowNavbar((prev) => { return !prev })
  };

    const handleClickDashboard = () => {
      setModBackground(false)
      setNavLineClicked("dashboard")
      screenWidth < 1160 && setShowNavbar(false)
    };
    const handleClickHome = () => {
      setModBackground(true)
      setNavLineClicked("home")
      screenWidth < 1160 && setShowNavbar(false)
    };
    const handleClickProfile = () => {
      setModBackground(false)
      setNavLineClicked("profile")
      screenWidth < 1160 && setShowNavbar(false)
    };
    const handleClickSettings = () => {
      setModBackground(true)
      setNavLineClicked("settings")
      screenWidth < 1160 && setShowNavbar(false)
    };
    const handleClickSources = () => {
      setModBackground(true)
      setNavLineClicked("sources")
      screenWidth < 1160 && setShowNavbar(false)
    };
    const handleClickDocuments = () => {
      setModBackground(true)
      setNavLineClicked("documents")
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
            clickSources={handleClickSources}
            clickDocuments={handleClickDocuments}
            navLineClicked={navLineClicked}/>}
            {(!showNavbar || screenWidth > 450) 
           && 
            <Body 
            showNavbar={handleShowNavbar}
            screenWidth={screenWidth}
            clickProfile={handleClickProfile}
            setConnectValide={props.setConnectValide}
            setSessionValide={props.setSessionValide}
            />}
      </div>
    </>
  )
}

export default Home
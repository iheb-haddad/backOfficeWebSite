import './Home.css'
import React, { useEffect,useState } from 'react';
import { Navbar ,Body} from '../index'
import {ClipLoader} from 'react-spinners';
import useAuth from '../../hooks/useAuth';
import { NormalPanel } from '../flexidocPanel';

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [modBackground, setModBackground] = useState(true)

  const { setNavLineClicked , liveConfiguration , setLiveConfiguration} = useAuth();
  
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);


  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
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
    setLiveConfiguration(false)
    console.log(showNavbar)
  };

    const handleClickMappings = () => {
      setModBackground(false)
      setNavLineClicked("mappings")
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
    const handleClickProjects = () => {
      setModBackground(true)
      setNavLineClicked("projects")
      screenWidth < 1160 && setShowNavbar(false)
    }
    const handleClickUsers = () => {
      setModBackground(false)
      setNavLineClicked("users")
      screenWidth < 1160 && setShowNavbar(false)
    }

  return (
    <>{ isLoading ? <ClipLoader
      className='pageLoader'
      loading={isLoading}
      aria-label="Loading Spinner"
      data-testid="loader"
      /> :
      <div className="container" style={{backgroundImage:modBackground && 'url(../../public/backFilter.png)'}}>        
            {((screenWidth > 1160 || showNavbar) && (!liveConfiguration)) &&
            <Navbar 
            showNavbar={handleShowNavbar}
            clickMappings={handleClickMappings}
            clickHome={handleClickHome}
            clickProfile={handleClickProfile}
            clickSettings={handleClickSettings}
            clickSources={handleClickSources}
            clickDocuments={handleClickDocuments}
            clickProjects={handleClickProjects}
            clickUsers={handleClickUsers}/>}
            {(!showNavbar || screenWidth > 450) 
           && 
            <Body 
            showNavbar={handleShowNavbar}
            screenWidth={screenWidth}
            clickProfile={handleClickProfile}
            />}
            {liveConfiguration && <NormalPanel />}
      </div>}
    </>
  )
}

export default Home
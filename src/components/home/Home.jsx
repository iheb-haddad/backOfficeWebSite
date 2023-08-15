import './Home.css'
import React, { useEffect,useState } from 'react';
import { Navbar ,Body} from '../index'
import {DocFormAjout ,DocsList ,Dashboard ,ProfilePage} from '../index';
function Home(props) {

  const handleAdd = () => {
    const newObject = {
      urlApp: urlApp,
      urlDoc: urlDoc,
      id: Math.random().toString(36).substring(7), // Generate a random id
    };

    fetch('https://urlsjsonserver.onrender.com/mappings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newObject),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('New object added:', data);
        // You can update your UI or perform other actions here
      })
      .catch((error) => {
        console.error('Error adding new object:', error);
      });
  };

  const handleDelete = () => {
    fetch('https://urlsjsonserver.onrender.com/mappings')
      .then((response) => response.json())
      .then((data) => {
        // Find the object with the matching urlApp
        const objectToDelete = data.find((obj) => obj.urlApp === urlApp);
  
        if (!objectToDelete) {
          console.log('Object not found with the provided urlApp:', urlApp);
          return;
        }
  
        // Perform the delete operation using the object's id
        fetch(`https://urlsjsonserver.onrender.com/mappings/${objectToDelete.id}`, {
          method: 'DELETE',
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Object deleted:', data);
            // You can update your UI or perform other actions here
          })
          .catch((error) => {
            console.error('Error deleting object:', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching objects:', error);
      });
  };

  const handleModify = () => {
    fetch('https://urlsjsonserver.onrender.com/mappings')
      .then((response) => response.json())
      .then((data) => {
        // Find the object with the matching urlApp
        const objectToModify = data.find((obj) => obj.urlApp === urlApp);
  
        if (!objectToModify) {
          console.log('Object not found with the provided urlApp:', urlApp);
          return;
        }
  
        // Modify the object's urlDoc property
        objectToModify.urlDoc = urlDoc;
  
        // Perform the update operation using the object's id
        fetch(`https://urlsjsonserver.onrender.com/mappings/${objectToModify.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(objectToModify),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Object modified:', data);
            // You can update your UI or perform other actions here
          })
          .catch((error) => {
            console.error('Error modifying object:', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching objects:', error);
      });
  };

  const [operation , setOperation] = useState("AJOUT D'UN MAPPING")
  const [buttonType,setButtonType] = useState(1);
  const [buttonName,setButtonName] = useState("Ajouter")
  const [urlDoc, setUrlDoc] = useState('');
  const [urlApp, setUrlApp] = useState('');

  const handleSubmit = () => {
    // Call the appropriate handler based on the value of buttonType
    if (buttonType === 1) {
      handleAdd();
    } else if (buttonType === 2) {
      handleModify();
    } else if (buttonType === 3) {
      handleDelete();
    }
  };
  const handleAnnuler = () => {
    setUrlApp('');
    setUrlDoc('');
  };
  const clickAdd = () => {
    setOperation("AJOUT D'UN MAPPING");
    setButtonType(1);
    setButtonName('Ajouter')
  };
  const clickModify = () => {
    setOperation("MODIFICATION D'UN MAPPING");
    setButtonType(2);
    setButtonName('Modifier')
  };
  const clickDelete = () => {
    setOperation("SUPPRESSION D'UN MAPPING");
    setButtonType(3);
    setButtonName('Supprimer')
  };
  const handleDeconnect = () =>{
    props.setConnectValide(false);
    localStorage.removeItem('connectValide');
    localStorage.removeItem('username');
  }
  
  const [pathName, setPathName] = useState('');

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);


  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      screenWidth > 700 && setnormalPanelExp(false);
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

  ///////////////////////////////////////////////////////////////////////////////
  const initialFilterParameteres = {
    selectedType : 'tout',
    selectedLanguage : 'tout',
    selectedApp : 'tout'
  }
  const [filterParameters, setFilterParameters] = useState(initialFilterParameteres);
  const [componentCharged , setComponentCharged] = useState(<DocsList filterParameters={filterParameters}/>);
  const [displayBackbtn , setDisplayBackbtn] = useState(false);
  const [addbtnIsClicked , setAddbtnIsClicked] = useState(false);
  const [filterbtnIsClicked , setFilterbtnIsClicked] = useState(false);
  const clickAddbtn = () => { 
    setComponentCharged(<DocFormAjout/>)
    setAddbtnIsClicked(true)
    setDisplayBackbtn(true)
    setFilterbtnIsClicked(false)
  };
  const clickFilterbtn = () => { 
    setComponentCharged(<DocsList filterParameters={filterParameters}/>)
    setAddbtnIsClicked(false)
    setDisplayBackbtn(false)
    setFilterbtnIsClicked(prev => !prev)
    setFilterParameters(initialFilterParameteres)
  };
  const clickBackbtn = () => { 
    setComponentCharged(<DocsList filterParameters={filterParameters}/>)
    setAddbtnIsClicked(false)
    setDisplayBackbtn(false)
    setFilterbtnIsClicked(false)
  };

  useEffect(() =>{
    setComponentCharged(<DocsList filterParameters={filterParameters}/>) 
  },[filterParameters]);

  return (
    <>
      <div className="container">          
          {/* {(screenWidth > 850 || showNavbar) && <Navbar 
          handleDeconnect={handleDeconnect} 
           
          handleChargeComponent={setComponentCharged}
          setPathname={setPathName}
          showNavbar={handleShowNavbar}/>}
          {(!showNavbar || screenWidth > 450) 
          && <Body componentCharged={componentCharged}
           pathName={pathName}
            showNavbar={handleShowNavbar}
            screenWidth={screenWidth}/>} */}
            {(screenWidth > 850 || showNavbar) &&<Navbar showNavbar={handleShowNavbar}/>}
            {(!showNavbar || screenWidth > 450) 
           && <Body 
            username={props.username}
            showNavbar={handleShowNavbar}
            screenWidth={screenWidth}
            componentCharged={<ProfilePage />
            // <Dashboard addbtnIsClicked={addbtnIsClicked}
            // filterbtnIsClicked={filterbtnIsClicked} 
            // displayBackbtn={displayBackbtn} 
            // clickAddbtn = {clickAddbtn}
            // clickFilterbtn = {clickFilterbtn}
            // clickBackbtn = {clickBackbtn} 
            // filterParameters = {filterParameters}
            // setFilterParameters = {setFilterParameters}
            // componentCharged={componentCharged} />
          }/>}
      </div>
    </>
  )
}

export default Home
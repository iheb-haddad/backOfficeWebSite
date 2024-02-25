import React from 'react'
import {useState} from 'react'
import {Registration ,Home, Dashboard , GestionMapping, ProfilePage, Configurations , GestionSources , GestionDocuments} from './components/index'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css'

function App() {
  const [sessionValide ,setSessionValide] = useState(()=>{
    const storedConnectValide = sessionStorage.getItem('connectValide') === 'true'
    return storedConnectValide ? storedConnectValide : false;
  });
  const [connectValide, setConnectValide] = useState(()=>{
    const storedConnectValide = localStorage.getItem('connectValide') === 'true'
    return storedConnectValide ? storedConnectValide : false;
  });
  const [userConnected,setUserConnected] = useState(()=>{
    const storedUserConnected = JSON.parse(localStorage.getItem('userConnected'));
    return storedUserConnected ? storedUserConnected : '';
  })
  return (
    <div>
      {(connectValide || sessionValide )? 
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home  setSessionValide={setSessionValide} setConnectValide={setConnectValide}/>}>
              <Route index element={<Dashboard />} />
              <Route path="GestionMapping" element={<GestionMapping />} />
              <Route path="Profile" element={<ProfilePage />} />
              <Route path="Configurations" element={<Configurations />} />
              <Route path="GestionSources" element={<GestionSources />} />
              <Route path="GestionDocuments" element={<GestionDocuments />} />
            </Route>
          </Routes>
        </BrowserRouter>
      : 
      <Registration setConnectValide={setConnectValide} setSessionValide={setSessionValide} setUserConnected={setUserConnected}/>}
    </div>
  )
}

export default App
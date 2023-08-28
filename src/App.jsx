import React from 'react'
import {useState} from 'react'
import {Registration ,Home} from './components/index'


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
      {(connectValide || sessionValide )? <Home  setSessionValide={setSessionValide} setConnectValide={setConnectValide}/>: <Registration setConnectValide={setConnectValide} setSessionValide={setSessionValide} setUserConnected={setUserConnected}/>}
    </div>
  )
}

export default App
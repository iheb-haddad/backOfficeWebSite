import React , {useEffect ,useState} from 'react'
import './UploadPage.css'
import Axios from '../../services/Axios';
import {parse} from 'papaparse'
function UploadPage() {
  const [data ,setData] = useState([])
  const [filesName ,setFilesName] = useState([])
  const [loadingNumber ,setLoadingNumber] = useState([])
  const [barWidth ,setBarWidth] = useState([])

  useEffect(()=>{
    const droparea = document.querySelector('.dragDropZone');

    const active = () => droparea.classList.add("greenBorder");
    const inactive = () => droparea.classList.remove("greenBorder") ;

    ['dragenter','dragover','dragleave','drop'].forEach(evtName => {
      droparea.addEventListener(evtName,(e)=>{
        e.preventDefault()})
    });

    ['dragenter','dragover'].forEach(evtName => {
      droparea.addEventListener(evtName,active)
    });
    ['dragleave','drop'].forEach(evtName => {
      droparea.addEventListener(evtName,inactive)
    });
  },[])
  const dropFiles = (e) => {
    Array.from(e.dataTransfer.files).map( async file => {
      filesName.push(file.name)
      let text = await file.text()
      let result = parse(text , {header : true})
      barWidth.push("10%")
      loadingNumber.push(10)
      setTimeout(() => {
        const updatedBarWidth = [...barWidth];
        updatedBarWidth[updatedBarWidth.length - 1] = "20%";
        setBarWidth(updatedBarWidth);
        const updatedNumber = [...loadingNumber];
        updatedNumber[updatedNumber.length - 1] = 20;
        setLoadingNumber(updatedNumber);
      }, 500);
      setTimeout(() => {
        const updatedBarWidth = [...barWidth];
        updatedBarWidth[updatedBarWidth.length - 1] = "30%";
        setBarWidth(updatedBarWidth);
        const updatedNumber = [...loadingNumber];
        updatedNumber[updatedNumber.length - 1] = 30;
        setLoadingNumber(updatedNumber);
      }, 500);
      result.data.map((document)=>{
        if(document.type){
      const newDocument = {
        langue: document.langue,
        titre: document.titre,
        statut: document.statut,
        urlDoc: document.urlDocument,
        affichage: document.affichage,
        expiration: document.expiration,
        consultNumber: 0
      };
      fetch('https://urlsjsonserver-p2nq.onrender.com/documentations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDocument),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('New document added:', data);
          // You can update your UI or perform other actions here
        })
        .catch((error) => {
          console.error('Error adding new document:', error);
        });
      }})
      setTimeout(() => {
        const updatedBarWidth = [...barWidth];
        updatedBarWidth[updatedBarWidth.length - 1] = "60%";
        setBarWidth(updatedBarWidth);
        const updatedNumber = [...loadingNumber];
        updatedNumber[updatedNumber.length - 1] = 60;
        setLoadingNumber(updatedNumber);
      }, 1500);
      setTimeout(() => {
        const updatedBarWidth = [...barWidth];
        updatedBarWidth[updatedBarWidth.length - 1] = "100%";
        setBarWidth(updatedBarWidth);
        const updatedNumber = [...loadingNumber];
        updatedNumber[updatedNumber.length - 1] = 100;
        setLoadingNumber(updatedNumber);
      }, 1500);
    })
  }
  return (
    <div className="uploadPage">
      <div className="title">Déposez votre fichier</div>
      <div className="remarque">Le fichier doit être csv </div>
      <div className="dragDropZone" onDrop={dropFiles}>
        <img src="./fileLogo.png" alt="fileLogo" />
        <div className="text">Glisser-Déposer</div>
      </div>
      <div className="uploadResult">
        <div className="resultTitle">Fichiers importés</div>
        {filesName.map((item ,index)=>(
          <div className='fileDropped' key={index}>
            <div className="imageLoad">
              <img src="./fileCsv.png" alt="" />
            </div>
            <div className="loadingBox"> 
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <div className="fileName">{item}</div>
                <div className="loadingChiffre">{loadingNumber[index]}%</div>
              </div>
              <div className="loadingBar" style={{width:barWidth[index]}}></div>  
            </div>    
          </div>
        ))}
      </div>
    </div>
  )
}

export default UploadPage
import React , {useEffect ,useState} from 'react'
import './UploadPage.css'
import Axios from '../../services/Axios';
import {parse} from 'papaparse'
import ModalBox from '../modalBox/ModalBox';
import ClipLoader from "react-spinners/ClipLoader";

function UploadPage({filesType , setDataChanged}) {

  const [data ,setData] = useState([])
  const [filesName ,setFilesName] = useState([])
  const [loadingNumber ,setLoadingNumber] = useState([])
  const [barWidth ,setBarWidth] = useState([])
  const [showModal , setShowModal] = useState(false)
  const [message , setMessage] = useState('')
  const [indexError , setIndexError] = useState(0)
  const [configurations , setConfigurations] = useState([])

  useEffect(() => {
    Axios.get('/configurations')
    .then((response) => {
      setConfigurations(response.data[0])
    })
    .catch((error) => {
      console.error('Error fetching configurations:', error);
    });
  }, []);

  const addSource = async (source,index) => {
    if(!source.name){
      setMessage('Manque le nom de la source à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('Source name is required');
      return false;
    }
    if(!source.keywords){
      setMessage('Manque les mots clés de la source à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('Source keywords are required');
      return false;
    }
    if(!source.subProject){
      setMessage('Manque du sous projet à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('Project is required');
      return false;
    }
    if(!source.project){
      setMessage('Manque du projet à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('Project is required');
      return false;
    }

    let urlList = [];
    if (source.keywords) {
        urlList = source.keywords.split(',');
      }
    const newSource = {
      project: source.project,
      subProject: source.subProject,
      name: source.name,
      keywords: urlList,
    };
    try {
      const response = await Axios.post('/sources/upload', newSource);
      console.log('New source added:', response.data);
      setDataChanged(prev => prev + 1);
      return true;
    } catch (error) {
      console.error('Error adding new source:', error);
      setMessage(error.response.data.message + ' à la ligne ' + (index + indexError + 1));
      setShowModal(true);
      setIndexError(index + indexError + 1);
      return false;
    }
  }

  const addDocument = async (document,index) => {
    if(!document.project){
      setMessage('Manque du projet à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('Project id is required');
      return false;
    }
    if(!document.subProject){
      setMessage('Manque du sous projet à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('Project id is required');
      return false;
    }
    if(!document.title){
      setMessage('Manque le nom du documpent à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('Document name is required');
      return false;
    }
    if(!document.language){
      setMessage('Manque la langue du document à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('Document language is required');
      return false;
    }
    if(!document.urlDoc && document.display === 'contenu'){
      setMessage('Manque l\'url du document à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('Document URL is required');
      return false;
    }
    if(!document.status){
      setMessage('Manque le statut du document à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('Document status is required');
      return false;
    }
    if(document.expiration && document.expiration !== "null" && !document.expiration.split('T')[0].match(/^\d{4}-\d{2}-\d{2}$/)){
      setMessage('format expiration à la ligne ' + (index + indexError + 1) + ' doit etre yyyy-mm-dd')
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('Invalid expiration format');
      return false;
    }

    let keywordList = [];
    if (document.keywords) {
    keywordList = document.keywords.split(',');
    }
    const newDocument = {
      project: document.project,
      subProject: document.subProject,
      language: document.language,
      title: document.title,
      status: document.status,
      urlDoc: document.urlDoc,
      display: document.display,
      note : document.note || "",
      expiration: document.expiration,
      keywords : keywordList,
      consultationNumber: 0,
      lastConsultation : ''
    };

    try {
      const response = await Axios.post('/documentations/upload', newDocument);
      console.log('New document added:', response.data);
      setDataChanged(prev => prev + 1);
      return true;
    } catch (error){
        console.error('Error adding new document:', error);
        if(error.response.status === 403){
          setMessage('format expiration à la ligne ' + (index + indexError + 1) , +' doit etre yyyy-mm-dd')
          setShowModal(true)
          setIndexError(index + indexError + 1)
          return false;
        }
    };
  }

  const addConfigurations = async (configuration,index) => {
    if(!configuration.project){
      setMessage('Manque du projet à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('Project id is required');
      return false;
    }
    const newConfiguration = {
      project : configuration.project,
      panelColor : configuration.panelColor || 'white',
      panelWidth : configuration.panelWidth || "300px",
      memoSection : configuration.memoSection || "display",
      memoBackgroundColor : configuration.memoBackgroundColor || '#ffc000',
      memoFontColor : configuration.memoFontColor || 'white',
      generalUrl : configuration.generalUrl || '',
      timer : configuration.timer || 10 ,
      resizeBarWidth : configuration.resizeBarWidth || 10,
    }

    try {
      const response = await Axios.post('/configurations/upload', newConfiguration);
      console.log('New configuration added:', response.data);
      setDataChanged(prev => prev + 1);
      return true;
    } catch (error){
      console.error('Error adding new configuration:', error);
      setShowModal(true)
      setMessage(error.response.data.message)
      setIndexError(1)
      return false;
    };
  }


  const addProject = async (project,index) => {
    if(!project.name){
      setMessage('Manque le nom du projet à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('Project name is required');
      return false;
    }
    if(!project.description){
      setMessage('Manque la description du projet à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('Project description is required');
      return false;
    }
    const newProject = {
      name: project.name,
      description: project.description,
    };
    try {
      const response = await Axios.post('/projects', newProject);
      console.log('New project added:', response.data);
      setDataChanged(prev => prev + 1);
      return true;
    } catch (error){
        console.error('Error adding new project:', error);
    };
  }

  const addSubProject = async (subProject,index) => {
    if(!subProject.name){
      setMessage('Manque le nom du sous-projet à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('SubProject name is required');
      return false;
    }
    if(!subProject.description){
      setMessage('Manque la description du sous-projet à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('SubProject description is required');
      return false;
    }
    if(!subProject.project){
      setMessage('Manque du projet à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('Project id is required');
      return false;
    }

    const newSubProject = {
      project: subProject.project,
      name: subProject.name,
      description: subProject.description,
    };
    try {
      const response = await Axios.post('/subProjects/upload', newSubProject);
      console.log('New sybProject added:', response.data);
      setDataChanged(prev => prev + 1);
      return true;
    } catch(error){
        console.error('Error adding new subProject:', error);
        setMessage(error.response.data.message + ' à la ligne ' + (index + indexError + 1))
        setShowModal(true)
        setIndexError(index + indexError + 1)
        return false;
      };
  }

  const addMapping = async (mapping,index) => {
    if(!mapping.project){
      setMessage('Manque du projet à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('Project is required');
      return false;
    }
    if(!mapping.subProject){
      setMessage('Manque du sous projet à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('SubProject is required');
      return false;
    }
    if(!mapping.document){
      setMessage('Manque du document à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('Document is required');
      return false;
    }
    if(!mapping.source){
      setMessage('Manque de la source à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('Source is required');
      return false;
    }
    if(!mapping.section){
      setMessage('Manque de la section à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('Section is required');
      return false;
    }
    const newMapping = {
      project: mapping.project,
      subProject: mapping.subProject,
      document: mapping.document,
      source: mapping.source,
      section: mapping.section,
    };
    try {
      const response = await Axios.post('/mappings/upload', newMapping);
      console.log('New mapping added:', response.data);
      
      return true;
    } catch(error){
        console.error('Error adding new mapping:', error);
        setMessage(error.response.data.message + ' à la ligne ' + (index + indexError + 1))
        setShowModal(true)
        setIndexError(index + indexError + 1)
        return false;
      };
  }

  const addSection = async (section,index) => {
    if(!section.titleFr){
      setMessage('Manque le titre de la section à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('Section title is required');
      return false;
    }
    if(!section.titleEn){
      setMessage('Manque le titre de la section en anglais à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('Section title in english is required');
      return false;
    }

    const newSection = {
      titleFr : section.titleFr,
      titleEn : section.titleEn,
      fontFamily : section.fontFamily || 'Montserrat',
      titleColor : section.titleColor || 'white',
      backgroundColor : section.backgroundColor || 'red',
      fontSizeTitle : section.fontSizeTitle || '14px',
      fontSizeText : section.fontSizeText || '14px',
      paddingUnderTitle : section.paddingUnderTitle || '2px'
    }

    try {
      const response = await Axios.post('/sections', newSection);
      console.log('New section added:', response.data);
      setDataChanged(prev => prev + 1);
      return true;
    } catch(error){
      console.error('Error adding new section:', error);
      setMessage(error.response.data.message + ' à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      return false;
    };
  }

  const addUser = async (user,index) => {
    if(!user.email){
      setMessage('Manque l\'email de l\'utilisateur à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('User email is required');
      return false;
    }
    if(!user.password){
      setMessage('Manque le mot de passe de l\'utilisateur à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('User password is required');
      return false;
    }
    if(!user.role){
      setMessage('Manque le role de l\'utilisateur à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      console.error('User role is required');
      return false;
    }
    const newUser = {
      email : user.email,
      password : user.password,
      role : user.role,
      projects : user.projects,
      subProjects : user.subProjects,
      username : user.username,
      firstName : user.firstName,
      lastName : user.lastName,
      numTel : user.numTel,
      country : user.country,
      region : user.region
    }

    try {
      const response = await Axios.post('/auth/register/upload', newUser);
      console.log('New user added:', response.data); 
      setDataChanged(prev => prev + 1);
      return true;
    } catch(error){
      console.error('Error adding new user:', error);
      setMessage(error.response.data.message + ' à la ligne ' + (index + indexError + 1))
      setShowModal(true)
      setIndexError(index + indexError + 1)
      return false;
    };
  }


  const handleContinuer = async () => {
    console.log(indexError);
    setShowModal(false)
    if(filesType === 'sources'){
      const newDatas = data.slice(indexError)
      newDatas.length === 0 && setIndexError(0)
      for (let i = 0; i < newDatas.length; i++) {
        const source = newDatas[i];
        if (!await addSource(source, i)) {
          console.error('Error adding new source:');
          break; // Break out of the loop
        }
        i === newDatas.length - 1 && setIndexError(0)
      }
    }else if(filesType === 'documents'){
      const newDatas = data.slice(indexError)
      newDatas.length === 0 && setIndexError(0)
      for (let i = 0; i < newDatas.length; i++) {
        const document = newDatas[i];
        if (!await addDocument(document, i)) {
          console.error('Error adding new document:');
          break; // Break out of the loop
        }
        i === newDatas.length - 1 && setIndexError(0)
      }
    }else if(filesType === 'projects'){
      const newDatas = data.slice(indexError)
      newDatas.length === 0 && setIndexError(0)
      for (let i = 0; i < newDatas.length; i++) {
        const project = newDatas[i];
        if (!await addProject(project, i)) {
          console.error('Error adding new project:');
          break; // Break out of the loop
        }
        i === newDatas.length - 1 && setIndexError(0)
    }
  }else if(filesType === 'mappings'){
    const newDatas = data.slice(indexError)
    newDatas.length === 0 && setIndexError(0)
    for (let i = 0; i < newDatas.length; i++) {
      const mapping = newDatas[i];
      if (!await addMapping(mapping, i)) {
        console.error('Error adding new mapping:');
        break; // Break out of the loop
      }
      i === newDatas.length - 1 && setIndexError(0)
    }
  }else if(filesType === 'configurations'){
    const newDatas = data.slice(indexError)
    newDatas.length === 0 && setIndexError(0)
    for (let i = 0; i < newDatas.length; i++) {
      const configuration = newDatas[i];
      if (!await addConfigurations(configuration,i)) {
        console.error('Error adding new configuration:');
        break; // Break out of the loop
      }
      i === newDatas.length - 1 && setIndexError(0)
    }
  }else if(filesType === 'sections'){
    const newDatas = data.slice(indexError)
    newDatas.length === 0 && setIndexError(0)
    for (let i = 0; i < newDatas.length; i++) {
      const section = newDatas[i];
      if (!await addSection(section, i)) {
        console.error('Error adding new section:');
        break; // Break out of the loop
      }
      i === newDatas.length - 1 && setIndexError(0)
    }
  }else if(filesType === 'subProjects'){  
    const newDatas = data.slice(indexError)
    newDatas.length === 0 && setIndexError(0)
    for (let i = 0; i < newDatas.length; i++) {
      const subProject = newDatas[i];
      if (!await addSubProject(subProject, i)) {
        console.error('Error adding new subProject:');
        break; // Break out of the loop
      }
      i === newDatas.length - 1 && setIndexError(0)
    }
  }else if(filesType === 'users'){
    const newDatas = data.slice(indexError)
    newDatas.length === 0 && setIndexError(0)
    for (let i = 0; i < newDatas.length; i++) {
      const user = newDatas[i];
      if (!await addUser(user, i)) {
        console.error('Error adding new user:');
        break; // Break out of the loop
      }
      i === newDatas.length - 1 && setIndexError(0)
    }
  }
}

  const handleAnnuler = () => {
    setShowModal(false)
    indexError === 1 && filesName.pop()
    setMessage('')
    setIndexError(0)
  }


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

  const dropFiles = async (e) => {
    Array.from(e.dataTransfer.files).map( async file => {
      filesName.push(file.name);
      let text = await file.text()
      let result = parse(text , {header : true})
      setData(result.data)
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
      
      if(filesType === 'sources'){
        let i = 0;  
        for (let i = 0; i < result.data.length; i++) {
          const source = result.data[i];
          if (!await addSource(source, i)) {
            console.error('Error adding new source:');
            break; // Break out of the loop
          }
        }
      }
      if(filesType === 'documents'){
        for (let i = 0; i < result.data.length; i++) {
          const document = result.data[i];
          if (!await addDocument(document, i)) {
            console.error('Error adding new document:');
            break; // Break out of the loop
          }
        }
      }
      if(filesType === 'projects'){
        for (let i = 0; i < result.data.length; i++) {
          const project = result.data[i];
          if (!await addProject(project, i)) {
            console.error('Error adding new project:');
            break; // Break out of the loop
          }
        }
      }
      if(filesType === 'mappings'){
        for (let i = 0; i < result.data.length; i++) {
          const mapping = result.data[i];
          if (!await addMapping(mapping, i)) {
            console.error('Error adding new mapping:');
            break; // Break out of the loop
          }
        }
      }
      if(filesType === 'configurations'){
        for (let i = 0; i < result.data.length; i++) {
          const configuration = result.data[i];
          if (!await addConfigurations(configuration,i)) {
            console.error('Error adding new configuration:');
            break; // Break out of the loop
          }
        }
      }
      if(filesType === 'sections'){
        for (let i = 0; i < result.data.length; i++) {
          const section = result.data[i];
          if (!await addSection(section, i)) {
            console.error('Error adding new section:');
            break; // Break out of the loop
          }
        }
      }
      if(filesType === 'subProjects'){
        for (let i = 0; i < result.data.length; i++) {
          const subProject = result.data[i];
          if (!await addSubProject(subProject, i)) {
            console.error('Error adding new subProject:');
            break; // Break out of the loop
          }
        }
      }
      if(filesType === 'users'){
        for (let i = 0; i < result.data.length; i++) {
          const user = result.data[i];
          if (!await addUser(user, i)) {
            console.error('Error adding new user:');
            break; // Break out of the loop
          }
        }
      }

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

  const handleFileSelect = async (e) => {
    Array.from(e.target.files).map( async file => {
    if (file) {
      filesName.push(file.name);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target.result;
        const result = parse(text, { header: true });
        setData(result.data);
      //  /Process the CSV data as needed
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
      
      if(filesType === 'sources'){
        for (let i = 0; i < result.data.length; i++) {
          const source = result.data[i];
          if (!await addSource(source, i)) {
            console.error('Error adding new source:');
            break; // Break out of the loop
          }
        }
      }
      if(filesType === 'documents'){
        for (let i = 0; i < result.data.length; i++) {
          const document = result.data[i];
          if (!await addDocument(document, i)) {
            console.error('Error adding new document:');
            break; // Break out of the loop
          }
        }
      }
      if(filesType === 'projects'){
        for (let i = 0; i < result.data.length; i++) {
          const project = result.data[i];
          if (!await addProject(project, i)) {
            console.error('Error adding new project:');
            break; // Break out of the loop
          }
        }
      }
      if(filesType === 'mappings'){
        for (let i = 0; i < result.data.length; i++) {
          const mapping = result.data[i];
          if (!await addMapping(mapping, i)) {
            console.error('Error adding new mapping:');
            break; // Break out of the loop
          }
        }
      }
      if(filesType === 'configurations'){
        for (let i = 0; i < result.data.length; i++) {
          const configuration = result.data[i];
          if (!await addConfigurations(configuration,i)) {
            console.error('Error adding new configuration:');
            break; // Break out of the loop
          }
        }
      }
      if(filesType === 'sections'){
        for (let i = 0; i < result.data.length; i++) {
          const section = result.data[i];
          if (!await addSection(section, i)) {
            console.error('Error adding new section:');
            break; // Break out of the loop
          }
        }
      }
      if(filesType === 'subProjects'){
        for (let i = 0; i < result.data.length; i++) {
          const subProject = result.data[i];
          if (!await addSubProject(subProject, i)) {
            console.error('Error adding new subProject:');
            break; // Break out of the loop
          }
        }
      }
      if(filesType === 'users'){
        for (let i = 0; i < result.data.length; i++) {
          const user = result.data[i];
          if (!await addUser(user, i)) {
            console.error('Error adding new user:');
            break; // Break out of the loop
          }
        }
      }

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
      };
      reader.readAsText(file);
    }})
    document.getElementById('fileInput').value = ''
  };

  const triggerFileInput = () => {
    document.getElementById('fileInput').click();
  };

  return (
    <div className="uploadPage">
      <div className="title">Déposez votre fichier</div>
      <div className="remarque">Le fichier doit être csv </div>
      <div className="dragDropZone" onDrop={dropFiles}>
        <img src="./fileLogo.png" alt="fileLogo" onClick={triggerFileInput} />
        <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileSelect} accept=".csv" />
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
      {showModal && <ModalBox type='upload' message={message} onCancel={handleAnnuler} onContinue={handleContinuer}/>}
    </div>
  )
}

export default UploadPage
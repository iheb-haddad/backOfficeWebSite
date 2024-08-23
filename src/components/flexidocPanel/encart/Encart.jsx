import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import "./Encart.css";
import { useTranslation } from 'react-i18next';


function Encart(props) {
  const { t } = useTranslation();

  const documents = [
    {
      _id: '1',
      langue: 'fr',
      titre: 'Document 1',
      statut: 'publié',
      urlDoc: 'http://www.google.com',
      affichage: 'titre',
      note: '',
      expiration: '2022-12-31',
      keywords: ['keyword1', 'keyword2'],
      consultNumber: 0,
      lastConsultation: ''
    },
    {
      _id: '3',
      langue: 'fr',
      titre: 'Document 3',
      statut: 'publié',
      urlDoc: '',
      affichage: 'titre',
      note: 'note',
      expiration: '2022-12-31',
      keywords: ['keyword1', 'keyword2'],
      consultNumber: 0,
      lastConsultation: ''
    }
  ]

  return (
    <div className='encart' style={{ backgroundColor: props.sectionConfig.backgroundColor, color: props.sectionConfig.titleColor,minHeight:'75px'}}>
      <div className='entete' style={{ borderBottom: `2px solid ${props.sectionConfig.titleColor}` , paddingBottom : props.sectionConfig.paddingUnderTitle, color: props.sectionConfig.titleColor}}>
        <div style={{fontSize:props.sectionConfig.fontSizeTitle,fontWeight:'bold',fontFamily:props.sectionConfig.titlePolice}} >{t(props.sectionConfig.titleEn)}</div>
        <div style={{ cursor: 'pointer',fontSize:props.sectionConfig.fontSizeTitle }}>
          <FontAwesomeIcon icon={faChevronUp} />
        </div>
      </div>
      {documents.map(doc => {
          return <div key={doc._id}>
          {doc.affichage === 'titre' && doc.urlDoc !== '' ? <p style={{margin:'0' ,textDecoration:'none',color:props.sectionConfig.textColor ,fontFamily:props.sectionConfig.textPolice ,fontSize: props.sectionConfig.fontSizeText,cursor:'pointer'}}>{doc.titre}</p>
           :<p style={{margin:'0' ,color:props.sectionConfig.textColor, fontFamily:props.sectionConfig.textPolice ,fontSize:props.sectionConfig.fontSizeText}}>{doc.titre}</p>}
            {doc.note !== '' && <p style={{margin:'0' ,color:props.sectionConfig.textColor, fontFamily:props.sectionConfig.textPolice ,fontSize:props.sectionConfig.fontSizeText}}>{'{'+doc.note+'}'}</p>}  
          </div>
      })}
    </div>
  );
}

export default Encart;

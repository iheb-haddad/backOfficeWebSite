import { useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight ,faSearch ,faX} from '@fortawesome/free-solid-svg-icons';
import { Encart , Memos} from '../index';
import './NormalPanel.css'
import { useTranslation } from 'react-i18next'
import useRessources from '../../../hooks/useRessources';
import useAuth from '../../../hooks/useAuth';

function NormalPanel() {
  const { languages , sections , confSelected } = useRessources();
  const { setLiveConfiguration, liveConfiguration } = useAuth();

  const handleCloseLiveConfiguration = () => {
    setLiveConfiguration(false);
  }
  
  const lngs= {
    en: { nativeName: 'English' },
    fr: { nativeName: 'Français' },
    de: { nativeName: 'Deutsch' },
    es: { nativeName: 'Español' },
    it: { nativeName: 'Italiano' },
    pt: { nativeName: 'Português' },
    ar: { nativeName: 'العربية' },
    zh: { nativeName: '中文' },
    tr: { nativeName: 'Türkçe' },
    nl: { nativeName: 'Nederlands' },
    pl: { nativeName: 'Polski' },
  };

  const filteredLngs = Object.keys(lngs).filter(lng => languages.some((lang) => lang.name === lngs[lng].nativeName));
  const result = filteredLngs.reduce((acc, lng) => {
    acc[lng] = lngs[lng];
    return acc;
  }, {});
  const { t , i18n} = useTranslation();
  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  useEffect(() => {
    const normalPanel = document.querySelector('.normalPanel');

    function adjustPanelHeight() {
      const viewportHeight = window.innerHeight;
      normalPanel?.setAttribute('style', `height: ${viewportHeight}px; overflow-y: auto;`);
    }
    adjustPanelHeight();
    window.addEventListener('resize', adjustPanelHeight);

    return () => {
      window.removeEventListener('resize', adjustPanelHeight);
    };
  }, []);

  const handleBlur = () => {
    console.log(isSearching)
  };

  const handleChange = (e) => {
  };

  

  return (
    <div style={{display: liveConfiguration ? 'flex' : 'none'}}>
      <div className="panelContainer">
      <div
        className="resize-bar"
        style={{
          width: confSelected.resizeBarWidth,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight:'100vh',
          cursor: 'col-resize',
          backgroundColor: '#0f0f0f',
        }}
      >
        <div className='resize-btn'
                style={{
                  width: confSelected.resizeBarWidth,
                  minHeight:'99vh',
                  maxHeight: '99vh' ,
                  cursor: 'col-resize',
                  backgroundColor: '#aaaaaa',
                  borderRadius:'10px'
                }}></div>
      </div>  
        <div className='normalPanel' style={{ width: confSelected.panelWidth ,backgroundColor : confSelected.panelColor}}>
      <>
          <div className='panelBox' style={{display:'flex',justifyContent:'space-between',alignItems:'center',margin:'10px'}}>
            <div  style={{marginLeft:'10px',fontFamily:'Montserrat, sans-serif',color:confSelected.panelTextColor, fontSize:'16px',fontWeight:'bold'}}>{t('Language')}</div>
            <div className='buttonsEx' >  
            <select name="" id="" onChange={changeLanguage} value={i18n.language}
            style={{ backgroundColor : "#3B3B3B", color : 'white' , fontSize : '13px', padding :'3px'}}>
              {
                Object.keys(result).map((lng) => (
                  <option key={lng} value={lng} >{lngs[lng].nativeName}</option>
                ))
              }
            </select>
            </div>
            <div style={{ cursor: 'pointer' , color:confSelected.panelTextColor,fontSize:'16px'}}>
                <FontAwesomeIcon icon={faX} onClick={handleCloseLiveConfiguration}/>
            </div>
          </div>
          <div className="searchExbar">
          <div className="inputEx-group">
          <input
            type="text"
            placeholder={t('search')}
            aria-label="Recherche"
            aria-describedby="basic-addon2"
            value=''
            onChange={handleChange}
            onBlur={handleBlur}
            style={{outline: 'none' , margin : '0',border:'none',color:'black'}}
          />
          <button className="search-btnEx" style={{backgroundColor:'white',color:'black',fontSize:'1.1rem',border:'none',minWidth:'12px',maxWidth:'12px',padding:'0',margin:'0'}}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
          </div> 
          { 
            sections.map((section,index) => {
              return(
                <Encart
                  key={index}
                  sectionConfig={section}
                  />
              )
            })
          }
          {confSelected.memoSection === 'display' && <Memos title={t('Memo')} fontColor={confSelected.memoFontColor} 
          bgcolor={confSelected.memoBackgroundColor}/>}
          </>
        </div>
      </div>
    </div>
    
  )
}
export default NormalPanel
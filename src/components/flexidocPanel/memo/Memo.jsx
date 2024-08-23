import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp} from '@fortawesome/free-solid-svg-icons';
import "./Memo.css";
import { useTranslation } from 'react-i18next';

function Memos(props) {
  const { t } = useTranslation();

  return (
    <>
          <div className='memo' style={{ backgroundColor: props.bgcolor, color: props.fontColor , minHeight:'75px' }}>
          <div className='enteteMemo' style={{ borderBottom: `2px solid ${props.fontColor}` }}>
            <div style={{fontSize:'16px',fontWeight:'bold'}} >{props.title}</div>
            <div style={{ cursor: 'pointer',fontSize:'16px' }}>
              <FontAwesomeIcon icon={faChevronUp} />
            </div>
          </div>
          <div className="memoBox" style={{color:props.fontColor,fontSize:'14px',margin:'0',padding:'0'}}>
          La maintenance des logiciels est la clé de la durabilité et de la performance de notre infrastructure informatique. 
          </div>
          <div className="btnMemo" style={{height:'30px',width:'100%' , position:'relative'}}>
          <button style={{position:'absolute',right:'5px',fontSize:'10px',color:"black",backgroundColor:'white',fontWeight:'600',border:'1px solid black',padding :'5px',minWidth:'70px',maxWidth:'70px'}}>{t('done')}</button>
          </div>
        </div>
    </>
  );
}

export default Memos;

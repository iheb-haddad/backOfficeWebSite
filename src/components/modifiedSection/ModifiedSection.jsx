import React , {useState} from 'react'
import ConfLine from '../confLine/ConfLine'

function ModifiedSection(props) {
    const initialValues = {
        titleFr : props.section.titleFr,
        titleEn : props.section.titleEn,
        fontFamily : props.section.fontFamily,
        titleColor : props.section.titleColor,
        backgroundColor : props.section.backgroundColor,
        fontSizeTitle : props.section.fontSizeTitle,
        fontSizeText : props.section.fontSizeText,
        paddingUnderTitle : props.section.paddngUnderTitle
    }

    const handleTitleChange = (event) => {
        props.setModifiedData((prevData) => ({
            ...prevData ,
            titleFr : event.target.value , 
            titleEn : props.sectionsTitles.filter((section) => section.titleFr === event.target.value)[0].titleEn
        }))
    }
    const handleFontFamilyChange = (event) => {
        props.setModifiedData((prevData) => ({
            ...prevData ,
            fontFamily : event.target.value
        }))
    }
    const handleTitleColorChange = (event) => {
        props.setModifiedData((prevData) => ({
            ...prevData ,
            titleColor : event.target.value
        }))
    }
    const handleBackgroundColorChange = (event) => {
        props.setModifiedData((prevData) => ({
            ...prevData ,
            backgroundColor : event.target.value
        }))
    }
    const handleFontSizeTitleChange = (event) => {
        props.setModifiedData((prevData) => ({
            ...prevData ,
            fontSizeTitle : event.target.value
        }))
    }
    const handleFontSizeTextChange = (event) => {
        props.setModifiedData((prevData) => ({
            ...prevData ,
            fontSizeText : event.target.value
        }))
    }
    const handlePaddingUnderTitleChange = (event) => {
        props.setModifiedData((prevData) => ({
            ...prevData ,
            paddingUnderTitle : event.target.value
        }))
    }

    const confLines = [
        {
            label : 'FontFamily',
            type : 'input',
            value : props.modifiedData.fontFamily,
            handle : handleFontFamilyChange,
            holder : 'FontFamily',
            style : {border: (props.showError && !props.modifiedData.fontFamily) && "1px solid red"},
            options : []
        },
        {
            label : 'Couleur du titre',
            type : 'input',
            value : props.modifiedData.titleColor,
            handle : handleTitleColorChange,
            holder : 'Couleur du titre',
            style : {border: (props.showError && !props.modifiedData.titleColor) && "1px solid red"},
            options : []
        },
        {
            label : 'Couleur du background',
            type : 'input',
            value : props.modifiedData.backgroundColor,
            handle : handleBackgroundColorChange,
            holder : 'Couleur du background',
            style : {border: (props.showError && !props.modifiedData.backgroundColor) && "1px solid red"},
            options : []
        },
        {
            label : 'Taille du titre',
            type : 'input',
            value : props.modifiedData.fontSizeTitle,
            handle : handleFontSizeTitleChange,
            holder : 'Taille du titre',
            style : {border: (props.showError && !props.modifiedData.fontSizeTitle) && "1px solid red"},
            options : []
        },
        {
            label : 'Taille du texte',
            type : 'input',
            value : props.modifiedData.fontSizeText,
            handle : handleFontSizeTextChange,
            holder : 'Taille du texte',
            style : {border: (props.showError && !props.modifiedData.fontSizeText) && "1px solid red"},
            options : []
        },
        {
            label : 'Padding sous le titre',
            type : 'input',
            value : props.modifiedData.paddingUnderTitle,
            handle : handlePaddingUnderTitleChange,
            holder : 'Padding sous le titre',
            style : {border: (props.showError && !props.modifiedData.paddingUnderTitle) && "1px solid red"},
            options : []
        }
    ]
  return (
<div className="modifiedForm">
    <div className="colorsLine">
                <h3>Titre *</h3>
                <select value={props.modifiedData.titleFr} onChange={handleTitleChange}
                style={{border: (props.showError && !props.modifiedData.titleFr) && "1px solid red"}}>
                    <option value="">----</option>
                    {props.sectionsTitles.map((section) =>(
                      <option key={section._id} value={section.titleFr}>{section.titleFr}</option>
                    ))}
                </select>
    </div> 
    {/* <div className="colorsLine">
            <h3>Langue</h3>
            <select value={props.modifiedData.language} onChange={handleLanguageChange}
                style={{border: (props.showError && !props.modifiedData.language) && "1px solid red"}}>
                    <option value="">----</option>
                    <option value="francais">Francais</option>
                    <option value="anglais">Anglais</option>
            </select>
    </div> */}
    {
        confLines.map((line,index) => {
            return <ConfLine
            key = {index}
            type = {line.type}
            label = {line.label}
            value = {line.value}
            handle = {line.handle}
            holder = {line.holder}
            style = {line.style}
            options = {line.options}
            />
        })
    }
    {/* <div className="colorsLine">
        <h3>FontFamily</h3>
        <input
            type="text"
            value={props.modifiedData.fontFamily}
            onChange={handleFontFamilyChange}
            placeholder={initialValues.fontFamily}
            style={{border: (props.showError && !props.modifiedData.fontFamily) && "1px solid red"}}
            />
    </div>
    <div className="colorsLine">
        <h3>Couleur du titre</h3>
        <input
            type="text"
            value={props.modifiedData.titleColor}
            onChange={handleTitleColorChange}
            placeholder={initialValues.titleColor}
            style={{border: (props.showError && !props.modifiedData.titleColor) && "1px solid red"}}
            />
    </div>
    <div className="colorsLine">
        <h3>Couleur du background</h3>
        <input
            type="text"
            value={props.modifiedData.backgroundColor}
            onChange={handleBackgroundColorChange}
            placeholder={initialValues.backgroundColor}
            style={{border: (props.showError && !props.modifiedData.backgroundColor) && "1px solid red"}}
            />
    </div> */}
</div>
  )
}

export default ModifiedSection
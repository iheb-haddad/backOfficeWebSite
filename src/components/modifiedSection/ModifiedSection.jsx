import React, { useState } from "react";
import ConfLine from "../confLine/ConfLine";

function ModifiedSection(props) {
  const handleTitleChange = (event) => {
    props.setModifiedData((prevData) => ({
      ...prevData,
      titleFr: event.target.value,
      titleEn: props.sectionsTitles.filter(
        (section) => section.titleFr === event.target.value
      )[0].titleEn,
    }));
  };
  const handleTitlePoliceChange = (event) => {
    props.setModifiedData((prevData) => ({
      ...prevData,
      titlePolice: event.target.value,
    }));
  };
  const handleTextPoliceChange = (event) => {
    props.setModifiedData((prevData) => ({
      ...prevData,
      textPolice: event.target.value,
    }));
  };
  const handleTitleColorChange = (event) => {
    props.setModifiedData((prevData) => ({
      ...prevData,
      titleColor: event.target.value,
    }));
  };
  const handleTextColorChange = (event) => {
    props.setModifiedData((prevData) => ({
      ...prevData,
      textColor: event.target.value,
    }));
  };
  const handleBackgroundColorChange = (event) => {
    props.setModifiedData((prevData) => ({
      ...prevData,
      backgroundColor: event.target.value,
    }));
  };
  const handleFontSizeTitleChange = (event) => {
    props.setModifiedData((prevData) => ({
      ...prevData,
      fontSizeTitle: event.target.value,
    }));
  };
  const handleFontSizeTextChange = (event) => {
    props.setModifiedData((prevData) => ({
      ...prevData,
      fontSizeText: event.target.value,
    }));
  };
  const handlePaddingUnderTitleChange = (event) => {
    props.setModifiedData((prevData) => ({
      ...prevData,
      paddingUnderTitle: event.target.value,
    }));
  };

  const confLines = [
    {
      label: "Police du titre",
      type: "input",
      value: props.modifiedData.titlePolice,
      handle: handleTitlePoliceChange,
      holder: "Saisir police",
      style: {
        border:
          props.showError && !props.modifiedData.titlePolice && "1px solid red",
      },
      options: [],
    },
    {
      label: "Police du texte",
      type: "input",
      value: props.modifiedData.textPolice,
      handle: handleTextPoliceChange,
      holder: "Saisir police",
      style: {
        border:
          props.showError && !props.modifiedData.textPolice && "1px solid red",
      },
      options: [],
    },
    {
      label: "Couleur du titre",
      type: "input",
      value: props.modifiedData.titleColor,
      handle: handleTitleColorChange,
      holder: "Couleur du titre",
      style: {
        border:
          props.showError && !props.modifiedData.titleColor && "1px solid red",
      },
      options: [],
    },
    {
      label: "Couleur du texte",
      type: "input",
      value: props.modifiedData.textColor,
      handle: handleTextColorChange,
      holder: "Couleur du texte",
      style: {
        border:
          props.showError && !props.modifiedData.textColor && "1px solid red",
      },
      options: [],
    },
    {
      label: "Couleur du background",
      type: "input",
      value: props.modifiedData.backgroundColor,
      handle: handleBackgroundColorChange,
      holder: "Couleur du background",
      style: {
        border:
          props.showError &&
          !props.modifiedData.backgroundColor &&
          "1px solid red",
      },
      options: [],
    },
    {
      label: "Taille du titre",
      type: "input",
      value: props.modifiedData.fontSizeTitle,
      handle: handleFontSizeTitleChange,
      holder: "Taille du titre",
      style: {
        border:
          props.showError &&
          !props.modifiedData.fontSizeTitle &&
          "1px solid red",
      },
      options: [],
    },
    {
      label: "Taille du texte",
      type: "input",
      value: props.modifiedData.fontSizeText,
      handle: handleFontSizeTextChange,
      holder: "Taille du texte",
      style: {
        border:
          props.showError &&
          !props.modifiedData.fontSizeText &&
          "1px solid red",
      },
      options: [],
    },
    {
      label: "Padding sous le titre",
      type: "input",
      value: props.modifiedData.paddingUnderTitle,
      handle: handlePaddingUnderTitleChange,
      holder: "Padding sous le titre",
      style: {
        border:
          props.showError &&
          !props.modifiedData.paddingUnderTitle &&
          "1px solid red",
      },
      options: [],
    },
  ];
  return (
    <div className="modifiedForm bg-white">
      <div className="colorsLine">
        <h3>Titre *</h3>
        <select
          value={props.modifiedData.titleFr}
          onChange={handleTitleChange}
          style={{
            border:
              props.showError && !props.modifiedData.titleFr && "1px solid red",
          }}
        >
          <option value="">----</option>
          <option value={props.modifiedData.titleFr}>
            {props.modifiedData.titleFr}
          </option>
          {props.sectionsTitles.map((section, index) => (
            <option key={index} value={section.titleFr}>
              {section.titleFr}
            </option>
          ))}
        </select>
      </div>
      {confLines.map((line, index) => {
        return (
          <ConfLine
            key={index}
            type={line.type}
            label={line.label}
            value={line.value}
            handle={line.handle}
            holder={line.holder}
            style={line.style}
            options={line.options}
          />
        );
      })}
    </div>
  );
}

export default ModifiedSection;

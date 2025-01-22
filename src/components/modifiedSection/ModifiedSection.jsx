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
  const handlePropertyChange = (field) => (event) => {
    props.setModifiedData((prevData) => ({
      ...prevData,
      [field]: event.target.value,
    }));
  };

  const handleTextPoliceChange = handlePropertyChange("textPolice");
  const handleTitlePoliceChange = handlePropertyChange("titlePolice");
  const handleTitleColorChange = handlePropertyChange("titleColor");
  const handleTextColorChange = handlePropertyChange("textColor");
  const handleBackgroundColorChange = handlePropertyChange("backgroundColor");
  const handleFontSizeTitleChange = handlePropertyChange("fontSizeTitle");
  const handleFontSizeTextChange = handlePropertyChange("fontSizeText");
  const handlePaddingUnderTitleChange = handlePropertyChange("paddingUnderTitle");
  const handleTraitDisplayChange = handlePropertyChange("traitDisplay");
  const handleTraitColorChange = handlePropertyChange("traitColor");
  const handleTraitWidthChange = handlePropertyChange("traitWidth");
  const handleSectionBorderDisplayChange = handlePropertyChange("sectionBorderDisplay");
  const handleSectionBorderColorChange = handlePropertyChange("sectionBorderColor");
  const handleSectionBorderRoundChange = handlePropertyChange("sectionBorderRound");

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
    {
      label: "Affichage du trait",
      type: "select",
      value: props.modifiedData.traitDisplay,
      handle: handleTraitDisplayChange,
      holder: "",
      style: {
        border:
          props.showError &&
          !props.modifiedData.traitDisplay &&
          "1px solid red",
      },
      options: [
        { title: "----", value: "" },
        { title: "Afficher Trait", value: "display" },
        { title: "Cacher Trait", value: "hide" },
      ],
    },
    {
      label: "Couleur du trait",
      type: "input",
      value: props.modifiedData.traitColor,
      handle: handleTraitColorChange,
      holder: "Couleur du trait",
      style: {
        border:
          props.showError && !props.modifiedData.traitColor && "1px solid red",
      },
      options: [],
    },
    {
      label: "Largeur du trait",
      type: "input",
      value: props.modifiedData.traitWidth,
      handle: handleTraitWidthChange,
      holder: "Largeur du trait",
      style: {
        border:
          props.showError && !props.modifiedData.traitWidth && "1px solid red",
      },
      options: [],
    },
    {
      label: "Affichage de la bordure de section",
      type: "select",
      value: props.modifiedData.sectionBorderDisplay,
      handle: handleSectionBorderDisplayChange,
      holder: "",
      style: {
        border:
          props.showError &&
          !props.modifiedData.sectionBorderDisplay &&
          "1px solid red",
      },
      options: [
        { title: "----", value: "" },
        { title: "Afficher Bordure", value: "display" },
        { title: "Cacher Bordure", value: "hide" },
      ],
    },
    {
      label: "Couleur de la bordure de section",
      type: "input",
      value: props.modifiedData.sectionBorderColor,
      handle: handleSectionBorderColorChange,
      holder: "Couleur de la bordure de section",
      style: {
        border:
          props.showError &&
          !props.modifiedData.sectionBorderColor &&
          "1px solid red",
      },
      options: [],
    },
    {
      label: "Arrondi de la bordure de section",
      type: "input",
      value: props.modifiedData.sectionBorderRound,
      handle: handleSectionBorderRoundChange,
      holder: "Arrondi de la bordure de section",
      style: {
        border:
          props.showError &&
          !props.modifiedData.sectionBorderRound &&
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

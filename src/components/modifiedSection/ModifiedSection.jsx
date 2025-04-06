import React, { useState } from "react";
import ConfLine from "../confLine/ConfLine";
import CustomTitlesManager from "@/components/ui/customTitlesManager";
import useRessources from "@/hooks/useRessources";

function ModifiedSection(props) {
  const { polices } = useRessources();
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

  const handleChangeColor = (field) => (color) => {
    props.setModifiedData((prevData) => ({
      ...prevData,
      [field]: color,
    }));
  };

  const handleTailleChange = (key) => (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      props.setModifiedData((prevData) => ({
        ...prevData,
        [key]: value,
      }));
    } else {
      props.setModifiedData((prevData) => ({
        ...prevData,
        [key]: 0,
      }));
    }
  };

  const handleTextPoliceChange = handlePropertyChange("textPolice");
  const handleTitlePoliceChange = handlePropertyChange("titlePolice");
  const handleTitleColorChange = handleChangeColor("titleColor");
  const handleTextColorChange = handleChangeColor("textColor");
  const handleBackgroundColorChange = handleChangeColor("backgroundColor");
  const handleFontSizeTitleChange = handleTailleChange("fontSizeTitle");
  const handleFontSizeTextChange = handleTailleChange("fontSizeText");
  const handlePaddingUnderTitleChange = handleTailleChange("paddingUnderTitle");
  const handleTraitDisplayChange = handlePropertyChange("traitDisplay");
  const handleTraitColorChange = handleChangeColor("traitColor");
  const handleTraitWidthChange = handleTailleChange("traitWidth");
  const handleSectionBorderDisplayChange = handlePropertyChange("sectionBorderDisplay");
  const handleSectionBorderWidthChange = handleTailleChange("sectionBorderWidth");
  const handleSectionBorderColorChange = handleChangeColor("sectionBorderColor");
  const handleSectionBorderRoundChange = handleTailleChange("sectionBorderRound");

  const confLines = [
    {
      label: "Police du titre",
      type: "select",
      value: props.modifiedData.titlePolice,
      handle: handleTitlePoliceChange,
      holder: "Saisir police",
      style: {
        border:
          props.showError && !props.modifiedData.titlePolice && "1px solid red",
      },
      options: polices
    },
    {
      label: "Police du texte",
      type: "select",
      value: props.modifiedData.textPolice,
      handle: handleTextPoliceChange,
      holder: "Saisir police",
      style: {
        border:
          props.showError && !props.modifiedData.textPolice && "1px solid red",
      },
      options: polices
    },
    {
      label: "Couleur du titre",
      type: "couleur",
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
      type: "couleur",
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
      type: "couleur",
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
      label: "Taille du titre (px)",
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
      label: "Taille du texte (px)",
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
      label: "Padding sous le titre (px)",
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
        { title: "Afficher Trait", value: "display" },
        { title: "Cacher Trait", value: "hide" },
      ],
    },
    {
      label: "Couleur du trait",
      type: "couleur",
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
      label: "Largeur du trait (px)",
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
      label: "Affichage de cadre de section",
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
        { title: "Afficher cadre", value: "display" },
        { title: "Cacher cadre", value: "hide" },
      ],
    },
    {
      label: "Largeur de cadre de section (px)",
      type: "input",
      value: props.modifiedData.sectionBorderWidth,
      handle: handleSectionBorderWidthChange,
      holder: "Largeur du trait de section",
      style: {
        border:
          props.showError &&
          !props.modifiedData.sectionBorderWidth &&
          "1px solid red",
      },
      options: [],
    },
    {
      label: "Couleur de cadre de section",
      type: "coueur",
      value: props.modifiedData.sectionBorderColor,
      handle: handleSectionBorderColorChange,
      holder: "Couleur de cadre de section",
      style: {
        border:
          props.showError &&
          !props.modifiedData.sectionBorderColor &&
          "1px solid red",
      },
      options: [],
    },
    {
      label: "Arrondi de cadre de section (px)",
      type: "input",
      value: props.modifiedData.sectionBorderRound,
      handle: handleSectionBorderRoundChange,
      holder: "Arrondi de cadre de section",
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
      <CustomTitlesManager  customTitles={props.customTitles} setCustomTitles={props.setCustomTitles}/>
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

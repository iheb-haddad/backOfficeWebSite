import React, { useState, useEffect } from "react";
import Axios from "../../services/Axios";
import { ConfLine } from "../index";
import "./GestionSections.css";
import { toast } from "sonner";
import ReorderSection from "../reorderSection/ReorderSection";
import CustomTitlesManager from "../ui/customTitlesManager";

function GestionSections({setThemeCompleted, setSections,sections}) {
  const [customTitles, setCustomTitles] = useState([]);
  const defaultTitles = [
    { id: 1, titleFr: "Alertes", titleEn: "Alerts" },
    { id: 2, titleFr: "Communs", titleEn: "Commons" },
    { id: 3, titleFr: "Fiches métier", titleEn: "Job sheets" },
    { id: 4, titleFr: "Instructions", titleEn: "Instructions" },
    { id: 5, titleFr: "Notes", titleEn: "Notes" },
    { id: 6, titleFr: "Formations", titleEn: "Trainings" },
    { id: 7, titleFr: "Autres", titleEn: "Others" },
    { id: 8, titleFr: "Erreurs", titleEn: "Errors" },
  ];
  const [showOrderChange, setShowOrderChange] = useState(false);

  const [sectionsTitles, setSectionsTitles] = useState(
    defaultTitles.filter(
      (section) =>
        !sections.some((section2) => section.titleFr === section2.titleFr)
    )
  );

  const initialValues = {
    titleFr: "",
    titleEn: "",
    customTitleFr: "",
    customTitleEn: "",
    titlePolice: "Montserrat",
    textPolice: "Montserrat",
    titleColor: "white",
    textColor: "black",
    backgroundColor: "red",
    fontSizeTitle: "14px",
    fontSizeText: "14px",
    paddingUnderTitle: "2px",
    traitDisplay: "display",
    traitColor: "black",
    traitWidth: "1px",
    sectionBorderDisplay: "display",
    sectionBorderWidth: "1px",
    sectionBorderColor: "black",
    sectionBorderRound: "0px",
  };

  const [formData, setFormData] = useState(initialValues);

  const [showError, setShowError] = useState(false);
  const [showListSections, setShowListSections] = useState(false);
  const [dataChanged, setDataChanged] = useState(0);
  const [copiedSection, setCopiedSection] = useState(null);

  const handleTitleChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      titleFr: event.target.value,
      titleEn: sectionsTitles.filter(
        (section) => section.titleFr === event.target.value
      )[0].titleEn,
    }));
  };
  const handleChange = (field) => (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: event.target.value,
    }));
  };

  const handleChangeColor = (field) => (color) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: color,
    }));
  };

  const handleTitlePoliceChange = handleChange("titlePolice");
  const handleTextPoliceChange = handleChange("textPolice");
  const handleTitleColorChange = handleChangeColor("titleColor");
  const handleTextColorChange = handleChangeColor("textColor");
  const handleBackgroundColorChange = handleChangeColor("backgroundColor");
  const handleFontSizeTitleChange = handleChange("fontSizeTitle");
  const handleFontSizeTextChange = handleChange("fontSizeText");
  const handlePaddingUnderTitleChange = handleChange("paddingUnderTitle");
  const handleTraitDisplayChange = handleChange("traitDisplay");
  const handleTraitColorChange = handleChangeColor("traitColor");
  const handleTraitWidthChange = handleChange("traitWidth");
  const handleSectionBorderDisplayChange = handleChange("sectionBorderDisplay");
  const handleSectionBorderWidthChange = handleChange("sectionBorderWidth");
  const handleSectionBorderColorChange = handleChangeColor("sectionBorderColor");
  const handleSectionBorderRoundChange = handleChange("sectionBorderRound");

  const handleAnnuler1 = () => {
    setFormData(initialValues);
  };

  const handleEnregistrerSection = () => {
    const hasEmptyFields = Object.entries(formData).some(([key, value]) => {
      return value === "" && key !== "customTitleFr" && key !== "customTitleEn";
    });
    setShowError(hasEmptyFields);
    if (!hasEmptyFields) {
      const newSection = {
        ...formData,
      };
      setSections((prev) => [...prev, newSection]);
      toast.success("Section " + newSection.titleFr + " ajoutée avec succès");
      setFormData(initialValues);
    }
  };

  useEffect(() => {
    setSectionsTitles(
      defaultTitles.filter(
        (section) =>
          !sections.some((section2) => section.titleFr === section2.titleFr)
      )
    );

    setThemeCompleted(sections.length === defaultTitles.length);
  }, [sections]);

  const polices = [
    { title: "---", value: "" },
    { title: "Arial", value: "Arial" },
    { title: "Bookman", value: "Bookman" },
    { title: "Comic Sans MS", value: "Comic Sans MS" },
    { title: "Courier New", value: "Courier New" },
    { title: "Garamond", value: "Garamond" },
    { title: "Georgia", value: "Georgia" },
    { title: "Helvetica", value: "Helvetica" },
    { title: "Montserrat", value: "Montserrat" },
    { title: "Palatino", value: "Palatino" },
    { title: "Sans-serif", value: "Sans-serif" },
    { title: "Times New Roman", value: "Times New Roman" },
    { title: "Verdana", value: "Verdana" },
];

  const confLines = [
    {
      type: "select",
      label: "Police du titre",
      value: formData.titlePolice,
      handle: handleTitlePoliceChange,
      holder: "Saisir Police ",
      style: { border: showError && !formData.titlePolice && "1px solid red" },
      options: polices,
    },
    {
      type: "select",
      label: "Police du texte",
      value: formData.textPolice,
      handle: handleTextPoliceChange,
      holder: "Saisir Police",
      style: { border: showError && !formData.textPolice && "1px solid red" },
      options: polices
    },
    {
      type: "input",
      label: "Couleur du titre",
      value: formData.titleColor,
      handle: handleTitleColorChange,
      holder: "Saisir couleur",
      style: { border: showError && !formData.titleColor && "1px solid red" },
      options: [],
    },
    {
      type: "input",
      label: "Couleur du texte",
      value: formData.textColor,
      handle: handleTextColorChange,
      holder: "Saisir couleur",
      style: { border: showError && !formData.textColor && "1px solid red" },
      options: [],
    },
    {
      type: "input",
      label: "Couleur du background",
      value: formData.backgroundColor,
      handle: handleBackgroundColorChange,
      holder: "Saisir couleur ",
      style: {
        border: showError && !formData.backgroundColor && "1px solid red",
      },
      options: [],
    },
    {
      type: "input",
      label: "Taille du titre",
      value: formData.fontSizeTitle,
      handle: handleFontSizeTitleChange,
      holder: "Saisir taille",
      style: {
        border: showError && !formData.fontSizeTitle && "1px solid red",
      },
      options: [],
    },
    {
      type: "input",
      label: "Taille du texte",
      value: formData.fontSizeText,
      handle: handleFontSizeTextChange,
      holder: "Saisir taille",
      style: { border: showError && !formData.fontSizeText && "1px solid red" },
      options: [],
    },
    {
      type: "input",
      label: "Padding sous le titre",
      value: formData.paddingUnderTitle,
      handle: handlePaddingUnderTitleChange,
      holder: "Saisir padding",
      style: {
        border: showError && !formData.paddingUnderTitle && "1px solid red",
      },
      options: [],
    },
    {
      type: "select",
      label: "Affichage du trait",
      value: formData.traitDisplay,
      handle: handleTraitDisplayChange,
      holder: "",
      style: { border: showError && !formData.traitDisplay && "1px solid red" },
      options: [
        { title: "----", value: "" },
        { title: "Afficher Trait", value: "display" },
        { title: "Cacher Trait", value: "hide" },
      ],
    },
    {
      type: "input",
      label: "Couleur du trait",
      value: formData.traitColor,
      handle: handleTraitColorChange,
      holder: "Saisir couleur",
      style: { border: showError && !formData.traitColor && "1px solid red" },
      options: [],
    },
    {
      type: "input",
      label: "Largeur du trait",
      value: formData.traitWidth,
      handle: handleTraitWidthChange,
      holder: "Saisir largeur",
      style: { border: showError && !formData.traitWidth && "1px solid red" },
      options: [],
    },
    {
      type: "select",
      label: "Affichage de cadre de section",
      value: formData.sectionBorderDisplay,
      handle: handleSectionBorderDisplayChange,
      holder: "",
      style: {
        border: showError && !formData.sectionBorderDisplay && "1px solid red",
      },
      options: [
        { title: "Afficher Cadre", value: "display" },
        { title: "Cacher Cadre", value: "hide" },
      ],
    },
    {
      type: "input",
      label: "Largeur de cadre de section",
      value: formData.sectionBorderWidth,
      handle: handleSectionBorderWidthChange,
      holder: "Saisir largeur",
      style: {
        border: showError && !formData.sectionBorderWidth && "1px solid red",
      },
      options: [],
    },
    {
      type: "couleur",
      label: "Couleur de cadre de section",
      value: formData.sectionBorderColor,
      handle: handleSectionBorderColorChange,
      holder: "Saisir couleur",
      style: {
        border: showError && !formData.sectionBorderColor && "1px solid red",
      },
      options: [],
    },
    {
      type: "input",
      label: "Arrondi de cadre de section",
      value: formData.sectionBorderRound,
      handle: handleSectionBorderRoundChange,
      holder: "Saisir arrondi",
      style: {
        border: showError && !formData.sectionBorderRound && "1px solid red",
      },
      options: [],
    },
  ];

  const pasteStyleToForm = () => {
    setFormData((prev) => ({
      ...prev,
      ...copiedSection,
    }));
    toast.success("Style collé avec succès");
  };

  return (
    <div className="configurations" style={{ marginBottom: "40px" }}>
      {showOrderChange && <ReorderSection />}
      <div className="colorsForm">
        <h4>Gestion des sections</h4>
        <div className="colorsLine">
          <div className="colorsLine">
            <h3>Titre *</h3>
            <select
              value={formData.titleFr}
              onChange={handleTitleChange}
              style={{
                border: showError && !formData.titleFr && "1px solid red",
              }}
            >
              <option value="" disabled hidden>
                ----
              </option>
              {sectionsTitles.map((section, index) => (
                <option key={index} value={section.titleFr}>
                  {section.titleFr}
                </option>
              ))}
            </select>
          </div>
        </div>
        <CustomTitlesManager  customTitles={customTitles} setCustomTitles={setCustomTitles}/>
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
        <div className="confButtons">
          <div>
            <button onClick={handleAnnuler1}>Annuler</button>
            <button className="appliquer" onClick={handleEnregistrerSection}>
              Ajouter Section
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GestionSections;

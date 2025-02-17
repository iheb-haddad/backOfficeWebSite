import React, { useState, useEffect } from "react";
import Axios from "../../services/Axios";
import { ModifiedSection, ConfLine } from "../index";
import "./GestionSections.css";
import useRessources from "../../hooks/useRessources";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import UploadPage from "../uploadPage/UploadPage";
import ExportCSV from "../exportCsv/ExportCsv";
import { toast } from "sonner";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { DataTable } from "../ui/dataTable";
import { Button } from "../ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import ModifySection from "./popupModifiedSection";
import { Copy, Download } from "lucide-react";
import ReorderSection from "../reorderSection/ReorderSection";
import CustomTitlesManager from "../ui/customTitlesManager";

function GestionSections() {
  const [showUploadPage, setShowUploadPage] = useState(false);
  const [showOrderChange, setShowOrderChange] = useState(false);
  const [customTitles, setCustomTitles] = useState([]);
  const clickUploadbtn = () => {
    setShowUploadPage((prev) => !prev);
  };

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

  const [sectionsTitles, setSectionsTitles] = useState([]);

  const initialValues = {
    titleFr: "",
    customTitles: [],
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
  const { sections, setSections } = useRessources();
  const [showError, setShowError] = useState(false);
  const [showListSections, setShowListSections] = useState(false);
  const [dataChanged, setDataChanged] = useState(0);
  const [copiedSection, setCopiedSection] = useState(null);

  const copyStyleSection = (section) => {
    const { _id, titleFr, titleEn, order, ...styleSection } = section;
    setCopiedSection({ ...styleSection });
    toast.success("Style de section copié");
  };

  useEffect(() => {
    Axios.get("/sections")
      .then((response) => {
        setSections(response.data);
        setSectionsTitles(
          defaultTitles.filter(
            (section) =>
              !response.data.some(
                (section2) => section.titleFr === section2.titleFr
              )
          )
        );
      })
      .catch((error) => {
        console.log(error);
        toast.error("Erreur lors du chargement des données");
      });
  }, [dataChanged]);

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

  const handleEnregistrer1 = () => {
    const hasEmptyFields = Object.entries(formData).some(([key, value]) => {
      return value === "" && key !== "customTitleFr" && key !== "customTitleEn";
    });
    setShowError(hasEmptyFields);
    if (!hasEmptyFields) {
      const newSection = {
        ...formData,
        customTitles: customTitles,
      };
      Axios.post("/sections", newSection)
        .then((response) => {
          console.log(response);
          setSections((prev) => [...prev, newSection]);
          setDataChanged((prev) => prev + 1);
          toast.success("Section ajoutée avec succès");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Erreur lors de l'ajout de la section");
        });
      setFormData(initialValues);
    }
  };

  const handleDeleteSection = (_id) => {
    Axios.delete(`/sections/${_id}`)
      .then((response) => {
        console.log(response);
        toast.success("Section supprimée avec succès");
        setSections(sections.filter((section) => section._id !== _id));
        setDataChanged((prev) => prev + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
      options: polices,
    },
    {
      type: "couleur",
      label: "Couleur du titre",
      value: formData.titleColor,
      handle: handleTitleColorChange,
      holder: "Saisir couleur",
      style: { border: showError && !formData.titleColor && "1px solid red" },
      options: [],
    },
    {
      type: "couleur",
      label: "Couleur du texte",
      value: formData.textColor,
      handle: handleTextColorChange,
      holder: "Saisir couleur",
      style: { border: showError && !formData.textColor && "1px solid red" },
      options: [],
    },
    {
      type: "couleur",
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
      type: "couleur",
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

  const pasteStyleToExistedSection = (_id) => {
    const newSection = {
      ...copiedSection,
    };
    Axios.put(`/sections/${_id}`, newSection)
      .then((response) => {
        console.log(response);
        setDataChanged((prev) => prev + 1);
        toast.success("Style collé avec succès");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    {
      accessorKey: "titleFr",
      header: "Titre",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const section = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-4 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <ModifySection
                section={section}
                setDataChanged={setDataChanged}
                sectionsTitles={sectionsTitles}
              />
              <DropdownMenuItem>
                <button onClick={() => handleDeleteSection(section._id)}>
                  Supprimer
                  <FontAwesomeIcon icon={faTrash} className="text-sm ml-2" />
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  onClick={() => copyStyleSection(section)}
                  className="flex items-center gap-2"
                >
                  Copier <Copy size={14} />
                </button>
              </DropdownMenuItem>
              {copiedSection && (
                <DropdownMenuItem>
                  <button
                    onClick={() => pasteStyleToExistedSection(section._id)}
                    className="flex items-center gap-2"
                  >
                    Coller <Download size={14} />
                  </button>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="configurations" style={{ marginBottom: "40px" }}>
      <div
        className="buttonsBox"
        style={{
          marginBottom: "40px",
          paddingRight: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {!showUploadPage ? (
          <button className="uploadbtn" onClick={clickUploadbtn}>
            <FontAwesomeIcon icon={faUpload} />
            <span>Importer des sections utilisant des fichiers csv</span>
          </button>
        ) : (
          <button className="uploadbtn" onClick={clickUploadbtn}>
            <FontAwesomeIcon icon={faUpload} />
            <span>Cacher la page d'importation</span>
          </button>
        )}
        {showUploadPage ? (
          <a
            className="uploadbtn text-sm"
            href="SectionsModel.csv"
            download="SectionsModel.csv"
          >
            Télécharger un modèle
          </a>
        ) : (showOrderChange && sections?.length > 0) ? (
          <button className="uploadbtn" onClick={() => setShowOrderChange(false)}>
            <span>Finir changement</span>
          </button>
        ) : (sections?.length > 0) && (
          <button style={{ color : "white" , backgroundColor : "#5356d0", padding : "3px"}} onClick={() => setShowOrderChange(true)}>
            <span>Changer l'ordre des sections</span>
          </button>
        )}
      </div>
      {showUploadPage && (
        <UploadPage filesType={"sections"} setDataChanged={setDataChanged} />
      )}
      {(showOrderChange && !showUploadPage) && <ReorderSection />}
      <div className="colorsForm">
        <div className="absolute flex -top-3 right-4 gap-2">
          {copiedSection && copiedSection.titleFr !== formData.titleFr && (
            <div
              className="flex items-center gap-1 p-2 border rounded-md border-blue-600 bg-white cursor-pointer"
              onClick={pasteStyleToForm}
            >
              Coller <Download size={14} />
            </div>
          )}
        </div>
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
        <div></div>
        <ExportCSV data={sections} fileName={"sections"} />
        <div className="confButtons">
          <div>
            <button onClick={handleAnnuler1}>Annuler</button>
            <button className="appliquer" onClick={handleEnregistrer1}>
              Ajouter
            </button>
          </div>
        </div>
        <div className="applicationsList" style={{ gridColumn: "span 2" }}>
          <div className="flex justify-end">
            <Button
              className="bg-white text-black border hover:bg-white"
              onClick={() => setShowListSections(!showListSections)}
            >
              {showListSections ? "cacher liste" : "afficher liste"}
            </Button>
          </div>
          {showListSections && (
            <DataTable
              data={sections}
              columns={columns}
              type="section"
              nbrColumnsMax={3}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default GestionSections;

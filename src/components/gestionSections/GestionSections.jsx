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

function GestionSections() {
  const [showUploadPage, setShowUploadPage] = useState(false);
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
    titleEn: "",
    titlePolice: "Montserrat",
    textPolice: "Montserrat",
    titleColor: "white",
    textColor: "black",
    backgroundColor: "red",
    fontSizeTitle: "14px",
    fontSizeText: "14px",
    paddingUnderTitle: "2px",
  };

  const [formData, setFormData] = useState(initialValues);
  const { sections, setSections } = useRessources();
  const [showError, setShowError] = useState(false);
  const [showListSections, setShowListSections] = useState(false);
  const [dataChanged, setDataChanged] = useState(0);

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
  const handleTitlePoliceChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      titlePolice: event.target.value,
    }));
  };
  const handleTextPoliceChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      textPolice: event.target.value,
    }));
  };
  const handleTitleColorChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      titleColor: event.target.value,
    }));
  };
  const handleTextColorChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      textColor: event.target.value,
    }));
  };
  const handleBackgroundColorChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      backgroundColor: event.target.value,
    }));
  };

  const handleFontSizeTitleChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      fontSizeTitle: event.target.value,
    }));
  };

  const handleFontSizeTextChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      fontSizeText: event.target.value,
    }));
  };

  const handlePaddingUnderTitleChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      paddingUnderTitle: event.target.value,
    }));
  };

  const handleAnnuler1 = () => {
    setFormData(initialValues);
  };

  const handleEnregistrer1 = () => {
    const hasEmptyFields = Object.entries(formData).some(([key, value]) => {
      return value === "";
    });
    setShowError(hasEmptyFields);
    if (!hasEmptyFields) {
      const newSection = {
        ...formData,
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

  const confLines = [
    {
      type: "input",
      label: "Police du titre",
      value: formData.titlePolice,
      handle: handleTitlePoliceChange,
      holder: "Saisir Police ",
      style: { border: showError && !formData.titlePolice && "1px solid red" },
      options: [],
    },
    {
      type: "input",
      label: "Police du texte",
      value: formData.textPolice,
      handle: handleTextPoliceChange,
      holder: "Saisir Police",
      style: { border: showError && !formData.textPolice && "1px solid red" },
      options: [],
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
  ];

  const columns = [
    {
      accessorKey: "titleFr",
      header: "Titre français",
    },
    {
      accessorKey: "titleEn",
      header: "Titre anglais",
    },
    {
      id: "actions",
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
        {showUploadPage && (
          <a
            className="uploadbtn"
            href="SectionsModel.csv"
            download="SectionsModel.csv"
          >
            Télécharger un modèle
          </a>
        )}
      </div>
      {showUploadPage && (
        <UploadPage filesType={"sections"} setDataChanged={setDataChanged} />
      )}
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
            <button className="appliquer" onClick={handleEnregistrer1}>
              Ajouter
            </button>
          </div>
        </div>
        <div></div>
        <ExportCSV data={sections} fileName={"sections"} />
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

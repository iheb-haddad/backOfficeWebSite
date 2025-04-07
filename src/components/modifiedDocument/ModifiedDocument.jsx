import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { parse } from "dotenv";

function ModifiedDocument(props) {
  const [keyword, setKeyword] = useState("");
  const initialValues = {
    project: props.document.idProject._id,
    subProject: props.document.idSubProject._id,
    selectedLanguage: props.document.language,
    title: props.document.title,
    selectedStatut: props.document.status,
    urlDocument: props.document.urlDoc,
    affichage: props.document.display,
    collapsible: props.document.collapsible,
    defaultEtat: props.document.defaultEtat,
    expiration: props.document.expiration,
    frameWidth: props.document.frameWidth,
    frameHeight: props.document.frameHeight,
  };

  const handleProjectChange = (event) => {
    props.setModifiedData((prevData) => ({
      ...prevData,
      project: event.target.value,
      subProject: "",
    }));
  };

  const handleSubProjectChange = (event) => {
    props.setModifiedData((prevData) => ({
      ...prevData,
      subProject: event.target.value,
    }));
  };

  const handleTitleChange = (event) => {
    props.setModifiedData((prevData) => ({
      ...prevData,
      title: event.target.value,
    }));
  };
  const handleLanguageChange = (event) => {
    props.setModifiedData((prevData) => ({
      ...prevData,
      selectedLanguage: event.target.value,
    }));
  };
  const handleStatutChange = (event) => {
    props.setModifiedData((prevData) => ({
      ...prevData,
      selectedStatut: event.target.value,
    }));
  };
  const handleUrlDocumentChange = (event) => {
    props.setModifiedData((prevData) => ({
      ...prevData,
      urlDocument: event.target.value,
    }));
  };
  const handleAffichageChange = (event) => {
    props.setModifiedData((prevData) => ({
      ...prevData,
      affichage: event.target.value,
    }));
  };

  const handleExpirationChange = (event) => {
    props.setModifiedData((prevData) => ({
      ...prevData,
      expiration: event.target.value,
    }));
  };

  const handleTextareaChange = (event) => {
    props.setModifiedData((prevData) => ({
      ...prevData,
      note: event.target.value,
    }));
  };

  const handleFrameHeightChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      props.setModifiedData((prevData) => ({
        ...prevData,
        frameHeight: value,
      }));
    } else {
      props.setModifiedData((prevData) => ({
        ...prevData,
        frameHeight: "",
      }));
    }
  };

  const handleFrameWidthChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      props.setModifiedData((prevData) => ({
        ...prevData,
        frameWidth: value,
      }));
    } else {
      props.setModifiedData((prevData) => ({
        ...prevData,
        frameWidth: "",
      }));
    }
  };

  const handleKeywordsChange = (event) => {
    if (event.key === "Enter") {
      console.log("Enter key pressed");
      props.setModifiedData((prevData) => ({
        ...prevData,
        keywords: [...prevData.keywords, keyword],
      }));
      setKeyword("");
    } else {
      setKeyword(event.target.value);
    }
  };

  const deleteKeyword = (index) => {
    props.setModifiedData((prevData) => ({
      ...prevData,
      keywords: prevData.keywords.filter((keyword, i) => i !== index),
    }));
  };

  return (
    <div
      className="configBox"
      style={{
        backgroundColor: "white",
        padding: "0px 10px 15px 10px",
        marginTop: "15px",
        width: "95%",
      }}
    >
      <div className="configLine">
        <h3>Client correspondant</h3>
        <select
          value={props.modifiedData.project}
          onChange={handleProjectChange}
          style={{
            border:
              props.showError && !props.modifiedData.project && "1px solid red",
          }}
        >
          <option value="">----</option>
          {props.projects.map((project, index) => (
            <option key={index} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
      <div className="configLine">
        <h3>Projet correspondant</h3>
        <select
          value={props.modifiedData.subProject}
          onChange={handleSubProjectChange}
          style={{
            border:
              props.showError &&
              !props.modifiedData.subProject &&
              "1px solid red",
          }}
        >
          <option value="">----</option>
          {props.subProjects.map(
            (subProject, index) =>
              subProject.idProject._id === props.modifiedData.project && (
                <option key={index} value={subProject._id}>
                  {subProject.name}
                </option>
              )
          )}
        </select>
      </div>
      <div className="configLine">
        <h3>Langue *</h3>
        <select
          value={props.modifiedData.selectedLanguage}
          onChange={handleLanguageChange}
          style={{
            border:
              props.showError &&
              !props.modifiedData.selectedLanguage &&
              "1px solid red",
          }}
        >
          <option value="">----</option>
          <option value="fr">Francais</option>
          <option value="en">Anglais</option>
        </select>
      </div>
      <div className="configLine">
        <h3>Titre</h3>
        <input
          type="text"
          value={props.modifiedData.title}
          onChange={handleTitleChange}
          placeholder={initialValues.title}
          style={{
            border:
              props.showError &&
              !props.modifiedData.title &&
              props.modifiedData.affichage === "titre" &&
              "1px solid red",
          }}
        />
      </div>
      <div className="configLine">
        <h3>Statut *</h3>
        <select
          value={props.modifiedData.selectedStatut}
          onChange={handleStatutChange}
          style={{
            border:
              props.showError &&
              !props.modifiedData.selectedStatut &&
              "1px solid red",
          }}
        >
          <option value="">----</option>
          <option value="public">Public</option>
          <option value="brouillon">Brouillon</option>
        </select>
      </div>
      {props.modifiedData.note === "" && (
        <div className="configLine">
          <h3>Url Document</h3>
          <input
            type="text"
            value={props.modifiedData.urlDocument}
            onChange={handleUrlDocumentChange}
            placeholder={initialValues.urlDocument || "Saisir url document"}
            // style={{border: (props.showError && !props.modifiedData.urlDocument) && "1px solid red"}}
          />
        </div>
      )}
      {props.modifiedData.urlDocument !== "" &&
        props.modifiedData.note === "" && (
          <div className="configLine">
            <h3>Affichage *</h3>
            <select
              value={props.modifiedData.affichage}
              onChange={handleAffichageChange}
            >
              {props.modifiedData.urlDocument && (
                <option value="contenu">Contenu affiché</option>
              )}
              <option value="titre">Seulement titre affiché</option>
            </select>
          </div>
        )}
      {props.modifiedData.affichage === "contenu" && (
        <div className="configLine flex flex-col justify-evenly">
          <h3>collapsible</h3>
          <div className="radioGrp flex gap-4">
            <div className="flex items-center gap-2">
              <input
                className="w-4 h-4"
                type="radio"
                name="collapsible"
                value="collapsible"
                checked={props.modifiedData.collapsible}
                onChange={() =>
                  props.setModifiedData((prevData) => ({
                    ...prevData,
                    collapsible: true,
                  }))
                }
              />
              <span>Oui</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="notCollabsible"
                value="notCollabsible"
                checked={!props.modifiedData.collapsible}
                onChange={() =>
                  props.setModifiedData((prevData) => ({
                    ...prevData,
                    collapsible: false,
                  }))
                }
              />
              <span>Non</span>
            </div>
          </div>
        </div>
      )}
      {props.modifiedData.affichage === "contenu" && (
        <div className="configLine">
          <h3>Largeur du cadre d'affichage (px)</h3>
          <input
            type="number"
            value={props.modifiedData.frameWidth}
            onChange={handleFrameWidthChange}
            placeholder={initialValues.frameWidth}
          />
        </div>
      )}
      {props.modifiedData.affichage === "contenu" && (
        <div className="configLine">
          <h3>Hauteur du cadre d'affichage (px)</h3>
          <input
            type="number"
            value={props.modifiedData.frameHeight}
            onChange={handleFrameHeightChange}
            placeholder={initialValues.frameHeight}
          />
        </div>
      )}
      {props.modifiedData.collapsible && (
        <div className="configLine flex flex-col justify-evenly">
          <h3>Etat par défaut</h3>
          <div className="radioGrp flex gap-4">
            <div className="flex items-center gap-2">
              <input
                className="w-4 h-4"
                type="radio"
                name="defaultEtatOpen"
                value="defaultEtatOpen"
                checked={props.modifiedData.defaultEtat}
                onChange={() =>
                  props.setModifiedData((prevData) => ({
                    ...prevData,
                    defaultEtat: true,
                  }))
                }
              />
              <span>Ouvert</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="defaultEtatClose"
                value="defaultEtatClose"
                checked={!props.modifiedData.defaultEtat}
                onChange={() =>
                  props.setModifiedData((prevData) => ({
                    ...prevData,
                    defaultEtat: false,
                  }))
                }
              />
              <span>Fermé</span>
            </div>
          </div>
        </div>
      )}
      {props.modifiedData.urlDocument === "" &&
        props.modifiedData.note !== "" && (
          <div className="configLine">
            <h3>Note / message</h3>
            <textarea
              id="myTextarea"
              value={props.modifiedData.note}
              onChange={handleTextareaChange}
              style={{ height: "100%", width: "89%" }}
            />
          </div>
        )}
      <div className="configLine">
        <h3>Date d'expiration</h3>
        <input
          type="date"
          id="dateInput"
          value={props.modifiedData.expiration?.split("T")[0]}
          onChange={handleExpirationChange}
        />
      </div>
      <div className="configLine">
        <h3>Mots-clés de recherche</h3>
        <input
          type="text"
          value={keyword}
          onChange={handleKeywordsChange}
          onKeyDown={handleKeywordsChange}
          placeholder="Saisir titre "
        />
        <div className="indication">Cliquer Entrée pour ajouter encore</div>
        <div className="urlBlock">
          {props.modifiedData.keywords?.map((keyword, index) => (
            <div key={index} className="urlColumn">
              <FontAwesomeIcon
                icon={faX}
                onClick={() => deleteKeyword(index)}
                style={{
                  cursor: "pointer",
                  fontSize: "7px",
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                }}
              />
              {keyword}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ModifiedDocument;

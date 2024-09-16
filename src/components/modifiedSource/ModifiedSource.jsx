import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

function ModifiedSource(props) {
  const [motCle, setMotCle] = useState("");

  const initialValues = {
    idProject: props.source.idProject._id,
    subProject: props.source.idSubProject._id,
    nom: props.source.name,
    url: props.source.keywords,
  };

  const handleProjectChange = (event) => {
    props.setModifiedProject(event.target.value);
    props.setModifiedSubProject("");
  };

  const handleSubProjectChange = (event) => {
    props.setModifiedSubProject(event.target.value);
  };

  const handleNameAppChange = (event) => {
    props.setModifiedName(event.target.value);
  };

  const handleMotCleChange = (event) => {
    if (event.key === "Enter") {
      props.setModifiedUrls((prevData) => [...prevData, motCle]);
      setMotCle("");
    } else {
      setMotCle(event.target.value);
    }
  };

  const deleteUrl = (index) => {
    props.setModifiedUrls((prevData) =>
      prevData.filter((url, i) => i !== index)
    );
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
          value={props.modifiedProject}
          onChange={handleProjectChange}
          style={{
            border:
              props.showError && !props.modifiedProject && "1px solid red",
          }}
        >
          <option value="" disabled hidden>
            ----
          </option>
          {props.projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
      <div className="configLine">
        <h3>Projet correspondant</h3>
        <select
          value={props.modifiedSubProject}
          onChange={handleSubProjectChange}
          style={{
            border:
              props.showError && !props.modifiedSubProject && "1px solid red",
          }}
        >
          <option value="" disabled hidden>
            ----
          </option>
          {props.subProjects.map(
            (subProject) =>
              subProject.idProject._id === props.modifiedProject && (
                <option key={subProject._id} value={subProject._id}>
                  {subProject.name}
                </option>
              )
          )}
        </select>
      </div>
      <div className="configLine">
        <h3>Nom de l'application</h3>
        <input
          type="text"
          value={props.modifiedName}
          onChange={handleNameAppChange}
          placeholder="Saisir titre "
          style={{
            border: props.showError && !props.modifiedName && "1px solid red",
          }}
        />
        <div className="adminErr">
          <p style={{ color: props.msgErreurColor }}>Nom app déjà existe</p>
        </div>
      </div>
      <div className="configLine">
        <h3>URL / Mots-clés</h3>
        <input
          type="text"
          value={motCle}
          onChange={handleMotCleChange}
          onKeyDown={handleMotCleChange}
          placeholder="Saisir titre "
          style={{
            border:
              props.showError &&
              props.modifiedUrls.length === 0 &&
              "1px solid red",
          }}
        />
        <div className="indication">Cliquer Entrée pour ajouter encore</div>
        <div className="urlBlock">
          {props.modifiedUrls.map((url, index) => (
            <div key={index} className="urlColumn">
              <FontAwesomeIcon
                icon={faX}
                onClick={() => deleteUrl(index)}
                style={{
                  cursor: "pointer",
                  fontSize: "7px",
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                }}
              />
              {url}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ModifiedSource;

import React from "react";

function ModifiedProject(props) {
  const initialValues = {
    name: props.project.name,
    description: props.project.description,
  };

  const handleNameAppChange = (event) => {
    props.setModifiedName(event.target.value);
    props.setMsgError("");
  };

  const handleDescriptionChange = (event) => {
    props.setModifiedDescription(event.target.value);
  };

  return (
    <div className="modifiedForm bg-white">
      <div className="urlLine">
        <h3>Nom du client</h3>
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
          <p style={{ color: "red" }}>{props.msgError}</p>
        </div>
      </div>
      <div className="urlLine">
        <h3>Description</h3>
        <input
          type="text"
          value={props.modifiedDescription}
          onChange={handleDescriptionChange}
          placeholder="Saisir Description "
          style={{
            border:
              props.showError && !props.modifiedDescription && "1px solid red",
          }}
        />
      </div>
    </div>
  );
}

export default ModifiedProject;

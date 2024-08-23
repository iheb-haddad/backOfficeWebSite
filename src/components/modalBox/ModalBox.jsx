import React from "react";
import "./ModalBox.css";

const ModalBox = ({ type ,message, onCancel, onContinue }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>{message}</p>
        { type === 'upload' && <p>voulez vous continuer vers les lignes suivantes ?</p>}
        { type === 'delete' && <p>voulez vous supprimer cet élément ?</p>}
        <div className="modal-buttons">
          <button onClick={onCancel}>Annuler</button>
          <button onClick={onContinue}>Continuer</button>
        </div>
      </div>
    </div>
  );
};

export default ModalBox;

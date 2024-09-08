import React from "react";
import "./Dashboard.css";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogClose,
  } from "../ui/dialog";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { Button } from "../ui/Button";

const Reinitialiser = ({ type ,message, onContinue }) => {
  return (
    <Dialog>
    <DialogTrigger asChild>
        <FontAwesomeIcon icon={faRotateRight} style={{cursor :'pointer'}}/>
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Confirmation</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div >
            <div>
              <p>{message}</p>
              { type === 'upload' && <p>voulez vous continuer vers les lignes suivantes ?</p>}
              { type === 'delete' && <p>voulez vous supprimer cet élément ?</p>}
            </div> 
          </div>
        </DialogDescription>
      <DialogFooter>
        <DialogClose asChild>
          {/* <div className="modal-buttons">
              <button>Annuler</button>
              <button onClick={onContinue}>Continuer</button>
        </div> */}
            <Button onClick={onContinue}>Continuer</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  );
};

export default Reinitialiser;

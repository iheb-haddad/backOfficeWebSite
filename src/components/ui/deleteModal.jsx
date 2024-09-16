import React from "react";
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
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button } from "../ui/Button";

const DeleteModal = ({message, onContinue }) => {
  return (
    <Dialog>
    <DialogTrigger asChild>
      <div className="cursor-pointer p-2 py-1 hover:bg-gray-100 flex gap-2 items-center" style={{fontSize : '0.9rem'}}>
        <button >Supprimer<FontAwesomeIcon icon={faTrash} className="text-sm ml-2"/></button>
      </div>
    </DialogTrigger>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Suppression</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div >
            <div>
              <p>{message}</p>
              <p>voulez vous supprimer cet élément ?</p>
            </div> 
          </div>
        </DialogDescription>
      <DialogFooter>
        <DialogClose asChild>
            <Button onClick={onContinue}>Continuer</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  );
};

export default DeleteModal;

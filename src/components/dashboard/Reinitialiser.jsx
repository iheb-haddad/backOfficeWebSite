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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../ui/Button";

const Reinitialiser = ({ type, message, onContinue }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="cursor-pointer p-2 py-1 hover:bg-gray-100 flex gap-2 items-center"
          style={{ fontSize: "0.9rem" }}
        >
          <span>Réinitialiser</span>
          <FontAwesomeIcon icon={faRotateRight} />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmation</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div>
            <div>
              <p>{message}</p>
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

export default Reinitialiser;

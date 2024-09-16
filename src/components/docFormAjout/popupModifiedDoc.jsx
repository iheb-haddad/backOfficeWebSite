import React, { useState } from "react";
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
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../ui/Button";
import { ModifiedDocument } from "../index";
import Axios from "../../services/Axios";
import { toast } from "sonner";

const ModifyDocument = ({
  document,
  setDataChanged,
  userProjects,
  subProjects,
}) => {
  const [modifiedData, setModifiedData] = useState({
    project: document.idProject._id,
    subProject: document.idSubProject._id,
    selectedLanguage: document.language,
    title: document.title,
    selectedStatut: document.status,
    urlDocument: document.urlDoc,
    affichage: document.display,
    note: document.note,
    expiration: document.expiration,
    keywords: document.keywords,
  });
  const [showError, setShowError] = useState(false);

  const handleGetModifiedDocument = (document) => {
    const hasEmptyFields = Object.entries(modifiedData).some(([key, value]) => {
      return (
        key !== "urlDocument" &&
        key !== "title" &&
        key !== "note" &&
        value === ""
      );
    });
    const titleEmpty =
      modifiedData.affichage === "titre" && modifiedData.title === "";
    setShowError(hasEmptyFields || titleEmpty);
    if (!hasEmptyFields && !titleEmpty) {
      const newDocument = {
        _id: document._id,
        idProject: modifiedData.project,
        idSubProject: modifiedData.subProject,
        language: modifiedData.selectedLanguage,
        title: modifiedData.title,
        status: modifiedData.selectedStatut,
        urlDoc: modifiedData.urlDocument,
        display: modifiedData.affichage,
        note: modifiedData.note,
        expiration: modifiedData.expiration,
        keywords: modifiedData.keywords,
        consultationNumber: document.consultNumber,
        lastConsultation: document.lastConsultation,
      };
      Axios.put(`/documentations/${document._id}`, newDocument)
        .then((response) => {
          console.log(response);
          setDataChanged((prev) => prev + 1);
          toast.success("La documentation est modifié avec succés");
        })
        .catch((error) => {
          console.log(error);
          toast.error(
            error.response.data.message || "Erreur lors de la modification"
          );
        });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="cursor-pointer p-2 py-1 hover:bg-gray-100 flex gap-2 items-center"
          style={{ fontSize: "0.9rem" }}
        >
          <span>Modifier</span>
          <FontAwesomeIcon icon={faEdit} className="text-sm" />
        </div>
      </DialogTrigger>
      <DialogContent className="min-w-[80vw] max-w-[80vw] lg:min-w-[60vw] lg:max-w-[60vw] max-h-[80vh] top-[50%] overflow-y-scroll ">
        <DialogHeader>
          <DialogTitle>{`Modification du document '${document.title}'`}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="w-full text-black">
            <ModifiedDocument
              document={document}
              modifiedData={modifiedData}
              setModifiedData={setModifiedData}
              showError={showError}
              projects={userProjects}
              subProjects={subProjects}
            />
          </div>
        </DialogDescription>
        <DialogFooter>
          <Button onClick={() => handleGetModifiedDocument(document)}>
            Valider
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModifyDocument;

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
import ModifiedProject from "../modifiedProject/ModifiedProject";
import Axios from "../../services/Axios";
import { toast } from "sonner";

const ModifyProject = ({ project, setDataChanged, type }) => {
  const [modifiedName, setModifiedName] = useState(project.name);
  const [modifiedDescription, setModifiedDescription] = useState(
    project.description
  );
  const [showError2, setShowError2] = useState(false);
  const [msgError2, setMsgError2] = useState("");

  const handleGetModifiedProject = (projectId) => {
    const hasEmptyFields = modifiedName === "" || modifiedDescription === "";
    setShowError2(hasEmptyFields);
    if (!hasEmptyFields) {
      const modifiedProject = {
        name: modifiedName,
        description: modifiedDescription,
      };
      Axios.put(`/projects/${projectId}`, modifiedProject)
        .then((data) => {
          console.log("app modified:", data);
          toast.success("Projet modifié avec succès");
          setModifiedName("");
          setModifiedDescription("");
          setDataChanged((prev) => prev + 1);
        })
        .catch((error) => {
          error.response.status === 400 &&
            setMsgError2("Nom de projet déjà existe");
          error.response.status === 400 &&
            toast.error("Nom de projet déjà existe");
          console.error("Error modifying app:", error);
        });
    }
  };

  const handleGetModifiedSubProject = (projectId) => {
    const hasEmptyFields = modifiedName === "" || modifiedDescription === "";
    setShowError2(hasEmptyFields);
    if (!hasEmptyFields) {
      const modifiedProject = {
        name: modifiedName,
        description: modifiedDescription,
      };
      Axios.put(`/subProjects/${projectId}`, modifiedProject)
        .then((data) => {
          console.log("app modified:", data);
          setModifiedName("");
          setModifiedDescription("");
          setDataChanged((prev) => prev + 1);
          toast.success("Sous-projet modifié avec succès");
        })
        .catch((error) => {
          error.response.status === 400 &&
            setMsgError2("Nom de projet déjà existe");
          console.error("Error modifying app:", error);
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
          <DialogTitle>{`Modification du ${
            type === "project" ? "client" : "projet"
          } '${project.name}'`}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="w-full text-black">
            <ModifiedProject
              project={project}
              modifiedName={modifiedName}
              modifiedDescription={modifiedDescription}
              setModifiedName={setModifiedName}
              setModifiedDescription={setModifiedDescription}
              msgError={msgError2}
              setMsgError={setMsgError2}
              showError={showError2}
            />
          </div>
        </DialogDescription>
        <DialogFooter>
          <Button
            onClick={
              type === "project"
                ? () => handleGetModifiedProject(project._id)
                : () => handleGetModifiedSubProject(project._id)
            }
          >
            Valider
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModifyProject;

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
import ModifiedSource from "../modifiedSource/ModifiedSource";
import Axios from "../../services/Axios";
import { toast } from "sonner";

const ModifySource = ({
  source,
  setDataChanged,
  type,
  userProjects,
  subProjects,
}) => {
  const [showError2, setShowError2] = useState(false);
  const [modifiedName, setModifiedName] = useState(source.name);
  const [modifiedUrls, setModifiedUrls] = useState(source.keywords);
  const [modifiedProject, setModifiedProject] = useState(source.idProject._id);
  const [modifiedSubProject, setModifiedSubProject] = useState(
    source.idSubProject._id
  );
  const [msgErreur2Color, setMsgErreur2Color] = useState("#EEEEEE");

  const handleGetModifiedSource = (sourceId) => {
    const hasEmptyFields =
      modifiedName === "" ||
      modifiedUrls.length === 0 ||
      modifiedSubProject === "" ||
      modifiedProject === "";
    setShowError2(hasEmptyFields);
    if (!hasEmptyFields) {
      const modifiedApp = {
        idProject: modifiedProject,
        idSubProject: modifiedSubProject,
        name: modifiedName,
        keywords: modifiedUrls,
      };
      Axios.put(`/sources/${sourceId}`, modifiedApp)
        .then((data) => {
          console.log("app modified:", data);
          setModifiedSubProject("");
          setModifiedProject("");
          setModifiedName("");
          setModifiedUrls([]);
          setDataChanged((prev) => prev + 1);
          toast.success("Application modifiée");
        })
        .catch((error) => {
          console.error("Error modifing app:", error);
          toast.error(
            error.response.data.message ||
              "Erreur lors de la modification de l'application"
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
          <DialogTitle>{`Modification de source '${source.name}'`}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="w-full text-black">
            <ModifiedSource
              source={source}
              modifiedName={modifiedName}
              modifiedUrls={modifiedUrls}
              modifiedProject={modifiedProject}
              modifiedSubProject={modifiedSubProject}
              setModifiedProject={setModifiedProject}
              setModifiedSubProject={setModifiedSubProject}
              setModifiedName={setModifiedName}
              setModifiedUrls={setModifiedUrls}
              msgErreurColor={msgErreur2Color}
              showError={showError2}
              projects={userProjects}
              subProjects={subProjects}
            />
          </div>
        </DialogDescription>
        <DialogFooter>
          <Button onClick={() => handleGetModifiedSource(source._id)}>
            Valider
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModifySource;

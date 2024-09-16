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
import ModifiedSection from "../modifiedSection/ModifiedSection";
import Axios from "../../services/Axios";
import { toast } from "sonner";

const ModifySection = ({
  section,
  setDataChanged,
  sectionsTitles,
}) => {

    const initialValues = {
      titleFr: section.titleFr,
      titleEn: section.titleEn,
      titlePolice: section.titlePolice,
      textPolice: section.textPolice,
      titleColor: section.titleColor,
      textColor: section.textColor,
      backgroundColor: section.backgroundColor,
      fontSizeTitle: section.fontSizeTitle,
      fontSizeText: section.fontSizeText,
      paddingUnderTitle: section.paddingUnderTitle,
    };
    const [modifiedData, setModifiedData] = useState(initialValues);
    const [showError2, setShowError2] = useState(false);
    const [msgErreurColor2, setMsgErreurColor2] = useState("#EEEEEE");


  const handleGetModifiedSection = (_id) => {
    const hasEmptyFields = Object.entries(modifiedData).some(([key, value]) => {
      return value === "";
    });
    setShowError2(hasEmptyFields);
    if (!hasEmptyFields) {
      setMsgErreurColor2("#EEEEEE");
      const newSection = {
        ...modifiedData,
      };
      Axios.put(`/sections/${_id}`, newSection)
        .then((response) => {
          console.log(response);
          setDataChanged((prev) => prev + 1);
          toast.success("Section modifiée avec succès");
        })
        .catch((error) => {
          console.log(error);
        });
      setIsModified("");
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
          <DialogTitle>{`Modification de section '${section.titleFr}'`}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="w-full text-black">
          <ModifiedSection
                    section={section}
                    sectionsTitles={sectionsTitles}
                    modifiedData={modifiedData}
                    setModifiedData={setModifiedData}
                    showError={showError2}
                    msgErreurColor={msgErreurColor2}
                  />
          </div>
        </DialogDescription>
        <DialogFooter>
          <Button onClick={() => handleGetModifiedSection(source._id)}>
            Valider
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModifySection;

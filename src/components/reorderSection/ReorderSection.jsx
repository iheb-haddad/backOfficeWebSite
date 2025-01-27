import React from "react";
import useRessources from "../../hooks/useRessources";
import Axios from "../../services/Axios";
import { useState , useEffect} from "react";
import { toast } from "sonner";

const ReorderSection = () => {
  const { sections, setSections } = useRessources();
  const [tempSections, setTempSections] = useState(sections.map((section) => ({ ...section })));
  const confirmChanges = () => {
    const reorderedSections = tempSections.map((section, index) => ({
      _id: section._id,
      order: section.order,
    }));
    Axios.patch("/sections/order", reorderedSections)
      .then(() => {
        setSections([...tempSections]);
        toast.success("Les sections ont été réorganisées avec succès");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Erreur lors de la réorganisation des sections");
      });
  };

  const cancelChanges = () => {
    setTempSections([...sections]);
  };

  return (
    <div className="m-auto w-[80%] flex flex-col gap-3">
      <div className="text-xl font-semibold">Changer l'order des sections</div>
      {tempSections
        .sort((a, b) => a.order - b.order)
        .map((section, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-2 text-lg border-2"
          >
            <span>{section.titleFr}</span>
            <div>
              {index > 0 && (
                <button
                  className="border-1 mx-2 bg-slate-200 w-9 h-9 rounded-sm"
                  onClick={() => {
                    const newSections = [...tempSections];
                    newSections[index].order--;
                    newSections[index - 1].order++;
                    setTempSections(newSections);
                  }}
                >
                  ↑
                </button>
              )}
              {index < tempSections.length - 1 && (
                <button
                  className="border-1 mx-2 bg-slate-200 w-9 h-9 rounded-sm"
                  onClick={() => {
                    const newSections = [...tempSections];
                    newSections[index].order++;
                    newSections[index + 1].order--;
                    setTempSections(newSections);
                  }}
                >
                  ↓
                </button>
              )}
            </div>
          </div>
        ))}
      <div className="flex justify-end p-2 mt-3 mb-6 gap-2">
        <button
          className="p-2 px-3 text-[#5356d0] text-lg rounded-sm font-semibold bg-white border border-[#5356d0] active:bg-[#5356d0] active:text-white"
          onClick={cancelChanges}
        >
          Annuler
        </button>
        <button
          className="p-2 px-3 text-white text-lg rounded-sm font-semibold bg-[#5356d0] active:bg-white active:text-[#5356d0] border-[#5356d0] border"
          onClick={confirmChanges}
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
};

export default ReorderSection;

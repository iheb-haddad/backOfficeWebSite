import { useContext } from "react";
import RessourcesContext from "../context/RessourcesProvider";

const useRessources = () => {
  return useContext(RessourcesContext);
};

export default useRessources;

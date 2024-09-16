import { createContext, useState } from "react";

const RessourcesContext = createContext({});

export const RessourcesProvider = ({ children }) => {
  const defaultData = {
    idProject: "",
    panelColor: "",
    panelTextColor: "",
    panelWidth: "",
    memoSection: "",
    memoBackgroundColor: "",
    memoFontColor: "",
    generalUrl: "",
    timer: "",
    resizeBarWidth: "",
  };
  const [languages, setLanguages] = useState([]);
  const [sections, setSections] = useState([]);
  const [confSelected, setConfSelected] = useState(defaultData);
  const [btnClicked, setBtnClicked] = useState("users");
  return (
    <RessourcesContext.Provider
      value={{
        languages,
        setLanguages,
        confSelected,
        setConfSelected,
        sections,
        setSections,
        btnClicked,
        setBtnClicked,
      }}
    >
      {children}
    </RessourcesContext.Provider>
  );
};

export default RessourcesContext;

import { createContext, useState } from "react";

const RessourcesContext = createContext({});

export const RessourcesProvider = ({ children }) => {
  const defaultData = {
    idProject: "",
    panelColor: "#000000",
    panelTextColor: "#000000",
    panelWidth: "",
    memoSection: "",
    memoBackgroundColor: "#000000",
    memoFontColor: "#000000",
    generalUrl: "",
    timer: "",
    resizeBarWidth: "",
    backgroundLanguage: "#000000",
    textColorLanguage: "#ffffff",
    fontTitleMemo: "",
    fontTextMemo: "",
    buttonMemoBgColor: "#000000",
    buttonMemoFontColor: "#000000",
    buttonMemoFontSize: "",
    sectionEmailDisplay: "",
  };
  const [languages, setLanguages] = useState([]);
  const [sections, setSections] = useState([]);
  const [themeSections, setThemeSections] = useState([]);
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
        themeSections,
        setThemeSections,
        btnClicked,
        setBtnClicked,
      }}
    >
      {children}
    </RessourcesContext.Provider>
  );
};

export default RessourcesContext;

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
    arrondiMemo: "",
    sectionEmailDisplay: "",
    textMemoSize: "",
    titleMemoSize: "",
    paddingUnderTitle: "",
    traitDisplay: "",
    traitColor: "#000000",
    traitWidth: "",
    sectionBorderDisplay: "",
    sectionBorderWidth: "",
    sectionBorderColor: "#000000",
  };
  const [languages, setLanguages] = useState([]);
  const [sections, setSections] = useState([]);
  const [themeSections, setThemeSections] = useState([]);
  const [confSelected, setConfSelected] = useState(defaultData);
  const [btnClicked, setBtnClicked] = useState("users");
  const polices = [
    { title: "---", value: "" },
    { title: "Arial", value: "Arial" },
    { title: "Arial Black", value: "Arial Black" },
    { title: "Bookman", value: "Bookman" },
    { title: "Comic Sans MS", value: "Comic Sans MS" },
    { title: "Courier New", value: "Courier New" },
    { title: "Garamond", value: "Garamond" },
    { title: "Georgia", value: "Georgia" },
    { title: "Helvetica", value: "Helvetica" },
    { title: "Montserrat", value: "Montserrat" },
    { title: "Palatino", value: "Palatino" },
    { title: "Sans-serif", value: "Sans-serif" },
    { title: "Tahoma", value: "Tahoma" },
    { title: "Trebuchet MS", value: "Trebuchet MS" },
    { title: "Times New Roman", value: "Times New Roman" },
    { title: "Verdana", value: "Verdana" },
    { title: "Impact", value: "Impact" },
    { title: "Lucida Console", value: "Lucida Console" },
    { title: "Lucida Sans Unicode", value: "Lucida Sans Unicode" },
  ];
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
        polices,
      }}
    >
      {children}
    </RessourcesContext.Provider>
  );
};

export default RessourcesContext;

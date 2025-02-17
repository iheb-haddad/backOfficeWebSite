import { useState , useEffect, memo} from "react";
import useRessources from "../../hooks/useRessources";
import ConfLine from "../confLine/ConfLine";
import Axios from "../../services/Axios";
import { toast } from "sonner";

const GestionMemo = ({ projects }) => {
  const [initialValues, setInitialValues] = useState({});
    const [dataChanged, setDataChanged] = useState(0);
  const [projet, setProjet] = useState("");
  const handleProjectChange = (event) => {
    setProjet(event.target.value);
  };
  const { confSelected, setConfSelected } = useRessources();

  const defaultData = {
    idProject: "",
    memoSection: "",
    memoBackgroundColor: "#000000",
    memoFontColor: "#000000",
    fontTitleMemo: "",
    fontTextMemo: "",
    buttonMemoBgColor: "#000000",
    buttonMemoFontColor: "#000000",
    buttonMemoFontSize: "",
    arrondiMemo: "",
  };

  useEffect(() => {
    Axios.get("/configurations")
      .then((response) => {
        const conf = response.data.find((conf) => conf.idProject === projet);
        conf && setConfSelected(conf);
        setInitialValues(conf);
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
        toast.error("Erreur lors du chargement des données");
      });
  }, [dataChanged, projet]);

  const createHandleChange = (key) => (event) => {
    setConfSelected((prevData) => ({
      ...prevData,
      [key]: event.target.value,
    }));
  };

  const createHandleColorChange = (key) => (color) => {
    setConfSelected((prevData) => ({
      ...prevData,
      [key]: color,
    }));
  };

  const handleMemoSectionChange = createHandleChange("memoSection");
  const handleMemoBackColorChange = createHandleColorChange(
    "memoBackgroundColor"
  );
  const handleMemoFontColorChange = createHandleColorChange("memoFontColor");
  const handleButtonMemoBgColorChange =
    createHandleColorChange("buttonMemoBgColor");
  const handleButtonMemoFontColorChange = createHandleColorChange(
    "buttonMemoFontColor"
  );
  const handleButtonMemoFontSizeChange =
    createHandleChange("buttonMemoFontSize");
  const handleFontTitleMemoChange = createHandleChange("fontTitleMemo");
  const handleFontTextMemoChange = createHandleChange("fontTextMemo");
  const handleArrondiMemoChange = createHandleChange("arrondiMemo");

  const initialInputColors = {
    memoFieldColor: "white",
    memoBackColorFieldColor: "white",
    memoFontColorFieldColor: "white",
    buttonMemoBgColor: "white",
    buttonMemoFontColor: "white",
    buttonMemoFontSize: "white",
    fontTitleMemo: "white",
    fontTextMemo: "white",
    arrondiMemo: "white",
  };

  const [inputColor, setInputColor] = useState(initialInputColors);

  const changeInputColors = () => {
    if (confSelected.memoBackColor != initialValues.memoBackColor) {
      setInputColor((prevData) => ({
        ...prevData,
        memoBackColorFieldColor: "#50e150",
      }));
    }

    if (confSelected.memoFontColor != initialValues.memoFontColor) {
      setInputColor((prevData) => ({
        ...prevData,
        memoFontColorFieldColor: "#50e150",
      }));
    }

    if (confSelected.memoSection != initialValues.memoSection) {
      setInputColor((prevColor) => ({
        ...prevColor,
        memoFieldColor: "#50e150",
      }));
    }

    if (confSelected.buttonMemoBgColor != initialValues.buttonMemoBgColor) {
      setInputColor((prevColor) => ({
        ...prevColor,
        buttonMemoBgColor: "#50e150",
      }));
    }
    if (confSelected.buttonMemoFontColor != initialValues.buttonMemoFontColor) {
      setInputColor((prevColor) => ({
        ...prevColor,
        buttonMemoFontColor: "#50e150",
      }));
    }
    if (confSelected.buttonMemoFontSize != initialValues.buttonMemoFontSize) {
      setInputColor((prevColor) => ({
        ...prevColor,
        buttonMemoFontSize: "#50e150",
      }));
    }
    if (confSelected.fontTitleMemo != initialValues.fontTitleMemo) {
      setInputColor((prevColor) => ({
        ...prevColor,
        fontTitleMemo: "#50e150",
      }));
    }
    if (confSelected.fontTextMemo != initialValues.fontTextMemo) {
      setInputColor((prevColor) => ({
        ...prevColor,
        fontTextMemo: "#50e150",
      }));
    }
    if (confSelected.arrondiMemo != initialValues.arrondiMemo) {
      setInputColor((prevColor) => ({
        ...prevColor,
        arrondiMemo: "#50e150",
      }));
    }

    setTimeout(() => {
      setInputColor(initialInputColors);
    }, 2000);
  };

  const reinitialisedData = {
    idProject: confSelected.idProject,
    memoSection: "display",
    memoBackgroundColor: "#ffc000",
    memoFontColor: "#ffffff",
    buttonMemoBgColor: "#000000",
    buttonMemoFontColor: "#ffffff",
    buttonMemoFontSize: "10px",
    memoFontTitle: "Montserrat",
    memoFontText: "Montserrat",
    arrondiMemo: "0px",
  };

const polices = [
    { title: "---", value: "" },
    { title: "Arial", value: "Arial" },
    { title: "Bookman", value: "Bookman" },
    { title: "Comic Sans MS", value: "Comic Sans MS" },
    { title: "Courier New", value: "Courier New" },
    { title: "Garamond", value: "Garamond" },
    { title: "Georgia", value: "Georgia" },
    { title: "Helvetica", value: "Helvetica" },
    { title: "Montserrat", value: "Montserrat" },
    { title: "Palatino", value: "Palatino" },
    { title: "Sans-serif", value: "Sans-serif" },
    { title: "Times New Roman", value: "Times New Roman" },
    { title: "Verdana", value: "Verdana" },
];

  const confLines = [
    {
      type: "select",
      label: "Affichage de la section Mémo",
      value: confSelected.memoSection,
      handle: handleMemoSectionChange,
      holder: "",
      style: { backgroundColor: inputColor.memoFieldColor },
      options: [
        { title: "Afficher Mémo", value: "display" },
        { title: "Cacher Mémo", value: "hide" },
      ],
    },
    {
      type: "couleur",
      label: "Couleur de section Mémo",
      value: confSelected.memoBackgroundColor,
      handle: handleMemoBackColorChange,
      holder: "Saisir couleur",
      style: { backgroundColor: inputColor.memoBackColorFieldColor },
      options: [],
    },
    {
      type: "select",
      label: "Police du titre Mémo",
      value: confSelected.fontTitleMemo,
      handle: handleFontTitleMemoChange,
      holder: "Saisir police",
      style: { backgroundColor: inputColor.fontTitleMemo },
      options: polices,
    },
    {
      type: "select",
      label: "Police du texte Mémo",
      value: confSelected.fontTextMemo,
      handle: handleFontTextMemoChange,
      holder: "Saisir police",
      style: { backgroundColor: inputColor.fontTextMemo },
      options: polices,
    },
    {
      type: "couleur",
      label: "Couleur du texte Mémo",
      value: confSelected.memoFontColor,
      handle: handleMemoFontColorChange,
      holder: "Saisir couleur",
      style: { backgroundColor: inputColor.memoFontColorFieldColor },
      options: [],
    },
    {
      type: "couleur",
      label: "Couleur de fond de bouton Mémo",
      value: confSelected.buttonMemoBgColor,
      handle: handleButtonMemoBgColorChange,
      holder: "Saisir couleur",
      style: { backgroundColor: inputColor.buttonMemoBgColor },
      options: [],
    },
    {
      type: "couleur",
      label: "Couleur du texte de bouton Mémo",
      value: confSelected.buttonMemoFontColor,
      handle: handleButtonMemoFontColorChange,
      holder: "Saisir couleur",
      style: { backgroundColor: inputColor.buttonMemoFontColor },
      options: [],
    },
    {
      type: "input",
      label: "Taille du texte de bouton Mémo",
      value: confSelected.buttonMemoFontSize,
      handle: handleButtonMemoFontSizeChange,
      holder: "Saisir taille",
      style: { backgroundColor: inputColor.buttonMemoFontSize },
      options: [],
    },
    {
      type: "input",
      label: "Arrondi de cadre du Mémo",
      value: confSelected.arrondiMemo,
      handle: handleArrondiMemoChange,
      holder: "Saisir arrondi",
      style: { backgroundColor: inputColor.arrondiMemo },
      options: [],
    },
  ];

  const handleAReinitialiser = () => {
    setConfSelected({
      ...confSelected,
      ...reinitialisedData,
    });
    Axios.put(`/configurations/${confSelected._id}`, reinitialisedData)
      .then((data) => {
        setInitialValues(reinitialisedData);
        setDataChanged((prev) => prev + 1);
        // You can update your UI or perform other actions here
      })
      .catch((error) => {
        console.error("Error modifying object:", error);
      });
  };

  const handleAnnuler1 = () => {
    setConfSelected({ ...confSelected, ...initialValues });
  };

  const handleEnregistrer1 = () => {
    changeInputColors();
    Axios.put(`/configurations/${confSelected._id}`, {
        memoSection: confSelected.memoSection,
        memoBackgroundColor: confSelected.memoBackgroundColor,
        memoFontColor: confSelected.memoFontColor,
        fontTitleMemo: confSelected.fontTitleMemo,
        fontTextMemo: confSelected.fontTextMemo,
        buttonMemoBgColor: confSelected.buttonMemoBgColor,
        buttonMemoFontColor: confSelected.buttonMemoFontColor,
        buttonMemoFontSize: confSelected.buttonMemoFontSize,
        arrondiMemo: confSelected.arrondiMemo,
    })
      .then((data) => {
        setInitialValues(confSelected);
        setDataChanged((prev) => prev + 1);
        console.log("Object modified:", data);
        toast.success("Configuration modifiée avec succès");
      })
      .catch((error) => {
        console.error("Error modifying object:", error);
        toast.error("Erreur lors de la modification");
      });
  };
  return (
    <div className="colorsForm">
      <h4>Section Mémo</h4>
      <div className="configLine">
        <h3>Client correspondant</h3>
        <select value={projet} onChange={handleProjectChange}>
          <option value="" disabled hidden>
            ----
          </option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
      {confLines.map((line, index) => {
        return (
          <ConfLine
            key={index}
            type={line.type}
            label={line.label}
            value={line.value}
            handle={line.handle}
            holder={line.holder}
            style={line.style}
            options={line.options}
          />
        );
      })}
      <div></div>
      <div className="confButtons">
        <div>
          <button onClick={handleAReinitialiser}>Réinitialiser</button>
          <button onClick={handleAnnuler1}>Annuler</button>
          <button className="appliquer" onClick={handleEnregistrer1}>
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
};

export default GestionMemo;

import React, { useState, useEffect } from "react";
import "./Configurations.css";
import Axios from "../../services/Axios";
import GestionSections from "../gestionSections/GestionSections";
import ConfLine from "../confLine/ConfLine";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faEllipsis,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { Icon } from "@iconify/react";
import useAuth from "../../hooks/useAuth";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import useRessources from "../../hooks/useRessources";
import ExportCSV from "../exportCsv/ExportCsv";
import UploadPage from "../uploadPage/UploadPage";
import useStore from "../../globalState/UseStore";
import { toast } from "sonner";
import SmtpConfig from "../smtpConfig/SmtpConfig";
import SupportMailConfig from "../supportMailConfig/SupportMailConfig";
import { set } from "date-fns";

function Configurations() {
  const [initialValues, setInitialValues] = useState({});
  const [dataChanged, setDataChanged] = useState(0);
  const [languagesChanged, setLanguagesChanged] = useState(0);
  const [notAllowedLanguages, setNotAllowedLanguages] = useState([]);
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);
  const { setNavLineClicked, setLiveConfiguration, auth } = useAuth();
  const [showUploadPage, setShowUploadPage] = useState(false);
  const [themes, setThemes] = useState([]);
  const [themeSelected, setThemeSelected] = useState("");
  const [clientSelected, setClientSelected] = useState("");

  const clickUploadbtn = () => {
    setShowUploadPage((prev) => !prev);
  };

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

  const [configurations, setConfigurations] = useState([]);
  const {
    languages,
    setLanguages,
    confSelected,
    setConfSelected,
    setThemeSections,
  } = useRessources();
  const { projects, fetchProjects } = useStore();

  const langs = [
    {
      name: "Français",
      code: "fr",
    },
    {
      name: "English",
      code: "en",
    },
    {
      name: "Español",
      code: "es",
    },
    {
      name: "Deutsch",
      code: "de",
    },
    {
      name: "Italiano",
      code: "it",
    },
    {
      name: "Português",
      code: "pt",
    },
    {
      name: "العربية",
      code: "ar",
    },
    {
      name: "中文",
      code: "zh",
    },
    {
      name: "Türkçe",
      code: "tr",
    },
    {
      name: "Nederlands",
      code: "nl",
    },
    {
      name: "Polski",
      code: "pl",
    },
  ];

  useEffect(() => {
    setNavLineClicked("settings");
    Axios.get("/languages")
      .then((response) => {
        setLanguages(response.data);
        setNotAllowedLanguages(
          langs.filter(
            (lng) => !response.data.map((l) => l.code).includes(lng.code)
          )
        );
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
  }, [languagesChanged]);

  useEffect(() => {
    Axios.get("/themes")
      .then((response) => {
        setThemes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
    setThemeSections([]);
  }, []);

  useEffect(() => {
    const user = auth?.user?._id || "";
    fetchProjects(user);
  }, [dataChanged]);

  const [projet, setProjet] = useState(confSelected.idProject);

  useEffect(() => {
    Axios.get("/configurations")
      .then((response) => {
        setConfigurations(response.data);
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

  const handlePanelColorChange = createHandleColorChange("panelColor");

  const handlePanelTextColorChange = createHandleColorChange("panelTextColor");
  const handleMemoSectionChange = createHandleChange("memoSection");
  const handleMemoBackColorChange = createHandleColorChange(
    "memoBackgroundColor"
  );
  const handleMemoFontColorChange = createHandleColorChange("memoFontColor");
  const handlePanelWidthChange = createHandleChange("panelWidth");
  const handleResizeBarWidthChange = createHandleChange("resizeBarWidth");
  const handleBackgroundLanguageChange =
    createHandleColorChange("backgroundLanguage");
  const handleTextColorLanguageChange =
    createHandleColorChange("textColorLanguage");
  const handleButtonMemoBgColorChange =
    createHandleColorChange("buttonMemoBgColor");
  const handleButtonMemoFontColorChange = createHandleColorChange(
    "buttonMemoFontColor"
  );
  const handleButtonMemoFontSizeChange =
    createHandleChange("buttonMemoFontSize");
  const handleSectionEmailDisplayChange = createHandleChange(
    "sectionEmailDisplay"
  );
  const handleFontTitleMemoChange = createHandleChange("fontTitleMemo");
  const handleFontTextMemoChange = createHandleChange("fontTextMemo");
  const handleArrondiMemoChange = createHandleChange("arrondiMemo");
  const handleTimerChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      setConfSelected((prevData) => ({
        ...prevData,
        timer: value,
      }));
    } else {
      setConfSelected((prevData) => ({
        ...prevData,
        timer: 0,
      }));
    }
  };

  const initialInputColors = {
    panelFieldColor: "white",
    panelTextColorFieldColor: "white",
    memoFieldColor: "white",
    memoBackColorFieldColor: "white",
    memoFontColorFieldColor: "white",
    widthPanelFieldColor: "white",
    timerFieldColor: "white",
    resizeBarWidthFieldColor: "white",
    backgroundLanguage: "white",
    textColorLanguage: "white",
    buttonMemoBgColor: "white",
    buttonMemoFontColor: "white",
    buttonMemoFontSize: "white",
    handleSectionEmailDisplay: "white",
    fontTitleMemo: "white",
    fontTextMemo: "white",
    arrondiMemo: "white",
  };
  const [inputColor, setInputColor] = useState(initialInputColors);

  const changeInputColors = () => {
    if (confSelected.panelColor != initialValues.panelColor) {
      setInputColor((prevData) => ({
        ...prevData,
        panelFieldColor: "#50e150",
      }));
    }

    if (confSelected.panelTextColor != initialValues.panelTextColor) {
      setInputColor((prevData) => ({
        ...prevData,
        panelTextColorFieldColor: "#50e150",
      }));
    }

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
    if (confSelected.panelWidth != initialValues.panelWidth) {
      setInputColor((prevColor) => ({
        ...prevColor,
        widthPanelFieldColor: "#50e150",
      }));
    }
    if (confSelected.timer != initialValues.timer) {
      setInputColor((prevColor) => ({
        ...prevColor,
        timerFieldColor: "#50e150",
      }));
    }
    if (confSelected.resizeBarWidth != initialValues.resizeBarWidth) {
      setInputColor((prevColor) => ({
        ...prevColor,
        resizeBarWidthFieldColor: "#50e150",
      }));
    }
    if (confSelected.backgroundLanguage != initialValues.backgroundLanguage) {
      setInputColor((prevColor) => ({
        ...prevColor,
        backgroundLanguage: "#50e150",
      }));
    }
    if (confSelected.textColorLanguage != initialValues.textColorLanguage) {
      setInputColor((prevColor) => ({
        ...prevColor,
        textColorLanguage: "#50e150",
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
    if (confSelected.sectionEmailDisplay != initialValues.sectionEmailDisplay) {
      setInputColor((prevColor) => ({
        ...prevColor,
        handleSectionEmailDisplay: "#50e150",
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

  const handleEnregistrer1 = () => {
    changeInputColors();
    Axios.put(`/configurations/${confSelected._id}`, confSelected)
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
  const handleAnnuler1 = () => {
    setConfSelected(initialValues);
  };

  const reinitialisedData = {
    idProject: confSelected.idProject,
    panelColor: "#ffffff",
    panelTextColor: "#000000",
    panelWidth: "300px",
    memoSection: "display",
    memoBackgroundColor: "#ffc000",
    memoFontColor: "#ffffff",
    generalUrl: confSelected.generalUrl,
    timer: 10,
    resizeBarWidth: "5px",
    backgroundLanguage: "#000000",
    textColorLanguage: "#ffffff",
    buttonMemoBgColor: "#000000",
    buttonMemoFontColor: "#ffffff",
    buttonMemoFontSize: "10px",
    sectionEmailDisplay: "display",
    memoFontTitle: "Montserrat",
    memoFontText: "Montserrat",
    arrondiMemo: "0px",
  };

  const handleAReinitialiser = () => {
    setConfSelected(reinitialisedData);
    Axios.put(`/configurations/${confSelected._id}`, reinitialisedData)
      .then((data) => {
        console.log("Object modified:", data);
        setInitialValues(reinitialisedData);
        setDataChanged((prev) => prev + 1);
        // You can update your UI or perform other actions here
      })
      .catch((error) => {
        console.error("Error modifying object:", error);
      });
  };

  const addLanguage = (lng) => {
    Axios.post("/languages", lng)
      .then((response) => {
        console.log("New language added:", response.data);
        setLanguagesChanged((prev) => prev + 1);
        setNotAllowedLanguages((prev) =>
          prev.filter((l) => l.code != lng.code)
        );
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  const deleteLanguage = (lng) => {
    Axios.delete(`/languages/${lng._id}`)
      .then((response) => {
        console.log("Language deleted:", response.data);
        setLanguages((prev) => prev.filter((l) => l.code != lng.code));
        setNotAllowedLanguages((prev) => [...prev, lng]);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  const confLines = [
    {
      type: "couleur",
      label: "Couleur du panneau",
      value: confSelected.panelColor,
      handle: handlePanelColorChange,
      holder: "Saisir couleur",
      style: { backgroundColor: inputColor.panelFieldColor },
      options: [],
    },
    {
      type: "couleur",
      label: "Couleur du mot 'Langue'",
      value: confSelected.panelTextColor,
      handle: handlePanelTextColorChange,
      holder: "Saisir couleur",
      style: { backgroundColor: inputColor.panelTextColorFieldColor },
      options: [],
    },
    {
      type: "input",
      label: "Largeur initial du panneau",
      value: confSelected.panelWidth,
      handle: handlePanelWidthChange,
      holder: "Saisir largeur",
      style: { backgroundColor: inputColor.widthPanelFieldColor },
      options: [],
    },
    {
      type: "input",
      label: "Durée du Timer (en minutes)",
      value: confSelected.timer,
      handle: handleTimerChange,
      holder: "Saisir durée",
      style: { backgroundColor: inputColor.timerFieldColor },
      options: [],
    },
    {
      type: "input",
      label: "Largeur de la barre de redimensionnement",
      value: confSelected.resizeBarWidth,
      handle: handleResizeBarWidthChange,
      holder: "Saisir largeur",
      style: { backgroundColor: inputColor.resizeBarWidthFieldColor },
      options: [],
    },
    {
      type: "couleur",
      label: "Couleur de fond de la langue",
      value: confSelected.backgroundLanguage,
      handle: handleBackgroundLanguageChange,
      holder: "Saisir couleur",
      style: { backgroundColor: inputColor.backgroundLanguage },
      options: [],
    },
    {
      type: "couleur",
      label: "Couleur du texte de la langue",
      value: confSelected.textColorLanguage,
      handle: handleTextColorLanguageChange,
      holder: "Saisir couleur",
      style: { backgroundColor: inputColor.textColorLanguage },
      options: [],
    },
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
      type: "select",
      label: "Affichage de la section Email",
      value: confSelected.sectionEmailDisplay,
      handle: handleSectionEmailDisplayChange,
      holder: "",
      style: { backgroundColor: inputColor.handleSectionEmailDisplay },
      options: [
        { title: "Afficher Email", value: "display" },
        { title: "Cacher Email", value: "hide" },
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
      type: "input",
      label: "Police du titre Mémo",
      value: confSelected.fontTitleMemo,
      handle: handleFontTitleMemoChange,
      holder: "Saisir police",
      style: { backgroundColor: inputColor.fontTitleMemo },
      options: [],
    },
    {
      type: "input",
      label: "Police du texte Mémo",
      value: confSelected.fontTextMemo,
      handle: handleFontTextMemoChange,
      holder: "Saisir police",
      style: { backgroundColor: inputColor.fontTextMemo },
      options: [],
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

  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const handleLiveConfiguration = () => {
    setLiveConfiguration((prev) => !prev);
  };

  const handleProjectChange = (event) => {
    setProjet(event.target.value);
    const conf = configurations.find((c) => c.idProject === event.target.value);
    setConfSelected(conf);
    setInitialValues(conf);
  };

  const handleAppliquerTheme = () => {
    Axios.put(`/configurations/${clientSelected}`, {
      projectId: clientSelected,
      ...confSelected,
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
    <div
      className="configurations"
      style={{ paddingTop: "40px", position: "relative" }}
    >
      <div className="infoContainer">
        <div className="buttonsInfo">
          <div className="flex items-center gap-2">
            <button onClick={handleLiveConfiguration}>
              Configurer en direct
            </button>
            <Icon
              className="infoIcon"
              icon="mdi:information-variant-circle-outline"
              onClick={onOpenModal}
            />
          </div>
        </div>
        <Modal open={open} onClose={onCloseModal} center>
          <img src="./fleche1.png" alt="" className="fleche1" />
          <img src="./modeNormal.png" alt="" className="demo" />
          <h4 className="panelColor">
            Couleur <br />
            du panneau
          </h4>
          <img src="./fleche2.png" alt="" className="fleche2" />
          <h4 className="memoSection">
            Section <br />
            mémo
          </h4>
          <img src="./fleche2.png" alt="" className="fleche3" />
          <h4 className="barreRed">
            Barre de <br />
            redimensionnement
          </h4>
          <img src="./fleche3.png" alt="" className="fleche4" />
          <h4 className="sectionText">Texte de section</h4>
          <img src="./fleche4.png" alt="" className="fleche5" />
          <h4 className="sectionTitle">Titre de section</h4>
        </Modal>
      </div>
      <div className="colorsForm">
        <h4>Thème</h4>
        <div>
          <h1 className="text-sm font-semibold mb-2">
            Choisir un thème déjà pret pour faciliter la configuration.
          </h1>
          <ConfLine
            type="select"
            label="Thème"
            value={themeSelected}
            handle={(e) => {
              setThemeSelected(e.target.value);
              const theme = themes.find(
                (theme) => theme._id === e.target.value
              );
              if(theme){
              setThemeSections(theme?.sections || []);
              setConfSelected((prevData) => ({
                ...prevData,
                ...theme.configuration,
              }));
            }else{
              setThemeSections([]);
              setConfSelected((prevData) => ({
                ...prevData,
                ...defaultData,
              }));
            }
            }}
            holder=""
            style={{}}
            options={[
              { title: "---", value: "" },
              ...themes.map((theme) => ({
                title: theme.name,
                value: theme._id,
              })),
            ]}
          />
          <div className="h-4"></div>
            <ConfLine
             type="select"
             label="Client"
              value={clientSelected}
              handle={(e) => { setClientSelected(e.target.value);}}
              holder="Choisir un client"
              style={{}}
              options={[{ title: "---", value : ""},...projects.map((project) => ({
                title: project.name,
                value: project._id,
              }))]}
            />
            <div className="confButtons">
              <button className="appliquer" onClick={handleAppliquerTheme}>
                Appliquer
              </button>
            </div>
        </div>
      </div>
      {(auth?.user?.role === "admin" || projects.length > 0) && (
        <>
          <div
            className="buttonsBox"
            style={{
              marginBottom: "40px",
              paddingRight: "40px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {!showUploadPage ? (
              <button className="uploadbtn" onClick={clickUploadbtn}>
                <FontAwesomeIcon icon={faUpload} />
                <span>Importer configuration utilisant des fichiers csv</span>
              </button>
            ) : (
              <button className="uploadbtn" onClick={clickUploadbtn}>
                <FontAwesomeIcon icon={faUpload} />
                <span>Cacher la page d'importation</span>
              </button>
            )}
            {showUploadPage && (
              <a
                className="uploadbtn"
                href="ConfigurationsModel.csv"
                download="ConfigurationsModel.csv"
              >
                Télécharger un modèle
              </a>
            )}
          </div>
          {showUploadPage && (
            <UploadPage
              filesType={"configurations"}
              setDataChanged={setDataChanged}
            />
          )}
          <div className="colorsForm">
            <h4>Configuration du panneau latéral</h4>
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
            <ExportCSV data={configurations} fileName={"configurations"} />
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
          <div
            className="colorsForm"
            style={{
              gridTemplateColumns: "auto",
              gap: "0",
              paddingTop: "40px",
              paddingBottom: "40px",
            }}
          >
            <h4>Configuration des langues</h4>
            {languages.map((language, index) => (
              <div
                key={index}
                className="languageLine"
                style={{ color: "black" }}
              >
                {language.name}
                <FontAwesomeIcon
                  icon={faMinus}
                  style={{ cursor: "pointer" }}
                  onClick={() => deleteLanguage(language)}
                />
              </div>
            ))}
            {notAllowedLanguages.length > 0 && (
              <div
                className="languageLine addLine"
                style={{ color: "#8d7878" }}
                onClick={() => setIsAddingLanguage(!isAddingLanguage)}
              >
                Ajouter une langue
                <FontAwesomeIcon
                  icon={faEllipsis}
                  style={{ cursor: "pointer" }}
                />
              </div>
            )}
            {isAddingLanguage &&
              notAllowedLanguages.map((language, index) => (
                <div
                  key={index}
                  className="languageLine addLine"
                  style={{ color: "#8d7878" }}
                >
                  {language.name}
                  <FontAwesomeIcon
                    icon={faPlus}
                    style={{ cursor: "pointer" }}
                    onClick={() => addLanguage(language)}
                  />
                </div>
              ))}
          </div>
          <GestionSections />
          <SmtpConfig />
        </>
      )}
      <SupportMailConfig />
    </div>
  );
}

export default Configurations;

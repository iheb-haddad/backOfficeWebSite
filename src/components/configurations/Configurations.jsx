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
import GestionMemo from "./GestionMemo";

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
    generalUrl: "",
    timer: "",
    resizeBarWidth: "",
    backgroundLanguage: "#000000",
    textColorLanguage: "#ffffff",
    sectionEmailDisplay: "display",
    btnCloseAllDisplay: "display",
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

  const createHandleTailleChange = (key) => (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      setConfSelected((prevData) => ({
        ...prevData,
        [key]: value,
      }));
    } else {
      setConfSelected((prevData) => ({
        ...prevData,
        [key]: 0,
      }));
    }
  };

  const handlePanelColorChange = createHandleColorChange("panelColor");

  const handlePanelTextColorChange = createHandleColorChange("panelTextColor");

  const handlePanelWidthChange = createHandleTailleChange("panelWidth");
  const handleResizeBarWidthChange = createHandleTailleChange("resizeBarWidth");
  const handleBackgroundLanguageChange =
    createHandleColorChange("backgroundLanguage");
  const handleTextColorLanguageChange =
    createHandleColorChange("textColorLanguage");

  const handleSectionEmailDisplayChange = createHandleChange(
    "sectionEmailDisplay"
  );

  const handleBtnCloseAllDisplayChange = createHandleChange(
    "btnCloseAllDisplay"
  );

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
    widthPanelFieldColor: "white",
    timerFieldColor: "white",
    resizeBarWidthFieldColor: "white",
    backgroundLanguage: "white",
    textColorLanguage: "white",
    handleSectionEmailDisplay: "white",
    btnCloseAllDisplay: "white",
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

    if (confSelected.sectionEmailDisplay != initialValues.sectionEmailDisplay) {
      setInputColor((prevColor) => ({
        ...prevColor,
        handleSectionEmailDisplay: "#50e150",
      }));
    }

    if (confSelected.btnCloseAllDisplay != initialValues.btnCloseAllDisplay) {
      setInputColor((prevColor) => ({
        ...prevColor,
        btnCloseAllDisplay: "#50e150",
      }));
    }

    setTimeout(() => {
      setInputColor(initialInputColors);
    }, 2000);
  };

  const handleEnregistrer1 = () => {
    changeInputColors();
    Axios.put(`/configurations/${confSelected._id}`, {
      panelColor: confSelected.panelColor,
      panelTextColor: confSelected.panelTextColor,
      panelWidth: confSelected.panelWidth,
      generalUrl: confSelected.generalUrl,
      timer: confSelected.timer,
      resizeBarWidth: confSelected.resizeBarWidth,
      backgroundLanguage: confSelected.backgroundLanguage,
      textColorLanguage: confSelected.textColorLanguage,
      sectionEmailDisplay: confSelected.sectionEmailDisplay,
      btnCloseAllDisplay: confSelected.btnCloseAllDisplay,
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
  const handleAnnuler1 = () => {
    setConfSelected({ ...confSelected, ...initialValues });
  };

  const reinitialisedData = {
    idProject: confSelected.idProject,
    panelColor: "#ffffff",
    panelTextColor: "#000000",
    panelWidth: "300",
    generalUrl: confSelected.generalUrl,
    timer: 10,
    resizeBarWidth: "5",
    backgroundLanguage: "#000000",
    textColorLanguage: "#ffffff",
    sectionEmailDisplay: "display",
    btnCloseAllDisplay: "display",
  };

  const handleAReinitialiser = () => {
    setConfSelected({
      ...confSelected,
      ...reinitialisedData,
    });
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
      label: "Largeur initial du panneau (px)",
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
      label: "Largeur de la barre de redimensionnement (px)",
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
      label: "Affichage de la section Email",
      value: confSelected.sectionEmailDisplay,
      handle: handleSectionEmailDisplayChange,
      holder: "",
      style: { backgroundColor: inputColor.handleSectionEmailDisplay },
      options: [
        { title: "Cacher Email", value: "hide" },
        { title: "Afficher Email", value: "display" }
      ],
    },
    {
      type: "select",
      label: "Afficher le bouton 'Fermer/Ouvrir tout'",
      value: confSelected.btnCloseAllDisplay,
      handle: handleBtnCloseAllDisplayChange,
      holder: "",
      style: { backgroundColor: inputColor.btnCloseAllDisplay },
      options: [
        { title: "Cacher le bouton", value: "hide" },
        { title: "Afficher le bouton", value: "display" }
      ],
    }
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
          <img src="./InfoPanel.png" alt="" className="demo" />
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
          {(auth?.user?.role === "admin" || projects.length > 0) && (
              <GestionMemo projects={projects}/>
            )}
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

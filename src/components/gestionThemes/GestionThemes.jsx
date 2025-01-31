import * as React from "react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTrash } from "@fortawesome/free-solid-svg-icons";
import UploadPage from "../uploadPage/UploadPage";
import ColorPicker from "../ui/color-picker";
import useAuth from "../../hooks/useAuth";
import ConfLine from "../confLine/ConfLine";
import ExportCSV from "../exportCsv/ExportCsv";
import { CheckCircle, ChevronsRight, ChevronsLeft } from "lucide-react";
import { defineStepper } from "@stepperize/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import GestionSections from "./GestionSections";
import { toast } from "sonner";
import Axios from "@/services/Axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { DataTable } from "../ui/dataTable";

const GestionThemes = () => {
  const [theme, setTheme] = useState({});
  const [themeChanged, setThemeChanged] = useState(false);
  const [themes, setThemes] = useState([]);
  const [sections, setSections] = useState([]);
  const { setNavLineClicked, setLiveConfiguration, auth } = useAuth();
  const [showUploadPage, setShowUploadPage] = useState(false);
  const [themeCompleted, setThemeCompleted] = useState(false);
  const [showError1, setShowError1] = useState(false);
  const [showError2, setShowError2] = useState(false);

  const { useStepper, steps, utils } = defineStepper(
    { id: "step-1", title: "Création de thème", description: "First step" },
    {
      id: "step-2",
      title: "Configuration du panneau latéral",
      description: "Second step",
    },
    {
      id: "step-3",
      title: "Configuration des sections",
      description: "Third step",
    }
  );

  const stepper = useStepper();
  const currentIndex = utils.getIndex(stepper.current.id);

  const createHandleChange = (key) => (event) => {
    setTheme((prevData) => ({
      ...prevData,
      [key]: event.target.value,
    }));
  };

  const clickUploadbtn = () => {
    setShowUploadPage((prev) => !prev);
  };

  useEffect(() => {
    setNavLineClicked("themes");
  }, []);

  const handleNameChange = createHandleChange("name");
  const handleDescriptionChange = createHandleChange("description");
  const createHandleColorChange = (key) => (color) => {
    setTheme((prevData) => ({
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
      setTheme((prevData) => ({
        ...prevData,
        timer: value,
      }));
    } else {
      setTheme((prevData) => ({
        ...prevData,
        timer: 0,
      }));
    }
  };

  const initialInputColors = {
    nameFieldColor: "rgb(214, 214, 214)",
    descriptionFieldColor: "rgb(214, 214, 214)",
    panelFieldColor: "rgb(214, 214, 214)",
    panelTextColorFieldColor: "rgb(214, 214, 214)",
    memoFieldColor: "rgb(214, 214, 214)",
    memoBackColorFieldColor: "rgb(214, 214, 214)",
    memoFontColorFieldColor: "rgb(214, 214, 214)",
    widthPanelFieldColor: "rgb(214, 214, 214)",
    timerFieldColor: "rgb(214, 214, 214)",
    resizeBarWidthFieldColor: "rgb(214, 214, 214)",
    backgroundLanguage: "rgb(214, 214, 214)",
    textColorLanguage: "rgb(214, 214, 214)",
    buttonMemoBgColor: "rgb(214, 214, 214)",
    buttonMemoFontColor: "rgb(214, 214, 214)",
    buttonMemoFontSize: "rgb(214, 214, 214)",
    handleSectionEmailDisplay: "rgb(214, 214, 214)",
    fontTitleMemo: "rgb(214, 214, 214)",
    fontTextMemo: "rgb(214, 214, 214)",
    arrondiMemo: "rgb(214, 214, 214)",
  };
  const [inputColor, setInputColor] = useState(initialInputColors);

  const confThemeLines = [
    {
      type: "input",
      label: "Nom de thème",
      value: theme.name,
      handle: handleNameChange,
      holder: "Saisir nom",
      style: {
        borderColor:
          showError1 && !theme.name ? "red" : inputColor.nameFieldColor,
      },
      options: [],
    },
    {
      type: "input",
      label: "Description",
      value: theme.description,
      handle: handleDescriptionChange,
      holder: "Saisir description",
      style: {
        borderColor:
          showError1 && !theme.description
            ? "red"
            : inputColor.descriptionFieldColor,
      },
      options: [],
    },
  ];

  const confLines = [
    {
      type: "couleur",
      label: "Couleur du panneau",
      value: theme.panelColor,
      handle: handlePanelColorChange,
      holder: "Saisir couleur",
      style: {
        borderColor:
          showError2 && !theme.panelColor ? "red" : inputColor.panelFieldColor,
      },
      options: [],
    },
    {
      type: "couleur",
      label: "Couleur du texte du panneau",
      value: theme.panelTextColor,
      handle: handlePanelTextColorChange,
      holder: "Saisir couleur",
      style: {
        borderColor:
          showError2 && !theme.panelTextColor
            ? "red"
            : inputColor.panelTextColorFieldColor,
      },
      options: [],
    },
    {
      type: "input",
      label: "Largeur initial du panneau",
      value: theme.panelWidth,
      handle: handlePanelWidthChange,
      holder: "Saisir largeur",
      style: {
        borderColor:
          showError2 && !theme.panelWidth
            ? "red"
            : inputColor.widthPanelFieldColor,
      },
      options: [],
    },
    {
      type: "input",
      label: "Durée du Timer (en minutes)",
      value: theme.timer,
      handle: handleTimerChange,
      holder: "Saisir durée",
      style: {
        borderColor:
          showError2 && !theme.timer ? "red" : inputColor.timerFieldColor,
      },
      options: [],
    },
    {
      type: "input",
      label: "Largeur de la barre de redimensionnement",
      value: theme.resizeBarWidth,
      handle: handleResizeBarWidthChange,
      holder: "Saisir largeur",
      style: {
        borderColor:
          showError2 && !theme.resizeBarWidth
            ? "red"
            : inputColor.resizeBarWidthFieldColor,
      },
      options: [],
    },
    {
      type: "couleur",
      label: "Couleur de fond de la langue",
      value: theme.backgroundLanguage,
      handle: handleBackgroundLanguageChange,
      holder: "Saisir couleur",
      style: {
        borderColor:
          showError2 && !theme.backgroundLanguage
            ? "red"
            : inputColor.backgroundLanguage,
      },
      options: [],
    },
    {
      type: "couleur",
      label: "Couleur du texte de la langue",
      value: theme.textColorLanguage,
      handle: handleTextColorLanguageChange,
      holder: "Saisir couleur",
      style: {
        borderColor:
          showError2 && !theme.textColorLanguage
            ? "red"
            : inputColor.textColorLanguage,
      },
      options: [],
    },
    {
      type: "select",
      label: "Affichage de la section Mémo",
      value: theme.memoSection,
      handle: handleMemoSectionChange,
      holder: "",
      style: {
        borderColor:
          showError2 && !theme.memoSection ? "red" : inputColor.memoFieldColor,
      },
      options: [
        { title: "---", value: "" },
        { title: "Afficher Mémo", value: "display" },
        { title: "Cacher Mémo", value: "hide" },
      ],
    },
    {
      type: "select",
      label: "Affichage de la section Email",
      value: theme.sectionEmailDisplay,
      handle: handleSectionEmailDisplayChange,
      holder: "",
      style: {
        borderColor:
          showError2 && !theme.sectionEmailDisplay
            ? "red"
            : inputColor.handleSectionEmailDisplay,
      },
      options: [
        { title: "---", value: "" },
        { title: "Afficher Email", value: "display" },
        { title: "Cacher Email", value: "hide" },
      ],
    },
    {
      type: "couleur",
      label: "Couleur de section Mémo",
      value: theme.memoBackgroundColor,
      handle: handleMemoBackColorChange,
      holder: "Saisir couleur",
      style: {
        borderColor:
          showError2 && !theme.memoBackgroundColor
            ? "red"
            : inputColor.memoBackColorFieldColor,
      },
      options: [],
    },
    {
      type: "input",
      label: "Police du titre Mémo",
      value: theme.fontTitleMemo,
      handle: handleFontTitleMemoChange,
      holder: "Saisir police",
      style: {
        borderColor:
          showError2 && !theme.fontTitleMemo ? "red" : inputColor.fontTitleMemo,
      },
      options: [],
    },
    {
      type: "input",
      label: "Police du texte Mémo",
      value: theme.fontTextMemo,
      handle: handleFontTextMemoChange,
      holder: "Saisir police",
      style: {
        borderColor:
          showError2 && !theme.fontTextMemo ? "red" : inputColor.fontTextMemo,
      },
      options: [],
    },
    {
      type: "couleur",
      label: "Couleur du texte Mémo",
      value: theme.memoFontColor,
      handle: handleMemoFontColorChange,
      holder: "Saisir couleur",
      style: {
        borderColor:
          showError2 && !theme.memoFontColor
            ? "red"
            : inputColor.memoFontColorFieldColor,
      },
      options: [],
    },
    {
      type: "couleur",
      label: "Couleur de fond de bouton Mémo",
      value: theme.buttonMemoBgColor,
      handle: handleButtonMemoBgColorChange,
      holder: "Saisir couleur",
      style: {
        borderColor:
          showError2 && !theme.buttonMemoBgColor
            ? "red"
            : inputColor.buttonMemoBgColor,
      },
      options: [],
    },
    {
      type: "couleur",
      label: "Couleur du texte de bouton Mémo",
      value: theme.buttonMemoFontColor,
      handle: handleButtonMemoFontColorChange,
      holder: "Saisir couleur",
      style: {
        borderColor:
          showError2 && !theme.buttonMemoFontColor
            ? "red"
            : inputColor.buttonMemoFontColor,
      },
      options: [],
    },
    {
      type: "input",
      label: "Taille du texte de bouton Mémo",
      value: theme.buttonMemoFontSize,
      handle: handleButtonMemoFontSizeChange,
      holder: "Saisir taille",
      style: {
        borderColor:
          showError2 && !theme.buttonMemoFontSize
            ? "red"
            : inputColor.buttonMemoFontSize,
      },
      options: [],
    },
    {
      type: "input",
      label: "Arrondi de cadre du Mémo",
      value: theme.arrondiMemo,
      handle: handleArrondiMemoChange,
      holder: "Saisir arrondi",
      style: {
        borderColor:
          showError2 && !theme.arrondiMemo ? "red" : inputColor.arrondiMemo,
      },
      options: [],
    },
  ];

  const handleThemeEnregistrer = () => {
    if (themeCompleted) {
      Axios.post("/themes", {
        name: theme.name,
        description: theme.description,
        configuration: {
          panelColor: theme.panelColor,
          panelTextColor: theme.panelTextColor,
          panelWidth: theme.panelWidth,
          memoSection: theme.memoSection,
          memoBackgroundColor: theme.memoBackgroundColor,
          memoFontColor: theme.memoFontColor,
          timer: theme.timer,
          resizeBarWidth: theme.resizeBarWidth,
          backgroundLanguage: theme.backgroundLanguage,
          textColorLanguage: theme.textColorLanguage,
          buttonMemoBgColor: theme.buttonMemoBgColor,
          buttonMemoFontColor: theme.buttonMemoFontColor,
          buttonMemoFontSize: theme.buttonMemoFontSize,
          sectionEmailDisplay: theme.sectionEmailDisplay,
          fontTitleMemo: theme.fontTitleMemo,
          fontTextMemo: theme.fontTextMemo,
          arrondiMemo: theme.arrondiMemo,
        },
        sections: sections,
      })
        .then(() => {
          toast.success("Thème enregistré avec succès");
          setThemeCompleted(false);
          setTheme({});
          setSections([]);
          stepper.goTo("step-1");
        })
        .catch(() => {
          toast.error("Erreur lors de l'enregistrement du thème");
        });
    } else {
      toast.error("Veuillez compléter la configuration du thème");
    }
  };

  const handleDeleteTheme = (id) => {
    Axios.delete(`/themes/${id}`)
      .then(() => {
        setThemeChanged(prev => !prev);
        toast.success("Thème supprimé avec succès");
      })
      .catch(() => {
        toast.error("Erreur lors de la suppression du thème");
      });
  };

  useEffect(() => {
    Axios.get("/themes")
      .then((response) => {
        setThemes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
  }, [themeChanged]);

  const columns = [
    {
      accessorKey: "name",
      header: "Nom du thème",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const theme = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-4 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <button onClick={() => handleDeleteTheme(theme._id)}>
                  Supprimer
                  <FontAwesomeIcon icon={faTrash} className="text-sm ml-2" />
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div
      className="configurations"
      style={{ paddingTop: "40px", position: "relative" }}
    >
      <div className="relative">
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
              <span>Importer thèmes utilisant des fichiers csv</span>
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
            setDataChanged={setThemeChanged}
          />
        )}
        <div className="flex justify-between w-[80%] mx-auto">
          <h2 className="text-2xl font-medium">Thème</h2>
          <div className="flex items-center gap-2">
            <span className="text-lg text-muted-foreground">
              Etape {currentIndex + 1} de {steps.length}
            </span>
            <div />
          </div>
        </div>
        <nav
          aria-label="Checkout Steps"
          className="group my-4 w-[80%] mx-auto mb-16"
        >
          <ol
            className="flex items-center justify-between gap-2"
            aria-orientation="horizontal"
          >
            {stepper.all.map((step, index, array) => (
              <React.Fragment key={step.id}>
                <li className="flex items-center gap-4 flex-shrink-0">
                  <Button
                    type="button"
                    role="tab"
                    variant={index <= currentIndex ? "default" : "secondary"}
                    aria-current={
                      stepper.current.id === step.id ? "step" : undefined
                    }
                    aria-posinset={index + 1}
                    aria-setsize={steps.length}
                    aria-selected={stepper.current.id === step.id}
                    className="flex size-10 items-center justify-center rounded-full"
                    onClick={() => stepper.goTo(step.id)}
                  >
                    {index + 1}
                  </Button>
                  <span className="text-lg font-medium">{step.title}</span>
                </li>
                {index < array.length - 1 && (
                  <Separator
                    className={`flex-1 ${
                      index < currentIndex ? "bg-primary" : "bg-[#d6d6d6]"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </ol>
        </nav>
        {stepper.when("step-1", (step) => (
          <div className="colorsForm">
            <h4>Création de thème</h4>
            {confThemeLines.map((line, index) => {
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
                <button
                  onClick={async () => {
                    stepper.beforeNext(async () => {
                      if (theme.name && theme.description) {
                        try {
                          const response = await Axios.post(
                            "/themes/verifyNameUniqueness",
                            { name: theme.name }
                          );
                          if (response.status === 200) {
                            return true;
                          } else {
                            return false;
                          }
                        } catch (error) {
                          if (error.response && error.response.status === 400) {
                            toast.error("Nom de thème déjà utilisé");
                          } else {
                            toast.error(
                              "Erreur lors de la vérification du nom du thème"
                            );
                          }
                          return false;
                        }
                      } else {
                        setShowError1(true);
                        return false;
                      }
                    });
                  }}
                  className="appliquer flex items-center gap-2"
                  style={{ fontSize: "1.1rem" }}
                >
                  Next
                  <ChevronsRight />
                </button>
              </div>
            </div>
          </div>
        ))}
        {stepper.when("step-2", (step) => (
          <div className="colorsForm">
            <h4>Configuration du panneau latéral</h4>
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
              <div className="flex justify-between w-full">
                <button
                  onClick={() => {
                    stepper.prev();
                  }}
                  className="flex items-center gap-2"
                  style={{ fontSize: "1.1rem" }}
                >
                  <ChevronsLeft />
                  Previous
                </button>
              </div>
            </div>
            <div className="confButtons">
              <div className="flex justify-end w-full">
                <button
                  onClick={() => {
                    stepper.beforeNext(() => {
                      if (
                        theme.panelColor &&
                        theme.panelTextColor &&
                        theme.panelWidth &&
                        theme.memoSection &&
                        theme.memoBackgroundColor &&
                        theme.memoFontColor &&
                        theme.timer &&
                        theme.resizeBarWidth &&
                        theme.backgroundLanguage &&
                        theme.textColorLanguage &&
                        theme.buttonMemoBgColor &&
                        theme.buttonMemoFontColor &&
                        theme.buttonMemoFontSize &&
                        theme.sectionEmailDisplay
                      ) {
                        return true;
                      } else {
                        setShowError2(true);
                        return false;
                      }
                    });
                  }}
                  className="appliquer flex items-center gap-2"
                  style={{ fontSize: "1.1rem" }}
                >
                  Next
                  <ChevronsRight />
                </button>
              </div>
            </div>
            <div></div>
            {/* <ExportCSV data={configurations} fileName={"configurations"} /> */}
          </div>
        ))}
        {stepper.when("step-3", () => (
          <>
            <GestionSections
              setThemeCompleted={setThemeCompleted}
              setSections={setSections}
              sections={sections}
            />
            <div className="confButtons justify-between pr-0 w-[80%] mx-auto mb-20">
              <button
                onClick={() => {
                  stepper.prev();
                }}
                className="flex items-center gap-2"
                style={{ fontSize: "1.1rem" }}
              >
                <ChevronsLeft />
                Previous
              </button>
              <button
                onClick={handleThemeEnregistrer}
                className="appliquer flex items-center gap-2"
                style={{ fontSize: "1.1rem" }}
              >
                Enregistrer le thème
              </button>
            </div>
          </>
        ))}
        <div className="w-[80%] mx-auto mb-20">
          <DataTable
            data={themes}
            columns={columns}
            type="themes"
            nbrColumnsMax={4}
          />
        </div>
      </div>
    </div>
  );
};

export default GestionThemes;

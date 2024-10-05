import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowRight,
  faCircleArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import "./Dashboard.css";
import useStore from "../../globalState/UseStore";
import useAuth from "../../hooks/useAuth";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import Axios from "../../services/Axios";
import ModalBox from "../modalBox/ModalBox";
import { toast } from "sonner";
import Reinitialiser from "./Reinitialiser";
import HistoricList from "./HistoricList";
import { AreaChartCard, PieChartCard } from "../index";
import { DataTable } from "../ui/dataTable";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Dashboard() {
  const initialFilterParameteres = {
    title: "",
    creationDate: "",
    consultNumber: "",
    lastConsult: "",
  };

  const {
    documentations,
    mappings,
    mappingIsLoaded,
    documentIsLoaded,
    fetchDocumentations,
    fetchMappings,
  } = useStore();
  const [filtredDocumentations, setFiltredDocumentations] = useState([]);
  const [filterParameters, setFilterParameters] = useState(
    initialFilterParameteres
  );
  const { setNavLineClicked, auth } = useAuth();

  const [page, setPage] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isLeaving2, setIsLeaving2] = useState(false);
  const [isEntering2, setIsEntering2] = useState(false);

  const columns = [
    {
      accessorKey: "title",
      header: "Titre",
    },
    {
      accessorKey: "createdAt",
      header: "Date de création",
      cell: ({ row }) => {
        return reformDate(row.original.createdAt);
      },
    },
    {
      accessorKey: "consultationNumber",
      header: "Nombre de consultation",
    },
    {
      accessorKey: "lastConsultation",
      header: "Dernière consultation",
      cell: ({ row }) => {
        return (
          row.original.lastConsultation &&
          reformDate(row.original.lastConsultation)
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const document = row.original;

        return (
          document.consultationNumber > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-4 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <HistoricList doc={document} />
                <Reinitialiser
                  onContinue={() => handleResetConsultNumber(document)}
                  message={`Voulez-vous vraiment supprimer l'historique de consultation de du document "${document.title}" ?`}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          )
        );
      },
    },
    {
      accessorKey: "language",
      header: "Langue",
    },
    {
      accessorKey: "status",
      header: "Statut",
    },
  ];

  useEffect(() => {
    const user = auth?.user?._id || "";
    setNavLineClicked("home");
    fetchDocumentations(user);
    fetchMappings(user);
  }, []);

  useEffect(() => {
    setFiltredDocumentations(documentations);
  }, [documentations]);

  const handleClickRights = () => {
    setIsEntering2(false);
    setIsLeaving2(false);
    setIsEntering(false);
    setIsLeaving(true);
    setTimeout(() => {
      setIsLeaving(false);
      setPage((prev) => prev + 1);
      setIsEntering(true);
    }, 300);
  };
  const handleClickleft = () => {
    setIsEntering2(false);
    setIsLeaving2(true);
    setIsEntering(false);
    setIsLeaving(false);
    setTimeout(() => {
      setIsLeaving2(false);
      setPage((prev) => prev - 1);
      setIsEntering2(true);
    }, 300);
  };

  const reformDate = (date) => {
    return date.split("T")[0] + " " + date.split("T")[1].split(".")[0];
  };

  const compareDate = (userInput, comparisonDate) => {
    const operators = ["<", ">", "="];
    let operator = "=";

    // Check if the user input starts with an operator
    if (operators.includes(userInput.charAt(0))) {
      operator = userInput.charAt(0);
      userInput = userInput.slice(1).trim();
    }

    // Normalize the input date format to 'YYYY-MM-DD'
    const normalizedUserInput = normalizeDate(userInput);
    const normalizedComparisonDate = normalizeDate(comparisonDate);

    // Compare dates based on the operator
    switch (operator) {
      case ">":
        return normalizedUserInput < normalizedComparisonDate;
      case "<":
        return normalizedUserInput > normalizedComparisonDate;
      case "=":
      default:
        return normalizedUserInput === normalizedComparisonDate;
    }
  };

  const normalizeDate = (dateStr) => {
    // Handle different formats and normalize them to 'YYYY-MM-DD'
    const dateParts = dateStr.split(/[-/]/);

    let year, month, day;

    // Differentiate based on parts length
    if (dateParts.length === 1) {
      // Format: YYYY
      year = dateParts[0];
      month = "01";
      day = "01";
    } else if (dateParts.length === 2) {
      // Format: YYYY-MM or MM-YYYY
      if (dateParts[0].length === 4) {
        year = dateParts[0];
        month = dateParts[1];
        day = "01";
      } else {
        year = dateParts[1];
        month = dateParts[0];
        day = "01";
      }
    } else if (dateParts.length === 3) {
      // Format: YYYY-MM-DD or DD-MM-YYYY or MM-DD-YYYY
      if (dateParts[0].length === 4) {
        year = dateParts[0];
        month = dateParts[1];
        day = dateParts[2];
      } else if (dateParts[2].length === 4) {
        year = dateParts[2];
        month = dateParts[1];
        day = dateParts[0];
      } else {
        year = dateParts[2];
        month = dateParts[0];
        day = dateParts[1];
      }
    }

    // Pad month and day with leading zero if necessary
    if (month.length === 1) month = "0" + month;
    if (day.length === 1) day = "0" + day;

    return `${year}-${month}-${day}`;
  };

  const compareConsultNumber = (consultationNumber) => {
    return (
      filterParameters.consultNumber === "" ||
      filterParameters.consultNumber === "<" ||
      filterParameters.consultNumber === ">" ||
      filterParameters.consultNumber === "=" ||
      (filterParameters.consultNumber[0] === "="
        ? consultationNumber == filterParameters.consultNumber.split("=")[1]
        : filterParameters.consultNumber[0] === "<"
        ? consultationNumber < filterParameters.consultNumber.split("<")[1]
        : filterParameters.consultNumber[0] === ">" &&
          consultationNumber > filterParameters.consultNumber.split(">")[1]) ||
      consultationNumber.toString().startsWith(filterParameters.consultNumber)
    );
  };

  useEffect(() => {
    const filteredData = documentations.filter((doc) => {
      const titleMatch =
        filterParameters.title === "" ||
        doc.title
          .toLowerCase()
          .startsWith(filterParameters.title.toLowerCase());
      const creationDateMatch =
        filterParameters.creationDate === "" ||
        compareDate(filterParameters.creationDate, doc.createdAt.split("T")[0]);
      const consultNumberMatch = compareConsultNumber(doc.consultationNumber);
      const lastConsultMatch =
        filterParameters.lastConsult === "" ||
        (doc.lastConsultation &&
          compareDate(
            filterParameters.lastConsult,
            doc.lastConsultation.split("T")[0]
          ));
      return (
        titleMatch &&
        creationDateMatch &&
        consultNumberMatch &&
        lastConsultMatch
      );
    });
    setFiltredDocumentations(filteredData);
  }, [filterParameters]);

  const handleResetConsultNumber = (doc) => {
    Axios.put(`/documentations/resetConsultationNumber/${doc._id}`)
      .then((res) => {
        const user = auth?.user?._id || "";
        fetchDocumentations(user);
      })
      .catch((err) => {
        console.log(err);
      });

    Axios.delete(`/consultHistoric/documentation/${doc._id}`)
      .then((res) => {
        toast.success("Historique de consultaion supprimé");
      })
      .catch((err) => {
        console.log(err);
        toast.error(
          "Erreur lors de la suppression de l'historique de consultation"
        );
      });
  };

  const [historicSelected, setHistoricSelected] = useState("");
  const [historic, setHistoric] = useState([]);

  useEffect(() => {
    if (historicSelected) {
      Axios.get(`/consultHistoric/documentation/${historicSelected}`)
        .then((res) => {
          setHistoric(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [historicSelected]);

  const [creationDate, setCreationDate] = React.useState({
    from: "",
    to: "",
  });

  const [consultaionDate, setConsultationDate] = React.useState({
    from: "",
    to: "",
  });

  React.useEffect(() => {
    setFiltredDocumentations(
      documentations.filter((doc) => {
        const creatDate = new Date(doc.createdAt);
        const consultDate = new Date(doc.lastConsultation);
        const creationDateMatch =
          creationDate?.from === "" ||
          creationDate?.from === undefined ||
          creationDate?.to === undefined ||
          creationDate?.to === "" ||
          (creatDate >= creationDate.from && creatDate <= creationDate?.to);
        const consultationDateMatch =
          consultaionDate?.from === "" ||
          consultaionDate?.from === undefined ||
          consultaionDate?.to === undefined ||
          consultaionDate?.to === "" ||
          (consultDate >= consultaionDate.from &&
            consultDate <= consultaionDate?.to);
        return creationDateMatch && consultationDateMatch;
      })
    );
  }, [creationDate, consultaionDate]);

  return (
    <div className="accueil">
      <div className="accueilBoxes">
        <div className="accueilBox bigBox modifications">
          <div className="modificationsHead">
            <div className="modificationsTitle">
              <div
                className="precedentIcon"
                style={{ display: page === 0 && "none" }}
                onClick={handleClickleft}
              >
                <FontAwesomeIcon icon={faCircleArrowLeft} />
              </div>
              Dernières modifications
            </div>
            <div
              className="suivantIcon"
              style={{ display: mappings.length - 2 * page < 3 && "none" }}
              onClick={handleClickRights}
            >
              <FontAwesomeIcon icon={faCircleArrowRight} />
            </div>
          </div>
          <div className="modificationsList">
            <div className="modificationsHeadList">
              <div className="type">Section</div>
              <div className="titre">Titre</div>
              <div className="langue">Langue</div>
              <div className="webApp">Application web</div>
            </div>
            <ClipLoader
              className="loader"
              loading={!mappingIsLoaded}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            {(mappingIsLoaded && mappings.length > 0) ?
              mappings
                .slice(
                  mappings.length - page * 2 - 2 > 0
                    ? mappings.length - page * 2 - 2
                    : 0,
                  mappings.length - page * 2
                )
                .reverse()
                .map((mapping) => (
                  <div
                    className={`modificationsHeadList modificationsLine ${
                      isLeaving && "isLeaving"
                    } ${isEntering && "isEntering"} ${
                      isLeaving2 && "isLeaving2"
                    } ${isEntering2 && "isEntering2"}`}
                    key={mapping._id}
                  >
                    <div className="type">{mapping.idSection.titleFr}</div>
                    <div className="titre">{mapping.idDocument.title}</div>
                    <div className="langue">{mapping.idDocument.language}</div>
                    <div className="webApp">{mapping.idSource.name}</div>
                  </div>
                ))
              : (mappingIsLoaded && mappings.length === 0) && (
                <div className="modificationsHeadList modificationsLine">
                  <div className="type">Aucun résultat</div>
                </div>
                )}
          </div>
        </div>
        <div
          className="accueilBox bigBox citation"
          style={{ backgroundImage: "url(./citationBack.png)" }}
        >
          <div className="title">Votre documentation, votre manière</div>
          <div className="subtitle">
            "FlexiDoc : Votre documentation personnalisé pour une efficacité
            maximale et pour une productivité optimale.."
          </div>
        </div>
        <PieChartCard />
        <AreaChartCard />
        <DataTable
          columns={columns}
          data={filtredDocumentations}
          creationDate={creationDate}
          consultaionDate={consultaionDate}
          setCreationDate={setCreationDate}
          setConsultationDate={setConsultationDate}
          nbrColumnsMax={5}
          type="dashboard"
        />
      </div>
    </div>
  );
}

export default Dashboard;

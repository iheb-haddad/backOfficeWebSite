import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Axios from "../../services/Axios";
import ExportCSV from "../exportCsv/ExportCsv";
import "./DocsList.css";
import useAuth from "../../hooks/useAuth";
import { toast } from "sonner";
import { DataTable } from "../ui/dataTable";
import { Button } from "../ui/Button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function DocsList(props) {
  const [mappings, setMappings] = useState([]);
  const [filtredMappings, setFiltredMappings] = useState([]);
  const [dataChanged, setDataChanged] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const { auth } = useAuth();

  useEffect(() => {
    const user = auth?.user?._id || "";
    Axios.get(`/mappings/user/${user}`)
      .then((response) => {
        setMappings(response.data);
        const filteredData = response.data.filter((mapping) => {
          const projectMatch =
            props.filterParameters.selectedProject === "tout" ||
            mapping.idProject._id === props.filterParameters.selectedProject;
          const subProjectMatch =
            props.filterParameters.selectedSubProject === "tout" ||
            mapping.idSubProject._id ===
              props.filterParameters.selectedSubProject;
          const typeMatch =
            props.filterParameters.selectedType === "tout" ||
            mapping.idSection._id === props.filterParameters.selectedType;
          const languageMatch =
            props.filterParameters.selectedLanguage === "tout" ||
            mapping.idDocument.language ===
              props.filterParameters.selectedLanguage;
          const appMatch =
            props.filterParameters.selectedApp === "tout" ||
            mapping.idSource._id === props.filterParameters.selectedApp;
          const titleMatch =
            props.filterParameters.titleSearched === "" ||
            mapping.idDocument.title
              .toLowerCase()
              .startsWith(props.filterParameters.titleSearched.toLowerCase());

          return (
            projectMatch &&
            subProjectMatch &&
            typeMatch &&
            languageMatch &&
            appMatch &&
            titleMatch
          );
        });
        setFiltredMappings(
          filteredData.map((mapping) => {
            return {
              _id : mapping._id,
              section: mapping.idSection.titleFr,
              title: mapping.idDocument.title,
              language: mapping.idDocument.language,
              source: mapping.idSource.name,
              display: mapping.idDocument.display,
            };
          })
        );
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error("Error fetching mappings:", error);
        toast.error("Erreur lors du chargement des données");
      });
  }, [dataChanged]);

  const handleDelete = (mappingId) => {
    Axios.delete(`/mappings/${mappingId}`)
      .then((data) => {
        setDataChanged((prev) => prev + 1);
        toast.success("Mapping supprimé avec succès");
      })
      .catch((error) => {
        console.error("Error deleting ", error);
        toast.error("Erreur lors de la suppression du mapping");
      });
  };

  useEffect(() => {
    const filteredData = mappings.filter((mapping) => {
      const projectMatch =
        props.filterParameters.selectedProject === "tout" ||
        mapping.idProject._id === props.filterParameters.selectedProject;
      const subProjectMatch =
        props.filterParameters.selectedSubProject === "tout" ||
        mapping.idSubProject._id === props.filterParameters.selectedSubProject;
      const typeMatch =
        props.filterParameters.selectedType === "tout" ||
        mapping.idSection._id === props.filterParameters.selectedType;
      const languageMatch =
        props.filterParameters.selectedLanguage === "tout" ||
        mapping.idDocument.language === props.filterParameters.selectedLanguage;
      const appMatch =
        props.filterParameters.selectedApp === "tout" ||
        mapping.idSource._id === props.filterParameters.selectedApp;
      const titleMatch =
        props.filterParameters.titleSearched === "" ||
        mapping.idDocument.title
          .toLowerCase()
          .startsWith(props.filterParameters.titleSearched.toLowerCase());

      return (
        projectMatch &&
        subProjectMatch &&
        typeMatch &&
        languageMatch &&
        appMatch &&
        titleMatch
      );
    });
    setFiltredMappings(
      filteredData.map((mapping) => {
        return {
          _id : mapping._id,
          section: mapping.idSection.titleFr,
          title: mapping.idDocument.title,
          language: mapping.idDocument.language,
          source: mapping.idSource.name,
          display: mapping.idDocument.display,
        };
      })
    );
  }, [props.filterParameters]);

  const columns = [
    {
      accessorKey: "section",
      header: "Section",
    },
    {
      accessorKey: "title",
      header: "Titre",
    },
    {
      accessorKey: "language",
      header: "Langue",
    },
    {
      accessorKey: "source",
      header: "Source",
    },
    {
      accessorKey: "display",
      header: "Affichage",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const mapping = row.original;

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
                <button onClick={() => handleDelete(mapping._id)}>
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
    <div style={{ position: "relative" }}>
      <ClipLoader
        className="loading"
        loading={!isLoaded}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <div className="px-10">
      {isLoaded && (
        <DataTable
          data={filtredMappings}
          columns={columns}
          type="mapping"
          nbrColumnsMax={6}
        />
      )}
      </div>
      {isLoaded && <ExportCSV data={mappings} fileName={"mappings"} />}
    </div>
  );
}

export default DocsList;

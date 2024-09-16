import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import UploadPage from "../uploadPage/UploadPage";
import useStore from "../../globalState/UseStore";
import useAuth from "../../hooks/useAuth";
import Axios from "../../services/Axios";
import { toast } from "sonner";
import ExportCSV from "../exportCSV/ExportCSV";
import { DataTable } from "../ui/dataTable";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/Button";
import { MoreHorizontal } from "lucide-react";
import { use } from "i18next";

const GestionErrors = () => {
  const { auth } = useAuth();
  const {
    errors,
    fetchErrors,
    userProjects,
    fetchUserProjects,
    subProjects,
    fetchSubProjects,
  } = useStore();
  const [projectSelected, setProjectSelected] = useState("");
  const [subProjectSelected, setSubProjectSelected] = useState("");
  const [showUploadPage, setShowUploadPage] = useState(false);
  const [showListErrors, setShowListErrors] = useState(false);
  const [dataChanged, setDataChanged] = useState(0);
  const [reformedErrors, setReformedErrors] = useState([]);

  useEffect(() => {
    const user = auth?.user?._id || "";
    fetchSubProjects(user);
    fetchUserProjects(user);
    fetchErrors(user);
  }, [dataChanged]);

  useEffect(() => {
    setReformedErrors(
      errors.map((error) => {
        return {
          title: error.idDocumentation.title,
          language: error.idDocumentation.language,
          status: error.idDocumentation.status,
          _id: error._id,
          idProject: error.idProject._id,
          idSubProject: error.idSubProject._id,
        };
      })
    );
  }, [errors]);

  const handleProjectChange = (event) => {
    setProjectSelected(event.target.value);
    setSubProjectSelected("");
  };

  const handleSubProjectChange = (event) => {
    setSubProjectSelected(event.target.value);
  };

  const clickUploadbtn = () => {
    setShowUploadPage(!showUploadPage);
  };

  const handleDeleteError = (id) => {
    Axios.delete(`/errors/${id}`)
      .then(() => {
        toast.success("Erreur supprimée avec succès");
        setDataChanged(dataChanged + 1);
      })
      .catch((err) => {
        toast.error("Erreur lors de la suppression");
      });
  };

  const columns = [
    {
      accessorKey: "title",
      header: "Titre",
    },
    {
      accessorKey: "language",
      header: "Langue",
    },
    {
      accessorKey: "status",
      header: "Statut",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const error = row.original;

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
                <button onClick={() => handleDeleteError(error._id)}>
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
    <div className="configurations" style={{ marginBottom: "40px" }}>
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
            <span>Importer des erreurs utilisant des fichiers csv</span>
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
            href="ErrorsModel.csv"
            download="ErrorsModel.csv"
          >
            Télécharger un modèle
          </a>
        )}
      </div>
      {showUploadPage && (
        <UploadPage filesType={"erreurs"} setDataChanged={setDataChanged} />
      )}
      <div className="colorsForm" style={{ display: "block" }}>
        <h4>Gestion des erreurs</h4>
        <div className="configBox" style={{ padding: "20px" }}>
          <div className="configLine" style={{ padding: "20px" }}>
            <h3>Client correspondant</h3>
            <select value={projectSelected} onChange={handleProjectChange}>
              <option value="" disabled hidden>
                ----
              </option>
              {userProjects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className="configLine" style={{ padding: "20px" }}>
            <h3>Projet correspondant</h3>
            <select
              value={subProjectSelected}
              onChange={handleSubProjectChange}
            >
              <option value="" disabled hidden>
                ----
              </option>
              {subProjects
                .filter(
                  (subProject) => subProject.idProject._id === projectSelected
                )
                .map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="applicationsList" style={{ marginTop: "30px" }}>
          <div className="flex justify-end">
            <Button
              className="bg-white text-black border hover:bg-white"
              onClick={() => setShowListErrors(!showListErrors)}
            >
              {showListErrors ? "cacher liste" : "afficher liste"}
            </Button>
          </div>
          {showListErrors && (
            <DataTable
              data={reformedErrors.filter((error) => {
                return (
                  (projectSelected === "" ||
                    error.idProject === projectSelected) &&
                  (subProjectSelected === "" ||
                    error.idSubProject === subProjectSelected)
                );
              })}
              columns={columns}
              type="error"
              nbrColumnsMax={4}
            />
          )}
        </div>
        <ExportCSV
          data={errors.map((error) => {
            (error.idDocumentation.idProject = error.idProject),
              (error.idDocumentation.idSubProject = error.idSubProject);
            return error.idDocumentation;
          })}
          fileName={"erreurs"}
        />
      </div>
    </div>
  );
};

export default GestionErrors;

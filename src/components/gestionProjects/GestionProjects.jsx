import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Axios from "../../services/Axios";
import useStore from "../../globalState/UseStore";
import useAuth from "../../hooks/useAuth";
import UploadPage from "../uploadPage/UploadPage";
import ExportCSV from "../exportCsv/ExportCsv";
import GestionSubProjects from "../gestionSubProjects/GestionSubProjects";
import { toast } from "sonner";
import { DataTable } from "../ui/dataTable";
import { Button } from "../ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import ModifyProject from "./popupModifiedProj";
import DeleteModal from "../ui/deleteModal";

function GestionProjects() {
  const { setNavLineClicked, auth } = useAuth();
  const [showUploadPage, setShowUploadPage] = useState(false);

  const clickUploadbtn = () => {
    setShowUploadPage((prev) => !prev);
  };

  const initialApp = {
    name: "",
    description: "",
  };
  const { projects, fetchProjects } = useStore();
  const [projectForm, setprojectForm] = useState(initialApp);
  const [dataChanged, setDataChanged] = useState(0);
  const [msgError1, setMsgError1] = useState("");
  const [showListProjects, setShowListProjects] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setNavLineClicked("projects");
    const user = auth?.user?._id || "";
    fetchProjects(user);
  }, [dataChanged]);

  const handleProjectNameChange = (event) => {
    setMsgError1("");
    setprojectForm((prevData) => ({
      ...prevData,
      name: event.target.value,
    }));
  };

  const handleProjectDescriptionChange = (event) => {
    setprojectForm((prevData) => ({
      ...prevData,
      description: event.target.value,
    }));
  };

  const handleEnregistrerProject = () => {
    setShowError(false);
    const hasEmptyFields =
      projectForm.name === "" || projectForm.description === "";
    setShowError(hasEmptyFields);
    if (!hasEmptyFields) {
      const newProject = {
        name: projectForm.name,
        description: projectForm.description,
      };
      Axios.post("/projects", newProject)
        .then((data) => {
          console.log("app added:", data);
          toast.success("Projet ajouté avec succès");
          setprojectForm(initialApp);
          setDataChanged((prev) => prev + 1);
        })
        .catch((error) => {
          error.response.status === 400 &&
            setMsgError1("Nom de projet déjà existe");
          error.response.status === 400 &&
            toast.error("Nom de projet déjà existe");
          console.error("Error adding app:", error);
        });
    }
  };

  const handleAnnulerWebApp = () => {
    setprojectForm(initialApp);
  };

  const handleDeleteProject = (projectId) => {
    Axios.delete(`/projects/${projectId}`)
      .then((data) => {
        setDataChanged((prev) => prev + 1);
        console.log("project deleted");
        toast.success("Projet supprimé avec succès");
        // You can update your UI or perform other actions here
      })
      .catch((error) => {
        console.error("Error deleting ", error);
      });
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Nom",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const project = row.original;

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
              <ModifyProject
                project={project}
                setDataChanged={setDataChanged}
                type="project"
              />
              <DeleteModal
                message={`Attention vous êtes sur le point de supprimer le projet ${project.name} et tout ce qui lui est associé (documents,sources,users...).`}
                onContinue={() => handleDeleteProject(project._id)}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div style={{ paddingBottom: "50px" }}>
      {auth?.user?.role === "admin" && (
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
                <span>Importer des clients utilisant des fichiers csv</span>
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
                href="ClientsModel.csv"
                download="ClientsModel.csv"
              >
                Télécharger un modèle
              </a>
            )}
          </div>
          {showUploadPage && (
            <UploadPage
              filesType={"projects"}
              setDataChanged={setDataChanged}
            />
          )}
        </>
      )}
      <div className="urlBox">
        <h5>Clients</h5>
        {auth?.user?.role === "admin" && (
          <>
            <h4>Ajouter un nouveau client.</h4>
            <div className="urlForm">
              <div className="urlLine">
                <h3>Nom du client</h3>
                <input
                  type="text"
                  value={projectForm.name}
                  onChange={handleProjectNameChange}
                  placeholder="Saisir titre "
                  style={{
                    border: showError && !projectForm.name && "1px solid red",
                  }}
                />
                <div className="adminErr">
                  <p style={{ color: "red" }}>{msgError1}</p>
                </div>
              </div>
              <div className="urlLine">
                <h3>Description</h3>
                <input
                  type="text"
                  value={projectForm.description}
                  onChange={handleProjectDescriptionChange}
                  placeholder="Saisir titre "
                  style={{
                    border:
                      showError && !projectForm.description && "1px solid red",
                  }}
                />
              </div>
            </div>
            <div className="confButtons" style={{ marginBottom: "30px" }}>
              <button onClick={handleAnnulerWebApp}>Annuler</button>
              <button className="appliquer" onClick={handleEnregistrerProject}>
                Appliquer
              </button>
            </div>
          </>
        )}
        <div className="applicationsList">
          <div className="flex justify-end">
            <Button
              className="bg-white text-black border hover:bg-white"
              onClick={() => setShowListProjects(!showListProjects)}
            >
              {showListProjects ? "cacher liste" : "afficher liste"}
            </Button>
          </div>
          {showListProjects && (
            <DataTable
              data={projects}
              columns={columns}
              type="project"
              nbrColumnsMax={3}
            />
          )}
          <ExportCSV data={projects} fileName={"clients"} />
        </div>
      </div>
      <GestionSubProjects />
    </div>
  );
}

export default GestionProjects;

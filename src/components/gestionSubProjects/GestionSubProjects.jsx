import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Axios from "../../services/Axios";
import useStore from "../../globalState/UseStore";
import useAuth from "../../hooks/useAuth";
import ModifiedProject from "../modifiedProject/ModifiedProject";
import UploadPage from "../uploadPage/UploadPage";
import ExportCSV from "../exportCsv/ExportCsv";
import ModalBox from "../modalBox/ModalBox";
import { toast } from "sonner";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
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
import ModifyProject from "../gestionProjects/popupModifiedProj";

function GestionSubProjects() {
  const { setNavLineClicked, auth } = useAuth();
  const [showUploadPage, setShowUploadPage] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [projectSelected, setProjectSelected] = useState("");

  const tryToDelete = (project) => {
    setProjectSelected(project._id);
    setMessage(
      `Attention vous êtes sur le point de supprimer le projet ${project.name} et tout ce qui lui est associé (documents,sources,users...).`
    );
    setShowModal(true);
  };

  const handleAnnuler = () => {
    setShowModal(false);
  };
  const handleContinuer = () => {
    setShowModal(false);
    handleDeleteProject(projectSelected);
  };

  const clickUploadbtn = () => {
    setShowUploadPage((prev) => !prev);
  };

  const initialApp = {
    name: "",
    description: "",
    project: "",
  };
  const {
    projects,
    fetchProjects,
    subProjects,
    fetchSubProjects,
    userProjects,
    fetchUserProjects,
  } = useStore();
  const [projectForm, setprojectForm] = useState(initialApp);
  const [dataChanged, setDataChanged] = useState(0);
  const [msgError1, setMsgError1] = useState("");
  const [msgError2, setMsgError2] = useState("");
  const [showListProjects, setShowListProjects] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showError2, setShowError2] = useState(false);
  const [isModified, setIsModified] = useState("");
  const [modifiedName, setModifiedName] = useState("");
  const [modifiedDescription, setModifiedDescription] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  useEffect(() => {
    setNavLineClicked("projects");
    const user = auth?.user?._id || "";
    fetchProjects(user);
    fetchSubProjects(user);
    fetchUserProjects(user);
  }, [dataChanged]);

  const handleProjectChange = (event) => {
    setprojectForm((prevData) => ({
      ...prevData,
      project: event.target.value,
    }));
  };

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
        idProject: projectForm.project,
        name: projectForm.name,
        description: projectForm.description,
      };
      Axios.post("/subProjects", newProject)
        .then((data) => {
          console.log("app added:", data);
          setprojectForm(initialApp);
          setDataChanged((prev) => prev + 1);
          toast.success("Sous-projet ajouté avec succès");
        })
        .catch((error) => {
          toast.error(error.response.data.message);
          console.error("Error adding app:", error);
        });
    } else {
      toast.error("Veuillez remplir tous les champs");
    }
  };

  const handleAnnulerWebApp = () => {
    setprojectForm(initialApp);
  };

  const handleDeleteProject = (projectId) => {
    Axios.delete(`/subProjects/${projectId}`)
      .then((data) => {
        setDataChanged((prev) => prev + 1);
        console.log("project deleted");
        toast.success("Sous-projet supprimé avec succès");
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
                type="subProject"
              />
              <DropdownMenuItem>
                <button onClick={() => handleDeleteProject(project._id)}>
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
    <>
      <div
        className="buttonsBox"
        style={{
          marginBottom: "40px",
          paddingRight: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "30px",
        }}
      >
        {!showUploadPage ? (
          <button className="uploadbtn" onClick={clickUploadbtn}>
            <FontAwesomeIcon icon={faUpload} />
            <span>Importer des projets utilisant des fichiers csv</span>
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
            href="ProjectsModel.csv"
            download="ProjectsModel.csv"
          >
            Télécharger un modèle
          </a>
        )}
      </div>
      {showUploadPage && (
        <UploadPage filesType={"subProjects"} setDataChanged={setDataChanged} />
      )}
      <div className="urlBox">
        <h5>Projets</h5>
        <h4>Ajouter un nouveau projet.</h4>
        <div className="configBox">
          <div className="configLine">
            <h3>Client correspondant</h3>
            <select
              value={projectForm.project}
              onChange={handleProjectChange}
              style={{
                border: showError && !projectForm.project && "1px solid red",
              }}
            >
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
          <div className="configLine">
            <h3>Nom du projet</h3>
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
          <div className="configLine">
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
        <div className="configBox" style={{ padding: "20px" }}>
          <div className="configLine" style={{ padding: "20px" }}>
            <h3>Client correspondant</h3>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
            >
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
        </div>
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
              data={subProjects.filter((subPrj) => {
                return (
                  projectFilter === "" || subPrj.idProject._id === projectFilter
                );
              })}
              columns={columns}
              type="project"
              nbrColumnsMax={3}
            />
          )}
          <ExportCSV data={subProjects} fileName={"projects"} />
        </div>
      </div>
      {showModal && (
        <ModalBox
          type="delete"
          message={message}
          onCancel={handleAnnuler}
          onContinue={handleContinuer}
        />
      )}
    </>
  );
}

export default GestionSubProjects;

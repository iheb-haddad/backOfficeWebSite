import React from "react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrash,
  faCircleCheck,
  faX,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import Axios from "../../services/Axios";
import useStore from "../../globalState/UseStore";
import { ClipLoader } from "react-spinners";
import useAuth from "../../hooks/useAuth";
import "./GestionUsers.css";
import useRessources from "../../hooks/useRessources";
import ExportCSV from "../exportCsv/ExportCsv";
import UploadPage from "../uploadPage/UploadPage";
import { toast } from "sonner";

const GestionUsers = () => {
  const { projects, fetchProjects, subProjects, fetchSubProjects } = useStore();
  const [users, setUsers] = useState([]);
  const [dataChanged, setDataChanged] = useState(0);
  const [isEditing, setIsEditing] = useState("");
  const [isModified, setIsModified] = useState("");
  const [isDeleting, setIsDeleting] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [projectInput, setProjectInput] = useState("");
  const [subProjectInput, setSubProjectInput] = useState("");
  const { setNavLineClicked, auth } = useAuth();
  const { setBtnClicked } = useRessources();
  const [newProjects, setNewProjects] = useState([]);
  const [newSubProjects, setNewSubProjects] = useState([]);
  const [password, setPassword] = useState("");
  const [projectsEmpty, setProjectsEmpty] = useState(false);
  const [subProjectsEmpty, setSubProjectsEmpty] = useState(false);
  const [showUploadPage, setShowUploadPage] = useState(false);
  const [userModified, setUserModified] = useState(false);

  const clickUploadbtn = () => {
    setShowUploadPage((prev) => !prev);
  };

  useEffect(() => {
    setNavLineClicked("users");
    setBtnClicked("users");
    const user = auth?.user?._id || "";
    fetchProjects(user);
    fetchSubProjects(user);
    Axios.get(`/users/${user}`)
      .then((response) => {
        setUsers(response.data);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
        toast.error("Erreur lors du chargement des données");
      });
  }, [dataChanged]);

  const handleDelete = (userId) => {
    setIsDeleting(userId);
    Axios.delete(`/users/${userId}`)
      .then((data) => {
        setDataChanged((prev) => prev + 1);
        toast.success("Utilisateur supprimé avec succès");
      })
      .catch((error) => {
        console.error("Error deleting ", error);
      });
    setTimeout(() => {
      setIsDeleting("");
    }, 1500);
  };

  // Methofds to handle the form
  const onChangeProject = (event) => {
    const project = projects.find(
      (project) => project._id === event.target.value
    );
    setNewProjects([...newProjects, project]);
    setUserModified(true);
  };

  const onChangeSubProject = (event) => {
    const project = subProjects.find(
      (project) => project._id === event.target.value
    );
    setNewSubProjects([...newSubProjects, project]);
    setUserModified(true);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
    setUserModified(true);
  };

  const handleModify = (user) => {
    setUserModified(false);
    setIsEditing(user._id);
    setProjectInput("");
    setSubProjectInput("");
    setNewProjects(user.projects);
    setNewSubProjects(user.subProjects);
    setPassword("");
  };

  const handleModifyComplete = (user) => {
    setProjectsEmpty(newProjects.length === 0);
    setSubProjectsEmpty(
      newSubProjects.length === 0 && auth?.user?.role === "user"
    );
    if (
      newProjects.length > 0 &&
      (auth?.user?.role === "admin" || newSubProjects.length > 0)
    ) {
      setIsEditing("");
      if (userModified) {
        const userModified = {
          projects: newProjects,
          subProjects: newSubProjects,
          password: password,
        };
        Axios.put(`/users/privileges/${user._id}`, userModified)
          .then((data) => {
            console.log("Object modified:", data);
            setDataChanged((prev) => prev + 1);
            toast.success("Utilisateur modifié avec succès");
          })
          .catch((error) => {
            console.error("Error modifying object:", error);
          });
        setTimeout(() => {
          setIsModified(user._id);
        }, 500);
        setTimeout(() => {
          setIsModified("");
        }, 3000);
      }
    }
  };

  const deleteProjet = (index) => {
    const projectToDelete = newProjects[index];
    setUserModified(true);
    setNewProjects(newProjects.filter((prj, i) => i !== index));
    setNewSubProjects(
      newSubProjects.filter(
        (prj) =>
          prj.idProject !== projectToDelete._id &&
          prj.idProject._id !== projectToDelete._id
      )
    );
  };

  const deleteSubProjet = (index) => {
    setNewSubProjects(newSubProjects.filter((prj, i) => i !== index));
    setUserModified(true);
  };

  return (
    <div style={{ position: "relative", marginTop: "50px" }}>
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
            <span>Importer des users utilisant des fichiers csv</span>
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
            href="usersModel.csv"
            download="UsersModel.csv"
          >
            Télécharger un modèle
          </a>
        )}
      </div>
      {showUploadPage && (
        <UploadPage filesType={"users"} setDataChanged={setDataChanged} />
      )}
      <div className="headList">
        <div className="type firstname">Nom & Prénom</div>
        <div className="titre lastname">Mot de passe</div>
        <div className="langue email">email</div>
        <div className="webApp projet">Clients</div>
        <div className="webApp projet">Projets</div>
        <div className="actions acts">Actions</div>
      </div>
      <ClipLoader
        className="loading"
        loading={!isLoaded}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      {isLoaded &&
        users.map((user) => (
          <div
            className={`headList lineList ${
              isEditing === user._id && "isEditing"
            }`}
            key={user._id}
            style={{ backgroundColor: isModified === user._id && "#50e150" }}
          >
            <div
              className={`type firstname ${
                isDeleting === user._id && "isDeleting"
              }`}
            >
              {user.lastName + " " + user.firstName}
            </div>
            <div
              className={`titre lastname ${
                isDeleting === user._id && "isDeleting"
              }`}
            >
              {isEditing !== user._id ? (
                "****************"
              ) : (
                <input
                  type="text"
                  value={password}
                  onChange={handleChangePassword}
                />
              )}
            </div>
            <div
              className={`langue email ${
                isDeleting === user._id && "isDeleting"
              }`}
            >
              {user.email}
            </div>
            <div
              className={`webApp projet ${
                isDeleting === user._id && "isDeleting"
              }`}
            >
              {isEditing === user._id ? (
                <>
                  <div className="urlBlock">
                    {newProjects.map((prj, index) => (
                      <div key={index} className="urlColumn">
                        <FontAwesomeIcon
                          icon={faX}
                          onClick={() => deleteProjet(index)}
                          style={{
                            cursor: "pointer",
                            fontSize: "7px",
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                          }}
                        />
                        {prj.name}
                      </div>
                    ))}
                  </div>
                  {projects.filter(
                    (prj) => !newProjects.some((p) => p._id === prj._id)
                  ).length > 0 && (
                    <select
                      name="app"
                      id="selectApp"
                      value={projectInput}
                      onChange={onChangeProject}
                      style={{ border: projectsEmpty && "1px solid red" }}
                    >
                      <option value="" disabled hidden>
                        ----
                      </option>
                      {projects
                        .filter(
                          (prj) => !newProjects.some((p) => p._id === prj._id)
                        )
                        .map((project) => (
                          <option key={project._id} value={project._id}>
                            {project.name}
                          </option>
                        ))}
                    </select>
                  )}
                </>
              ) : (
                <div className="projectsList">
                  {user.projects.map((prj, index) => {
                    return (
                      <div key={index}>
                        {prj.name +
                          `${index !== user.projects.length - 1 ? " / " : ""}`}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div
              className={`webApp projet ${
                isDeleting === user._id && "isDeleting"
              }`}
            >
              {isEditing === user._id ? (
                <>
                  <div className="urlBlock">
                    {newSubProjects.map((prj, index) => (
                      <div key={index} className="urlColumn">
                        <FontAwesomeIcon
                          icon={faX}
                          onClick={() => deleteSubProjet(index)}
                          style={{
                            cursor: "pointer",
                            fontSize: "7px",
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                          }}
                        />
                        {prj.name}
                      </div>
                    ))}
                  </div>
                  {subProjects.filter(
                    (prj) =>
                      !newSubProjects.some((sp) => sp._id === prj._id) &&
                      newProjects.some((p) => p._id === prj.idProject._id)
                  ).length > 0 && (
                    <select
                      name="app"
                      id="selectApp"
                      value={subProjectInput}
                      onChange={onChangeSubProject}
                      style={{ border: subProjectsEmpty && "1px solid red" }}
                    >
                      <option value="" disabled hidden>
                        ----
                      </option>
                      {subProjects
                        .filter(
                          (prj) =>
                            !newSubProjects.some((sp) => sp._id === prj._id) &&
                            newProjects.some((p) => p._id === prj.idProject._id)
                        )
                        .map((project) => (
                          <option key={project._id} value={project._id}>
                            {project.name}
                          </option>
                        ))}
                    </select>
                  )}
                </>
              ) : (
                <div className="projectsList">
                  {user.subProjects.map((prj, index) => {
                    return (
                      <div key={index}>
                        {prj.name +
                          `${
                            index !== user.subProjects.length - 1 ? " / " : ""
                          }`}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="actions acts">
              {!(isEditing === user._id) ? (
                <FontAwesomeIcon
                  icon={faPen}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleModify(user)}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleModifyComplete(user)}
                />
              )}
              <FontAwesomeIcon
                icon={faTrash}
                style={{ cursor: "pointer" }}
                onClick={() => handleDelete(user._id)}
              />
            </div>
          </div>
        ))}
      {users.length === 0 && isLoaded && (
        <div
          style={{ textAlign: "center", marginTop: "50px", fontSize: "1.2rem" }}
        >
          Aucun utilisateur trouvé
        </div>
      )}
      <ExportCSV data={users} fileName={"users"} />
    </div>
  );
};

export default GestionUsers;

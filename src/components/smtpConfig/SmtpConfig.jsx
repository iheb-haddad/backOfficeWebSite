import { useState, useEffect } from "react";
import useStore from "../../globalState/UseStore";
import useAuth from "../../hooks/useAuth";
import ConfLine from "../confLine/ConfLine";
import Axios from "../../services/Axios";
import { toast } from "sonner";

export default function SmtpConfig() {
  const { auth } = useAuth();
  const { projects, fetchProjects } = useStore();
  const [emptyFileds, setEmptyFileds] = useState(false);
  const [oldSmtpConfig, setOldSmtpConfig] = useState({});

  useEffect(() => {
    const user = auth?.user?._id || "";
    fetchProjects(user);
  }, []);

  const emptyForm = {
    id: "",
    project: "",
    smtpHost: "",
    smtpPort: "",
    smtpLogin: "",
    smtpPassword: "",
    smtpType: true,
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (!formData.project) {
      return;
    }
    Axios.get("smtpConfiguration/" + formData.project)
      .then((res) => {
        const data = res.data;
        if (!data) {
          setFormData({
            id: "",
            project: formData.project,
            smtpHost: "",
            smtpPort: "",
            smtpLogin: "",
            smtpPassword: "",
            smtpType: true,
          });
          return;
        }
        setFormData({
          id: data._id,
          project: data.idProject,
          smtpHost: data.host,
          smtpPort: data.port,
          smtpLogin: data.user,
          smtpPassword: data.pass,
          smtpType: data.type,
        });
        setOldSmtpConfig({
          id: data._id,
          project: data.idProject,
          smtpHost: data.host,
          smtpPort: data.port,
          smtpLogin: data.user,
          smtpPassword: data.pass,
          smtpType: data.type,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [formData.project]);

  const confLines = [
    {
      type: "input",
      label: "SMTP HOST",
      value: formData.smtpHost,
      handle: (e) => setFormData({ ...formData, smtpHost: e.target.value }),
      holder: "Saisir host",
      style: { borderColor: emptyFileds && !formData.smtpHost ? "red" : "" },
      options: [],
    },
    {
      type: "input",
      label: "SMTP PORT",
      value: formData.smtpPort,
      handle: (e) =>
        setFormData({ ...formData, smtpPort: parseInt(e.target.value) }),
      holder: "Saisir port",
      style: { borderColor: emptyFileds && !formData.smtpPort ? "red" : "" },
      options: [],
    },
    {
      type: "input",
      label: "SMTP LOGIN",
      value: formData.smtpLogin,
      handle: (e) => setFormData({ ...formData, smtpLogin: e.target.value }),
      holder: "Saisir login",
      style: { borderColor: emptyFileds && !formData.smtpLogin ? "red" : "" },
      options: [],
    },
    {
      type: "input",
      label: "SMTP PASSWORD",
      value: formData.smtpPassword,
      handle: (e) => setFormData({ ...formData, smtpPassword: e.target.value }),
      holder: "Saisir password",
      style: {
        borderColor: emptyFileds && !formData.smtpPassword ? "red" : "",
      },
      options: [],
    },
    {
      type: "select",
      label: "SMTP TYPE",
      value: formData.smtpType,
      handle: (e) => setFormData({ ...formData, smtpType: e.target.value }),
      holder: "Saisir type",
      style: { borderColor: emptyFileds && !formData.smtpType ? "red" : "" },
      options: [
        {
          title: "Sécurisé",
          value: true,
        },
        {
          title: "Non Sécurisé",
          value: false,
        },
      ],
    },
  ];

  const handleAnnuler = () => {
    if (formData.id) {
      setFormData(oldSmtpConfig);
    } else {
      setFormData(emptyForm);
    }
  };

  const handleEnregistrer = () => {
    const emptyFiled =
      formData.project === "" ||
      formData.smtpHost === "" ||
      formData.smtpPort === "" ||
      formData.smtpLogin === "" ||
      formData.smtpPassword === "" ||
      formData.smtpType === "";
    setEmptyFileds(emptyFiled);
    if (!emptyFiled) {
      if (
        oldSmtpConfig.smtpHost === formData.smtpHost &&
        oldSmtpConfig.smtpPort === formData.smtpPort &&
        oldSmtpConfig.smtpLogin === formData.smtpLogin &&
        oldSmtpConfig.smtpPassword === formData.smtpPassword &&
        oldSmtpConfig.smtpType === formData.smtpType
      ) {
        toast.info("Aucune modification n'a été effectuée");
        return;
      }
      if (formData.id) {
        Axios.put("smtpConfiguration/" + formData.id, {
          idProject: formData.project,
          host: formData.smtpHost,
          port: formData.smtpPort,
          user: formData.smtpLogin,
          pass: formData.smtpPassword,
          type: formData.smtpType,
        })
          .then((res) => {
            toast.success("Configuration modifiée avec succès");
            console.log(res);
            setFormData(emptyForm);
          })
          .catch((err) => {
            toast.error("Erreur lors de l'enregistrement de la configuration");
            console.log(err);
          });
      } else {
        Axios.post("smtpConfiguration", {
          idProject: formData.project,
          host: formData.smtpHost,
          port: formData.smtpPort,
          user: formData.smtpLogin,
          pass: formData.smtpPassword,
          type: formData.smtpType,
        })
          .then((res) => {
            toast.success("Configuration enregistrée avec succès");
            console.log(res);
            setFormData(emptyForm);
          })
          .catch((err) => {
            toast.error("Erreur lors de l'enregistrement de la configuration");
            console.log(err);
          });
      }
    }
  };

  return (
    <div className="colorsForm">
      <h4>Configuration Serveur SMTP</h4>
      <div className="configLine">
        <h3>Client correspondant</h3>
        <select
          value={formData.project}
          onChange={(e) =>
            setFormData({ ...formData, project: e.target.value })
          }
          style={{ borderColor: emptyFileds && !formData.project ? "red" : "" }}
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
          <button onClick={handleAnnuler}>Annuler</button>
          <button className="appliquer" onClick={handleEnregistrer}>
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
}

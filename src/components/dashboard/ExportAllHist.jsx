import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import Axios from "../../services/Axios";
import { toast } from "sonner";

const ExportAllHist = ({ docs }) => {
  const getHistorics = () => {
    setLoading(true);
    const idsDocs = docs.map((doc) => doc._id).join(",");
    Axios.get(`/consultHistoric/docs/${idsDocs}`)
      .then((res) => {
        exportToCSV(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Erreur lors de l'exportation des historiques");
      });
  };

  const exportToCSV = (historic) => {
    if (historic.length > 0) {
      const csvData = historic.map((item) => {
        const { createdAt, updatedAt, __v, idDocumentation, _id, ...rest } =
          item;
        return {
          document: item.idDocumentation.title,
          ...rest,
        };
      });
      const csvRows = [];
      const headers = Object.keys(csvData[0]);
      csvRows.push(headers.join(","));

      csvData.forEach((row) => {
        const values = headers.map((header) => {
          const escaped = ("" + row[header]).replace(/"/g, '\\"');
          return `"${escaped}"`;
        });
        csvRows.push(values.join(","));
      });

      const csvString = csvRows.join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "historique_consultations.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setLoading(false);
    }
  };

  return (
    <div
      className="cursor-pointer p-2 hover:bg-gray-100 flex gap-2 items-center"
      style={{ fontSize: "0.9rem" , borderRadius: "0.5rem", backgroundColor: "#f0f0f0", color: "#333"}}
      onClick={getHistorics}
    >
      <span>Exporter</span>
      <FontAwesomeIcon icon={faDownload} />
    </div>
  );
};

export default ExportAllHist;

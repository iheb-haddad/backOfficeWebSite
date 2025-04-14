import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import Axios from "../../services/Axios";

const ExportHistoric = ({ doc }) => {
  const [historic, setHistoric] = useState([]);

  useEffect(() => {
    if (doc._id) {
      Axios.get(`/consultHistoric/documentation/${doc._id}`)
        .then((res) => {
          setHistoric(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [doc._id]);

  const exportToCSV = () => {
    if (historic.length > 0) {
      const csvData = historic;
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
        link.setAttribute("download", "historique_doc_" + doc.title + ".csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };
  return (
    <div
      className="cursor-pointer p-2 py-1 hover:bg-gray-100 flex gap-2 items-center"
      style={{ fontSize: "0.9rem" }}
      onClick={exportToCSV}
    >
      <span>Export Historiq</span>
      <FontAwesomeIcon icon={faDownload} />
    </div>
  );
};

export default ExportHistoric;

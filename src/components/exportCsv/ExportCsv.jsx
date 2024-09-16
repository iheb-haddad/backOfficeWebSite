import React from "react";
import "./ExportCsv.css";

function ExportCSV({ data, fileName }) {
  const exportToCSV = () => {
    const csvData = data.map((item) => {
      const { createdAt, updatedAt, __v, ...rest } = item;

      if (item.idDocumentation) {
        return {
          _id: item._id,
          client: item.idProject && item.idProject.name,
          project: item.idSubProject && item.idSubProject.name,
          document: item.idDocumentation.title,
        };
      } else if (item.idDocument) {
        return {
          _id: item._id,
          client: item.idProject && item.idProject.name,
          project: item.idSubProject && item.idSubProject.name,
          document: item.idDocument.title,
          section: item.idSection && item.idSection.titleFr,
          source: item.idSource && item.idSource.name,
        };
      } else if (item.idSubProject && item.idProject) {
        const { idSubProject, idProject, ...rest2 } = rest;
        return {
          ...rest2,
          client: item.idProject.name,
          project: item.idSubProject.name,
        };
      } else if (item.idProject) {
        const { idProject, ...rest2 } = rest;
        return {
          ...rest2,
          client: item.idProject.name,
        };
      } else if (item.projects) {
        const { projects, subProjects, ...rest2 } = rest;
        return {
          ...rest2,
          clients: item.projects.map((project) => project.name).join(","),
          projects: item.subProjects
            .map((subProject) => subProject.name)
            .join(","),
        };
      } else {
        return {
          ...rest,
        };
      }
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
      link.setAttribute("download", fileName + ".csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="exportBox">
      <button onClick={exportToCSV}>Export to CSV</button>
    </div>
  );
}

export default ExportCSV;

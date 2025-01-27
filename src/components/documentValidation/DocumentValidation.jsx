import React, { useEffect } from "react";
import { useState } from "react";
import useStore from "../../globalState/UseStore";
import { DataTable } from "../ui/dataTable";

const DocumentValidation = () => {
  const { documentations, fetchDocumentations } = useStore();
  const [documents, setDocuments] = useState(
    documentations
      .filter((doc) => doc.urlDoc)
      .map((doc) => ({ ...doc, validation: "PENDING" }))
  );

  const verifyDocument = async (id) => {
    const document = documentations.find((doc) => doc._id === id);
    try {
      const response = await fetch(document.urlDoc);
      if (response.ok) {
        updateDocumentStatus(id, "OK");
      } else {
        updateDocumentStatus(id, "KO");
      }
    } catch (error) {
      updateDocumentStatus(id, "KO");
    }
  };

  const updateDocumentStatus = (id, validation) => {
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) => (doc._id === id ? { ...doc, validation } : doc))
    );
  };

  useEffect(() => {
    setDocuments(
      documentations
        .filter((doc) => doc.urlDoc)
        .map((doc) => ({ ...doc, validation: "PENDING" }))
    );
  }, [documentations]);

  const columns = [
    {
      accessorKey: "title",
      header: "Titre",
    },
    {
      accessorKey: "validation",
      header: "Validation",
    cell: ({ cell }) => {
      const validation = cell.getValue();
    return (
      <div
        className={`flex items-center justify-center p-2 rounded-md w-fit ${
          validation === "OK"
            ? "border border-green-500"
            : validation === "PENDING"
            ? "border border-yellow-600"
            : "border border-red-500"
        }`}
      >
        {validation === "OK" ? (
          <span className="text-green-500" role="img" aria-label="ok">
            Valide ✅
          </span>
        ) : validation === "PENDING" ? (
          <span className="text-yellow-600" role="img" aria-label="pending">
            à voir ⏳
          </span>
        ) : (
          <span className="text-red-500" role="img" aria-label="ko">
            non valide ❌
          </span>
        )}
      </div>
    );
    },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const document = row.original;

        return (
            <div className="flex items-center justify-center p-2 gap-1 rounded-md w-fit">
          <button className="border border-black py-1 px-2 rounded-md active:scale-90" onClick={() => verifyDocument(document._id)}>Verifier</button>
          {/* <button className="border border-black py-1 px-2 rounded-md active:scale-90" onClick={() => verifyDocument(document._id)}>Modifier</button> */}
            </div>
        );
      },
    },
  ];

  return (
    <div className="w-[80%] m-auto p-4">
      <h1 className="font-semibold text-xl">Document Validation</h1>
      <DataTable
        data={documents}
        columns={columns}
        type="document"
        nbrColumnsMax={4}
      />
    </div>
  );
};

export default DocumentValidation;

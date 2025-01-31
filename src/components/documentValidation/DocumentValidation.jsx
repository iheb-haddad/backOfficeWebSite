import React, { useEffect } from "react";
import { useState } from "react";
import useStore from "../../globalState/UseStore";
import { DataTable } from "../ui/dataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import LinkPreview from "../ui/linkPreview";
import { Button } from "../ui/button";
import { MoreHorizontal, BadgeCheck } from "lucide-react";

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
      const url = document.urlDoc.startsWith("http") ? document.urlDoc : `https://${document.urlDoc}`;
      const response = await fetch(url);
      if (response.ok) {
        console.log(response);
        updateDocumentStatus(id, "OK");
      } else {
        console.log(response);
        updateDocumentStatus(id, "KO");
      }
    } catch (error) {
      console.log(error);
      updateDocumentStatus(id, "KO");
    }
  };

  const updateDocumentStatus = (id, validation) => {
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc._id === id ? { ...doc, validation } : doc
      )
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-4 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 text-blue-600 w-full"
                onClick={() => verifyDocument(document._id)}
              >
                <BadgeCheck className="w-4 h-4" />
                <span>Verify</span>
              </Button>
              <DropdownMenuItem>
                <LinkPreview url={document.urlDoc} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="w-[80%] m-auto p-4 mb-20">
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

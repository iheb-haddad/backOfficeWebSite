import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Axios from "@/services/Axios";
import { DataTable } from "./dataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { ConfLine } from "..";
import { DialogDescription } from "@radix-ui/react-dialog";

const CustomTitlesManager = ({ customTitles, setCustomTitles }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [formData, setFormData] = useState({
    language: "",
    title: "",
  });

  useEffect(() => {
    Axios.get("/languages").then((response) => {
      setLanguages(response.data);
    });
  }, []);

  const columns = [
    {
      accessorKey: "language",
      header: "Langue",
      render: (value) => languages.find((lang) => lang._id === value)?.name,
    },
    {
      accessorKey: "title",
      header: "Titre",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const title = row.original;

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
              {/* <ModifyDocument
                  document={document}
                  userProjects={userProjects}
                  subProjects={subProjects}
                  setDataChanged={setDataChanged}
                /> */}
              <DropdownMenuItem>
                <button onClick={() => { setCustomTitles(customTitles.filter((t) => t.language !== title.language)); }}>
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
    <div className="inline-block">
      <div className="h-full flex flex-col justify-center">
        <Button
          variant="ghost"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
          className="flex items-center space-x-2 bg-slate-100 w-full border border-blue-950 rounded-md p-1"
        >
          Titres personnalisés
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[60vw] max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Configurer des titres personnalisés</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="grid grid-cols-2 gap-4">
              <ConfLine
                type="select"
                label="Langue"
                value={formData.language}
                handle={(e) => {
                  setFormData({ ...formData, language: e.target.value });
                }}
                holder="Choisir une langue"
                style={{}}
                options={[
                  { title: "---", value: "" },
                  ...languages.filter((lng) => !customTitles.some((title) => title.language === lng.code)).map((language) => ({
                    title: language.name,
                    value: language.code,
                  })),
                ]}
              />
              <ConfLine
                type="input"
                label="Titre"
                value={formData.title}
                handle={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                }}
                holder="Titre"
                style={{}}
                options={[]}
              />
              <div></div>
              <div className="flex justify-end p-4">
                <Button
                  className="w-24"
                  onClick={() => {
                    setCustomTitles([...customTitles, formData]);
                    setFormData({ language: "", title: "" });
                  }}
                >
                  Ajouter
                </Button>
              </div>
            </div>
            <DataTable
              data={customTitles}
              columns={columns}
              type="titre"
              nbrColumnsMax={4}
            />
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomTitlesManager;

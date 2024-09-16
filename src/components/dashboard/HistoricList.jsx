import React from "react";
import "./Dashboard.css";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ClipLoader } from "react-spinners";
import Axios from "../../services/Axios";
import { useState, useEffect } from "react";
import { DataTable } from "../ui/dataTable";

const HistoricList = ({ doc }) => {
  const [historic, setHistoric] = useState([]);
  const [filtredHistoric, setFiltredHistoric] = useState([]);
  const [documentIsLoaded, setDocumentIsLoaded] = useState(false);

  useEffect(() => {
    if (doc._id) {
      Axios.get(`/consultHistoric/documentation/${doc._id}`)
        .then((res) => {
          setHistoric(res.data);
          setDocumentIsLoaded(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [doc._id]);

  useEffect(() => {
    setFiltredHistoric(historic);
  }, [historic]);

  const reformDate = (date) => {
    return date.split("T")[0] + " " + date.split("T")[1].split(".")[0];
  };

  const columns = [
    {
      accessorKey: "ipUser",
      header: "Adresse IP",
    },
    {
      accessorKey: "sourceConsultation",
      header: "Source de consultation",
    },
    {
      accessorKey: "date",
      header: "Date consultation",
      cell: ({ row }) => {
        return row.original.date && reformDate(row.original.date);
      },
    },
  ];

  const [consultaionDate, setConsultationDate] = React.useState({
    from: "",
    to: "",
  });

  React.useEffect(() => {
    setFiltredHistoric(
      historic.filter((hist) => {
        const consultDate = new Date(hist.date);
        const consultationDateMatch =
          consultaionDate?.from === "" ||
          consultaionDate?.from === undefined ||
          consultaionDate?.to === undefined ||
          consultaionDate?.to === "" ||
          (consultDate >= consultaionDate.from &&
            consultDate <= consultaionDate?.to);
        return consultationDateMatch;
      })
    );
  }, [consultaionDate]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="cursor-pointer p-2 py-1 hover:bg-gray-100 flex gap-2 items-center"
          style={{ fontSize: "0.9rem" }}
        >
          <span>Historique</span>
          <FontAwesomeIcon icon={faBook} />
        </div>
      </DialogTrigger>
      <DialogContent className="min-w-[80vw] max-w-[80vw] lg:min-w-[60vw] lg:max-w-[60vw] max-h-[80vh] top-[50%] overflow-y-scroll ">
        <DialogHeader>
          <DialogTitle>{`Historique de consultation du document '${doc.title}'`}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="w-full text-black">
            <ClipLoader
              className="loader"
              loading={!documentIsLoaded}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
            {documentIsLoaded && (
              <DataTable
                columns={columns}
                data={filtredHistoric}
                nbrColumnsMax={3}
                consultaionDate={consultaionDate}
                setConsultationDate={setConsultationDate}
                type="historic"
              />
            )}
          </div>
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Terminer</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HistoricList;

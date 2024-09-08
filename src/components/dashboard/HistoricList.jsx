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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ClipLoader } from "react-spinners";
import Axios from "../../services/Axios";
import { useState, useEffect } from "react";


const HistoricList = ({ doc }) => {
    const initialFilterParameteres = {
        lastConsult : ''
    }
    const [filterParameters, setFilterParameters] = useState(initialFilterParameteres);
    const [historic , setHistoric] = useState([])
    const [filtredHistoric , setFiltredHistoric] = useState([])
    const [documentIsLoaded , setDocumentIsLoaded] = useState(false)

    useEffect(() => {
      if(doc._id){
          Axios.get(`/consultHistoric/documentation/${doc._id}`)
          .then((res) => {
              setHistoric(res.data)
              setDocumentIsLoaded(true)
          })
          .catch((err) => {
              console.log(err);
          })
      }
    }, [doc._id])

    useEffect(() => {
        setFiltredHistoric(historic)
    }, [historic])

    const reformDate = (date) => {
        return date.split("T")[0] + " " + date.split("T")[1].split(".")[0]
      }

    const compareDate = (userInput, comparisonDate) => {
        const operators = ['<', '>', '='];
        let operator = '=';
        
        // Check if the user input starts with an operator
        if (operators.includes(userInput.charAt(0))) {
            operator = userInput.charAt(0);
            userInput = userInput.slice(1).trim();
        }
    
        // Normalize the input date format to 'YYYY-MM-DD'
        const normalizedUserInput = normalizeDate(userInput);
        const normalizedComparisonDate = normalizeDate(comparisonDate);
    
        // Compare dates based on the operator
        switch (operator) {
            case '>':
                return normalizedUserInput < normalizedComparisonDate;
            case '<':
                return normalizedUserInput > normalizedComparisonDate;
            case '=':
            default:
                return normalizedUserInput === normalizedComparisonDate;
        }
    }
    
    const normalizeDate = (dateStr) => {
        // Handle different formats and normalize them to 'YYYY-MM-DD'
        const dateParts = dateStr.split(/[-/]/);
    
        let year, month, day;
    
        // Differentiate based on parts length
        if (dateParts.length === 1) {
            // Format: YYYY
            year = dateParts[0];
            month = '01';
            day = '01';
        } else if (dateParts.length === 2) {
            // Format: YYYY-MM or MM-YYYY
            if (dateParts[0].length === 4) {
                year = dateParts[0];
                month = dateParts[1];
                day = '01';
            } else {
                year = dateParts[1];
                month = dateParts[0];
                day = '01';
            }
        } else if (dateParts.length === 3) {
            // Format: YYYY-MM-DD or DD-MM-YYYY or MM-DD-YYYY
            if (dateParts[0].length === 4) {
                year = dateParts[0];
                month = dateParts[1];
                day = dateParts[2];
            } else if (dateParts[2].length === 4) {
                year = dateParts[2];
                month = dateParts[1];
                day = dateParts[0];
            } else {
                year = dateParts[2];
                month = dateParts[0];
                day = dateParts[1];
            }
        }
    
        // Pad month and day with leading zero if necessary
        if (month.length === 1) month = '0' + month;
        if (day.length === 1) day = '0' + day;
    
        return `${year}-${month}-${day}`;
    }

      useEffect(() => {
        const filteredData = historic.filter((hist) => {
            const lastConsultMatch = filterParameters.lastConsult === '' ||compareDate(filterParameters.lastConsult,hist.date.split("T")[0])
            return lastConsultMatch;
        });
        setFiltredHistoric(filteredData);
    }, [filterParameters])

    const handleChangeFilterLastConsult = (event) => {
        setFilterParameters((prevData) => ({
            ...prevData,
            lastConsult : event.target.value,
        }))
    }

  return (
    <Dialog>
    <DialogTrigger asChild>
        <div className='hist'>{doc.consultationNumber > 0 && 'Historique'}</div>
    </DialogTrigger>
    <DialogContent className='min-w-[80vw] max-w-[80vw] lg:min-w-[60vw] lg:max-w-[60vw] max-h-[80vh] top-[50%] overflow-y-scroll '>
        <DialogHeader>
            <DialogTitle>{`Historique de consultation du document '${doc.title}'`}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
            <div className="max-w-[70vw] lg:max-w-[50vw] text-black">
                    <div className="flex justify-evenly font-bold  mb-2">
                        <div className="w-1/5">Adresse IP</div>
                        <div className="w-2/5">Url de consultation</div>
                        <div className="w-1/5">Date consultation</div>
                    </div>
                    <div className="flex justify-evenly mb-2">
                        <div className="w-1/5" />
                        <div className='w-2/5' />
                        <Input className='w-1/5 h-7' type="text" value={filterParameters.lastConsult} onChange={handleChangeFilterLastConsult}/>
                    </div>
                    <ClipLoader
                        className='loader'
                        loading={!documentIsLoaded}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        />
                    <div className="">
                        {documentIsLoaded && filtredHistoric.length > 0 ? filtredHistoric.map((hist) => (
                            <div key={hist._id} className="flex justify-evenly" style={{borderBottom: "1px solid rgba(0,0,0,0.4)"}}>
                                <div className="w-1/5">{hist.ipUser}</div>
                                <div className="w-2/5 overflow-hidden text-ellipsis">{hist.urlConsulted}</div>
                                <div className="w-1/5">{hist.date}</div>
                            </div>
                        ))
                    :
                    <div style={{ textAlign : 'center',marginTop :'50px'}} >Aucune historique trouvée</div>
                    }
                    </div>
            </div>
        </DialogDescription>
      <DialogFooter>
        <DialogClose asChild>
            <Button >Terminer</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  );
};

export default HistoricList;

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./MappingAdd.css";
import Axios from "../../services/Axios";
import useStore from "../../globalState/UseStore";
import useAuth from "../../hooks/useAuth";
import { toast } from "sonner";

function MappingAdd(props) {
  const { auth } = useAuth();
  const {
    mappings,
    fetchMappings,
    userProjects,
    fetchUserProjects,
    subProjects,
    fetchSubProjects,
  } = useStore();
  const [mappingDirection, setMappingDirection] = useState("");
  const [checkedSource, setCheckedSource] = useState(false);
  const [checkedDoc, setCheckedDoc] = useState(false);
  const [sourceClicked, setSourceClicked] = useState("");
  const [docClicked, setDocClicked] = useState("");
  const [sectionClicked, setSectionClicked] = useState(
    props.data.sections[0]?._id
  );
  const [sourcesListInc, setSourcesListInc] = useState([]);
  const [sourcesListExc, setSourcesListExc] = useState([]);
  const [docsListInc, setDocsListInc] = useState([]);
  const [docsListExc, setDocsListExc] = useState([]);
  const [docsDansMapping, setDocsDansMapping] = useState([]);
  const [docsHorsMapping, setDocsHorsMapping] = useState([]);
  const [sourcesDansMapping, setSourcesDansMapping] = useState([]);
  const [sourcesHorsMapping, setSourcesHorsMapping] = useState([]);
  const [dataChanged, setDataChanged] = useState(0);
  const [dansMappingSearching, setDansMappingSearching] = useState("");
  const [horsMappingSearching, setHorsMappingSearching] = useState("");
  const [documentationsSearching, setDocumentationsSearching] = useState("");
  const [allDansMapping, setAllDansMapping] = useState([]);
  const [allHorsMapping, setAllHorsMapping] = useState([]);
  const [allDocumentations, setAllDocumentations] = useState(
    props.data.documentations
  );

  useEffect(() => {
    const user = auth?.user?._id || "";
    fetchMappings(user);
    fetchUserProjects(user);
    fetchSubProjects(user);
  }, [dataChanged]);

  function categorizeDocuments(source) {
    const mappedDocs = mappings
      .filter((mapping) => mapping.idSource._id === source._id)
      .map((mapping) => mapping.idDocument);
    const idMappedDocs = mappedDocs.map((doc) => doc._id);
    const unmappedDocs = props.data.documentations.filter(
      (doc) =>
        !idMappedDocs.includes(doc._id) &&
        doc.idSubProject._id === source.idSubProject._id
    );
    setDocsDansMapping(mappedDocs);
    setAllDansMapping(mappedDocs);
    setDocsHorsMapping(unmappedDocs);
    setAllHorsMapping(unmappedDocs);
  }

  function categorizeSources(doc) {
    const mappedSources = mappings
      .filter((mapping) => mapping.idDocument._id === doc._id)
      .map((mapping) => mapping.idSource);
    const idMappedSources = mappedSources.map((source) => source._id);
    const unmappedSources = props.data.sources.filter(
      (source) =>
        !idMappedSources.includes(source._id) &&
        source.idSubProject._id === doc.idSubProject._id
    );
    setSourcesDansMapping(mappedSources);
    setSourcesHorsMapping(unmappedSources);
  }

  const handleChangeToSource = () => {
    handleAnnuler();
    setMappingDirection("sourceToDoc");
    setCheckedSource((prev) => !prev);
  };

  const handleChangeToDoc = () => {
    handleAnnuler();
    setMappingDirection("docToSource");
    setCheckedDoc((prev) => !prev);
  };

  const clickSource = (event) => {
    if (mappingDirection === "sourceToDoc") {
      if (sourceClicked === event.target.value) {
        setSourceClicked("");
        setDocsDansMapping([]);
        setDocsHorsMapping([]);
      } else {
        const source = props.data.sources.filter(
          (source) => source._id === event.target.value
        )[0];
        setSourceClicked(event.target.value);
        categorizeDocuments(source);
      }
      setDocsListInc([]);
      setDocsListExc([]);
      setSectionClicked(props.data.sections[0]._id);
    }
  };

  const clickDocInc = (docId) => {
    if (sourceClicked) {
      docsListExc.length > 0 && setDocsListExc([]);
      docsListInc.some((doc) => doc === docId)
        ? setDocsListInc(docsListInc.filter((doc) => doc !== docId))
        : setDocsListInc([...docsListInc, docId]);
    }
  };

  const clickDocExc = (docId) => {
    if (sourceClicked) {
      if (
        docsListExc.length === 0 ||
        (docsListExc.some((doc) => doc === docId) && docsListExc.length === 2)
      ) {
        const document =
          docsListExc.length === 0
            ? docId
            : docsListExc.filter((doc) => doc !== docId)[0];
        const section = mappings.filter(
          (mapping) =>
            mapping.idDocument._id === document &&
            mapping.idSource._id === sourceClicked
        )[0]?.idSection._id;
        section && setSectionClicked(section);
      } else {
        setSectionClicked("");
      }
      docsListInc.length > 0 && setDocsListInc([]);
      docsListExc.some((doc) => doc === docId)
        ? setDocsListExc(docsListExc.filter((doc) => doc !== docId))
        : setDocsListExc([...docsListExc, docId]);
    }
  };

  const clickDoc2 = (docId) => {
    if (mappingDirection === "docToSource") {
      if (docClicked === docId) {
        setDocClicked("");
        setSourcesDansMapping([]);
        setSourcesHorsMapping([]);
      } else {
        const doc = props.data.documentations.filter(
          (doc) => doc._id === docId
        )[0];
        setDocClicked(docId);
        categorizeSources(doc);
      }
      setSourcesListInc([]);
      setSourcesListExc([]);
      setSectionClicked(props.data.sections[0]._id);
    }
  };

  const clickSourceInc = (sourceId) => {
    if (docClicked) {
      sourcesListExc.length > 0 && setSourcesListExc([]);
      sourcesListInc.some((source) => source === sourceId)
        ? setSourcesListInc(
            sourcesListInc.filter((source) => source !== sourceId)
          )
        : setSourcesListInc([...sourcesListInc, sourceId]);
    }
  };

  const clickSourceExc = (sourceId) => {
    if (docClicked) {
      if (
        sourcesListExc.length === 0 ||
        (sourcesListExc.some((source) => source === sourceId) &&
          sourcesListExc.length === 2)
      ) {
        const source =
          sourcesListExc.length === 0
            ? sourceId
            : sourcesListExc.filter((source) => source !== sourceId)[0];
        const section = mappings.filter(
          (mapping) =>
            mapping.idDocument._id === docClicked &&
            mapping.idSource._id === source
        )[0]?.idSection._id;
        section && setSectionClicked(section);
      } else {
        setSectionClicked("");
      }
      sourcesListInc.length > 0 && setSourcesListInc([]);
      sourcesListExc.some((source) => source === sourceId)
        ? setSourcesListExc(
            sourcesListExc.filter((source) => source !== sourceId)
          )
        : setSourcesListExc([...sourcesListExc, sourceId]);
    }
  };

  const clickSection = (event) => {
    if (docsListInc.length !== 0 || sourcesListInc.length !== 0) {
      sectionClicked === event.target.value
        ? setSectionClicked("")
        : setSectionClicked(event.target.value);
    } else if (docsListExc.length !== 0 || sourcesListExc.length !== 0) {
      setSectionClicked("");
      sectionClicked === event.target.value
        ? setSectionClicked("")
        : setSectionClicked(event.target.value);
      if (docsListExc.length !== 0) {
        docsListExc.map((doc) => {
          const idmapping = mappings.filter(
            (mapping) =>
              mapping.idDocument._id === doc &&
              mapping.idSource._id === sourceClicked
          )[0]._id;
          Axios.put(`/mappings/${idmapping}`, { idSection: event.target.value })
            .then((data) => {
              console.log("Object modified:", data);
              setDataChanged((prev) => prev + 1);
              toast.success("Mapping modifié avec succès");
            })
            .catch((error) => {
              console.error("Error modifying object:", error);
            });
        });
        setDocsListExc([]);
        setSectionClicked("");
        setDataChanged((prev) => prev + 1);
      } else if (sourcesListExc.length !== 0) {
        sourcesListExc.map((source) => {
          const idmapping = mappings.filter(
            (mapping) =>
              mapping.idDocument._id === docClicked &&
              mapping.idSource._id === source
          )[0]._id;
          Axios.put(`/mappings/${idmapping}`, { idSection: event.target.value })
            .then((data) => {
              console.log("Object modified:", data);
              setDataChanged((prev) => prev + 1);
              toast.success("Mapping modifié avec succès");
            })
            .catch((error) => {
              console.error("Error modifying object:", error);
            });
        });
        setSourcesListExc([]);
        setSectionClicked("");
        setDataChanged((prev) => prev + 1);
      }
    }
  };

  const handleInput1Search = (event) => {
    setHorsMappingSearching(event.target.value);
    setDocsHorsMapping(
      allHorsMapping.filter((doc) =>
        doc.title.toLowerCase().startsWith(event.target.value.toLowerCase())
      )
    );
  };
  const handleInput2Search = (event) => {
    setDansMappingSearching(event.target.value);
    setDocsDansMapping(
      allDansMapping.filter((doc) =>
        doc.title.toLowerCase().startsWith(event.target.value.toLowerCase())
      )
    );
  };
  const handleInput3Search = (event) => {
    setDocumentationsSearching(event.target.value);
    setAllDocumentations(
      props.data.documentations.filter((doc) =>
        doc.title.toLowerCase().startsWith(event.target.value.toLowerCase())
      )
    );
  };

  const handleAnnuler = () => {
    setCheckedSource(false);
    setCheckedDoc(false);
    setSourceClicked("");
    setDocsListInc([]);
    setDocsListExc([]);
    setDocsDansMapping([]);
    setDocsHorsMapping([]);
    setSourcesDansMapping([]);
    setSourcesHorsMapping([]);
    setSourcesListInc([]);
    setSourcesListExc([]);
    setDocClicked("");
    setSectionClicked(props.data.sections[0]._id);
    setMappingDirection("");
  };

  const addDocumentsToMapping = () => {
    if (docsListInc.length > 0 && sectionClicked) {
      let docsToADD = props.data.documentations.filter((docs) =>
        docsListInc.includes(docs._id)
      );
      docsListInc.map((doc) => {
        const newMapping = {
          idProject: projectSelected,
          idSubProject: subProjectSelected,
          idDocument: doc,
          idSection: sectionClicked,
          idSource: sourceClicked,
        };
        Axios.post(`/mappings/`, newMapping)
          .then((data) => {
            console.log("Object modified:", data);
            setDataChanged((prev) => prev + 1);
          })
          .catch((error) => {
            console.error("Error modifying object:", error);
            toast.error("Erreur lors de l'ajout du mapping");
          });
      });
      setDocsHorsMapping(
        docsHorsMapping.filter((docs) => !docsListInc.includes(docs._id))
      );
      setDocsDansMapping([...docsDansMapping, ...docsToADD]);
      setDocsListInc([]);
    }
  };

  const deleteDocumentsFromToMapping = () => {
    if (docsListExc.length > 0) {
      let docsToDelete = props.data.documentations.filter((docs) =>
        docsListExc.includes(docs._id)
      );
      docsListExc.map((doc) => {
        const idmapping = mappings.filter(
          (mapping) =>
            mapping.idDocument._id === doc &&
            mapping.idSource._id === sourceClicked
        )[0]._id;
        Axios.delete(`/mappings/${idmapping}`)
          .then((data) => {
            console.log("Object deleted:", data);
            setDataChanged((prev) => prev + 1);
          })
          .catch((error) => {
            console.error("Error deleting object:", error);
            toast.error("Erreur lors de la suppression du mapping");
          });
      });
      setDocsDansMapping(
        docsDansMapping.filter((docs) => !docsListExc.includes(docs._id))
      );
      setDocsHorsMapping([...docsHorsMapping, ...docsToDelete]);
      setDocsListExc([]);
    }
  };

  const addSourcesToMapping = () => {
    if (sourcesListInc.length > 0 && sectionClicked) {
      let sourcesToADD = props.data.sources.filter((source) =>
        sourcesListInc.includes(source._id)
      );
      sourcesListInc.map((source) => {
        const newMapping = {
          idProject: projectSelected,
          idSubProject: subProjectSelected,
          idDocument: docClicked,
          idSection: sectionClicked,
          idSource: source,
        };
        Axios.post(`/mappings/`, newMapping)
          .then((data) => {
            console.log("Object modified:", data);
            setDataChanged((prev) => prev + 1);
          })
          .catch((error) => {
            console.error("Error modifying object:", error);
            toast.error("Erreur lors de l'ajout du mapping");
          });
      });
      setSourcesHorsMapping(
        sourcesHorsMapping.filter(
          (source) => !sourcesListInc.includes(source._id)
        )
      );
      setSourcesDansMapping([...sourcesDansMapping, ...sourcesToADD]);
      setSourcesListInc([]);
    }
  };

  const deleteSourcesFromMapping = () => {
    if (sourcesListExc.length > 0) {
      let sourcesToDelete = props.data.sources.filter((source) =>
        sourcesListExc.includes(source._id)
      );
      sourcesListExc.map((source) => {
        const idmapping = mappings.filter(
          (mapping) =>
            mapping.idDocument._id === docClicked &&
            mapping.idSource._id === source
        )[0]._id;
        Axios.delete(`/mappings/${idmapping}`)
          .then((data) => {
            console.log("Object deleted:", data);
            setDataChanged((prev) => prev + 1);
          })
          .catch((error) => {
            console.error("Error deleting object:", error);
            toast.error("Erreur lors de la suppression du mapping");
          });
      });
      setSourcesDansMapping(
        sourcesDansMapping.filter(
          (source) => !sourcesListExc.includes(source._id)
        )
      );
      setSourcesHorsMapping([...sourcesHorsMapping, ...sourcesToDelete]);
      setSourcesListExc([]);
    }
  };

  const [projectSelected, setProjectSelected] = useState("");
  const [subProjectSelected, setSubProjectSelected] = useState("");

  const handleProjectChange = (event) => {
    setProjectSelected(event.target.value);
    setSubProjectSelected("");
  };

  const handleSubProjectChange = (event) => {
    setSubProjectSelected(event.target.value);
  };

  return (
    <div className="mappingAddBox">
      <div className="mappingAddEntete">
        <div className="configBox" style={{ padding: "20px" }}>
          <div className="configLine" style={{ padding: "20px" }}>
            <h3>Client correspondant</h3>
            <select value={projectSelected} onChange={handleProjectChange}>
              <option value="" disabled hidden>
                ----
              </option>
              {userProjects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className="configLine" style={{ padding: "20px" }}>
            <h3>Projet correspondant</h3>
            <select
              value={subProjectSelected}
              onChange={handleSubProjectChange}
            >
              <option value="" disabled hidden>
                ----
              </option>
              {subProjects
                .filter(
                  (subProject) => subProject.idProject._id === projectSelected
                )
                .map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="enteteTitle">Configurations basées sur :</div>
        <div className="flex items-center gap-1">
        <input
          type="radio"
          name="source"
          value="sourceToDoc"
          checked={checkedSource}
          onChange={handleChangeToSource}
          style={{ margin: "0" }}
        />
        <span style={{ marginRight: "30px" }}>Sources</span>
        <input
          type="radio"
          name="document"
          value="docToSource"
          checked={checkedDoc}
          onChange={handleChangeToDoc}
          style={{ margin: "0" }}
        />
        <span>Documentations / Notes</span>
        </div>
      </div>
      {mappingDirection === "sourceToDoc" && (
        <div className="mapContainer">
          <div className="emptyColumn">
            <div className="headerEmptyCol">Sources</div>
            <select
              name="app"
              id="selectApp"
              value={sourceClicked}
              onChange={clickSource}
            >
              <option value="" disabled>
                - - - - - - -
              </option>
              {props.data.sources.map(
                (source) =>
                  subProjectSelected === source.idSubProject._id && (
                    <option key={source._id} value={source._id}>
                      {source.name}
                    </option>
                  )
              )}
            </select>
          </div>
          <div className="column">
            {sourceClicked && (
              <div className="headerCol">
                Documentations/Notes
                <br /> (hors mapping )
              </div>
            )}
            {sourceClicked && (
              <input
                type="text"
                className="cell"
                placeholder="Chercher avec le titre ..."
                value={horsMappingSearching}
                onChange={handleInput1Search}
              />
            )}
            {docsHorsMapping.map((doc) => (
              <div
                key={doc._id}
                className={`cell ${
                  docsListInc.some((docc) => docc === doc._id) && "activeCell"
                }`}
                onClick={() => clickDocInc(doc._id)}
              >
                {doc.title}
              </div>
            ))}
          </div>
          {sourceClicked && (
            <div className="column" style={{ flex: "2" }}>
              <div className="headerCol">
                Inclure/Exclure
                <br />
                <span style={{ color: "white" }}>s</span>
              </div>
              <div
                className={`cell switch ${
                  docsListInc.length > 0 && "activeButton"
                }`}
                style={{ textAlign: "center" }}
                onClick={addDocumentsToMapping}
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
              <div
                className={`cell switch ${
                  docsListExc.length > 0 && "activeButton"
                }`}
                style={{ textAlign: "center" }}
                onClick={deleteDocumentsFromToMapping}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </div>
            </div>
          )}
          <div className="column">
            {sourceClicked && (
              <div className="headerCol">
                Documentations/Notes
                <br /> (dans le mapping )
              </div>
            )}
            {sourceClicked && (
              <input
                type="text"
                className="cell"
                placeholder="Chercher avec le titre ..."
                value={dansMappingSearching}
                onChange={handleInput2Search}
              />
            )}
            {docsDansMapping.map((doc) => (
              <div
                key={doc._id}
                className={`cell ${
                  docsListExc.some((docc) => docc === doc._id) && "activeCell"
                }`}
                onClick={() => clickDocExc(doc._id)}
              >
                {doc.title}
              </div>
            ))}
          </div>
          {sourceClicked && (
            <div className="emptyColumn">
              <div className="headerEmptyCol">Sections</div>
              <select
                name="app"
                id="selectApp"
                value={sectionClicked}
                onChange={clickSection}
              >
                <option value="" disabled>
                  - - - - - - -
                </option>
                {(docsListInc.length > 0 || docsListExc.length > 0) &&
                  props.data.sections.map((section) => (
                    section.titleFr !== "Erreurs" && (
                    <option key={section._id} value={section._id}>
                      {section.titleFr}
                    </option>
                    )
                  ))}
              </select>
            </div>
          )}
        </div>
      )}

      {mappingDirection === "docToSource" && (
        <div className="mapContainer">
          <div className="emptyColumn" style={{ flex: "5" }}>
            <div className="headerEmptyCol">Documentations/Notes</div>
            <input
              type="text"
              className="cell"
              placeholder="Chercher avec le titre ..."
              value={documentationsSearching}
              onChange={handleInput3Search}
            />
            {allDocumentations.map(
              (doc) =>
                subProjectSelected === doc.idSubProject._id && (
                  <div
                    key={doc._id}
                    className={`cell ${docClicked === doc._id && "activeCell"}`}
                    onClick={() => clickDoc2(doc._id)}
                  >
                    {doc.title}
                  </div>
                )
            )}
          </div>
          {docClicked && (
            <div className="column" style={{ flex: "4" }}>
              <div className="headerCol">
                Sources
                <br />
                (hors mapping)
              </div>
              {sourcesHorsMapping.map((app) => (
                <div
                  key={app._id}
                  className={`cell ${
                    sourcesListInc.some((source) => source === app._id) &&
                    "activeCell"
                  }`}
                  onClick={() => clickSourceInc(app._id)}
                >
                  {app.name}
                </div>
              ))}
            </div>
          )}
          {docClicked && (
            <div className="column" style={{ flex: "2" }}>
              <div className="headerCol">
                Inclure/Exclure
                <br />
                <span style={{ color: "white" }}>s</span>
              </div>
              <div
                className={`cell switch ${
                  sourcesListInc.length > 0 && "activeButton"
                }`}
                style={{ textAlign: "center" }}
                onClick={addSourcesToMapping}
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
              <div
                className={`cell switch ${
                  sourcesListExc.length > 0 && "activeButton"
                }`}
                style={{ textAlign: "center" }}
                onClick={deleteSourcesFromMapping}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </div>
            </div>
          )}
          {docClicked && (
            <div className="column" style={{ flex: "4" }}>
              <div className="headerCol">
                Sources
                <br />
                (dans le mapping)
              </div>
              {sourcesDansMapping.map((app) => (
                <div
                  key={app._id}
                  className={`cell ${
                    sourcesListExc.some((source) => source === app._id) &&
                    "activeCell"
                  }`}
                  onClick={() => clickSourceExc(app._id)}
                >
                  {app.name}
                </div>
              ))}
            </div>
          )}
          {docClicked && (
            <div className="emptyColumn">
              <div className="headerEmptyCol">Sections</div>
              <select
                name="app"
                id="selectApp"
                value={sectionClicked}
                onChange={clickSection}
              >
                <option value="" disabled>
                  - - - - - - -
                </option>
                {(sourcesListInc.length > 0 || sourcesListExc.length > 0) &&
                  props.data.sections.map((section) => (
                    section.titleFr !== "Erreurs" && (
                    <option key={section._id} value={section._id}>
                      {section.titleFr}
                    </option>
                    )
                  ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MappingAdd;

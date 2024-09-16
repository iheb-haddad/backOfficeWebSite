import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Outlet } from "react-router-dom";
import "./Body.css";
import useAuth from "../../hooks/useAuth";
import useRessources from "../../hooks/useRessources";
import DropDownDisconnect from "../ui/dropDownDisconnect";

function Body(props) {
  const { liveConfiguration } = useAuth();
  const { confSelected } = useRessources();

  return (
    <div
      className="body"
      style={{
        marginLeft: liveConfiguration && "0",
        marginRight: liveConfiguration && confSelected.panelWidth,
      }}
    >
      <div className="headBody">
        {props.screenWidth < 1160 && (
          <FontAwesomeIcon
            icon={faBars}
            onClick={props.showNavbar}
            className="barIcon"
          />
        )}
        <DropDownDisconnect />
      </div>
      <Outlet />
    </div>
  );
}

export default Body;

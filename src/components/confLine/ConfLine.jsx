import React from "react";

function ConfLine(props) {
  return (
    <div className="colorsLine">
      <h3>{props.label}</h3>
      {props.type === "input" ? (
        <input
          type="text"
          value={props.value || ""}
          onChange={props.handle}
          placeholder={props.holder}
          style={props.style}
        />
      ) : (
        <select value={props.value} onChange={props.handle} style={props.style}>
          {props.options.map((option, index) => {
            return (
              <option key={index} value={option.value}>
                {option.title}
              </option>
            );
          })}
        </select>
      )}
    </div>
  );
}

export default ConfLine;

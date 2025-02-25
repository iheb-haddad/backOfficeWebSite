import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import "./Memo.css";
import { useTranslation } from "react-i18next";

function Memos(props) {
  const { t } = useTranslation();

  return (
    <>
      <div
        className="memo"
        style={{
          backgroundColor: props.configurations.memoBackgroundColor,
          color: props.configurations.memoFontColor,
          minHeight: "75px",
          border:
            props.configurations.sectionBorderDisplay === "display"
              ? `${props.configurations.sectionBorderWidth} solid ${props.configurations.sectionBorderColor}`
              : "none",
          borderRadius: props.configurations.arrondiMemo,
        }}
      >
        <div
          className="enteteMemo"
          style={{
            borderBottom:
              props.configurations.traitDisplay === "display"
                ? `${props.configurations.traitWidth} solid ${props.configurations.traitColor}`
                : "none",
            paddingBottom: props.configurations.paddingUnderTitle,
          }}
        >
          <div
            style={{
              fontSize: props.configurations.titleMemoSize,
              fontWeight: "bold",
              fontFamily: props.configurations.fontTitleMemo,
            }}
          >
            {props.title}
          </div>
          <div
            style={{
              cursor: "pointer",
              fontSize: props.configurations.titleMemoSize,
            }}
          >
            <FontAwesomeIcon icon={faChevronUp} />
          </div>
        </div>
        <div
          className="memoBox"
          style={{
            color: props.configurations.memoFontColor,
            fontSize: props.configurations.textMemoSize,
            margin: "0",
            padding: "0",
            fontFamily: props.configurations.fontTextMemo,
          }}
        >
          La maintenance des logiciels est la clé de la durabilité et de la
          performance de notre infrastructure informatique.
        </div>
        <div
          className="btnMemo"
          style={{ height: "30px", width: "100%", position: "relative" }}
        >
          <button
            style={{
              position: "absolute",
              right: "5px",
              fontSize: props.buttonFontSize || "10px",
              color: props.buttonFontColor || "black",
              backgroundColor: props.buttonBgColor || "white",
              fontWeight: "600",
              border: "1px solid black",
              padding: "5px",
              minWidth: "70px",
              maxWidth: "70px",
            }}
          >
            {t("done")}
          </button>
        </div>
      </div>
    </>
  );
}

export default Memos;

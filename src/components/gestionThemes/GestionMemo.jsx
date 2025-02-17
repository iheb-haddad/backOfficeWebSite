import ConfLine from "../confLine/ConfLine";

const GestionMemo = ({confLines}) => {
  return (
    <div className="colorsForm">
      <h4>Section Mémo</h4>
      {confLines.map((line, index) => {
        return (
          <ConfLine
            key={index}
            type={line.type}
            label={line.label}
            value={line.value}
            handle={line.handle}
            holder={line.holder}
            style={line.style}
            options={line.options}
          />
        );
      })}
    </div>
  );
};

export default GestionMemo;

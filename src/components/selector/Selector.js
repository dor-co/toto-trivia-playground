import React from "react";

function Selector({ id, value, isSelected }) {
  return (
    <option value={id} selected={isSelected}>
      {value}
    </option>
  );
}

export default Selector;

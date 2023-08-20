import React, { useState } from "react";

function MedItem(props) {
  //   const [disabled, setDisabled] = useState(false);
  //   const [color, setColor] = useState("bg-blue-500");

  //   function disable() {
  //     setDisabled(true);
  //     setColor("bg-gray-500");
  //   }

  //   function enable() {
  //     setDisabled(false);
  //     setColor("bg-blue-500");
  //   }
  const disabled = props.disabled;
  const alert = props.alert;
  const bgColor = disabled
    ? "bg-gray-500"
    : alert
    ? "bg-red-500"
    : "bg-blue-500";
  const btnColor = disabled
    ? "bg-gray-900"
    : alert
    ? "bg-red-900 hover:bg-red-700"
    : "bg-blue-900 hover:bg-blue-700";

  return (
    <div className={`med-item ${bgColor}`}>
      <h3>{props.name}</h3>
      <p>{props.description}</p>
      <p>{props.time}</p>
      <p>Dosage Interval {props.interval}</p>
      <button
        className={`${btnColor} text-white font-bold w-12 h-12 p-2 rounded m-4`}
        onClick={props.onRM}
        disabled={disabled}
      >
        X
      </button>
    </div>
  );
}

export default MedItem;

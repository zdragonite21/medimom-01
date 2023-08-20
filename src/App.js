import React, { useState, useEffect } from "react";
import MedItem from "./MedItem";
import moment from "moment";

const defaults = [
  {
    id: 1,
    name: "Aspirin",
    description: "Pain reliever",
    time: moment("8:00 AM", "h:mm A"),
    interval: moment.duration(6, "hours"),
    alert: false,
    disabled: false,
  },
  {
    id: 2,
    name: "Acetaminophen",
    description: "Pain reliever",
    time: moment("10:00 AM", "h:mm A"),
    interval: moment.duration(4, "hours"),
    alert: false,
    disabled: false,
  },
  {
    id: 3,
    name: "Ibuprofen",
    description: "Anti-inflammatory",
    time: moment("12:00 PM", "h:mm A"),
    interval: moment.duration(2, "hours"),
    alert: false,
    disabled: false,
  },
  {
    id: 4,
    name: "Acetaminophen",
    description: "Pain reliever",
    time: moment("4:00 PM", "h:mm A"),
    interval: moment.duration(4, "hours"),
    alert: false,
    disabled: false,
  },
];

function App() {
  const [medLs, setMedLs] = useState(defaults);
  const [taken, setTaken] = useState([]);

  function setMedDisable(id, disabled) {
    setMedLs((prevMedLs) =>
      prevMedLs.map((med) => {
        if (med.id === id) {
          return { ...med, disabled };
        } else {
          return med;
        }
      })
    );
  }

  function setMedAlert(id, alert) {
    setMedLs((prevMedLs) =>
      prevMedLs.map((med) => {
        if (med.id === id) {
          return { ...med, alert };
        } else {
          return med;
        }
      })
    );
  }

  function resetMedLs() {
    setMedLs(defaults);
  }

  function rmMed(id) {
    const upMed = medLs.filter((med) => med.id !== id);
    setMedLs(upMed);
    const med = medLs.find((med) => med.id === id);
    setTaken((prevTaken) => [...prevTaken, { name: med.name, time: moment() }]);
  }

  const [time, setTime] = useState(moment());

  useEffect(() => {
    medLs.forEach((med) => {
      if (time.isAfter(med.time)) {
        setMedAlert(med.id, true);
      } else if (time.isSame(med.time) || time.isBefore(med.time)) {
        setMedAlert(med.id, false);
      }
    });
  }, [time, medLs]);

  function handleTimeChange(e) {
    const newTime = moment(e.target.value, "h:mm A");
    if (newTime.isValid()) {
      setTime(newTime);
    }
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-4">My Medications</h1>
      <button
        className="font-bold m-4 w-24 h-12 bg-blue-500 text-white rounded hover:bg-blue-700 "
        onClick={resetMedLs}
      >
        Set Meds
      </button>
      <input className="bg-red-500" type="text" onChange={handleTimeChange} />
      <p>{time.format("h:mm A")}</p>

      {/* Medication List */}
      {medLs.map((med) => (
        <MedItem
          key={med.id}
          name={med.name}
          description={med.description}
          time={med.time.format("h:mm A")}
          interval={med.interval.humanize()}
          disabled={med.disabled}
          alert={med.alert}
          onRM={() => rmMed(med.id)}
        />
      ))}
    </div>
  );
}

export default App;

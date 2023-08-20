import React, { useState, useEffect, Children } from "react";
import MedItem from "./MedItem";
import moment from "moment";

const defaults = [
  {
    id: 1,
    name: "Aspirin",
    description: "Pain reliever",
    time: ["8:00 AM"],
    interval: 6,
  },
  {
    id: 2,
    name: "Acetaminophen",
    description: "Pain reliever",
    time: ["10:00 AM"],
    interval: 4,
  },
  {
    id: 3,
    name: "Ibuprofen",
    description: "Anti-inflammatory",
    time: ["12:00 PM", "4:00 PM"],
    interval: 2,
  },
];

function App() {
  // helper functions

  const [time, setTime] = useState(moment());

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

  function updateAlert() {
    medLs.forEach((med) => {
      if (time.isAfter(med.time)) {
        setMedAlert(med.id, true);
      } else if (time.isSame(med.time) || time.isBefore(med.time)) {
        setMedAlert(med.id, false);
      }
    });
  }

  function setMedLsSorted(medLs) {
    const sortedMedLs = [];
    var id = 0;
    medLs.forEach((med) => {
      med.time.forEach((t) => {
        const medTime = moment(t, "h:mm A");
        const alert = time.isAfter(medTime) ? true : false;
        sortedMedLs.push({
          ...med,
          id,
          time: medTime,
          interval: moment.duration(med.interval, "hours"),
          alert,
          disabled: false,
        });
        id++;
      });
    });
    sortedMedLs.sort((a, b) => a.time.diff(b.time));
    return sortedMedLs;
  }

  // start

  const [medLs, setMedLs] = useState(setMedLsSorted(defaults));

  const [LastTaken, setLastTaken] = useState(
    defaults.reduce((acc, med) => ({ ...acc, [med.name]: null }), {})
  );

  console.log(LastTaken);

  function resetMedLs() {
    setMedLs(setMedLsSorted(defaults));
    setLastTaken(
      defaults.reduce((acc, med) => ({ ...acc, [med.name]: null }), {})
    );
  }

  function checkInterval(med) {
    // returns true if interval has passed since last taken
    const taken = LastTaken[med.name];
    console.log(taken, time);
    if (taken === null) {
      return true;
    }
    if (time.diff(taken, "hours") >= med.interval.asHours()) {
      return true;
    }
    return false;
  }

  function rmMed(id) {
    const med = medLs.find((med) => med.id === id);
    const upMed = medLs.filter((med) => med.id !== id);
    setMedLs(upMed);
    setLastTaken((prevTaken) => ({
      ...prevTaken,
      [med.name]: time,
    }));

    setMedDisable(med.id, !checkInterval(med));
  }

  useEffect(() => {
    updateAlert();
    medLs.forEach((med) => {
      setMedDisable(med.id, !checkInterval(med));
    });
  }, [time]);

  function handleTimeChange(e) {
    const newTime = moment(e.target.value, "h:mm A");
    if (newTime.isValid()) {
      setTime(newTime);
    }
  }

  // html format

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

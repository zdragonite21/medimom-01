import React, { useState, useEffect } from "react";
import MedItem from "./MedItem";
import moment from "moment";
import { defaults } from "./defaults";

function App() {
  const [time, setTime] = useState(moment());
  const [meds, setMeds] = useState([]);
  const [lastTaken, setLastTaken] = useState([]);

  useEffect(() => {
    const storedMeds = JSON.parse(localStorage.getItem("meds"));
    if (storedMeds) {
      setMeds(storedMeds);
    } else {
      const sortedMeds = sortMeds(defaults);
      setMeds(sortedMeds);
      localStorage.setItem("meds", JSON.stringify(sortedMeds));
    }

    const storedLastTaken = JSON.parse(localStorage.getItem("lastTaken"));
    if (storedLastTaken) {
      setLastTaken(storedLastTaken);
    } else {
      setLastTaken(
        defaults.reduce((acc, med) => ({ ...acc, [med.name]: null }), {})
      );
      localStorage.setItem("lastTaken", JSON.stringify(lastTaken));
    }
  }, []);

  useEffect(() => {
    updateAlerts();
    meds.forEach((med) => {
      setMedDisabled(med.id, !checkInterval(med));
    });
  }, [time]);

  function sortMeds(meds) {
    const sortedMeds = [];
    var id = 0;
    meds.forEach((med) => {
      med.time.forEach((t) => {
        const medTime = moment(t, "h:mm A");
        const alert = time.isAfter(medTime) ? true : false;
        sortedMeds.push({
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
    sortedMeds.sort((a, b) => a.time.diff(b.time));
    return sortedMeds;
  }

  function updateAlerts() {
    meds.forEach((med) => {
      if (time.isAfter(med.time)) {
        setMedAlert(med.id, true);
      } else if (time.isSame(med.time) || time.isBefore(med.time)) {
        setMedAlert(med.id, false);
      }
    });
  }

  function checkInterval(med) {
    const lastTakenTime = getLastTaken(med.name);
    console.log(lastTakenTime);
    if (lastTakenTime === null) {
      return true;
    }
    if (time.diff(lastTakenTime, "hours") >= med.interval.asHours()) {
      return true;
    }
    return false;
  }

  function getLastTaken(medName) {
    return lastTaken[medName];
  }

  function setMedDisabled(id, disabled) {
    setMeds((prevMeds) =>
      prevMeds.map((med) => {
        if (med.id === id) {
          return { ...med, disabled };
        } else {
          return med;
        }
      })
    );
  }

  function setMedAlert(id, alert) {
    setMeds((prevMeds) =>
      prevMeds.map((med) => {
        if (med.id === id) {
          return { ...med, alert };
        } else {
          return med;
        }
      })
    );
  }

  function handleTimeChange(e) {
    const newTime = moment(e.target.value, "h:mm A");
    if (newTime.isValid()) {
      setTime(newTime);
    }
  }

  function handleRemoveMed(id) {
    const med = meds.find((med) => med.id === id);
    const upatedMeds = meds.filter((med) => med.id !== id);
    setMeds(upatedMeds);
    setLastTaken((prevTaken) => ({
      ...prevTaken,
      [med.name]: time,
    }));
    localStorage.setItem("meds", JSON.stringify(upatedMeds));
    localStorage.setItem("lastTaken", JSON.stringify(lastTaken));
    setMedDisabled(med.id, !checkInterval(med));
  }

  function handleResetMeds() {
    const defaultLastTaken = defaults.reduce(
      (acc, med) => ({ ...acc, [med.name]: null }),
      {}
    );
    const defaulSortMeds = sortMeds(defaults);
    setMeds(sortMeds(defaults));
    setLastTaken(defaultLastTaken);
    localStorage.setItem("meds", JSON.stringify(defaulSortMeds));
    localStorage.setItem("lastTaken", JSON.stringify(defaultLastTaken));
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-4">My Medications</h1>
      <button
        className="font-bold m-4 w-24 h-12 bg-blue-500 text-white rounded hover:bg-blue-700 "
        onClick={handleResetMeds}
      >
        Set Meds
      </button>
      <input className="bg-red-500" type="text" onChange={handleTimeChange} />
      <p>{time.format("h:mm A")}</p>

      {/* Medication List */}
      {meds.map((med) => (
        <MedItem
          key={med.id}
          name={med.name}
          description={med.description}
          time={med.time.format("h:mm A")}
          interval={med.interval.humanize()}
          disabled={med.disabled}
          alert={med.alert}
          onRM={() => handleRemoveMed(med.id)}
        />
      ))}
    </div>
  );
}

export default App;

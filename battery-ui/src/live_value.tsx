import React from 'react';
import './App.css';

const criticalRange = [20, 80];
const dangerRange = [25, 75];

interface TemperatureProps {
  temp: number;
}

function LiveValue({ temp } : TemperatureProps) {

  const cMap = {
    "Normal": "#f5f3f4",
    "Danger": "#ff7b00",
    "Critical": "#ba181b",
  };

  let valueColour = cMap["Normal"];
  let messageColour = "#161a1d";
  let message = "Ok"

  if (temp > criticalRange[1] || temp < criticalRange[0]) {
    valueColour = cMap["Critical"];
    messageColour = cMap["Critical"];
    message = "Critical";
  } else if (temp > dangerRange[1] || temp < dangerRange[0] ) {
    valueColour = cMap["Danger"];
    messageColour = cMap["Danger"];
    message = "Danger";
  }

  return (
      <main>
        <header className="live-value" style={{ color : valueColour }}>
          {`${temp.toString()}°C`}
        </header>
        <div className="message" style={{ backgroundColor : messageColour }}>
          {message}
        </div>
      </main>
  );
}

export default LiveValue;

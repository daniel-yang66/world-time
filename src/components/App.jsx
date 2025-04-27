import { useState, useEffect, useRef } from "react";
import TopArea from "./toparea";
import Search from "./search";
import Credits from "./credits";
import Footer from "./footer";
import Times from "./times";
import Data from "./data";
import Map from "./map";
import Title from "./title";
import Weather from "./weather";
import SettingsButton from "./settingsBtn";
import Settings from "./settings";
import UnitsDir from "./units";
import NightSettings from "./NightSettings";

function App() {
  const allForecasts = useRef([]);
  const [faves, setFaves] = useState([]);
  const [selection, setSelection] = useState("");
  const [isCreditOpen, setIsCreditOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [nightSettings, setNightSettings] = useState(["20:00", "06:30"]);
  const [activeMarker, setActiveMarker] = useState("");
  const [units, setUnits] = useState("imperial");
  const [allData, setAllData] = useState([]);
  const [mode, setMode] = useState("day");
  const [dropdownClose, setDropdownClose] = useState(true);
  const [toFrom, setToFrom] = useState("to");

  useEffect(() => {
    try {
      if (JSON.parse(localStorage.getItem("faves")))
        setFaves(JSON.parse(localStorage.getItem("faves")));
      if (JSON.parse(localStorage.getItem("nightSched")))
        setNightSettings(JSON.parse(localStorage.getItem("nightSched")));
    } catch {
      setFaves([]);
      setNightSettings(["20:00", "06:30"]);
    }
  }, []);

  function handleGlobalClick(e) {
    if (
      e.target.className !== "input" &&
      !e.target.className.includes("credits") &&
      !e.target.className.includes("credit-btn") &&
      !e.target.closest("div").className.includes("settings") &&
      !e.target.closest("div").className.includes("night-schedule") &&
      e.target.className !== "settings-btn"
    ) {
      setDropdownClose(true);
      setIsCreditOpen(false);
      setIsSettingsOpen(false);
    } else if (e.target.className === "input") {
      setDropdownClose(false);
    }
    if (e.target.className.includes("city-data-active")) {
      setActiveMarker("");
    }
  }

  const fetchWeather = async (
    lat,
    lon,
    condFunc,
    tempFunc,
    descFunc,
    aqiFunc,
    loadFunc,
    windFunc,
    city
  ) => {
    try {
      loadFunc("loading");
      const weatherData = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?key=${
          import.meta.env.VITE_WEATHER_KEY
        }&elements=%2Baqius`
      );
      const parsedWeatherData = await weatherData.json();

      condFunc(`${parsedWeatherData["currentConditions"]["icon"]}`);
      tempFunc(`${Math.round(parsedWeatherData["currentConditions"]["temp"])}`);
      windFunc([
        Math.round(parsedWeatherData["currentConditions"]["windspeed"]),
        Math.round(parsedWeatherData["currentConditions"]["winddirection"]),
      ]);
      aqiFunc(`${parsedWeatherData["currentConditions"]["aqius"]}`);
      descFunc(`${parsedWeatherData["currentConditions"]["conditions"]}`);

      allForecasts.current = allForecasts.current.filter((forecast) => {
        return forecast.loc !== city;
      });

      allForecasts.current.push({
        loc: city,
        data: parsedWeatherData["days"],
        tz: parsedWeatherData["timezone"],
      });
      setAllData(allForecasts.current);

      loadFunc("done");
    } catch {
      alert("Failed to get weather data.");
      loadFunc("done");
    }
  };

  checkMode(mode);
  function checkMode(curMode) {
    let newMode, night;

    const curTime = `${String(new Date().getHours()).padStart(2, "0")}:${String(
      new Date().getMinutes()
    ).padStart(2, "0")}`;

    if (nightSettings[0] > nightSettings[1]) {
      night = curTime >= nightSettings[0] || curTime <= nightSettings[1];
    } else {
      night = curTime >= nightSettings[0] && curTime <= nightSettings[1];
    }

    newMode = night ? "night" : "day";

    if (curMode === newMode) return;
    else {
      setMode(newMode);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => checkMode(mode), 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={
        mode === "day" ? `all-content ${mode}-bg` : `all-content ${mode}-bg`
      }
      onClick={handleGlobalClick}
    >
      <TopArea mode={mode}>
        <Title />

        <Search
          selectedValue={selection}
          onSetSelection={setSelection}
          dropdownClose={dropdownClose}
          favorites={faves}
          onSetFavorites={setFaves}
        />

        <SettingsButton onHandleSettingClick={setIsSettingsOpen} />
      </TopArea>

      <div className="times-map">
        <Times>
          {faves.length === 0 ? (
            <h2 style={{ margin: "auto" }}>Add up to 6 Locations</h2>
          ) : (
            faves.map((fave) => {
              return (
                <Data
                  timezone={fave[1]}
                  city={fave[0]}
                  key={fave}
                  cityLat={fave[2]}
                  cityLon={fave[3]}
                  faveList={faves}
                  onSetFavesList={setFaves}
                  onSetActive={setActiveMarker}
                  isActiveData={activeMarker}
                  unit={units}
                  onFetchWeather={fetchWeather}
                  mode={mode}
                  toFrom={toFrom}
                />
              );
            })
          )}
        </Times>
        <div className="map-weather">
          <Map
            faveList={faves}
            active={activeMarker}
            curSettings={nightSettings}
          />

          <Weather
            location={activeMarker}
            units={units}
            data={allData}
            mode={mode}
            dir={toFrom}
          />
        </div>

        <Footer onHandleCreditClick={setIsCreditOpen} />
        <Credits openStatus={isCreditOpen} mode={mode} />
        <Settings openStatus={isSettingsOpen} mode={mode}>
          Units & Wind Arrow
          <UnitsDir onSetUnits={setUnits} onSetDir={setToFrom} />
          <NightSettings
            curSettings={nightSettings}
            onSetNightSched={setNightSettings}
            onCheckMode={checkMode}
            curMode={mode}
          />
        </Settings>
      </div>
    </div>
  );
}

export default App;
